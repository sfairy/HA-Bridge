from __future__ import annotations

import asyncio
import json
import time
import traceback
from datetime import datetime, timedelta, timezone
from typing import Any
from urllib.parse import urlsplit
from uuid import uuid4

from fastapi import APIRouter, HTTPException, Query, Request, WebSocket, WebSocketDisconnect, status
from sqlalchemy import func, or_, select

from database import Database
from dependencies import (
    DatabaseSession,
    LicensedUser,
    LicensedViewer,
    ViewerPrincipal,
    require_viewer_entity,
    resolve_viewer_principal,
    viewer_entity_ids,
)
from display_access import active_display_device
from global_log import event_context
from ha.client import HAClient, HAClientError
from ha.crypto import CredentialCipherError
from models import DisplayDevice, HAArea, HAConnection, HADevice, HAEntity, HASyncState, User
from panel.action_rules import TOGGLE_ENTITY_DOMAINS
from schemas import HABrowseMediaRequest, HAConnectionInput, HAServiceCallRequest, HATestRequest

router = APIRouter(prefix='/ha', tags=['home-assistant'])
runtime_router = APIRouter(tags=['runtime'])
MAX_RUNTIME_ENTITIES = 1000
DISPLAY_BINDING_CACHE_SECONDS = 1
ALLOWED_SERVICES: dict[tuple[str, str], set[str]] = {
    ('homeassistant', 'toggle'): set(),
    ('button', 'press'): set(),
    ('script', 'turn_on'): set(),
    ('light', 'turn_on'): {
        'rgb_color',
        'brightness',
        'transition',
        'brightness_pct',
        'color_temp_kelvin',
    },
    ('light', 'turn_off'): {'transition'},
    ('switch', 'turn_on'): set(),
    ('switch', 'turn_off'): set(),
    ('cover', 'open_cover'): set(),
    ('cover', 'close_cover'): set(),
    ('cover', 'stop_cover'): set(),
    ('cover', 'set_cover_position'): {'position'},
    ('cover', 'open_cover_tilt'): set(),
    ('cover', 'close_cover_tilt'): set(),
    ('cover', 'stop_cover_tilt'): set(),
    ('cover', 'set_cover_tilt_position'): {'tilt_position'},
    ('climate', 'set_temperature'): {'temperature'},
    ('climate', 'set_hvac_mode'): {'hvac_mode'},
    ('climate', 'set_fan_mode'): {'fan_mode'},
    ('climate', 'set_swing_mode'): {'swing_mode'},
    ('climate', 'set_preset_mode'): {'preset_mode'},
    ('water_heater', 'turn_on'): set(),
    ('water_heater', 'turn_off'): set(),
    ('water_heater', 'set_temperature'): {'temperature'},
    ('water_heater', 'set_operation_mode'): {'operation_mode'},
    ('fan', 'set_percentage'): {'percentage'},
    ('fan', 'set_preset_mode'): {'preset_mode'},
    ('fan', 'turn_on'): set(),
    ('fan', 'turn_off'): set(),
    ('number', 'set_value'): {'value'},
    ('input_number', 'set_value'): {'value'},
    ('media_player', 'media_play_pause'): set(),
    ('media_player', 'media_play'): set(),
    ('media_player', 'media_pause'): set(),
    ('media_player', 'media_stop'): set(),
    ('media_player', 'media_previous_track'): set(),
    ('media_player', 'media_next_track'): set(),
    ('media_player', 'volume_set'): {'volume_level'},
    ('media_player', 'volume_mute'): {'is_volume_muted'},
    ('media_player', 'select_source'): {'source'},
    ('media_player', 'select_sound_mode'): {'sound_mode'},
    ('media_player', 'play_media'): {'media_content_id', 'media_content_type'},
    ('media_player', 'turn_on'): set(),
    ('media_player', 'turn_off'): set(),
    ('vacuum', 'start'): set(),
    ('vacuum', 'pause'): set(),
    ('vacuum', 'return_to_base'): set(),
    ('vacuum', 'set_fan_speed'): {'fan_speed'},
    ('select', 'select_option'): {'option'},
}


def require_admin(user: User) -> None:
    if user.role != 'admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='仅管理员可以修改 Home Assistant 连接。')


