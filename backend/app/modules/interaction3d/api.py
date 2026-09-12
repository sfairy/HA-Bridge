from __future__ import annotations

import hashlib
import json
import logging
import re
import shutil
from urllib.parse import urlencode
from uuid import uuid4

from fastapi import APIRouter, HTTPException, Query, Request
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse, Response
from pydantic import Field
from sqlalchemy import select
from starlette.concurrency import run_in_threadpool

from api.assets import UPLOAD_CONTENT_TYPES, user_asset_file
from api.ha import active_connection, call_service
from dependencies import DatabaseSession, LicensedUser, LicensedViewer, require_viewer_project
from models import HAEntity, ProjectDraft
from modules.interaction3d.access import access_grant, module_components, require_access
from modules.interaction3d.climate import require_air_conditioner_model, validate_climate_command
from modules.interaction3d.cover import require_curtain_model, validate_cover_command
from modules.interaction3d.render_cache import MAX_ENTRY_BYTES, cache_path, read_cache, write_cache
from schemas import HAServiceCallRequest

router = APIRouter(prefix='/modules/interaction3d', tags=['3D interaction'])
logger = logging.getLogger(__name__)
SCENE_ID = re.compile('[0-9a-f]{32}')
RESOURCE_TYPES = {
    **{
        name: 'text/javascript'
        for name in (
            'security-editor.js',
            'presence-focus-editor.js',
            'presence-character.js',
            'presence-motion.js',
            'presence-scene.js',
            'presence-editor.js',
            'floor-navigation.js',
            'vacuum-motion.js',
            'vacuum-map.js',
            'vacuum-map-editor.js',
            'runtime.js',
            'stage.js',
            'television-state.js',
            'television-panel.js',
            'television-screen.js',
            'nas-status.js',
            'camera-status.js',
            'nas-panel.js',
            'config-editor.js',
            'range-dialog.js',
            'light-range-editor.js',
            'light-state.js',
            'light-stream.js',
            'camera-motion.js',
            'idle-rotation.js',
            'scene-sync.js',
            'climate-state.js',
            'climate-panel.js',
            'environment-scene.js',
            'environment-halos.js',
            'environment-airflow.js',
            'cover-state.js',
            'cover-panel.js',
            'cover-feedback.js',
            'curtain-motion.js',
        )
    },
    **{
        name: 'text/css'
        for name in (
            'presence-editor.css',
            'runtime.css',
            'stage.css',
            'climate-panel.css',
            'nas-panel.css',
            'cover-panel.css',
        )
    },
}

TELEVISION_SERVICES = {
    'turn_on': 128,
    'turn_off': 256,
    'media_previous_track': 16,
    'media_next_track': 32,
    'media_play': 16384,
    'media_pause': 1,
}


class Interaction3dControlRequest(HAServiceCallRequest):
    project_id: str = Field(default='', alias='projectId', max_length=128)
    component_id: str = Field(default='', alias='componentId', max_length=128)
    device_kind: str = Field(default='', alias='deviceKind', max_length=32)


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


def floor_item_catalog(floor: dict) -> list:
    """Studio floors store furniture under scene.items (legacy: models)."""
    if not isinstance(floor, dict):
        return []
    scene = floor.get('scene') if isinstance(floor.get('scene'), dict) else {}
    # Empty models:[] must not win over scene.items (same as cover/climate).
    return floor.get('models') or scene.get('items') or scene.get('models') or []


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
    except (OSError, ValueError, AttributeError) as exc:
        if since:
            raise HTTPException(409, detail='户型保存尚未完成，稍后自动重试。')
        logger.debug('场景 current 回退到快照 scene=%s: %s', scene_id, exc)
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
        except (OSError, ValueError, KeyError, AttributeError) as exc:
            logger.debug('背景图解析跳过 scene=%s asset=%s: %s', scene_id, asset_id, exc)
    raise HTTPException(404, detail='户型底图不存在。')


def _load_component(database, project_id: str, component_id: str):
    draft = database.get(ProjectDraft, project_id)
    if draft is None:
        return None
    return next(
        (item for _, item in module_components(json.loads(draft.document_json)) if item.get('id') == component_id),
        None,
    )


def _scene_payload(request: Request, scene_id: str) -> dict:
    source = request.app.state.settings.studio3d_draft_path
    reference = json.loads(scene_path(request, scene_id).read_text(encoding='utf-8'))
    try:
        if source.is_file():
            payload = json.loads(source.read_text(encoding='utf-8'))
            if isinstance(payload.get('scene'), dict):
                return payload
    except (OSError, ValueError, KeyError, TypeError, AttributeError) as exc:
        logger.debug('场景草稿回退到快照 scene=%s: %s', scene_id, exc)
    return reference


def _component_devices(component: dict, kind: str) -> list:
    properties = component.get('properties') or {}
    if kind == 'television':
        devices = ((properties.get('devices') or {}).get('televisions')) or []
        return devices if isinstance(devices, list) else []
    environment = properties.get('environment') or {}
    key = 'curtains' if kind == 'cover' else 'airConditioners'
    items = environment.get(key) or []
    return items if isinstance(items, list) else []


async def _live_state(request: Request, entity_id: str) -> dict | None:
    states = await request.app.state.ha_connector.state_hub.snapshot({entity_id})
    return next((item for item in states if item.get('entityId') == entity_id), None)


