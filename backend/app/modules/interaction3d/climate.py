'''Model binding and live HA capability checks for the 3D climate controls.'''
from __future__ import annotations

import math

from fastapi import HTTPException

CLIMATE_SERVICES = {
    'set_temperature': 'temperature',
    'set_hvac_mode': 'hvac_mode',
    'set_fan_mode': 'fan_mode',
    'set_swing_mode': 'swing_mode',
}


def require_air_conditioner_model(bindings: list, entity_id: str, scene: dict) -> None:
    '''A saved model id, never a light-group id, anchors a climate binding.'''
    floors = scene.get('floors', [])
    for binding in bindings:
        if binding.get('entityId') != entity_id:
            continue
        floor = next((item for item in floors if item.get('id') == binding.get('floorId')), None)
        if floor is None:
            continue
        models = [item for item in floor.get('scene', {}).get('items', []) if item.get('id') == binding.get('modelId')]
        if len(models) == 1 and models[0].get('type') in {'wallac', 'floorac', 'airoutlet'}:
            return None
    raise HTTPException(status_code=409, detail='空调模型已失联，请在环境配置中重新选择模型。')


def _number(value) -> bool:
    if not isinstance(value, (int, float)) or isinstance(value, bool):
        return False
    try:
        return math.isfinite(value)
    except OverflowError:
        return False


def validate_climate_command(service: str, data: dict, state: dict | None) -> None:
    field = CLIMATE_SERVICES.get(service)
    if field is None or set(data) != {field}:
        raise HTTPException(status_code=422, detail='3D 空调控制不支持此服务或参数。')
    if not state or state.get('available') is False or state.get('state') in {None, '', 'unknown', 'unavailable'}:
        raise HTTPException(status_code=409, detail='空调状态暂不可用，请等待设备重新连接。')
    attributes = state.get('attributes')
    if not isinstance(attributes, dict):
        raise HTTPException(status_code=409, detail='空调能力尚未载入，请稍后重试。')
    value = data[field]
    if service == 'set_temperature':
        minimum, maximum = attributes.get('min_temp'), attributes.get('max_temp')
        step = attributes.get('target_temp_step', 0.5)
        features = attributes.get('supported_features', 0)
        has_temperature = _number(attributes.get('temperature')) or (
            isinstance(features, int) and not isinstance(features, bool) and bool(features & 1)
        )
        if (
            not has_temperature
            or not all(_number(item) for item in (minimum, maximum, step))
            or minimum >= maximum
            or step <= 0
        ):
            raise HTTPException(status_code=409, detail='空调未提供有效的温度调节能力。')
        if not _number(value) or not minimum <= value <= maximum:
            raise HTTPException(status_code=422, detail='目标温度超出空调支持的范围。')
        increments = (value - minimum) / step
        if not (math.isfinite(increments) and math.isclose(increments, round(increments), abs_tol=1e-06)):
            raise HTTPException(status_code=422, detail='目标温度不符合空调支持的调节步长。')
        return None
    choices = attributes.get({'hvac_mode': 'hvac_modes', 'fan_mode': 'fan_modes', 'swing_mode': 'swing_modes'}[field])
    if not isinstance(value, str) or not isinstance(choices, list) or not value or value not in choices:
        raise HTTPException(status_code=422, detail='该模式不在空调当前支持的选项中。')
    return None
