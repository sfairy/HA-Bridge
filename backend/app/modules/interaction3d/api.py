from __future__ import annotations

import hashlib
import json
import re
import shutil
from urllib.parse import urlencode
from uuid import uuid4

from fastapi import APIRouter, HTTPException, Query, Request
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse, Response
from starlette.concurrency import run_in_threadpool

from api.assets import UPLOAD_CONTENT_TYPES, user_asset_file
from api.ha import active_connection, call_service
from dependencies import DatabaseSession, LicensedUser, LicensedViewer, require_viewer_project
from models import ProjectDraft
from modules.interaction3d.access import access_grant, module_components, require_access
from modules.interaction3d.render_cache import MAX_ENTRY_BYTES, cache_path, read_cache, write_cache
from schemas import HAServiceCallRequest

router = APIRouter(prefix='/modules/interaction3d', tags=['3D interaction'])
SCENE_ID = re.compile('[0-9a-f]{32}')
RESOURCE_TYPES = {
    **{name: 'text/javascript' for name in (
        'runtime.js',
        'stage.js',
        'config-editor.js',
        'light-state.js',
        'light-stream.js',
        'camera-motion.js',
        'idle-rotation.js',
        'scene-sync.js',
    )},
    **{name: 'text/css' for name in ('runtime.css', 'stage.css')},
}


def light_history_scope(connection, viewer, project_id: str) -> str:
    principal = viewer.user or viewer.display
    if not project_id or principal is None or not getattr(principal, 'id', None) or connection is None:
        return ''
    base_url = (connection.base_url or '').strip().rstrip('/')
    encrypted_token = connection.encrypted_access_token or ''
    if not connection.is_active or not connection.id or not base_url or not encrypted_token:
        return ''
    identity = [
        'i3d-light-history-v1',
        'user' if viewer.user else 'display',
        principal.id,
        project_id,
        connection.id,
        base_url,
        hashlib.sha256(encrypted_token.encode('utf-8')).hexdigest(),
    ]
    return hashlib.sha256(json.dumps(identity, separators=(',', ':')).encode('utf-8')).hexdigest()


def scene_path(request: Request, scene_id: str):
    if not SCENE_ID.fullmatch(scene_id):
        raise HTTPException(404, detail='户型快照不存在。')
    path = request.app.state.settings.data_dir / 'modules' / 'interaction3d' / 'scenes' / f'{scene_id}.json'
    if not path.is_file():
        raise HTTPException(404, detail='户型快照不存在，请重新载入户型。')
    return path


def require_scene_viewer(request: Request, database, viewer, scene_id: str, project_id: str) -> None:
    require_access(request)
    if viewer.is_admin_session:
        return
    require_viewer_project(viewer, project_id)
    draft = database.get(ProjectDraft, project_id)
    if draft is None:
        raise HTTPException(403, detail='此户型未配置到当前仪表盘。')
    document = json.loads(draft.document_json)
    if not any(
        (component.get('properties') or {}).get('sceneId') == scene_id
        for _, component in module_components(document)
    ):
        raise HTTPException(403, detail='此户型未配置到当前仪表盘。')


def scene_floors(scene: dict) -> list[dict]:
    floors = scene.get('floors')
    if isinstance(floors, list) and floors:
        return floors
    return [{'scene': scene}]


def apply_background_urls(payload: dict, scene_id: str, project_id: str) -> None:
    scene = payload.get('scene')
    if not isinstance(scene, dict):
        return
    for floor in scene_floors(scene):
        background = (floor.get('scene') or {}).get('background') if isinstance(floor, dict) else None
        if not isinstance(background, dict):
            continue
        asset_id = str(background.get('assetId', '')).removeprefix('user:')
        if not SCENE_ID.fullmatch(asset_id):
            continue
        background['url'] = (
            f'/api/v1/modules/interaction3d/scenes/{scene_id}/background/{asset_id}?'
            + urlencode({'projectId': project_id})
        )


