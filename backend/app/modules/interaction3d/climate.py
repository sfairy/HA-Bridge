"""Model binding and live HA capability checks for the 3D climate controls."""
from __future__ import annotations

import math

from fastapi import HTTPException

CLIMATE_SERVICES = {
    'set_temperature': 'temperature',
    'set_hvac_mode': 'hvac_mode',
    'set_fan_mode': 'fan_mode',
    'set_swing_mode': 'swing_mode',
}
AIR_CONDITIONER_TYPES = frozenset({'wallac', 'floorac', 'airoutlet'})
# Home Assistant ClimateEntityFeature.TARGET_TEMPERATURE
TARGET_TEMPERATURE_FEATURE = 1


def _number(value) -> bool:
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        return False
    try:
        return math.isfinite(value)
    except OverflowError:
        return False


def require_air_conditioner_model(bindings, entity_id: str, scene: dict) -> None:
    """A saved model id, never a light-group id, anchors a climate binding."""
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
        raise HTTPException(409, detail='空调模型已失联，请在环境配置中重新选择模型。')
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
        raise HTTPException(409, detail='空调模型已失联，请在环境配置中重新选择模型。')
    models = [
        item
        for item in (floor.get('models') or floor.get('scene', {}).get('models') or [])
        if isinstance(item, dict) and str(item.get('id') or '') == model_id
    ]
    if len(models) != 1 or models[0].get('type') not in AIR_CONDITIONER_TYPES:
        raise HTTPException(409, detail='空调模型已失联，请在环境配置中重新选择模型。')


def validate_climate_command(service: str, data: dict, state: dict | None) -> None:
    field = CLIMATE_SERVICES.get(service)
    if field is None or not isinstance(data, dict):
        raise HTTPException(422, detail='空调控制不支持此服务或参数。')
    if set(data) - {field}:
        raise HTTPException(422, detail='空调控制不支持此服务或参数。')
    if not isinstance(state, dict) or state.get('available') is False:
        raise HTTPException(409, detail='空调状态暂不可用，请等待设备重新连接。')
    attributes = state.get('attributes')
    if not isinstance(attributes, dict):
        raise HTTPException(409, detail='空调能力尚未载入，请稍后重试。')

    if service == 'set_temperature':
        temperature = data.get('temperature')
        if not _number(temperature):
            raise HTTPException(422, detail='空调控制不支持此服务或参数。')
        min_temp = attributes.get('min_temp')
        max_temp = attributes.get('max_temp')
        step = attributes.get('target_temp_step', 1)
        features = attributes.get('supported_features', 0)
        try:
            features = int(features or 0)
        except (TypeError, ValueError):
            features = 0
        has_temperature = bool(features & TARGET_TEMPERATURE_FEATURE) or (
            _number(min_temp) and _number(max_temp)
        )
        if not has_temperature or not _number(min_temp) or not _number(max_temp):
            raise HTTPException(422, detail='空调未提供有效的温度调节能力。')
        if not (float(min_temp) <= float(temperature) <= float(max_temp)):
            raise HTTPException(422, detail='目标温度超出空调支持的范围。')
        if _number(step) and float(step) > 0:
            offset = (float(temperature) - float(min_temp)) / float(step)
            if abs(offset - round(offset)) > 0.001:
                raise HTTPException(422, detail='目标温度不符合空调支持的调节步长。')
        return

    options_key = {'hvac_mode': 'hvac_modes', 'fan_mode': 'fan_modes', 'swing_mode': 'swing_modes'}[field]
    options = attributes.get(options_key)
    value = data.get(field)
    if not isinstance(value, str) or not isinstance(options, list) or value not in options:
        raise HTTPException(422, detail='该模式不在空调当前支持的选项中。')