def active_connection(database: DatabaseSession) -> HAConnection | None:
    return database.scalar(select(HAConnection).where(HAConnection.is_active.is_(True)))


def load_active_connection_snapshot(database_manager: Database) -> HAConnection | None:
    with database_manager.session_factory() as database:
        connection = active_connection(database)
        if connection is not None:
            database.expunge(connection)
        return connection


def load_translation_context(database_manager: Database) -> tuple[HAConnection | None, set[str]]:
    with database_manager.session_factory() as database:
        connection = active_connection(database)
        if connection is None:
            return (None, set())
        integrations = set(
            database.scalars(
                select(HAEntity.platform)
                .where(
                    HAEntity.connection_id == connection.id,
                    HAEntity.sync_status == 'active',
                    HAEntity.platform.is_not(None),
                    HAEntity.translation_key.is_not(None),
                )
                .distinct()
            )
        )
        database.expunge(connection)
        return (connection, integrations)


def load_authorized_entity_context(
    database_manager: Database,
    viewer: ViewerPrincipal,
    entity_id: str,
) -> tuple[HAConnection | None, bool]:
    with database_manager.session_factory() as database:
        require_viewer_entity(database, viewer, entity_id)
        connection = active_connection(database)
        if connection is None:
            return (None, False)
        entity_exists = (
            database.scalar(
                select(HAEntity.id).where(
                    HAEntity.connection_id == connection.id,
                    HAEntity.entity_id == entity_id,
                    HAEntity.sync_status == 'active',
                )
            )
            is not None
        )
        database.expunge(connection)
        return (connection, entity_exists)


def connection_payload(connection: HAConnection | None, request: Request) -> dict[str, Any]:
    connector = request.app.state.ha_connector
    live_error = None if connector.connected else connector.runtime_error
    if connection is None:
        return {
            'configured': False,
            'hasToken': False,
            'connected': False,
            'baseUrl': '',
            'name': 'Home Assistant',
            'verifyTls': True,
            'version': None,
            'lastConnectedAt': None,
            'lastError': live_error,
        }
    return {
        'configured': True,
        'hasToken': bool(connection.encrypted_access_token),
        'connected': connector.connected,
        'baseUrl': connection.base_url,
        'name': connection.name,
        'verifyTls': connection.verify_tls,
        'version': connection.ha_version,
        'lastConnectedAt': connection.last_connected_at,
        'lastError': None if connector.connected else (live_error or connection.last_error),
    }


@router.get('/connection')
def get_connection(request: Request, database: DatabaseSession, _user: LicensedUser) -> dict[str, Any]:
    return connection_payload(active_connection(database), request)


@router.delete('/connection', status_code=status.HTTP_204_NO_CONTENT)
async def delete_connection(request: Request, database: DatabaseSession, user: LicensedUser) -> None:
    require_admin(user)
    connection = active_connection(database)
    if connection is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Home Assistant 连接不存在。')
    connector = request.app.state.ha_connector
    await connector.stop()
    try:
        database.delete(connection)
        database.commit()
        await connector.state_hub.replace([])
        await connector.state_hub.publish(
            {
                'type': 'entity_catalog_changed',
                'operation': 'cleared',
                'counts': {'entities': 0, 'devices': 0, 'areas': 0},
            }
        )
    except Exception:
        database.rollback()
        await connector.restart()
        raise
    await connector.restart()
    request.app.state.global_log.append('warning', 'Home Assistant', '连接', 'Home Assistant 连接配置已删除')


@router.post('/test')
async def test_connection(payload: HATestRequest, request: Request, user: LicensedUser) -> dict[str, Any]:
    require_admin(user)
    client = HAClient(
        payload.base_url,
        payload.access_token,
        verify_tls=payload.verify_tls,
        timeout=request.app.state.settings.ha_request_timeout_seconds,
    )
    try:
        result = await client.test_connection()
    except HAClientError as error:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT, detail=str(error)) from error
    return {'ok': True, **result}