@router.post('/scenes', status_code=201)
def snapshot_scene(request: Request, _user: LicensedUser) -> dict:
    require_access(request)
    source = request.app.state.settings.studio3d_draft_path
    if not source.is_file():
        raise HTTPException(409, detail='请先在户型编辑器中绘制并保存户型。')
    try:
        payload = json.loads(source.read_text(encoding='utf-8'))
    except (OSError, ValueError) as error:
        raise HTTPException(409, detail='户型暂时无法读取，请检查保存状态。') from error
    if not isinstance(payload, dict) or not isinstance(payload.get('scene'), dict):
        raise HTTPException(409, detail='户型数据为空，请先保存户型。')
    scene_id = uuid4().hex
    folder = request.app.state.settings.data_dir / 'modules' / 'interaction3d' / 'scenes'
    folder.mkdir(parents=True, exist_ok=True)
    path = folder / f'{scene_id}.json'
    with path.open('x', encoding='utf-8') as output:
        json.dump(payload, output, ensure_ascii=False)
    path.chmod(384)
    scene = payload['scene']
    assets_root = request.app.state.settings.user_assets_dir.resolve()
    for floor in scene_floors(scene):
        background = (floor.get('scene') or {}).get('background') if isinstance(floor, dict) else None
        if not isinstance(background, dict):
            continue
        asset_id = str(background.get('assetId', '')).removeprefix('user:')
        asset = user_asset_file(assets_root, asset_id)
        if not asset:
            continue
        shutil.copyfile(asset, folder / f'{scene_id}-{asset_id}{asset.suffix.lower()}')
    return {'sceneId': scene_id}


@router.get('/scenes/{scene_id}')
def get_scene(
    scene_id: str,
    request: Request,
    database: DatabaseSession,
    viewer: LicensedViewer,
    projectId: str = Query(default=''),
):
    require_scene_viewer(request, database, viewer, scene_id, projectId)
    payload = json.loads(scene_path(request, scene_id).read_text(encoding='utf-8'))
    apply_background_urls(payload, scene_id, projectId)
    return JSONResponse(payload, headers={'Cache-Control': 'no-store'})


@router.get('/scenes/{scene_id}/current')
def get_current_scene(
    scene_id: str,
    request: Request,
    database: DatabaseSession,
    viewer: LicensedViewer,
    projectId: str = Query(default=''),
    since: str = Query(default=''),
):
    require_scene_viewer(request, database, viewer, scene_id, projectId)
    reference = json.loads(scene_path(request, scene_id).read_text(encoding='utf-8'))
    source = request.app.state.settings.studio3d_draft_path
    try:
        if since and not source.is_file():
            raise ValueError('saved source unavailable')
        payload = json.loads(source.read_text(encoding='utf-8')) if source.is_file() else reference
        if not isinstance(payload.get('scene'), dict):
            raise ValueError('missing scene')
        key = hashlib.sha256(
            json.dumps(payload['scene'], sort_keys=True, separators=(',', ':')).encode()
        ).hexdigest()
        if key == since:
            return Response(status_code=204, headers={'Cache-Control': 'no-store'})
        payload['syncKey'] = key
        payload['referenceScene'] = reference.get('scene')
        apply_background_urls(payload, scene_id, projectId)
        return JSONResponse(payload, headers={'Cache-Control': 'no-store'})
    except (OSError, ValueError, AttributeError):
        if since:
            raise HTTPException(409, detail='户型保存尚未完成，稍后自动重试。')
        payload = reference
        apply_background_urls(payload, scene_id, projectId)
        return JSONResponse(payload, headers={'Cache-Control': 'no-store'})


@router.get('/scenes/{scene_id}/background/{asset_id}')
def get_background(
    scene_id: str,
    asset_id: str,
    request: Request,
    database: DatabaseSession,
    viewer: LicensedViewer,
    projectId: str = Query(default=''),
):
    require_scene_viewer(request, database, viewer, scene_id, projectId)
    folder = scene_path(request, scene_id).parent
    if SCENE_ID.fullmatch(asset_id):
        for suffix, media_type in UPLOAD_CONTENT_TYPES.items():
            path = folder / f'{scene_id}-{asset_id}{suffix}'
            if path.is_file():
                return FileResponse(path, media_type=media_type, headers={'Cache-Control': 'no-store'})
        try:
            scene = json.loads(request.app.state.settings.studio3d_draft_path.read_text(encoding='utf-8'))['scene']
            referenced = any(
                str(((floor.get('scene') or {}).get('background') or {}).get('assetId', '')).removeprefix('user:')
                == asset_id
                for floor in scene_floors(scene)
            )
            asset = (
                user_asset_file(request.app.state.settings.user_assets_dir.resolve(), asset_id)
                if referenced
                else None
            )
            if asset:
                return FileResponse(asset, headers={'Cache-Control': 'no-store'})
        except (OSError, ValueError, KeyError, AttributeError):
            pass
    raise HTTPException(404, detail='户型底图不存在。')


