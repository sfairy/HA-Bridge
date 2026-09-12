"""The 3D add-on's configuration contract, independent of the panel popup schema."""
from __future__ import annotations

import json
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

PAGE_IDS = frozenset({'light', 'vacuum', 'devices', 'overview', 'security', 'environment'})

COMMON_ITEM_BOUNDS = (
    ('x', -1000000, 1000000),
    ('y', -1000000, 1000000),
    ('height', 0, 20),
)
COMMON_ITEM_POSITIVE_KEYS = ('size', 'iconSize', 'hitSize')
COMMON_ITEM_BOOL_KEYS = ('visible', 'hiddenClickable', 'buttonHidden', 'motionEnabled', 'funMessages')
COMMON_ITEM_TEXT_KEYS = ('id', 'floorId', 'modelId', 'entityId', 'label')

ICON_PATTERN = re.compile(r'mdi:[a-z0-9][a-z0-9-]{0,119}')
ICON_PATTERN_LOOSE = re.compile(r'mdi:[a-z0-9-]{1,120}')

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
        'buttonHidden',
        'fadeDuration',
        'effectDefaults',
        'hiddenClickable',
    }
)
LIGHT_CLICK_ACTIONS = ('focus', 'turn-on-focus', 'turn-on', 'turn-on-panel')
LIGHT_ENTITY_PATTERN = re.compile(r'(?:light|switch)\.[a-z0-9_]+')
EFFECT_DEFAULT_BOUNDS = {'brightness': (0, 100), 'kelvin': (1000, 20000)}
EFFECT_RANGE_KEYS = frozenset({'brightnessMin', 'brightnessMax', 'temperatureMin', 'temperatureMax'})
EFFECT_RANGE_BOUNDS = (
    ('brightnessMin', 'brightnessMax', 0, 100),
    ('temperatureMin', 'temperatureMax', 1000, 20000),
)

CAMERA_KEYS = frozenset(
    {
        'x',
        'y',
        'id',
        'icon',
        'size',
        'label',
        'height',
        'floorId',
        'hitSize',
        'modelId',
        'visible',
        'entityId',
        'fontSize',
        'iconSize',
        'focusCamera',
        'buttonHidden',
    }
)
CAMERA_NUMBER_BOUNDS = (
    ('x', -1000000, 1000000),
    ('y', -1000000, 1000000),
    ('height', -1000, 1000),
    ('size', 1, 1000),
    ('iconSize', 1, 1000),
    ('fontSize', 1, 1000),
    ('hitSize', 1, 1000),
)
CAMERA_ENTITY_PATTERN = re.compile(r'camera\.[a-z0-9_]+')

PRESENCE_KEYS = frozenset(
    {
        'id',
        'size',
        'color',
        'label',
        'route',
        'speed',
        'floorId',
        'modelId',
        'deviceId',
        'entityId',
        'character',
        'waveScale',
        'deviceName',
        'hitPadding',
        'focusCamera',
        'routeClosed',
        'waveEnabled',
        'waveOpacity',
        'clickToFocus',
        'displayPages',
        'displayDuration',
    }
)
PRESENCE_ENTITY_PATTERN = re.compile(r'(?:binary_sensor|event)\.[a-z0-9_]{1,200}')
PRESENCE_PAGE_IDS = ('overview', 'light', 'environment', 'devices', 'vacuum', 'security')
PRESENCE_DEFAULT_PAGES = ['overview', 'light', 'security']
PRESENCE_CHARACTERS = ('traveler', 'bean', 'glow')
PRESENCE_COLORS = ('cyan', 'orange')

ENVIRONMENT_KEYS = frozenset({'curtains', 'dimStrength', 'airConditioners'})
AIR_CONDITIONER_KEYS = frozenset(
    {
        'x',
        'y',
        'id',
        'icon',
        'size',
        'label',
        'height',
        'floorId',
        'hitSize',
        'modelId',
        'visible',
        'entityId',
        'iconSize',
        'clickAction',
        'focusCamera',
        'buttonHidden',
        'hiddenClickable',
    }
)
AIR_CONDITIONER_ENTITY_PATTERN = re.compile(r'climate\.[a-z0-9_]+')
CURTAIN_KEYS = frozenset(
    {
        'x',
        'y',
        'id',
        'icon',
        'size',
        'label',
        'height',
        'floorId',
        'hitSize',
        'modelId',
        'visible',
        'entityId',
        'iconSize',
        'clickAction',
        'focusCamera',
        'buttonHidden',
        'coverDirection',
        'hiddenClickable',
        'iconStateReversed',
    }
)
CURTAIN_ENTITY_PATTERN = re.compile(r'cover\.[a-z0-9_]+')
CURTAIN_DIRECTIONS = ('auto', 'left', 'right', 'split')