@router.put('/connection')
async def save_connection(
    payload: HAConnectionInput,
    request: Request,
    database: DatabaseSession,
    user: LicensedUser,
) -> dict[str, Any]:
    if not request.app.state.license_service.allows('ha.configure'):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='当前授权不允许配置 Home Assistant。')
    require_admin(user)
    connector = request.app.state.ha_connector
    connection = active_connection(database)
    token = payload.access_token
    if not token:
        if connection is None:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT, detail='首次连接必须输入 Home Assistant Token。')
        try:
            token = connector.cipher.decrypt(connection.encrypted_access_token)
        except CredentialCipherError as error:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT, detail=str(error)) from error
    client = HAClient(
        payload.base_url,
        token,
        verify_tls=payload.verify_tls,
        timeout=request.app.state.settings.ha_request_timeout_seconds,
    )
    try:
        tested = await client.test_connection()
    except (HAClientError, CredentialCipherError) as error:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT, detail=str(error)) from error
    encrypted = connector.cipher.encrypt(token)
    ha_version = tested.get('version')
    if connection is None:
        connection = HAConnection(
            name=payload.name.strip(),
            base_url=payload.base_url,
            encrypted_access_token=encrypted,
            verify_tls=payload.verify_tls,
            ha_version=ha_version,
        )
        database.add(connection)
    else:
        connection.name = payload.name.strip()
        connection.base_url = payload.base_url
        connection.encrypted_access_token = encrypted
        connection.verify_tls = payload.verify_tls
        connection.ha_version = ha_version
    connection.last_error = None
    database.commit()
    database.refresh(connection)
    await connector.restart()
    request.app.state.global_log.append(
        'success',
        'Home Assistant',
        '连接',
        f'Home Assistant 连接配置已保存（{connection.name}，版本 {connection.ha_version or "未知"}）',
    )
    return connection_payload(connection, request)


@router.get('/entities')
def list_entities(
    database: DatabaseSession,
    viewer: LicensedViewer,
    search: str | None = Query(default=None, max_length=128),
    domain: str | None = Query(default=None, max_length=64),
    area_id: str | None = Query(default=None, alias='areaId', max_length=255),
    sync_status: str | None = Query(default=None, alias='status', max_length=32),
    limit: int = Query(default=200, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
) -> dict[str, Any]:
    connection = active_connection(database)
    if connection is None:
        return {'items': [], 'total': 0, 'limit': limit, 'offset': offset}
    filters = [HAEntity.connection_id == connection.id]
    allowed_entity_ids = viewer_entity_ids(database, viewer)
    if allowed_entity_ids is not None:
        filters.append(HAEntity.entity_id.in_(allowed_entity_ids))
    if search and search.strip():
        pattern = f'%{search.strip()}%'
        filters.append(or_(HAEntity.entity_id.ilike(pattern), HAEntity.name.ilike(pattern)))
    if domain:
        filters.append(HAEntity.domain == domain)
    if area_id:
        filters.append(HAEntity.area_id == area_id)
    if sync_status:
        filters.append(HAEntity.sync_status == sync_status)
    rows = database.execute(
        select(HAEntity, func.count().over().label('total_count'))
        .where(*filters)
        .order_by(HAEntity.entity_id)
        .offset(offset)
        .limit(limit)
    ).all()
    if not rows:
        total = database.scalar(select(func.count()).select_from(HAEntity).where(*filters)) or 0
        return {'items': [], 'total': int(total), 'limit': limit, 'offset': offset}
    total = int(rows[0].total_count)
    items = []
    for row in rows:
        item = row[0]
        items.append(
            {
                'entityId': item.entity_id,
                'domain': item.domain,
                'name': item.name,
                'icon': item.icon,
                'deviceId': item.device_id,
                'areaId': item.area_id,
                'platform': item.platform,
                'translationKey': item.translation_key,
                'hasEntityName': item.has_entity_name,
                'uniqueId': item.unique_id,
                'originalName': item.original_name,
                'disabledBy': item.disabled_by,
                'status': item.sync_status,
                'lastSeenAt': item.last_seen_at,
                'missingSince': item.missing_since,
            }
        )
    return {'items': items, 'total': total, 'limit': limit, 'offset': offset}


@router.get('/translations')
async def entity_translations(
    request: Request,
    _database: DatabaseSession,
    _viewer: LicensedViewer,
) -> dict[str, Any]:
    connection, integrations = await asyncio.to_thread(load_translation_context, request.app.state.database)
    if connection is None:
        return {'language': 'zh-Hans', 'resources': {}}
    try:
        resources = await request.app.state.ha_connector.client_for(connection).fetch_entity_translations(
            integrations,
            language='zh-Hans',
        )
    except (HAClientError, CredentialCipherError) as error:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(error)) from error
    return {'language': 'zh-Hans', 'resources': resources}


