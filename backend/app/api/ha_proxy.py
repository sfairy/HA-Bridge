from __future__ import annotations

import asyncio
from collections.abc import Mapping
from dataclasses import dataclass
from time import monotonic
from urllib.parse import quote

import httpx
from fastapi import APIRouter, HTTPException, Request, status
from fastapi.responses import JSONResponse, Response, StreamingResponse

from database import Database
from dependencies import ShortLivedLicensedViewer, ViewerPrincipal, require_viewer_entity
from ha.client import HAClientError
from ha.crypto import CredentialCipherError
from api.ha import active_connection

router = APIRouter(include_in_schema=False)
ALLOWED_MEDIA_PROXY_PREFIXES = (
    '/api/camera_proxy/',
    '/api/camera_proxy_stream/',
    '/api/image_proxy/',
    '/api/media_player_proxy/',
    '/api/hls/',
)
REQUEST_HEADERS_TO_DROP = {
    'te',
    'via',
    'host',
    'cookie',
    'origin',
    'referer',
    'trailer',
    'upgrade',
    'forwarded',
    'connection',
    'authorization',
    'x-scheme',
    'x-real-ip',
    'x-client-ip',
    'content-length',
    'true-client-ip',
    'cf-connecting-ip',
    'transfer-encoding',
    'proxy-authorization',
}
RESPONSE_HEADERS_TO_DROP = {
    'connection',
    'set-cookie',
    'content-length',
    'content-encoding',
    'transfer-encoding',
}
CAMERA_SNAPSHOT_CACHE_TTL_SECONDS = 8
CAMERA_SNAPSHOT_CACHE_MAX_ENTRIES = 64


@dataclass
class CameraSnapshotCacheEntry:
    content: bytes
    content_type: str
    created_at: float


camera_snapshot_cache: dict[str, CameraSnapshotCacheEntry] = {}
camera_snapshot_refreshes: dict[str, asyncio.Task[None]] = {}


def upstream_path(request: Request) -> str:
    path = request.url.path
    query = request.url.query
    return f'{path}?{query}' if query else path


def upstream_request_headers(headers: Mapping[str, str]) -> dict[str, str]:
    '''Keep media request headers without leaking an outer reverse-proxy hop to HA.'''
    return {
        name: value
        for name, value in headers.items()
        if name.lower() not in REQUEST_HEADERS_TO_DROP and not name.lower().startswith('x-forwarded-')
    }


def allowed_media_proxy_path(path: str) -> bool:
    '''Allow only HA media paths and reject path-normalization bypasses.'''
    if not path.startswith(ALLOWED_MEDIA_PROXY_PREFIXES) or '\\' in path:
        return False
    return all(segment not in frozenset({'.', '..'}) for segment in path.split('/'))


def rewrite_location(value: str, base_url: str) -> str:
    normalized_base = base_url.rstrip('/')
    if value == normalized_base:
        return '/'
    if value.startswith(f'{normalized_base}/'):
        return value[len(normalized_base):]
    return value


def versioned_image_proxy_cache_control(path: str, query: str, status_code: int) -> str | None:
    '''Cache state-versioned HA images without changing live camera behavior.'''
    if not path.startswith('/api/image_proxy/') or not (200 <= status_code < 300):
        return None
    versioned = any(
        (parts := part.partition('='))[1] and parts[0] == 'hb' and bool(parts[2])
        for part in query.split('&')
        if part
    )
    return 'private, max-age=600, immutable' if versioned else None


def camera_snapshot_cache_key(base_url: str, path: str) -> str:
    return f'{base_url.rstrip("/")}{path}'


def _remember_camera_snapshot(key: str, content: bytes, content_type: str) -> None:
    if key not in camera_snapshot_cache and len(camera_snapshot_cache) >= CAMERA_SNAPSHOT_CACHE_MAX_ENTRIES:
        oldest_key = min(camera_snapshot_cache, key=lambda item: camera_snapshot_cache[item].created_at)
        camera_snapshot_cache.pop(oldest_key, None)
    camera_snapshot_cache[key] = CameraSnapshotCacheEntry(
        content=content,
        content_type=content_type or 'image/jpeg',
        created_at=monotonic(),
    )