@router.post('/control')
async def control_light(
    payload: HAServiceCallRequest,
    request: Request,
    database: DatabaseSession,
    viewer: LicensedViewer,
):
    require_access(request)
    if payload.domain not in frozenset({'light', 'switch'}) or payload.service not in frozenset({'turn_on', 'turn_off'}):
        raise HTTPException(422, detail='3D 灯光控制只支持灯或开关。')
    return await call_service(payload, request, database, viewer)


@router.get('/stage.html')
def get_stage(
    request: Request,
    database: DatabaseSession,
    viewer: LicensedViewer,
    sceneId: str = Query(default=''),
    projectId: str = Query(default=''),
):
    require_scene_viewer(request, database, viewer, sceneId, projectId)
    scene_path(request, sceneId)
    html = (request.app.state.settings.frontend_dir / '3d-studio.html').read_text(encoding='utf-8')
    html = html.replace(
        '</head>',
        '<link rel="stylesheet" href="/api/v1/modules/interaction3d/stage.css?v=20260907-hidden-clickable-v1"></head>',
    )
    scope = light_history_scope(active_connection(database), viewer, projectId)
    html = html.replace('<body>', f'<body class="interaction3d-stage" data-i3d-light-history-scope="{scope}">')
    return HTMLResponse(html, headers={'Cache-Control': 'no-store'})


@router.get('/scenes/{scene_id}/render-cache/{cache_key}')
def get_render_cache(
    scene_id: str,
    cache_key: str,
    request: Request,
    database: DatabaseSession,
    viewer: LicensedViewer,
    projectId: str = Query(default=''),
):
    require_scene_viewer(request, database, viewer, scene_id, projectId)
    scene_path(request, scene_id)
    path = cache_path(request.app.state.settings.data_dir, scene_id, projectId, cache_key)
    content = read_cache(path)
    if content is None:
        return Response(status_code=204, headers={'Cache-Control': 'no-store'})
    return Response(content, media_type='image/png', headers={'Cache-Control': 'private, no-cache'})


@router.put('/scenes/{scene_id}/render-cache/{cache_key}', status_code=204)
async def put_render_cache(
    scene_id: str,
    cache_key: str,
    request: Request,
    database: DatabaseSession,
    viewer: LicensedViewer,
    projectId: str = Query(default=''),
):
    require_scene_viewer(request, database, viewer, scene_id, projectId)
    scene_path(request, scene_id)
    path = cache_path(request.app.state.settings.data_dir, scene_id, projectId, cache_key)
    content_type = (request.headers.get('content-type') or '').split(';')[0].strip()
    if content_type != 'image/png':
        raise HTTPException(415, detail='缓存仅接受 PNG 图层。')
    content = bytearray()
    async for chunk in request.stream():
        if len(content) + len(chunk) > MAX_ENTRY_BYTES:
            raise HTTPException(413, detail='缓存图层过大。')
        content.extend(chunk)
    await run_in_threadpool(write_cache, path, bytes(content))
    return Response(status_code=204)


@router.get('/access')
def get_access(request: Request, _viewer: LicensedViewer):
    return JSONResponse(access_grant(request), headers={'Cache-Control': 'no-store'})


@router.get('/projects/{project_id}/components/{component_id}/config')
def get_config(
    project_id: str,
    component_id: str,
    request: Request,
    database: DatabaseSession,
    viewer: LicensedViewer,
) -> dict:
    require_viewer_project(viewer, project_id)
    require_access(request)
    draft = database.get(ProjectDraft, project_id)
    if draft is None:
        raise HTTPException(404, detail='仪表盘不存在。')
    component = next(
        (item for _, item in module_components(json.loads(draft.document_json)) if item.get('id') == component_id),
        None,
    )
    if component is None:
        raise HTTPException(404, detail='3D 交互控件不存在。')
    return {
        'projectId': project_id,
        'componentId': component_id,
        'phase': 'authorization-shell',
        'component': component,
    }


@router.get('/{filename}')
def get_resource(filename: str, request: Request, _viewer: LicensedViewer):
    require_access(request)
    media_type = RESOURCE_TYPES.get(filename)
    if media_type is None:
        raise HTTPException(404, detail='3D 交互资源不存在。')
    root = (request.app.state.settings.frontend_dir / 'modules' / 'interaction3d').resolve()
    path = (root / filename).resolve()
    if not path.is_relative_to(root) or not path.is_file():
        raise HTTPException(404, detail='3D 交互资源不存在。')
    return FileResponse(path, media_type=media_type, headers={'Cache-Control': 'no-store'})