DEVICE_KEYS = frozenset({'nas', 'vacuums', 'televisions'})
TELEVISION_KEYS = frozenset(
    {
        'x',
        'y',
        'id',
        'icon',
        'size',
        'label',
        'height',
        'floorId',
        'hitSize',
        'modelId',
        'visible',
        'entityId',
        'iconSize',
        'clickAction',
        'focusCamera',
        'buttonHidden',
        'powerEntityId',
        'hiddenClickable',
    }
)
TELEVISION_ENTITY_PATTERN = re.compile(r'media_player\.[a-z0-9_]+')
TELEVISION_POWER_ENTITY_PATTERN = re.compile(r'(?:media_player|switch|binary_sensor|input_boolean)\.[a-z0-9_]+')
VACUUM_KEYS = frozenset(
    {
        'x',
        'y',
        'id',
        'map',
        'icon',
        'size',
        'label',
        'height',
        'floorId',
        'hitSize',
        'modelId',
        'visible',
        'deviceId',
        'entityId',
        'iconSize',
        'shortcuts',
        'deviceName',
        'clickAction',
        'focusCamera',
        'funMessages',
        'buttonHidden',
        'followCamera',
        'motionEnabled',
        'hiddenClickable',
        'relatedEntityIds',
    }
)
VACUUM_ENTITY_PATTERN = re.compile(r'vacuum\.[a-z0-9_]+')
VACUUM_MAP_KEYS = frozenset({'x', 'y', 'depth', 'width', 'opacity', 'visible', 'entityId', 'rotation', 'sourceMapId'})
VACUUM_MAP_BOUNDS = (
    ('x', -1000000, 1000000),
    ('y', -1000000, 1000000),
    ('width', 0.01, 1000000),
    ('depth', 0.01, 1000000),
    ('rotation', -360, 360),
    ('opacity', 0, 100),
)
VACUUM_MAP_ENTITY_PATTERN = re.compile(r'(?:camera|image)\.[a-z0-9_]+')
VACUUM_SHORTCUT_KEYS = frozenset(
    {
        'x',
        'y',
        'id',
        'icon',
        'size',
        'label',
        'height',
        'hitSize',
        'visible',
        'entityId',
        'fontSize',
        'iconSize',
        'iconHidden',
        'labelHidden',
        'buttonHidden',
        'hiddenClickable',
    }
)
VACUUM_SHORTCUT_ENTITY_PATTERN = re.compile(r'[a-z_]+\.[a-z0-9_]+')
NAS_KEYS = frozenset(
    {
        'x',
        'y',
        'id',
        'icon',
        'size',
        'label',
        'height',
        'floorId',
        'hitSize',
        'modelId',
        'visible',
        'entityId',
        'iconSize',
        'clickAction',
        'focusCamera',
        'buttonHidden',
        'statusSource',
        'hiddenClickable',
    }
)
NAS_ENTITY_PATTERN = re.compile(r'(?:binary_sensor|switch|input_boolean)\.[a-z0-9_]+')
NAS_STATUS_SOURCE_REQUIRED = frozenset({'name', 'metrics', 'deviceId', 'platform', 'primaryEntityId'})
NAS_STATUS_SOURCE_OPTIONAL = frozenset({'visibleMetrics', 'groupOrder'})
NAS_PLATFORMS = ('fnos', 'synology_dsm')
NAS_PRIMARY_ENTITY_PATTERN = re.compile(r'sensor\.[a-z0-9_]+')
NAS_METRIC_KEYS = frozenset({'kind', 'group', 'label', 'entityId'})
NAS_METRIC_ENTITY_PATTERN = re.compile(r'(?:sensor|binary_sensor)\.[a-z0-9_]+')
NAS_METRIC_GROUPS = ('system', 'storage', 'network', 'health')
NAS_METRIC_KINDS = ('number', 'status', 'problem', 'timestamp')

PAGE_BEHAVIOR_KEYS = frozenset({'autoRotate', 'interaction', 'idleExitFocus', 'idleHideIcons', 'hideIconsWhileRotating'})
PAGE_BEHAVIOR_BOOL_KEYS = frozenset({'autoRotate', 'idleHideIcons'})

FLOOR_NUMBERS_LIMIT = 128
FLOOR_CAMERAS_LIMIT = 128
LIGHT_REGION_LIMIT = 1024
LIGHT_REGION_BOUNDS = {
    'width': (0.5, 20),
    'depth': (0.5, 20),
    'rotation': (-180, 180),
    'softness': (0.05, 1),
}
LIGHT_REGION_FIELDS = frozenset(set(LIGHT_REGION_BOUNDS) | {'shape'})
LIGHT_REGION_OPTIONAL_FIELDS = frozenset({'offsetX', 'offsetZ', 'moveCenterEnabled'})
LIGHT_REGION_OFFSET_BOUNDS = (('offsetX', -100, 100), ('offsetZ', -100, 100))
LIGHT_REGION_SHAPES = ('circle', 'square', 'ellipse', 'strip')

NAVIGATION_KEYS = frozenset({'floors', 'categories', 'followOffset'})
NAVIGATION_PLACEMENT_KEYS = frozenset({'x', 'y', 'scale'})

GROUND_REFLECTION_KEYS = frozenset({'mode', 'strength', 'resolution'})
GROUND_REFLECTION_MODES = ('off', 'inside', 'outside', 'all')
GROUND_REFLECTION_RESOLUTIONS = (256, 512, 768)

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
    'floorBrightness': (50, 150),
}