def _camera_snapshot_response(entry: CameraSnapshotCacheEntry) -> Response:
    return Response(
        content=entry.content,
        media_type=entry.content_type,
        headers={'cache-control': 'private, no-store'},
    )


def load_active_connection(database_manager: Database):
    with database_manager.session_factory() as database:
        connection = active_connection(database)
        if connection is not None:
            database.expunge(connection)
        return connection


def load_authorized_camera_connection(
    database_manager: Database,
    viewer: ViewerPrincipal,
    entity_id: str,
):
    with database_manager.session_factory() as database:
        require_viewer_entity(database, viewer, entity_id)
        connection = active_connection(database)
        if connection is not None:
            database.expunge(connection)
        return connection


async def _refresh_camera_snapshot(
    key: str,
    target: str,
    headers: Mapping[str, str],
    verify_tls: bool,
    timeout: float,
) -> None:
    try:
        async with httpx.AsyncClient(verify=verify_tls, timeout=timeout, follow_redirects=False, trust_env=False) as client:
            upstream = await client.get(target, headers=dict(headers))
        if 200 <= upstream.status_code < 300 and upstream.content:
            _remember_camera_snapshot(
                key,
                upstream.content,
                upstream.headers.get('content-type', 'image/jpeg'),
            )
    except httpx.HTTPError:
        pass
    finally:
        camera_snapshot_refreshes.pop(key, None)


def _schedule_camera_snapshot_refresh(
    key: str,
    target: str,
    headers: Mapping[str, str],
    verify_tls: bool,
    timeout: float,
) -> None:
    existing = camera_snapshot_refreshes.get(key)
    if existing and not existing.done():
        return
    task = asyncio.create_task(_refresh_camera_snapshot(key, target, headers, verify_tls, timeout))
    camera_snapshot_refreshes[key] = task


async def proxy_http(request: Request) -> Response:
    if request.method not in frozenset({'GET', 'HEAD'}) or not allowed_media_proxy_path(request.url.path):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='媒体资源不存在。')
    connection = await asyncio.to_thread(load_active_connection, request.app.state.database)
    if connection is None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail='请先配置 Home Assistant 连接。')
    try:
        client_config = request.app.state.ha_connector.client_for(connection)
    except CredentialCipherError as error:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(error)) from error
    headers = upstream_request_headers(request.headers)
    headers['authorization'] = f'Bearer {client_config.access_token}'
    headers['accept-encoding'] = 'identity'
    proxy_path = upstream_path(request)
    target = f'{client_config.base_url}{proxy_path}'
    stream_response = request.url.path.startswith('/api/camera_proxy_stream/')
    snapshot_request = request.method == 'GET' and request.url.path.startswith('/api/camera_proxy/')
    snapshot_key = (
        camera_snapshot_cache_key(client_config.base_url, request.url.path) if snapshot_request else ''
    )
    if snapshot_request:
        cached = camera_snapshot_cache.get(snapshot_key)
        if cached is not None:
            if monotonic() - cached.created_at >= CAMERA_SNAPSHOT_CACHE_TTL_SECONDS:
                _schedule_camera_snapshot_refresh(
                    snapshot_key,
                    f'{client_config.base_url}{request.url.path}',
                    headers,
                    client_config.verify_tls,
                    client_config.timeout,
                )
            return _camera_snapshot_response(cached)
    client = httpx.AsyncClient(
        verify=client_config.verify_tls,
        timeout=None if stream_response else client_config.timeout,
        follow_redirects=False,
        trust_env=False,
    )
    try:
        upstream_request = client.build_request(request.method, target, headers=headers)
        upstream = await client.send(upstream_request, stream=stream_response)
    except httpx.HTTPError as error:
        await client.aclose()
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f'无法载入 Home Assistant 后台：{error}',
        ) from error
    response_headers = {
        name: value
        for name, value in upstream.headers.items()
        if name.lower() not in RESPONSE_HEADERS_TO_DROP
    }
    cache_control = versioned_image_proxy_cache_control(
        request.url.path,
        request.url.query,
        upstream.status_code,
    )
    if cache_control:
        response_headers['cache-control'] = cache_control
    if 'location' in response_headers:
        response_headers['location'] = rewrite_location(response_headers['location'], client_config.base_url)
    if stream_response:
        async def stream_body():
            try:
                async for chunk in upstream.aiter_raw():
                    if not chunk:
                        continue
                    yield chunk
            finally:
                await upstream.aclose()
                await client.aclose()

        return StreamingResponse(stream_body(), status_code=upstream.status_code, headers=response_headers)
    content = upstream.content
    if snapshot_request and 200 <= upstream.status_code < 300 and content:
        _remember_camera_snapshot(
            snapshot_key,
            content,
            upstream.headers.get('content-type', 'image/jpeg'),
        )
    await upstream.aclose()
    await client.aclose()
    return Response(content=content, status_code=upstream.status_code, headers=response_headers)


