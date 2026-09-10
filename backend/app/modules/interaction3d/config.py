"""The 3D add-on's configuration contract, independent of the panel popup schema."""
from __future__ import annotations

import math
import re

from fastapi import HTTPException

PROPERTY_KEYS = frozenset(
    {
        'label',
        'camera',
        'lights',
        'devices',
        'sceneId',
        'floorGap',
        'security',
        'autoRotate',
        'layoutMode',
        'navigation',
        'environment',
        'interaction',
        'renderScale',
        'baseLighting',
        'floorCameras',
        'floorNumbers',
        'instanceName',
        'lightingMode',
        'popupOpacity',
        'behaviorScope',
        'idleExitFocus',
        'idleHideIcons',
        'pageBehaviors',
        'floorSelection',
        'pageSaturation',
        'pageDimStrength',
        'focusDimStrength',
        'groundReflection',
        'backgroundVisible',
        'motionRenderScale',
        'lightRegionOverrides',
        'focusVignetteStrength',
        'hideIconsWhileRotating',
    }
)
LIGHT_KEYS = frozenset(
    {
        'x',
        'y',
        'id',
        'icon',
        'size',
        'label',
        'height',
        'floorId',
        'groupId',
        'hitSize',
        'visible',
        'entityId',
        'iconSize',
        'clickAction',
        'effectRange',
        'focusCamera',
        'fadeDuration',
        'effectDefaults',
        'hiddenClickable',
    }
)
CLICK_ACTIONS = frozenset(
    {
        'focus',
        'turn-on',
        'turn-on-focus',
        'turn-on-panel',
        'toggle',
        'none',
        'more-info',
    }
)
ICON_PATTERN = re.compile(r'^mdi:[a-z0-9][a-z0-9-]{0,119}$')
ENTITY_PATTERN = re.compile(r'(light|switch)\.[a-z0-9_]+')
LIGHTING_BOUNDS = {
    'exposure': (0.5, 2),
    'hemisphereIntensity': (0, 3),
    'ambientIntensity': (0, 2),
    'mainIntensity': (0, 5),
    'mainAzimuth': (-180, 180),
    'mainElevation': (5, 89),
    'mainShadowIntensity': (0, 1),
    'fillIntensity': (0, 3),
    'fillAzimuth': (-180, 180),
    'fillElevation': (0, 89),
    'topIntensity': (0, 3),
    'topAzimuth': (-180, 180),
    'topElevation': (0, 89),
}