@router.get('/history')
async def entity_history(
    request: Request,
    _database: DatabaseSession,
    viewer: LicensedViewer,
    entity_id: str = Query(alias='entityId', min_length=3, max_length=255),
    hours: int = Query(default=24, ge=1, le=168),
) -> dict[str, Any]:
    connection, entity_exists = await asyncio.to_thread(
        load_authorized_entity_context,
        request.app.state.database,
        viewer,
        entity_id,
    )
    if connection is None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail='请先配置 Home Assistant 连接。')
    if not entity_exists:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='实体不存在、已禁用或已失联。')
    start_time = (datetime.now(timezone.utc) - timedelta(hours=hours)).isoformat()
    try:
        history = await request.app.state.ha_connector.fetch_history(connection, entity_id, start_time, hours)
    except (HAClientError, CredentialCipherError) as error:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(error)) from error
    points = []
    for item in history:
        value = history_state_value(item.get('state'))
        timestamp = item.get('last_updated') or item.get('last_changed')
        if timestamp:
            points.append({'timestamp': timestamp, 'value': value})
    if len(points) > 480:
        step = max(1, int(len(points) / 480))
        points = [points[index] for index in range(0, len(points), step)][:480]
    return {'entityId': entity_id, 'hours': hours, 'points': points}


def history_state_value(raw_state: Any) -> float | str | None:
    try:
        return float(raw_state)
    except (TypeError, ValueError):
        value = str(raw_state or '').strip()
        return value or None


@router.get('/areas')
def list_areas(database: DatabaseSession, _user: LicensedUser) -> dict[str, Any]:
    connection = active_connection(database)
    if connection is None:
        return {'items': []}
    areas = database.scalars(
        select(HAArea).where(HAArea.connection_id == connection.id).order_by(HAArea.name, HAArea.area_id)
    )
    items = []
    for item in areas:
        try:
            aliases = json.loads(item.aliases_json)
        except (TypeError, json.JSONDecodeError):
            aliases = []
        items.append(
            {
                'areaId': item.area_id,
                'name': item.name,
                'aliases': aliases if isinstance(aliases, list) else [],
                'status': item.sync_status,
            }
        )
    return {'items': items}


@router.get('/devices')
def list_devices(database: DatabaseSession, viewer: LicensedViewer) -> dict[str, Any]:
    connection = active_connection(database)
    if connection is None:
        return {'items': []}
    filters = [HADevice.connection_id == connection.id]
    allowed_entity_ids = viewer_entity_ids(database, viewer)
    if allowed_entity_ids is not None:
        allowed_device_ids = set(
            database.scalars(
                select(HAEntity.device_id).where(
                    HAEntity.connection_id == connection.id,
                    HAEntity.entity_id.in_(allowed_entity_ids),
                    HAEntity.device_id.is_not(None),
                )
            )
        )
        filters.append(HADevice.device_id.in_(allowed_device_ids))
    devices = database.scalars(select(HADevice).where(*filters).order_by(HADevice.name_by_user, HADevice.name, HADevice.device_id))
    return {
        'items': [
            {
                'deviceId': item.device_id,
                'name': item.name_by_user or item.name,
                'manufacturer': item.manufacturer,
                'model': item.model,
                'areaId': item.area_id,
                'status': item.sync_status,
            }
            for item in devices
        ]
    }