CAMERA_STREAM_UNSUPPORTED_MARKERS = (
    'does not support play stream service',
    'does not support stream',
)


def _camera_stream_unsupported(error: Exception) -> bool:
    '''Detect Home Assistant cameras that cannot serve a native HLS stream.'''
    message = str(error).casefold()
    return any(marker in message for marker in CAMERA_STREAM_UNSUPPORTED_MARKERS)


def _camera_mjpeg_fallback(entity_id: str) -> JSONResponse:
    '''Fall back to the HA MJPEG proxy for cameras without HLS support.'''
    return JSONResponse({
        'url': f'/api/camera_proxy_stream/{quote(entity_id, safe="")}',
        'format': 'mjpeg',
    })


async def _camera_stream_fallback(websocket, client, entity_id: str) -> JSONResponse | None:
    '''Return an MJPEG source when the camera advertises no HLS stream type.'''
    try:
        capabilities = await client.command(websocket, 2, 'camera/capabilities', entity_id=entity_id)
    except HAClientError:
        return None
    stream_types = capabilities.get('frontend_stream_types') if isinstance(capabilities, dict) else None
    if isinstance(stream_types, list) and 'hls' not in stream_types:
        return _camera_mjpeg_fallback(entity_id)
    return None


@router.get('/api/camera_hls/{entity_id}')
async def camera_hls_stream(
    entity_id: str,
    request: Request,
    viewer: ShortLivedLicensedViewer,
) -> JSONResponse:
    connection = await asyncio.to_thread(
        load_authorized_camera_connection,
        request.app.state.database,
        viewer,
        entity_id,
    )
    if connection is None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail='请先配置 Home Assistant 连接。')
    try:
        client = request.app.state.ha_connector.client_for(connection)
        websocket = await client.connect_websocket()
        try:
            fallback = await _camera_stream_fallback(websocket, client, entity_id)
            if fallback is not None:
                return fallback
            result = await client.command(
                websocket,
                3,
                'camera/stream',
                entity_id=entity_id,
                format='hls',
            )
        finally:
            await websocket.close()
    except (HAClientError, CredentialCipherError) as error:
        if _camera_stream_unsupported(error):
            return _camera_mjpeg_fallback(entity_id)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f'无法启动摄像头实时流：{error}',
        ) from error
    stream_url = str(result.get('url') if isinstance(result, dict) else result or '').strip()
    if not stream_url:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail='Home Assistant 未返回摄像头流地址。',
        )
    stream_url = rewrite_location(stream_url, client.base_url)
    if not allowed_media_proxy_path(stream_url.split('?', 1)[0]):
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail='Home Assistant 返回了无效的摄像头流地址。',
        )
    return JSONResponse({'url': stream_url, 'format': 'hls'})


@router.api_route('/api/camera_proxy/{path:path}', methods=['GET', 'HEAD'])
@router.api_route('/api/camera_proxy_stream/{path:path}', methods=['GET', 'HEAD'])
@router.api_route('/api/image_proxy/{path:path}', methods=['GET', 'HEAD'])
@router.api_route('/api/media_player_proxy/{path:path}', methods=['GET', 'HEAD'])
@router.api_route('/api/hls/{path:path}', methods=['GET', 'HEAD'])
async def proxy_home_assistant_media(
    request: Request,
    _viewer: ShortLivedLicensedViewer,
) -> Response:
    return await proxy_http(request)