def validate_config(properties) -> None:
    def fail() -> None:
        raise HTTPException(422, detail='3D 交互配置无效，请检查户型、灯光、环境及图标设置。')

    def number(value, low, high) -> bool:
        if isinstance(value, bool) or not isinstance(value, (int, float)):
            return False
        try:
            return math.isfinite(value) and low <= value <= high
        except OverflowError:
            return False

    def text(value, length=128) -> bool:
        return isinstance(value, str) and len(value) <= length

    def validate_camera(camera, *, allow_legacy_interaction: bool = False) -> None:
        if camera in (None, {}):
            return
        if not isinstance(camera, dict):
            fail()
        allowed = {'mode', 'zoom', 'target', 'position', 'up', 'view', 'frameSize', 'focalLength', 'topRotation'}
        if allow_legacy_interaction:
            allowed |= {'panEnabled', 'zoomEnabled', 'rotationMode'}
        if set(camera) - allowed:
            fail()
        if camera.get('mode', 'perspective') not in ('orthographic', 'perspective'):
            fail()
        if 'zoom' in camera and not number(camera['zoom'], 0.01, 100):
            fail()
        for key in ('position', 'target', 'up'):
            if key not in camera:
                continue
            vector = camera[key]
            if not isinstance(vector, list) or len(vector) != 3:
                fail()
            if not all(isinstance(item, (int, float)) and not isinstance(item, bool) and math.isfinite(item) for item in vector):
                fail()
            if any(abs(item) > 10000 for item in vector):
                fail()
        for key, low, high in (('frameSize', 0.001, 20000), ('topRotation', 0, 360), ('focalLength', 18, 120)):
            if key in camera and not number(camera[key], low, high):
                fail()
        if camera.get('view', 'free') not in ('free', 'top'):
            fail()
        if allow_legacy_interaction:
            if camera.get('rotationMode', 'free') not in ('free', 'horizontal', 'vertical'):
                fail()
            for key in ('panEnabled', 'zoomEnabled'):
                if key in camera and not isinstance(camera[key], bool):
                    fail()

    if not isinstance(properties, dict) or set(properties) - PROPERTY_KEYS:
        fail()
    if properties.get('layoutMode', 'free') not in frozenset({'fill', 'free'}):
        fail()
    if not isinstance(properties.get('backgroundVisible', True), bool):
        fail()
    if not number(properties.get('renderScale', 1), 0.25, 2):
        fail()
    if not number(properties.get('focusVignetteStrength', 14), 0, 60):
        fail()
    if not number(properties.get('popupOpacity', 74), 0, 100):
        fail()
    interaction = properties.get('interaction', {})
    if not isinstance(interaction, dict) or set(interaction) - {'panEnabled', 'zoomEnabled', 'rotationMode'}:
        fail()
    if interaction.get('rotationMode', 'free') not in frozenset({'free', 'vertical', 'horizontal'}):
        fail()
    for key in ('panEnabled', 'zoomEnabled'):
        if key in interaction and not isinstance(interaction[key], bool):
            fail()
    auto_rotate = properties.get('autoRotate', {})
    if not isinstance(auto_rotate, dict) or set(auto_rotate) - {
        'speed',
        'enabled',
        'direction',
        'idleSeconds',
        'returnToDefault',
    }:
        fail()
    if not isinstance(auto_rotate.get('enabled', False), bool):
        fail()
    if not isinstance(auto_rotate.get('returnToDefault', False), bool):
        fail()
    if auto_rotate.get('direction', 'clockwise') not in ('clockwise', 'counterclockwise'):
        fail()
    idle_seconds = auto_rotate.get('idleSeconds', 30)
    if isinstance(idle_seconds, float) and idle_seconds.is_integer():
        idle_seconds = int(idle_seconds)
    if not isinstance(idle_seconds, int) or isinstance(idle_seconds, bool) or not number(idle_seconds, 1, 3600):
        fail()
    if not number(auto_rotate.get('speed', 6), 0.5, 30):
        fail()
    idle_hide_icons = properties.get('idleHideIcons', {})
    if not isinstance(idle_hide_icons, dict) or set(idle_hide_icons) - {'enabled', 'idleSeconds'}:
        fail()
    if not isinstance(idle_hide_icons.get('enabled', False), bool):
        fail()
    hide_idle_seconds = idle_hide_icons.get('idleSeconds', 30)
    if isinstance(hide_idle_seconds, float) and hide_idle_seconds.is_integer():
        hide_idle_seconds = int(hide_idle_seconds)
    if not isinstance(hide_idle_seconds, int) or isinstance(hide_idle_seconds, bool) or not number(hide_idle_seconds, 1, 3600):
        fail()
    lighting = properties.get('baseLighting', {})
    if lighting not in (None, {}):
        if not isinstance(lighting, dict) or set(lighting) - set(LIGHTING_BOUNDS):
            fail()
        for key, (low, high) in LIGHTING_BOUNDS.items():
            if key in lighting and not number(lighting[key], low, high):
                fail()
    for key in ('label', 'instanceName', 'floorSelection'):
        if key in properties and not text(properties[key]):
            fail()
    scene_id = properties.get('sceneId', '')
    if scene_id not in ('', None) and not (isinstance(scene_id, str) and re.fullmatch('[0-9a-f]{32}', scene_id)):
        fail()
    lights = properties.get('lights', [])
    if not isinstance(lights, list) or len(lights) > 128:
        fail()
    ids = set()
    for light in lights:
        if not isinstance(light, dict) or set(light) - LIGHT_KEYS:
            fail()
        light_id = light.get('id')
        if not isinstance(light_id, str) or not light_id or light_id in ids or len(light_id) > 128:
            fail()
        ids.add(light_id)
        for key in ('floorId', 'groupId', 'entityId', 'label'):
            if key in light and not text(light[key], 255 if key == 'entityId' else 128):
                fail()
        entity_id = light.get('entityId', '')
        if entity_id and not ENTITY_PATTERN.fullmatch(str(entity_id)):
            fail()
        for key, low, high in (
            ('x', -10000, 10000),
            ('y', -10000, 10000),
            ('size', 0, 10000),
            ('height', -10000, 10000),
            ('hitSize', 0, 10000),
            ('iconSize', 0, 10000),
            ('fadeDuration', 0, 60),
        ):
            if key in light and not number(light[key], low, high):
                fail()
        if 'visible' in light and not isinstance(light['visible'], bool):
            fail()
        if 'hiddenClickable' in light and not isinstance(light['hiddenClickable'], bool):
            fail()
        if 'icon' in light:
            if not text(light['icon'], 128):
                fail()
            if light['icon'] and not ICON_PATTERN.fullmatch(light['icon']):
                fail()
        if light.get('clickAction', 'focus') not in CLICK_ACTIONS:
            fail()
        defaults = light.get('effectDefaults', {})
        if defaults not in (None, {}):
            if not isinstance(defaults, dict):
                fail()
            if set(defaults) - {'brightness', 'kelvin', 'brightnessMin', 'brightnessMax', 'temperatureMin', 'temperatureMax'}:
                fail()
            for key in ('brightness', 'kelvin'):
                if key in defaults and not number(defaults[key], 0, 20000):
                    fail()
            for low_key, high_key, low, high in (
                ('brightnessMin', 'brightnessMax', 0, 100),
                ('temperatureMin', 'temperatureMax', 1000, 20000),
            ):
                if low_key in defaults and not number(defaults[low_key], low, high):
                    fail()
                if high_key in defaults and not number(defaults[high_key], low, high):
                    fail()
        if 'focusCamera' in light:
            validate_camera(light['focusCamera'])
        if 'effectRange' in light and light['effectRange'] is not None:
            effect_range = light['effectRange']
            if isinstance(effect_range, dict):
                if set(effect_range) - {
                    'brightnessMin',
                    'brightnessMax',
                    'temperatureMin',
                    'temperatureMax',
                }:
                    fail()
                for key, low, high in (
                    ('brightnessMin', 0, 100),
                    ('brightnessMax', 0, 100),
                    ('temperatureMin', 1000, 20000),
                    ('temperatureMax', 1000, 20000),
                ):
                    if key in effect_range and not number(effect_range[key], low, high):
                        fail()
            elif not number(effect_range, 0, 10000):
                fail()
    validate_camera(properties.get('camera'), allow_legacy_interaction=True)

    # Extended 0.5.0 surfaces with nested contract checks.
    security = properties.get('security', {})
    if security not in (None, {}):
        if not isinstance(security, dict) or set(security) - {'presenceSensors'}:
            fail()
        people = security.get('presenceSensors', [])
        if not isinstance(people, list) or len(people) > 128:
            fail()
        presence_ids = set()
        for person in people:
            if not isinstance(person, dict):
                fail()
            person_id = person.get('id')
            if not isinstance(person_id, str) or not person_id or person_id in presence_ids or len(person_id) > 128:
                fail()
            presence_ids.add(person_id)
            for key in ('entityId', 'label', 'floorId', 'modelId'):
                if key in person and not text(person[key], 255 if key == 'entityId' else 128):
                    fail()

    environment = properties.get('environment', {})
    if environment not in (None, {}):
        if not isinstance(environment, dict) or set(environment) - {
            'curtains',
            'dimStrength',
            'airConditioners',
        }:
            fail()
        if 'dimStrength' in environment and not number(environment['dimStrength'], 0, 100):
            fail()
        for list_key in ('curtains', 'airConditioners'):
            items = environment.get(list_key, [])
            if items in (None, []):
                continue
            if not isinstance(items, list) or len(items) > 128:
                fail()
            item_ids = set()
            for item in items:
                if not isinstance(item, dict):
                    fail()
                item_id = item.get('id')
                if not isinstance(item_id, str) or not item_id or item_id in item_ids or len(item_id) > 128:
                    fail()
                item_ids.add(item_id)
                for key in ('entityId', 'label', 'floorId', 'modelId'):
                    if key in item and not text(item[key], 255 if key == 'entityId' else 128):
                        fail()

    devices = properties.get('devices', {})
    if devices not in (None, {}):
        if not isinstance(devices, dict) or set(devices) - {'nas', 'vacuums', 'televisions'}:
            fail()
        for list_key in ('nas', 'vacuums', 'televisions'):
            items = devices.get(list_key, [])
            if items in (None, []):
                continue
            if not isinstance(items, list) or len(items) > 128:
                fail()
            item_ids = set()
            for item in items:
                if not isinstance(item, dict):
                    fail()
                item_id = item.get('id')
                if not isinstance(item_id, str) or not item_id or item_id in item_ids or len(item_id) > 128:
                    fail()
                item_ids.add(item_id)
                for key in ('entityId', 'powerEntityId', 'label', 'floorId', 'modelId', 'statusSource'):
                    if key in item and item[key] is not None and not isinstance(item[key], (str, dict)):
                        fail()
                    if key in item and isinstance(item[key], str) and not text(item[key], 255 if 'Entity' in key else 128):
                        fail()

    page_behaviors = properties.get('pageBehaviors', {})
    if page_behaviors not in (None, {}):
        if not isinstance(page_behaviors, dict):
            fail()
        allowed_pages = frozenset({'light', 'vacuum', 'devices', 'overview', 'security', 'environment'})
        if set(page_behaviors) - allowed_pages:
            fail()
        for value in page_behaviors.values():
            if value is not None and not isinstance(value, dict):
                fail()

    for key in (
        'navigation',
        'groundReflection',
        'floorCameras',
        'floorNumbers',
        'lightRegionOverrides',
        'pageDimStrength',
        'idleExitFocus',
    ):
        value = properties.get(key)
        if value in (None, {}, []):
            continue
        if not isinstance(value, (dict, list)):
            fail()
        if isinstance(value, list) and len(value) > 256:
            fail()
        if isinstance(value, dict) and len(value) > 256:
            fail()
    for key in ('floorGap', 'pageSaturation', 'focusDimStrength'):
        if key in properties and properties[key] is not None and not number(properties[key], -10000, 10000):
            fail()
    if 'motionRenderScale' in properties and properties['motionRenderScale'] is not None:
        if not number(properties['motionRenderScale'], 0.25, 1):
            raise HTTPException(422, detail='3D 转动分辨率无效')
    if 'lightingMode' in properties and properties['lightingMode'] not in (
        None,
        '',
        'auto',
        'manual',
        'region',
        'standard',
    ):
        fail()
    if 'behaviorScope' in properties and not text(properties['behaviorScope']):
        fail()
    if 'hideIconsWhileRotating' in properties and not isinstance(properties['hideIconsWhileRotating'], bool):
        fail()