@router.post('/control')
async def control_device(
    payload: Interaction3dControlRequest,
    request: Request,
    database: DatabaseSession,
    viewer: LicensedViewer,
):
    require_access(request)
    device_kind = (payload.device_kind or '').strip()
    domain = payload.domain
    service = payload.service
    entity_id = payload.entity_id
    data = payload.data if isinstance(payload.data, dict) else {}

    if device_kind == 'television' or domain == 'media_player':
        if not payload.project_id or not payload.component_id:
            raise HTTPException(422, detail='电视控制缺少仪表盘或控件信息。')
        require_viewer_project(viewer, payload.project_id)
        component = _load_component(database, payload.project_id, payload.component_id)
        if component is None:
            raise HTTPException(422, detail='电视控制缺少仪表盘或控件信息。')
        televisions = _component_devices(component, 'television')
        match = next(
            (
                item
                for item in televisions
                if isinstance(item, dict)
                and (
                    str(item.get('powerEntityId') or '') == entity_id
                    or str(item.get('entityId') or '') == entity_id
                )
            ),
            None,
        )
        if match is None:
            raise HTTPException(403, detail='此电源实体未配置到当前电视。')
        scene_id = str((component.get('properties') or {}).get('sceneId') or '')
        try:
            scene = _scene_payload(request, scene_id).get('scene') or {}
            floors = scene_floors(scene)
            model_id = str(match.get('modelId') or '')
            floor_id = str(match.get('floorId') or '')
            models = []
            for floor in floors:
                if not isinstance(floor, dict):
                    continue
                if floor_id and str(floor.get('id') or '') != floor_id:
                    continue
                for item in floor_item_catalog(floor):
                    if isinstance(item, dict) and str(item.get('id') or '') == model_id:
                        models.append(item)
            if len(models) != 1 or models[0].get('type') != 'tv':
                raise HTTPException(409, detail='电视模型已失联，请重新配置。')
        except (OSError, ValueError, KeyError, TypeError, AttributeError) as error:
            raise HTTPException(409, detail='户型暂时无法读取，请稍后重试。') from error
        if domain not in frozenset({'switch', 'media_player'}) or service not in TELEVISION_SERVICES:
            raise HTTPException(422, detail='电视不支持此控制操作或参数。')
        if set(data):
            raise HTTPException(422, detail='电视不支持此控制操作或参数。')
        state = await _live_state(request, entity_id)
        if (
            not isinstance(state, dict)
            or state.get('available') is False
            or state.get('state') in frozenset({None, '', 'unknown', 'unavailable'})
        ):
            raise HTTPException(409, detail='电视电源状态不可用，请稍后重试。')
        if domain == 'media_player':
            attributes = state.get('attributes') if isinstance(state.get('attributes'), dict) else {}
            try:
                features = int(attributes.get('supported_features') or 0)
            except (TypeError, ValueError):
                features = 0
            required = TELEVISION_SERVICES[service]
            if not features & required:
                raise HTTPException(422, detail='此媒体实体不支持该操作。')
            if service not in frozenset({'turn_on', 'turn_off'}) and state.get('state') in frozenset(
                {'off', 'standby'}
            ):
                raise HTTPException(409, detail='请先开启电视。')
        return await call_service(payload, request, database, viewer)

    if device_kind in frozenset({'cover', 'climate'}) or domain in frozenset({'cover', 'climate'}):
        is_cover = device_kind == 'cover' or domain == 'cover'
        label = '窗帘' if is_cover else '空调'
        if not payload.project_id or not payload.component_id:
            raise HTTPException(422, detail=f'{label}控制缺少仪表盘或控件信息。')
        require_viewer_project(viewer, payload.project_id)
        component = _load_component(database, payload.project_id, payload.component_id)
        if component is None:
            raise HTTPException(422, detail=f'{label}控制缺少仪表盘或控件信息。')
        bindings = _component_devices(component, 'cover' if is_cover else 'climate')
        if not any(isinstance(item, dict) and str(item.get('entityId') or '') == entity_id for item in bindings):
            raise HTTPException(403, detail=f'此{label}未配置到当前 3D 交互控件。')
        scene_id = str((component.get('properties') or {}).get('sceneId') or '')
        try:
            scene = _scene_payload(request, scene_id).get('scene') or {}
            if is_cover:
                require_curtain_model(bindings, entity_id, scene)
            else:
                require_air_conditioner_model(bindings, entity_id, scene)
        except HTTPException:
            raise
        except (OSError, ValueError, KeyError, TypeError, AttributeError) as error:
            raise HTTPException(409, detail='户型暂时无法读取，请稍后重试。') from error
        connection = active_connection(database)
        if connection is None:
            raise HTTPException(409, detail='请先配置 Home Assistant 连接。')
        entity = database.scalar(
            select(HAEntity).where(
                HAEntity.connection_id == connection.id,
                HAEntity.entity_id == entity_id,
                HAEntity.sync_status == 'active',
                HAEntity.disabled_by.is_(None),
            )
        )
        if entity is None:
            raise HTTPException(404, detail='实体不存在、已禁用或已失联。')
        state = await _live_state(request, entity_id)
        if is_cover:
            if domain != 'cover':
                raise HTTPException(422, detail='3D 交互控制只支持已配置的灯光、开关、空调或窗帘。')
            validate_cover_command(service, data, state)
        else:
            if domain != 'climate':
                raise HTTPException(422, detail='3D 交互控制只支持已配置的灯光、开关、空调或窗帘。')
            validate_climate_command(service, data, state)
        return await call_service(payload, request, database, viewer)

    if domain not in frozenset({'light', 'switch'}) or service not in frozenset({'turn_on', 'turn_off'}):
        raise HTTPException(422, detail='3D 交互控制只支持已配置的灯光、开关、空调或窗帘。')
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
        '<link rel="stylesheet" href="/api/v1/modules/interaction3d/stage.css?v=20260910-health-fixes-v1"></head>',
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