@router.get('/sync/status')
def sync_status(request: Request, database: DatabaseSession, _viewer: LicensedViewer) -> dict[str, Any]:
    connection = active_connection(database)
    if connection is None:
        return {'configured': False, 'status': 'not_configured', 'connected': False}
    state = database.get(HASyncState, connection.id)
    connector = request.app.state.ha_connector
    connected = connector.connected
    last_error = None if connected else (connector.runtime_error or (state.last_error if state else None))
    return {
        'configured': True,
        'connected': connected,
        'status': state.status if state else 'idle',
        'phase': state.phase if state else None,
        'lastFullSyncAt': state.last_full_sync_at if state else None,
        'lastIncrementalAt': state.last_incremental_at if state else None,
        'lastReconciledAt': state.last_reconciled_at if state else None,
        'catalogRevision': state.catalog_revision if state else 0,
        'counts': {
            'entities': state.entity_count if state else 0,
            'devices': state.device_count if state else 0,
            'areas': state.area_count if state else 0,
        },
        'lastError': last_error,
    }


@router.post('/sync')
async def run_sync(request: Request, _database: DatabaseSession, user: LicensedUser) -> dict[str, Any]:
    if not request.app.state.license_service.allows('ha.sync'):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='当前授权不允许同步 Home Assistant。')
    require_admin(user)
    connection = await asyncio.to_thread(load_active_connection_snapshot, request.app.state.database)
    if connection is None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail='请先配置 Home Assistant 连接。')
    try:
        counts = await request.app.state.ha_connector.sync_once(connection.id, reconciled=True)
    except (HAClientError, CredentialCipherError) as error:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(error)) from error
    return {'ok': True, 'counts': counts}


@router.get('/health')
def ha_health(request: Request, database: DatabaseSession, _viewer: LicensedViewer) -> dict[str, Any]:
    connection = active_connection(database)
    connected = request.app.state.ha_connector.connected
    if connected:
        last_error = None
    else:
        last_error = request.app.state.ha_connector.runtime_error or (connection.last_error if connection else None)
    return {
        'configured': connection is not None,
        'connected': connected,
        'lastError': last_error,
    }


@router.post('/services/call')
async def call_service(
    payload: HAServiceCallRequest,
    request: Request,
    _database: DatabaseSession,
    viewer: LicensedViewer,
) -> dict[str, Any]:
    if not request.app.state.license_service.allows('ha.control'):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='当前授权不允许控制 Home Assistant。')
    allowed_fields = ALLOWED_SERVICES.get((payload.domain, payload.service))
    if allowed_fields is None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='该 Home Assistant 服务不在允许列表中。')
    unknown_fields = set(payload.data) - allowed_fields
    if unknown_fields:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail='服务参数不允许：' + ', '.join(sorted(unknown_fields)),
        )
    entity_domain = payload.entity_id.partition('.')[0]
    if payload.domain == 'homeassistant' and payload.service == 'toggle' and entity_domain not in TOGGLE_ENTITY_DOMAINS:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT, detail='该实体类型不支持切换动作。')
    if payload.domain != 'homeassistant' and entity_domain != payload.domain:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT, detail='服务域与实体域不匹配。')
    connection, entity_exists = await asyncio.to_thread(
        load_authorized_entity_context,
        request.app.state.database,
        viewer,
        payload.entity_id,
    )
    if connection is None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail='请先配置 Home Assistant 连接。')
    if not entity_exists:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='实体不存在、已禁用或已失联。')
    actor = '仪表盘编辑器' if viewer.is_admin_session else '展示设备'
    try:
        result = await request.app.state.ha_connector.client_for(connection).call_service(
            payload.domain,
            payload.service,
            payload.entity_id,
            payload.data,
        )
    except (HAClientError, CredentialCipherError) as error:
        request.app.state.global_log.append(
            'error',
            actor,
            '设备操作',
            f'操作失败：{payload.entity_id} · {payload.domain}.{payload.service}',
            context={'entityId': payload.entity_id, 'service': f'{payload.domain}.{payload.service}', 'status': 502},
            details=traceback.format_exc(),
        )
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(error)) from error
    request.app.state.global_log.append(
        'success',
        actor,
        '设备操作',
        f'操作成功：{payload.entity_id} · {payload.domain}.{payload.service}',
        context={'entityId': payload.entity_id, 'service': f'{payload.domain}.{payload.service}'},
    )
    return {'ok': True, 'result': result}