CAMERA_BASE_KEYS = frozenset({'mode', 'zoom', 'target', 'position'})
CAMERA_OPTIONAL_KEYS = frozenset({'up', 'view', 'frameSize', 'focalLength', 'topRotation'})
CAMERA_LEGACY_KEYS = frozenset({'panEnabled', 'zoomEnabled', 'rotationMode'})
CAMERA_VECTOR_KEYS = ('position', 'target', 'up')
CAMERA_VECTOR_BOUNDS = (-10000, 10000)
CAMERA_NUMBER_KEYS = (('frameSize', 0.001, 20000), ('topRotation', 0, 360), ('focalLength', 18, 120))

IDLE_LIMIT_LOW = 1
IDLE_LIMIT_HIGH = 3600


def validate_config(properties) -> None:
    def fail() -> None:
        raise HTTPException(422, detail='3D 交互配置无效，请检查户型、灯光、环境及图标设置。')

    def number(value, low, high) -> bool:
        if not isinstance(value, (int, float)) or isinstance(value, bool):
            return False
        try:
            return math.isfinite(value) and low <= value <= high
        except OverflowError:
            return False

    def positive_number(value) -> bool:
        return number(value, 0, math.inf) and value > 0

    def text(value, length: int = 128) -> bool:
        return isinstance(value, str) and len(value) <= length

    def optional_text(item, keys) -> bool:
        """Present keys must be strings within the default text length."""
        return not any(not text(item.get(key, '')) for key in keys)

    def required_text(item, keys) -> bool:
        """Every key must be present, truthy and a string within the default text length."""
        return not any(not text(item.get(key)) or not item.get(key) for key in keys)

    def filled(item, keys) -> bool:
        """Every key must be present and truthy."""
        return not any(not item.get(key) for key in keys)

    def optional_bools(item, keys) -> bool:
        return not any(key in item and not isinstance(item[key], bool) for key in keys)

    def optional_numbers(item, bounds) -> bool:
        return not any(key in item and not number(item[key], low, high) for key, low, high in bounds)

    def optional_positive_numbers(item, keys) -> bool:
        return not any(key in item and not positive_number(item[key]) for key in keys)

    def optional_icon(item, pattern) -> bool:
        if 'icon' not in item:
            return True
        return isinstance(item['icon'], str) and pattern.fullmatch(item['icon']) is not None

    def validate_camera(camera, *, allow_legacy_interaction: bool = False) -> None:
        if camera is None:
            return
        optional = set(CAMERA_OPTIONAL_KEYS)
        if allow_legacy_interaction:
            optional |= CAMERA_LEGACY_KEYS
        if not (
            isinstance(camera, dict)
            and CAMERA_BASE_KEYS.issubset(camera)
            and not (set(camera) - CAMERA_BASE_KEYS - optional)
        ):
            fail()
        if camera['mode'] not in ('orthographic', 'perspective') or not number(camera['zoom'], 0.01, 100):
            fail()
        vector_keys = ['position', 'target']
        if 'up' in camera:
            vector_keys.append('up')
        for key in vector_keys:
            vector = camera[key]
            low, high = CAMERA_VECTOR_BOUNDS
            if not (
                isinstance(vector, list)
                and len(vector) == 3
                and all(number(item, low, high) for item in vector)
            ):
                fail()
        for key, low, high in CAMERA_NUMBER_KEYS:
            if key in camera and not number(camera[key], low, high):
                fail()
        if 'view' in camera and camera['view'] not in ('free', 'top'):
            fail()
        if not allow_legacy_interaction:
            return
        if camera.get('rotationMode', 'free') not in ('free', 'horizontal', 'vertical'):
            fail()
        if any(not isinstance(camera.get(key, True), bool) for key in ('panEnabled', 'zoomEnabled')):
            fail()

    # --- root properties ---------------------------------------------------
    if not isinstance(properties, dict) or set(properties) - PROPERTY_KEYS:
        fail()

    # --- security cameras --------------------------------------------------
    security = properties.get('security', {})
    if not isinstance(security, dict) or set(security) - {'presenceSensors', 'cameras'}:
        fail()
    cameras = security.get('cameras', [])
    if not isinstance(cameras, list) or len(cameras) > 128:
        fail()
    camera_ids: set[str] = set()
    camera_models: set[tuple] = set()
    for camera in cameras:
        if not isinstance(camera, dict) or set(camera) - CAMERA_KEYS:
            fail()
        if not required_text(camera, ('id', 'floorId', 'modelId')):
            fail()
        if camera['id'] in camera_ids or (camera['floorId'], camera['modelId']) in camera_models:
            fail()
        camera_ids.add(camera['id'])
        camera_models.add((camera['floorId'], camera['modelId']))
        if camera['floorId'] == 'all':
            fail()
        entity_id = camera.get('entityId', '')
        if entity_id and not CAMERA_ENTITY_PATTERN.fullmatch(entity_id):
            fail()
        if not (text(camera.get('label', '')) and text(camera.get('icon', ''))):
            fail()
        if not optional_numbers(camera, CAMERA_NUMBER_BOUNDS):
            fail()
        if not optional_bools(camera, ('visible', 'buttonHidden')):
            fail()
        validate_camera(camera.get('focusCamera'))

    # --- security presence -------------------------------------------------
    people = security.get('presenceSensors', [])
    if not isinstance(people, list) or len(people) > 128:
        fail()
    presence_ids: set[str] = set()
    presence_models: set[tuple] = set()
    for person in people:
        if not isinstance(person, dict) or set(person) - PRESENCE_KEYS:
            fail()
        if not optional_text(person, ('deviceId', 'deviceName')):
            fail()
        ident = person.get('id')
        if not (text(ident) and ident and ident not in presence_ids):
            fail()
        presence_ids.add(ident)
        if not (
            isinstance(person.get('waveEnabled', True), bool)
            and number(person.get('waveScale', 1), 0.25, 3)
            and number(person.get('waveOpacity', 68), 0, 100)
        ):
            fail()
        if not (text(person.get('label', '')) and text(person.get('floorId'))):
            fail()
        if person['floorId'] == 'all':
            fail()
        if 'modelId' in person:
            if not (text(person['modelId']) and person['modelId']):
                fail()
            model_key = (person.get('floorId'), person['modelId'])
            if model_key in presence_models:
                fail()
            presence_models.add(model_key)
        entity_id = person.get('entityId')
        if not isinstance(entity_id, str):
            fail()
        if entity_id and not PRESENCE_ENTITY_PATTERN.fullmatch(entity_id):
            fail()
        if person.get('character', 'traveler') not in PRESENCE_CHARACTERS:
            fail()
        if person.get('color', 'cyan') not in PRESENCE_COLORS:
            fail()
        event_sensor = entity_id.startswith('event.')
        if not number(
            person.get('displayDuration', 30 if event_sensor else 0),
            1 if event_sensor else 0,
            3600,
        ):
            fail()
        pages = person.get('displayPages', PRESENCE_DEFAULT_PAGES)
        if pages != 'all':
            pages_valid = (
                isinstance(pages, list)
                and 1 <= len(pages) <= len(PRESENCE_PAGE_IDS)
                and all(isinstance(page, str) and page in PRESENCE_PAGE_IDS for page in pages)
                and len(set(pages)) == len(pages)
            )
            if not pages_valid:
                fail()
        if not (number(person.get('speed', 0.45), 0.1, 2) and number(person.get('size', 1), 0.25, 3)):
            fail()
        if not (isinstance(person.get('clickToFocus', False), bool) and number(person.get('hitPadding', 8), 0, 80)):
            fail()
        validate_camera(person.get('focusCamera'))
        route = person.get('route')
        if not isinstance(person.get('routeClosed', True), bool):
            fail()
        min_points = 0 if person.get('routeClosed') is False else 3
        if not (isinstance(route, list) and min_points <= len(route) <= 128):
            fail()
        if any(
            not (
                isinstance(point, dict)
                and set(point) == {'x', 'y'}
                and all(number(point[axis], -1000000, 1000000) for axis in ('x', 'y'))
            )
            for point in route
        ):
            fail()
        if person.get('routeClosed') is False:
            continue
        if len({(point['x'], point['y']) for point in route}) != len(route):
            fail()
        origin = route[0]
        if not any(
            abs(
                (point['x'] - origin['x']) * (following['y'] - origin['y'])
                - (point['y'] - origin['y']) * (following['x'] - origin['x'])
            ) > 0.000001
            for point, following in zip(route[1:], route[2:])
        ):
            fail()

    # --- floor / behaviour knobs ------------------------------------------
    if 'floorGap' in properties and not number(properties['floorGap'], 0, 20):
        fail()
    if properties.get('behaviorScope', 'global') not in ('global', 'page'):
        fail()

    page_behaviors = properties.get('pageBehaviors', {})
    if not isinstance(page_behaviors, dict) or set(page_behaviors) - PAGE_IDS:
        fail()
    for behavior in page_behaviors.values():
        if not isinstance(behavior, dict) or set(behavior) - PAGE_BEHAVIOR_KEYS:
            fail()
        normalized = {}
        for key, value in behavior.items():
            if key in PAGE_BEHAVIOR_BOOL_KEYS and type(value) is bool:
                normalized[key] = {'enabled': value}
            else:
                normalized[key] = value
        validate_config(normalized)

    page_saturation = properties.get('pageSaturation', {})
    if not (isinstance(page_saturation, dict) and not (set(page_saturation) - PAGE_IDS)):
        fail()
    if any(not number(value, 0, 100) for value in page_saturation.values()):
        fail()

    page_dim = properties.get('pageDimStrength', {})
    if not (isinstance(page_dim, dict) and not (set(page_dim) - PAGE_IDS)):
        fail()
    if any(not number(value, 0, 100) for value in page_dim.values()):
        fail()
    if not number(properties.get('focusDimStrength', 15), 0, 100):
        fail()

    floor_numbers = properties.get('floorNumbers', {})
    if not (isinstance(floor_numbers, dict) and len(floor_numbers) <= FLOOR_NUMBERS_LIMIT):
        fail()
    for floor_id, floor_number in floor_numbers.items():
        if not (
            text(floor_id)
            and floor_id
            and floor_id != 'all'
            and type(floor_number) is int
            and floor_number != 0
            and -99 <= floor_number <= 99
        ):
            fail()

    floor_cameras = properties.get('floorCameras', {})
    if not (isinstance(floor_cameras, dict) and len(floor_cameras) <= FLOOR_CAMERAS_LIMIT):
        fail()
    for floor_id, camera in floor_cameras.items():
        if not (text(floor_id) and floor_id and camera is not None):
            fail()
        validate_camera(camera)

    navigation = properties.get('navigation', {})
    if not (isinstance(navigation, dict) and not (set(navigation) - NAVIGATION_KEYS)):
        fail()
    if not number(navigation.get('followOffset', 16), 0, 300):
        fail()
    for key, placement in navigation.items():
        if key == 'followOffset':
            continue
        if not (isinstance(placement, dict) and not (set(placement) - NAVIGATION_PLACEMENT_KEYS)):
            fail()
        if any(not number(value, 0, 100) for axis, value in placement.items() if axis != 'scale'):
            fail()
        if 'scale' in placement and not number(placement['scale'], 0.5, 2):
            fail()

    if properties.get('lightingMode', 'standard') not in ('standard', 'region'):
        fail()

    reflection = properties.get('groundReflection', {})
    if not (isinstance(reflection, dict) and not (set(reflection) - GROUND_REFLECTION_KEYS)):
        fail()
    if reflection.get('mode', 'off') not in GROUND_REFLECTION_MODES:
        fail()
    resolution = reflection.get('resolution', 512)
    if not (number(resolution, 256, 768) and resolution in GROUND_REFLECTION_RESOLUTIONS):
        fail()
    if not number(reflection.get('strength', 0.18), 0, 0.45):
        fail()

    override = properties.get('lightRegionOverrides', {})
    if not (isinstance(override, dict) and len(override) <= LIGHT_REGION_LIMIT):
        fail()
    for key, region in override.items():
        if not text(key, 2048):
            fail()
        try:
            pair = json.loads(key)
        except (ValueError, RecursionError):
            fail()
        if not (isinstance(pair, list) and len(pair) == 2 and not any(not text(value) or not value for value in pair)):
            fail()
        if json.dumps(pair, ensure_ascii=False, separators=(',', ':')) != key:
            fail()
        if not (
            isinstance(region, dict)
            and LIGHT_REGION_FIELDS.issubset(region)
            and not (set(region) - LIGHT_REGION_FIELDS - LIGHT_REGION_OPTIONAL_FIELDS)
        ):
            fail()
        if not optional_numbers(region, LIGHT_REGION_OFFSET_BOUNDS):
            fail()
        if 'moveCenterEnabled' in region and not isinstance(region['moveCenterEnabled'], bool):
            fail()
        if region['shape'] not in LIGHT_REGION_SHAPES:
            fail()
        if any(not number(region[field], low, high) for field, (low, high) in LIGHT_REGION_BOUNDS.items()):
            fail()

    if properties.get('layoutMode', 'free') not in frozenset({'fill', 'free'}):
        fail()
    if not isinstance(properties.get('backgroundVisible', True), bool):
        fail()

    if properties.get('motionRenderScale') is not None:
        if not number(properties['motionRenderScale'], 0.25, 1):
            raise HTTPException(422, detail='3D 转动分辨率无效')

    if not number(properties.get('renderScale', 1), 0.25, 2):
        fail()
    if not number(properties.get('focusVignetteStrength', 14), 0, 60):
        fail()
    if not number(properties.get('popupOpacity', 74), 0, 100):
        fail()
    if 'hideIconsWhileRotating' in properties and not isinstance(properties['hideIconsWhileRotating'], bool):
        fail()

    interaction = properties.get('interaction', {})
    if not isinstance(interaction, dict) or set(interaction) - {'panEnabled', 'zoomEnabled', 'rotationMode'}:
        fail()
    if interaction.get('rotationMode', 'free') not in frozenset({'free', 'vertical', 'horizontal'}):
        fail()
    if any(not isinstance(interaction.get(key, True), bool) for key in ('panEnabled', 'zoomEnabled')):
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
    if not (isinstance(idle_seconds, int) and number(idle_seconds, IDLE_LIMIT_LOW, IDLE_LIMIT_HIGH)):
        fail()
    if not number(auto_rotate.get('speed', 6), 0.5, 30):
        fail()

    idle_hide_icons = properties.get('idleHideIcons', {})
    if not isinstance(idle_hide_icons, dict) or set(idle_hide_icons) - {'enabled', 'idleSeconds'}:
        fail()
    if not isinstance(idle_hide_icons.get('enabled', False), bool):
        fail()
    hide_idle_seconds = idle_hide_icons.get('idleSeconds', 30)
    if not (isinstance(hide_idle_seconds, int) and number(hide_idle_seconds, IDLE_LIMIT_LOW, IDLE_LIMIT_HIGH)):
        fail()

    idle_exit_focus = properties.get('idleExitFocus', {})
    if not isinstance(idle_exit_focus, dict) or set(idle_exit_focus) - {'enabled', 'idleSeconds'}:
        fail()
    if not isinstance(idle_exit_focus.get('enabled', False), bool):
        fail()
    exit_idle_seconds = idle_exit_focus.get('idleSeconds', 30)
    if not (isinstance(exit_idle_seconds, int) and number(exit_idle_seconds, IDLE_LIMIT_LOW, IDLE_LIMIT_HIGH)):
        fail()

    lighting = properties.get('baseLighting', {})
    if not (
        isinstance(lighting, dict)
        and not (set(lighting) - set(LIGHTING_BOUNDS))
        and not any(not number(value, *LIGHTING_BOUNDS[key]) for key, value in lighting.items())
    ):
        fail()

    for key in ('label', 'instanceName', 'floorSelection'):
        if key in properties and not text(properties[key]):
            fail()

    scene_id = properties.get('sceneId', '')
    if not (isinstance(scene_id, str) and (not scene_id or re.fullmatch('[0-9a-f]{32}', scene_id))):
        fail()

    # --- lights ------------------------------------------------------------
    lights = properties.get('lights', [])
    if not isinstance(lights, list) or len(lights) > 128:
        fail()
    light_ids: set[str] = set()
    for light in lights:
        if not isinstance(light, dict) or set(light) - LIGHT_KEYS:
            fail()
        if not optional_text(light, ('id', 'floorId', 'groupId', 'entityId', 'label')):
            fail()
        if not (light.get('id') and light['id'] not in light_ids):
            fail()
        light_ids.add(light['id'])
        entity_id = light.get('entityId', '')
        if entity_id and not LIGHT_ENTITY_PATTERN.fullmatch(entity_id):
            fail()
        if not all(number(light.get(key), low, high) for key, low, high in COMMON_ITEM_BOUNDS):
            fail()
        if not positive_number(light.get('size')):
            fail()
        if 'visible' in light and not isinstance(light['visible'], bool):
            fail()
        if not optional_bools(light, ('hiddenClickable', 'buttonHidden')):
            fail()
        if light.get('clickAction', 'focus') not in LIGHT_CLICK_ACTIONS:
            fail()
        if not optional_positive_numbers(light, ('iconSize', 'hitSize')):
            fail()
        if not optional_icon(light, ICON_PATTERN):
            fail()
        if 'fadeDuration' in light and not number(light['fadeDuration'], 0, 10):
            fail()
        if 'effectDefaults' in light:
            defaults = light['effectDefaults']
            if not (
                isinstance(defaults, dict)
                and not (set(defaults) - set(EFFECT_DEFAULT_BOUNDS))
                and not any(not number(value, *EFFECT_DEFAULT_BOUNDS[key]) for key, value in defaults.items())
            ):
                fail()
        effect_range = light.get('effectRange')
        if effect_range is not None:
            if not (isinstance(effect_range, dict) and not (set(effect_range) - EFFECT_RANGE_KEYS)):
                fail()
            for minimum, maximum, low, high in EFFECT_RANGE_BOUNDS:
                if not (
                    number(effect_range[minimum], low, high)
                    and number(effect_range[maximum], low, high)
                    and effect_range[minimum] <= effect_range[maximum]
                ):
                    fail()
        validate_camera(light.get('focusCamera'))

    # --- environment -------------------------------------------------------
    environment = properties.get('environment', {})
    if not (isinstance(environment, dict) and not (set(environment) - ENVIRONMENT_KEYS)):
        fail()
    if not number(environment.get('dimStrength', 70), 0, 100):
        fail()

    air_conditioners = environment.get('airConditioners', [])
    if not isinstance(air_conditioners, list) or len(air_conditioners) > 128:
        fail()
    ac_ids: set[str] = set()
    ac_models: set[tuple] = set()
    for item in air_conditioners:
        if not isinstance(item, dict) or set(item) - AIR_CONDITIONER_KEYS:
            fail()
        if not optional_text(item, COMMON_ITEM_TEXT_KEYS):
            fail()
        if not filled(item, ('id', 'floorId', 'modelId')):
            fail()
        model = (item['floorId'], item['modelId'])
        if item['id'] in ac_ids or model in ac_models:
            fail()
        ac_ids.add(item['id'])
        ac_models.add(model)
        entity_id = item.get('entityId', '')
        if entity_id and not AIR_CONDITIONER_ENTITY_PATTERN.fullmatch(entity_id):
            fail()
        if not optional_numbers(item, COMMON_ITEM_BOUNDS):
            fail()
        if not optional_positive_numbers(item, COMMON_ITEM_POSITIVE_KEYS):
            fail()
        if not optional_bools(item, COMMON_ITEM_BOOL_KEYS):
            fail()
        if item.get('clickAction', 'focus') not in LIGHT_CLICK_ACTIONS:
            fail()
        if not optional_icon(item, ICON_PATTERN):
            fail()
        validate_camera(item.get('focusCamera'))

    curtains = environment.get('curtains', [])
    if not isinstance(curtains, list) or len(curtains) > 128:
        fail()
    curtain_ids: set[str] = set()
    curtain_models: set[tuple] = set()
    for item in curtains:
        if not isinstance(item, dict) or set(item) - CURTAIN_KEYS:
            fail()
        if not optional_text(item, COMMON_ITEM_TEXT_KEYS):
            fail()
        if not (item.get('id') and item['id'] not in curtain_ids):
            fail()
        curtain_ids.add(item['id'])
        model = (item.get('floorId', ''), item.get('modelId', ''))
        if all(model):
            if model in curtain_models:
                fail()
            curtain_models.add(model)
        entity_id = item.get('entityId', '')
        if entity_id and not CURTAIN_ENTITY_PATTERN.fullmatch(entity_id):
            fail()
        if not optional_positive_numbers(item, COMMON_ITEM_POSITIVE_KEYS):
            fail()
        if not optional_bools(item, COMMON_ITEM_BOOL_KEYS):
            fail()
        if item.get('clickAction', 'focus') not in ('focus', 'panel'):
            fail()
        if not optional_numbers(item, COMMON_ITEM_BOUNDS):
            fail()
        if item.get('coverDirection', 'auto') not in CURTAIN_DIRECTIONS:
            fail()
        if 'iconStateReversed' in item and not isinstance(item['iconStateReversed'], bool):
            fail()
        if not optional_icon(item, ICON_PATTERN):
            fail()
        validate_camera(item.get('focusCamera'))

    # --- devices -----------------------------------------------------------
    devices = properties.get('devices', {})
    if not (isinstance(devices, dict) and not (set(devices) - DEVICE_KEYS)):
        fail()

    televisions = devices.get('televisions', [])
    if not isinstance(televisions, list) or len(televisions) > 128:
        fail()
    television_ids: set[str] = set()
    television_models: set[tuple] = set()
    for item in televisions:
        if not isinstance(item, dict) or set(item) - TELEVISION_KEYS:
            fail()
        if not optional_text(item, ('id', 'floorId', 'modelId', 'entityId', 'powerEntityId', 'label')):
            fail()
        if not filled(item, ('id', 'floorId', 'modelId')):
            fail()
        model = (item['floorId'], item['modelId'])
        if item['id'] in television_ids or model in television_models:
            fail()
        television_ids.add(item['id'])
        television_models.add(model)
        entity_id = item.get('entityId')
        if entity_id and not TELEVISION_ENTITY_PATTERN.fullmatch(entity_id):
            fail()
        power_entity_id = item.get('powerEntityId')
        if power_entity_id and not TELEVISION_POWER_ENTITY_PATTERN.fullmatch(power_entity_id):
            fail()
        if not optional_numbers(item, COMMON_ITEM_BOUNDS):
            fail()
        if not optional_positive_numbers(item, COMMON_ITEM_POSITIVE_KEYS):
            fail()
        if not optional_bools(item, COMMON_ITEM_BOOL_KEYS):
            fail()
        if item.get('clickAction', 'focus-panel') not in ('focus', 'focus-panel', 'panel'):
            fail()
        if not optional_icon(item, ICON_PATTERN_LOOSE):
            fail()
        validate_camera(item.get('focusCamera'))

    vacuums = devices.get('vacuums', [])
    if not isinstance(vacuums, list) or len(vacuums) > 128:
        fail()
    vacuum_ids: set[str] = set()
    vacuum_models: set[tuple] = set()
    for item in vacuums:
        if not isinstance(item, dict) or set(item) - VACUUM_KEYS:
            fail()
        if not optional_text(item, COMMON_ITEM_TEXT_KEYS):
            fail()
        if not filled(item, ('id', 'floorId', 'modelId')):
            fail()
        model = (item['floorId'], item['modelId'])
        if item['id'] in vacuum_ids or model in vacuum_models:
            fail()
        vacuum_ids.add(item['id'])
        vacuum_models.add(model)
        entity_id = item.get('entityId')
        if entity_id and not VACUUM_ENTITY_PATTERN.fullmatch(entity_id):
            fail()
        if not optional_numbers(item, COMMON_ITEM_BOUNDS):
            fail()
        if not optional_positive_numbers(item, COMMON_ITEM_POSITIVE_KEYS):
            fail()
        if not optional_bools(item, COMMON_ITEM_BOOL_KEYS):
            fail()
        if item.get('clickAction', 'focus-panel') not in ('focus', 'focus-panel', 'panel'):
            fail()
        if not optional_icon(item, ICON_PATTERN_LOOSE):
            fail()
        validate_camera(item.get('focusCamera'))
        validate_camera(item.get('followCamera'))

        mapping = item.get('map', {})
        if not (isinstance(mapping, dict) and not (set(mapping) - VACUUM_MAP_KEYS)):
            fail()
        if 'sourceMapId' in mapping:
            source_map_id = mapping['sourceMapId']
            if not (isinstance(source_map_id, str) and 0 < len(source_map_id) <= 128):
                fail()
        map_entity_id = mapping.get('entityId')
        if map_entity_id:
            if not (text(map_entity_id) and VACUUM_MAP_ENTITY_PATTERN.fullmatch(map_entity_id)):
                fail()
        if not optional_numbers(mapping, VACUUM_MAP_BOUNDS):
            fail()
        if 'visible' in mapping and not isinstance(mapping['visible'], bool):
            fail()

        shortcuts = item.get('shortcuts', [])
        if not isinstance(shortcuts, list) or len(shortcuts) > 64:
            fail()
        shortcut_ids: set[str] = set()
        for shortcut in shortcuts:
            if not isinstance(shortcut, dict) or set(shortcut) - VACUUM_SHORTCUT_KEYS:
                fail()
            shortcut_id = shortcut.get('id')
            if not (text(shortcut_id) and shortcut_id and shortcut_id not in shortcut_ids):
                fail()
            shortcut_ids.add(shortcut_id)
            if not (text(shortcut.get('label', '')) and text(shortcut.get('entityId', ''))):
                fail()
            shortcut_entity_id = shortcut.get('entityId')
            if shortcut_entity_id and not VACUUM_SHORTCUT_ENTITY_PATTERN.fullmatch(shortcut_entity_id):
                fail()
            if not all(number(shortcut.get(axis), -1000000, 1000000) for axis in ('x', 'y')):
                fail()
            if not optional_positive_numbers(shortcut, ('size', 'iconSize', 'hitSize', 'fontSize')):
                fail()
            if 'height' in shortcut and not number(shortcut['height'], 0, 20):
                fail()
            if not optional_icon(shortcut, ICON_PATTERN_LOOSE):
                fail()
            if not optional_bools(shortcut, ('hiddenClickable', 'buttonHidden', 'iconHidden', 'labelHidden')):
                fail()
            if 'visible' in shortcut and not isinstance(shortcut['visible'], bool):
                fail()

        if not optional_text(item, ('deviceId', 'deviceName')):
            fail()
        related = item.get('relatedEntityIds', [])
        if not (
            isinstance(related, list)
            and len(related) <= 512
            and not any(not text(entity) or not VACUUM_SHORTCUT_ENTITY_PATTERN.fullmatch(entity) for entity in related)
        ):
            fail()

    nas_items = devices.get('nas', [])
    if not isinstance(nas_items, list) or len(nas_items) > 128:
        fail()
    nas_ids: set[str] = set()
    nas_models: set[tuple] = set()
    for item in nas_items:
        if not isinstance(item, dict) or set(item) - NAS_KEYS:
            fail()
        if not optional_text(item, COMMON_ITEM_TEXT_KEYS):
            fail()
        if not filled(item, ('id', 'floorId', 'modelId')):
            fail()
        model = (item['floorId'], item['modelId'])
        if item['id'] in nas_ids or model in nas_models:
            fail()
        nas_ids.add(item['id'])
        nas_models.add(model)
        entity_id = item.get('entityId', '')
        if entity_id and not NAS_ENTITY_PATTERN.fullmatch(entity_id):
            fail()
        if not optional_numbers(item, COMMON_ITEM_BOUNDS):
            fail()
        if not optional_positive_numbers(item, COMMON_ITEM_POSITIVE_KEYS):
            fail()
        if not optional_bools(item, COMMON_ITEM_BOOL_KEYS):
            fail()
        if item.get('clickAction', 'focus') not in ('focus', 'focus-panel', 'panel'):
            fail()
        if 'statusSource' in item:
            source = item['statusSource']
            if not (
                isinstance(source, dict)
                and NAS_STATUS_SOURCE_REQUIRED.issubset(source)
                and not (set(source) - NAS_STATUS_SOURCE_REQUIRED - NAS_STATUS_SOURCE_OPTIONAL)
            ):
                fail()
            if not (text(source['deviceId']) and source['deviceId'] and text(source['name'])):
                fail()
            if source['platform'] not in NAS_PLATFORMS:
                fail()
            if not (isinstance(source['primaryEntityId'], str) and NAS_PRIMARY_ENTITY_PATTERN.fullmatch(source['primaryEntityId'])):
                fail()
            metrics = source['metrics']
            if not (isinstance(metrics, list) and 1 <= len(metrics) <= 48):
                fail()
            metric_ids: set[str] = set()
            for metric in metrics:
                if not isinstance(metric, dict) or set(metric) != NAS_METRIC_KEYS:
                    fail()
                metric_entity_id = metric['entityId']
                if not (
                    isinstance(metric_entity_id, str)
                    and NAS_METRIC_ENTITY_PATTERN.fullmatch(metric_entity_id)
                    and metric_entity_id not in metric_ids
                ):
                    fail()
                metric_ids.add(metric_entity_id)
                if not (
                    text(metric['label'])
                    and metric['group'] in NAS_METRIC_GROUPS
                    and metric['kind'] in NAS_METRIC_KINDS
                ):
                    fail()
            if source['primaryEntityId'] not in metric_ids:
                fail()
            if 'visibleMetrics' in source:
                visible = source['visibleMetrics']
                if not (
                    isinstance(visible, list)
                    and len(visible) <= 48
                    and not any(
                        not (isinstance(entity, str) and entity in metric_ids) for entity in visible
                    )
                    and len(set(visible)) == len(visible)
                ):
                    fail()
            if 'groupOrder' in source:
                order = source['groupOrder']
                if not (
                    isinstance(order, list)
                    and len(order) <= 4
                    and not any(group not in NAS_METRIC_GROUPS for group in order)
                    and len(set(order)) == len(order)
                ):
                    fail()
        if not optional_icon(item, ICON_PATTERN):
            fail()
        validate_camera(item.get('focusCamera'))

    validate_camera(properties.get('camera'), allow_legacy_interaction=True)
