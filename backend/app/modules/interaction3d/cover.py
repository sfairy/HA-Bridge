"""Saved curtain model binding and authoritative HA capability checks."""
from __future__ import annotations

import math

from fastapi import HTTPException

COVER_SERVICES = {
    'open_cover': 1,
    'close_cover': 2,
    'set_cover_position': 4,
    'stop_cover': 8,
}


def _number(value) -> bool:
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        return False
    try:
        return math.isfinite(value)
    except OverflowError:
        return False


def require_curtain_model(bindings, entity_id: str, scene: dict) -> None:
    """Only a unique ordinary curtain model can authorize its bound cover."""
    floors = scene.get('floors') if isinstance(scene.get('floors'), list) else []
    if not floors and isinstance(scene, dict):
        floors = [{'scene': scene, 'id': scene.get('id')}]
    binding = next(
        (
            item
            for item in (bindings or [])
            if isinstance(item, dict) and str(item.get('entityId') or '') == entity_id
        ),
        None,
    )
    if not isinstance(binding, dict):
        raise HTTPException(409, detail='窗帘模型已失联，请在环境配置中重新选择普通窗帘模型。')
    floor_id = str(binding.get('floorId') or '')
    model_id = str(binding.get('modelId') or '')
    floor = next(
        (
            item
            for item in floors
            if isinstance(item, dict) and str(item.get('id') or '') == floor_id
        ),
        None,
    )
    if floor is None and len(floors) == 1 and isinstance(floors[0], dict):
        floor = floors[0]
    if not isinstance(floor, dict) or not model_id:
        raise HTTPException(409, detail='窗帘模型已失联，请在环境配置中重新选择普通窗帘模型。')
    scene_payload = floor.get('scene') if isinstance(floor.get('scene'), dict) else {}
    catalog = floor.get('models') or scene_payload.get('items') or scene_payload.get('models') or []
    models = [
        item
        for item in catalog
        if isinstance(item, dict) and str(item.get('id') or '') == model_id
    ]
    if len(models) != 1 or models[0].get('type') != 'curtain':
        raise HTTPException(409, detail='窗帘模型已失联，请在环境配置中重新选择普通窗帘模型。')


def validate_cover_command(service: str, data: dict, state: dict | None) -> None:
    required_feature = COVER_SERVICES.get(service)
    fields = {'position'} if service == 'set_cover_position' else set()
    if required_feature is None or not isinstance(data, dict) or set(data) - fields:
        raise HTTPException(422, detail='窗帘控制不支持此服务或参数。')
    if service == 'set_cover_position':
        position = data.get('position')
        if (
            isinstance(position, bool)
            or not isinstance(position, (int, float))
            or not _number(position)
            or position != int(position)
            or not 0 <= int(position) <= 100
        ):
            raise HTTPException(422, detail='窗帘位置必须是 0 到 100 的整数。')
    if not isinstance(state, dict) or state.get('available') is False:
        raise HTTPException(409, detail='窗帘状态暂不可用，请等待设备重新连接。')
    if state.get('state') in frozenset({None, '', 'unknown', 'unavailable'}):
        raise HTTPException(409, detail='窗帘状态暂不可用，请等待设备重新连接。')
    attributes = state.get('attributes')
    if not isinstance(attributes, dict):
        raise HTTPException(409, detail='窗帘能力尚未载入，请稍后重试。')
    features = attributes.get('supported_features')
    try:
        features = int(features)
    except (TypeError, ValueError):
        raise HTTPException(409, detail='窗帘能力尚未载入，请稍后重试。') from None
    if features < 0:
        raise HTTPException(409, detail='窗帘能力尚未载入，请稍后重试。')
    if not features & required_feature:
        raise HTTPException(422, detail='窗帘当前不支持此操作。')