@router.post('/media/browse')
async def browse_media(
    payload: HABrowseMediaRequest,
    request: Request,
    _database: DatabaseSession,
    viewer: LicensedViewer,
) -> dict[str, Any]:
    if not request.app.state.license_service.allows('ha.control'):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='当前授权不允许控制 Home Assistant。')
    entity_domain = payload.entity_id.partition('.')[0]
    if entity_domain != 'media_player':
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT, detail='媒体浏览只能用于媒体播放器实体。')
    connection, entity_exists = await asyncio.to_thread(
        load_authorized_entity_context,
        request.app.state.database,
        viewer,
        payload.entity_id,
    )
    if connection is None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail='请先配置 Home Assistant 连接。')
    if not entity_exists:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='实体不存在、已禁用或已失联。')
    try:
        result = await request.app.state.ha_connector.client_for(connection).browse_media(
            payload.entity_id,
            payload.media_content_id,
            payload.media_content_type,
        )
    except (HAClientError, CredentialCipherError) as error:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(error)) from error
    return {'ok': True, 'result': result}


def websocket_viewer(websocket: WebSocket) -> ViewerPrincipal | None:
    settings = websocket.app.state.settings
    with websocket.app.state.database.session_factory() as database:
        viewer = resolve_viewer_principal(
            database,
            session_token=websocket.cookies.get(settings.cookie_name, ''),
            display_token=websocket.cookies.get(settings.display_cookie_name, ''),
            account_user_id=websocket.app.state.admin_account.user_id,
        )
        if viewer is None:
            return None
        if viewer.user is not None:
            database.expunge(viewer.user)
        if viewer.display is not None:
            database.expunge(viewer.display)
        return viewer


def websocket_origin_allowed(websocket: WebSocket) -> bool:
    '''Require browser WebSockets to originate from this application host.'''
    origin = websocket.headers.get('origin', '').strip()
    if not origin:
        return False
    configured_base_url = websocket.app.state.settings.app_base_url
    if configured_base_url:
        parsed = urlsplit(configured_base_url)
        expected_origin = f'{parsed.scheme}://{parsed.netloc}' if parsed.scheme in {'http', 'https'} and parsed.netloc else ''
        return bool(expected_origin) and origin == expected_origin
    parsed_origin = urlsplit(origin)
    host = websocket.headers.get('host', '').strip()
    if (
        parsed_origin.scheme not in {'http', 'https'}
        or not parsed_origin.netloc
        or parsed_origin.username is not None
        or parsed_origin.password is not None
        or parsed_origin.path not in {'', '/'}
        or parsed_origin.query
        or parsed_origin.fragment
        or not host
    ):
        return False
    return parsed_origin.netloc.casefold() == host.casefold()


@runtime_router.websocket('/ws/runtime')
async def runtime_websocket(websocket: WebSocket) -> None:
    context = {
        'requestId': uuid4().hex,
        'path': '/api/v1/ws/runtime',
        'method': 'WEBSOCKET',
    }
    token = event_context.set(context)
    try:
        try:
            await _runtime_websocket(websocket, context)
        except Exception as error:
            _runtime_log(
                websocket,
                'error',
                f'实时连接异常：{error}',
                context,
                details=traceback.format_exc(),
            )
            raise
    finally:
        event_context.reset(token)


def _runtime_log(
    websocket: WebSocket,
    level: str,
    message: str,
    context: dict,
    *,
    details: str | None = None,
) -> None:
    log = getattr(getattr(websocket, 'app', None), 'state', None)
    log = getattr(log, 'global_log', None) if log is not None else None
    if log is None:
        return
    source = '展示设备' if context.get('displayId') else ('仪表盘编辑器' if context.get('actor') else '系统后台')
    log.append(level, source, '实时连接', message, context=context, details=details)


async def _runtime_websocket(websocket: WebSocket, context: dict) -> None:
    async def close_with_log(code: int, reason: str, *, send_reason: bool = True) -> None:
        _runtime_log(
            websocket,
            'warning',
            f'实时连接已关闭：{reason}',
            {**context, 'code': str(code), 'phase': 'rejected'},
        )
        await websocket.close(code=code, reason=reason if send_reason else None)

    if not websocket_origin_allowed(websocket):
        await close_with_log(4403, 'origin not allowed')
        return
    viewer = await asyncio.to_thread(websocket_viewer, websocket)
    if viewer is None:
        await close_with_log(4401, 'authentication required')
        return
    if viewer.user is not None:
        context['actor'] = viewer.user.username
    if viewer.display is not None:
        context.update(
            displayId=viewer.display.id,
            displayName=viewer.display.name,
            projectId=viewer.display.project_id,
        )
    if not websocket.app.state.license_service.allows('runtime.websocket'):
        await close_with_log(4403, 'license restricted')
        return
    await websocket.accept()
    context['phase'] = 'accepted'
    _runtime_log(websocket, 'info', '实时连接已建立', context)

    display_binding_cache = None

    async def display_binding_matches() -> bool:
        nonlocal display_binding_cache
        if viewer.display is None:
            return True
        now = time.monotonic()
        if display_binding_cache is not None and now - display_binding_cache[0] < DISPLAY_BINDING_CACHE_SECONDS:
            return display_binding_cache[1]

        def load_binding_match() -> bool:
            with websocket.app.state.database.session_factory() as database:
                device = active_display_device(
                    database,
                    websocket.cookies.get(websocket.app.state.settings.display_cookie_name, ''),
                )
                return bool(device and viewer.display is not None and device.id == viewer.display.id)

        matches = await asyncio.to_thread(load_binding_match)
        display_binding_cache = (time.monotonic(), matches)
        return matches

    def load_allowed_entity_ids():
        with websocket.app.state.database.session_factory() as database:
            allowed = viewer_entity_ids(database, viewer)
            return set(allowed) if allowed is not None else None

    queue = websocket.app.state.ha_connector.state_hub.subscribe()
    entity_ids: set[str] = set()
    watching = False
    try:
        while True:
            if not await display_binding_matches():
                await close_with_log(4401, 'authentication required')
                return
            try:
                event = await asyncio.wait_for(websocket.receive_json(), timeout=30)
            except TimeoutError:
                continue
            except WebSocketDisconnect:
                return
            if not isinstance(event, dict) or event.get('type') != 'subscribe':
                await close_with_log(4400, 'subscribe message required')
                return
            value = event.get('entityIds')
            if not isinstance(value, list):
                await close_with_log(4400, 'subscribe message required')
                return
            next_ids = {str(item) for item in value if item}
            allowed_entity_ids = await asyncio.to_thread(load_allowed_entity_ids)
            if allowed_entity_ids is not None:
                next_ids.intersection_update(allowed_entity_ids)
            if len(next_ids) > MAX_RUNTIME_ENTITIES:
                next_ids = set(list(next_ids)[:MAX_RUNTIME_ENTITIES])
            if watching:
                await websocket.app.state.ha_connector.remove_runtime_entity_watch(entity_ids)
            entity_ids = next_ids
            websocket.app.state.ha_connector.state_hub.set_subscription_entities(queue, entity_ids)
            await websocket.app.state.ha_connector.add_runtime_entity_watch(entity_ids)
            watching = True
            initial_snapshot = await websocket.app.state.ha_connector.state_hub.snapshot(entity_ids)
            await websocket.send_json({'type': 'snapshot', 'states': initial_snapshot})
            await websocket.app.state.ha_connector.ensure_entity_states(entity_ids)
            hydrated_snapshot = await websocket.app.state.ha_connector.state_hub.snapshot(entity_ids)
            if hydrated_snapshot != initial_snapshot:
                await websocket.send_json({'type': 'snapshot', 'states': hydrated_snapshot})
            while True:
                if not await display_binding_matches():
                    await close_with_log(4401, 'authentication required')
                    return
                receive_task = asyncio.create_task(websocket.receive_json())
                event_task = asyncio.create_task(queue.get())
                done, pending = await asyncio.wait({receive_task, event_task}, return_when=asyncio.FIRST_COMPLETED)
                for task in pending:
                    task.cancel()
                if receive_task in done:
                    try:
                        event = receive_task.result()
                    except WebSocketDisconnect:
                        return
                    break
                event = event_task.result()
                await websocket.send_json(event)
    finally:
        websocket.app.state.ha_connector.state_hub.unsubscribe(queue)
        if watching:
            await websocket.app.state.ha_connector.remove_runtime_entity_watch(entity_ids)
