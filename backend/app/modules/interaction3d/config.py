"""The 3D add-on's configuration contract, independent of the panel popup schema."""
import json
import math
import re

from fastapi import HTTPException


def validate_config(properties: dict) -> None:

    def fail():
        raise HTTPException(422, detail='3D 交互配置无效，请检查户型、灯光、环境及图标设置。')

    def number(value, low, high):
        if not isinstance(value, (int, float)) or isinstance(value, bool):
            return False
        try:
            return math.isfinite(value) and low <= value <= high
        except OverflowError:
            return False

    def positive_number(value):
        return number(value, 0, math.inf) and value > 0

    def text(value, length=128):
        return isinstance(value, str) and len(value) <= length

    def validate_camera(camera, *, allow_legacy_interaction=False):
        if camera is None:
            return None
        required = {'mode', 'zoom', 'target', 'position'}
        optional = {'up', 'view', 'frameSize', 'focalLength', 'topRotation'}
        if allow_legacy_interaction:
            optional.update({'panEnabled', 'zoomEnabled', 'rotationMode'})
        if not isinstance(camera, dict) or not required.issubset(camera) or set(camera) - required - optional:
            fail()
        if camera['mode'] not in ('orthographic', 'perspective') or not number(camera['zoom'], 0.01, 100):
            fail()
        for key in ('position', 'target', *(['up'] if 'up' in camera else [])):
            if not isinstance(camera[key], list) or len(camera[key]) != 3 or not all(number(v, -10000, 10000) for v in camera[key]):
                fail()
        for key, low, high in (('frameSize', 0.001, 20000), ('topRotation', 0, 360), ('focalLength', 18, 120)):
            if key not in camera:
                continue
            if number(camera[key], low, high):
                continue
            fail()
        if 'view' in camera and camera['view'] not in ('free', 'top'):
            fail()
        if allow_legacy_interaction:
            if camera.get('rotationMode', 'free') not in ('free', 'horizontal', 'vertical'):
                fail()
            if any(not isinstance(camera.get(key, True), bool) for key in ('panEnabled', 'zoomEnabled')):
                fail()
        return None

    if not isinstance(properties, dict) or set(properties) - {
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
        'popupLayout',
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
        'backgroundTheme',
        'pageDimStrength',
        'focusDimStrength',
        'groundReflection',
        'backgroundVisible',
        'motionRenderScale',
        'lightRegionOverrides',
        'uniformOverviewStack',
        'focusVignetteStrength',
        'hideIconsWhileRotating'}:
        fail()
    security = properties.get('security', {})
    if not isinstance(security, dict) or set(security) - {
        'presenceSensors',
        'cameras'}:
        fail()
    cameras = security.get('cameras', [])
    if not isinstance(cameras, list) or len(cameras) > 128:
        fail()
    camera_ids = set()
    camera_models = set()
    for item in cameras:
        fields = {
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
            'buttonHidden'}
        if not isinstance(item, dict) or set(item) - fields:
            fail()
        if any(not text(item.get(key)) or not item[key] for key in ('id', 'floorId', 'modelId')) or item['id'] in camera_ids or (item['floorId'], item['modelId']) in camera_models:
            fail()
        camera_ids.add(item['id'])
        camera_models.add((item['floorId'], item['modelId']))
        if item['floorId'] == 'all':
            fail()
        if not isinstance(item.get('entityId', ''), str) or not item.get('entityId') or not re.fullmatch('camera\\.[a-z0-9_]+', item['entityId']):
            fail()
        if not text(item.get('label', '')) or not text(item.get('icon', '')):
            fail()
        for key, low, high in (('x', -1e+06, 1e+06), ('y', -1e+06, 1e+06), ('height', -1000, 1000), ('size', 1, 1000), ('iconSize', 1, 1000), ('fontSize', 1, 1000), ('hitSize', 1, 1000)):
            if key not in item:
                continue
            if number(item[key], low, high):
                continue
            fail()
        if any(key in item and not isinstance(item[key], bool) for key in ('visible', 'buttonHidden')):
            fail()
        validate_camera(item.get('focusCamera'))
    people = security.get('presenceSensors', [])
    if not isinstance(people, list) or len(people) > 128:
        fail()
    presence_ids = set()
    presence_models = set()
    for person in people:
        if not isinstance(person, dict) or set(person) - {
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
            'triggerMode',
            'waveEnabled',
            'waveOpacity',
            'clickToFocus',
            'displayPages',
            'triggerValue',
            'displayDuration',
            'triggerThreshold'}:
            fail()
        if any(not text(person.get(key, '')) for key in ('deviceId', 'deviceName')):
            fail()
        ident = person.get('id')
        if not text(ident) or not ident or ident in presence_ids:
            fail()
        presence_ids.add(ident)
        if not isinstance(person.get('waveEnabled', True), bool) or not number(person.get('waveScale', 1), 0.25, 3) or not number(person.get('waveOpacity', 68), 0, 100):
            fail()
        if not text(person.get('label', '')) or not text(person.get('floorId')) or person['floorId'] == 'all':
            fail()
        if 'modelId' in person:
            if not text(person['modelId']) or not person['modelId']:
                fail()
            model_key = (person.get('floorId'), person['modelId'])
            if model_key in presence_models:
                fail()
            presence_models.add(model_key)
        if not isinstance(person.get('entityId'), str) or not person['entityId'] or not re.fullmatch('[a-z_]+\\.[a-z0-9_]{1,200}', person['entityId']):
            fail()
        if person.get('character', 'traveler') not in ('traveler', 'bean', 'glow') or person.get('color', 'cyan') not in ('cyan', 'orange'):
            fail()
        trigger_mode = person.get('triggerMode', 'auto')
        if trigger_mode not in ('auto', 'threshold', 'equals', 'change'):
            fail()
        if 'triggerValue' in person and (not isinstance(person['triggerValue'], str) or len(person['triggerValue']) > 128):
            fail()
        if trigger_mode == 'equals' and not str(person.get('triggerValue', 'on')).strip():
            fail()
        if 'triggerThreshold' in person and not number(person['triggerThreshold'], -1000000, 1000000):
            fail()
        event_sensor = trigger_mode in ('equals', 'change') or trigger_mode == 'auto' and person['entityId'].startswith('event.')
        if not number(person.get('displayDuration', 30 if event_sensor else 0), 1 if event_sensor else 0, 3600):
            fail()
        pages = person.get('displayPages', ['overview', 'light', 'security'])
        if pages != 'all' and (not isinstance(pages, list) or not 1 <= len(pages) <= 6 or any(not isinstance(page, str) or page not in ('overview', 'light', 'environment', 'devices', 'vacuum', 'security') for page in pages) or len(set(pages)) != len(pages)):
            fail()
        if not number(person.get('speed', 0.45), 0.1, 2) or not number(person.get('size', 1), 0.25, 3):
            fail()
        if not isinstance(person.get('clickToFocus', False), bool) or not number(person.get('hitPadding', 8), 0, 80):
            fail()
        validate_camera(person.get('focusCamera'))
        route = person.get('route')
        if not isinstance(person.get('routeClosed', True), bool):
            fail()
        if not isinstance(route, list) or not (0 if person.get('routeClosed') is False else 3) <= len(route) <= 128 or any(not isinstance(p, dict) or set(p) != {'x', 'y'} or not all(number(p[k], -1000000, 1000000) for k in ('x', 'y')) for p in route):
            fail()
        if person.get('routeClosed') is False:
            continue
        if len({(p['x'], p['y']) for p in route}) != len(route):
            fail()
        a = route[0]
        if not any(abs((b['x'] - a['x']) * (c['y'] - a['y']) - (b['y'] - a['y']) * (c['x'] - a['x'])) > 1e-06 for b, c in zip(route[1:], route[2:])):
            fail()
    if 'uniformOverviewStack' in properties and not isinstance(properties['uniformOverviewStack'], bool):
        fail()
    if 'floorGap' in properties and not number(properties['floorGap'], 0, 20):
        fail()
    if properties.get('behaviorScope', 'global') not in ('global', 'page'):
        fail()
    page_behaviors = properties.get('pageBehaviors', {})
    if not isinstance(page_behaviors, dict) or set(page_behaviors) - {
        'light',
        'vacuum',
        'devices',
        'overview',
        'security',
        'environment'}:
        fail()
    for behavior in page_behaviors.values():
        if not isinstance(behavior, dict) or set(behavior) - {
            'autoRotate',
            'interaction',
            'idleExitFocus',
            'idleHideIcons',
            'hideIconsWhileRotating'}:
            fail()
        normalized = {
            key: {'enabled': value} if key in {'autoRotate', 'idleHideIcons'} and type(value) is bool else value
            for key, value in behavior.items()
        }
        validate_config(normalized)
    saturation = properties.get('pageSaturation', {})
    if not isinstance(saturation, dict) or set(saturation) - {
        'light',
        'vacuum',
        'devices',
        'overview',
        'security',
        'environment'} or any(not number(value, 0, 100) for value in saturation.values()):
        fail()
    page_dim = properties.get('pageDimStrength', {})
    if not isinstance(page_dim, dict) or set(page_dim) - {
        'light',
        'vacuum',
        'devices',
        'overview',
        'security',
        'environment'}:
        fail()
    if any(not number(value, 0, 100) for value in page_dim.values()) or not number(properties.get('focusDimStrength', 15), 0, 100):
        fail()
    floor_numbers = properties.get('floorNumbers', {})
    if not isinstance(floor_numbers, dict) or len(floor_numbers) > 128:
        fail()
    for floor_id, floor_number in floor_numbers.items():
        if not text(floor_id) or not floor_id or floor_id == 'all' or type(floor_number) is not int or floor_number == 0 or not -99 <= floor_number <= 99:
            fail()
    floor_cameras = properties.get('floorCameras', {})
    if not isinstance(floor_cameras, dict) or len(floor_cameras) > 128:
        fail()
    for floor_id, camera in floor_cameras.items():
        if not text(floor_id) or not floor_id or camera is None:
            fail()
        validate_camera(camera)
    popup_layout = properties.get('popupLayout', {})
    if not isinstance(popup_layout, dict) or set(popup_layout) - {
        'general',
        'camera'}:
        fail()
    for placement in popup_layout.values():
        if not isinstance(placement, dict) or set(placement) - {
            'x',
            'y',
            'scale'}:
            fail()
        if any(not number(value, 0.5, 2) if axis == 'scale' else not number(value, 0, 100) for axis, value in placement.items()):
            fail()
    navigation = properties.get('navigation', {})
    if not isinstance(navigation, dict) or set(navigation) - {
        'floors',
        'categories',
        'followOffset'}:
        fail()
    if not number(navigation.get('followOffset', 16), 0, 300):
        fail()
    for key, placement in navigation.items():
        if key == 'followOffset':
            continue
        if not isinstance(placement, dict) or set(placement) - {
            'x',
            'y',
            'scale'}:
            fail()
        if any(not number(value, 0, 100) for axis, value in placement.items() if axis != 'scale'):
            fail()
        if 'scale' in placement and not number(placement['scale'], 0.5, 2):
            fail()
    if properties.get('lightingMode', 'standard') not in ('standard', 'region'):
        fail()
    reflection = properties.get('groundReflection', {})
    if not isinstance(reflection, dict) or set(reflection) - {
        'mode',
        'strength',
        'resolution'}:
        fail()
    if reflection.get('mode', 'off') not in ('off', 'inside', 'outside', 'all'):
        fail()
    if not number(reflection.get('resolution', 512), 256, 768) or reflection.get('resolution', 512) not in (256, 512, 768):
        fail()
    if not number(reflection.get('strength', 0.18), 0, 0.45):
        fail()
    overrides = properties.get('lightRegionOverrides', {})
    if not isinstance(overrides, dict) or len(overrides) > 1024:
        fail()
    region_bounds = {
        'width': (0.5, 20),
        'depth': (0.5, 20),
        'rotation': (-180, 180),
        'softness': (0.05, 1)}
    region_fields = {*region_bounds, 'shape'}
    region_optional = {
        'offsetX',
        'offsetZ',
        'heightMax',
        'heightMin',
        'heightAbove',
        'heightBelow',
        'moveCenterEnabled'}
    for key, region in overrides.items():
        if not text(key, 2048):
            fail()
        try:
            pair = json.loads(key)
        except (ValueError, RecursionError):
            fail()
        if not isinstance(pair, list) or len(pair) != 2 or any(not text(value) or not value for value in pair):
            fail()
        if json.dumps(pair, ensure_ascii=False, separators=(',', ':')) != key:
            fail()
        if not isinstance(region, dict) or not region_fields <= set(region) or set(region) - region_fields - region_optional:
            fail()
        if any(field in region and not number(region[field], -100, 100) for field in ('offsetX', 'offsetZ')):
            fail()
        if any(field in region and not number(region[field], 0, 20) for field in ('heightAbove', 'heightBelow', 'heightMin', 'heightMax')):
            fail()
        if 'heightMin' in region and 'heightMax' in region and region['heightMin'] > region['heightMax']:
            fail()
        if 'moveCenterEnabled' in region and not isinstance(region['moveCenterEnabled'], bool):
            fail()
        if region['shape'] not in ('circle', 'square', 'ellipse', 'strip'):
            fail()
        if any(not number(region[field], *bounds) for field, bounds in region_bounds.items()):
            fail()
    if properties.get('layoutMode', 'free') not in {
        'fill',
        'free'} or not isinstance(properties.get('backgroundVisible', True), bool):
        fail()
    if not isinstance(properties.get('backgroundTheme', 'grid'), str) or properties.get('backgroundTheme', 'grid') not in {
        'dots',
        'grid',
        'contours'}:
        fail()
    if properties.get('motionRenderScale') is not None and not number(properties['motionRenderScale'], 0.25, 1):
        raise HTTPException(status_code=422, detail='3D 转动分辨率无效')
    if not number(properties.get('renderScale', 1), 0.25, 2):
        fail()
    if not number(properties.get('focusVignetteStrength', 14), 0, 60):
        fail()
    if not number(properties.get('popupOpacity', 74), 0, 100):
        fail()
    if 'hideIconsWhileRotating' in properties and not isinstance(properties['hideIconsWhileRotating'], bool):
        fail()
    interaction = properties.get('interaction', {})
    if not isinstance(interaction, dict) or set(interaction) - {
        'panEnabled',
        'zoomEnabled',
        'rotationMode'}:
        fail()
    if interaction.get('rotationMode', 'free') not in {
        'free',
        'vertical',
        'horizontal'}:
        fail()
    if any(not isinstance(interaction.get(key, True), bool) for key in ('panEnabled', 'zoomEnabled')):
        fail()
    auto_rotate = properties.get('autoRotate', {})
    if not isinstance(auto_rotate, dict) or set(auto_rotate) - {
        'speed',
        'enabled',
        'direction',
        'idleSeconds',
        'returnToDefault'}:
        fail()
    if not isinstance(auto_rotate.get('enabled', False), bool):
        fail()
    if not isinstance(auto_rotate.get('returnToDefault', False), bool):
        fail()
    if auto_rotate.get('direction', 'clockwise') not in ('clockwise', 'counterclockwise'):
        fail()
    idle_seconds = auto_rotate.get('idleSeconds', 30)
    if not isinstance(idle_seconds, int) or not number(idle_seconds, 1, 3600):
        fail()
    if not number(auto_rotate.get('speed', 6), 0.5, 30):
        fail()
    idle_hide_icons = properties.get('idleHideIcons', {})
    if not isinstance(idle_hide_icons, dict) or set(idle_hide_icons) - {
        'enabled',
        'idleSeconds'}:
        fail()
    if not isinstance(idle_hide_icons.get('enabled', False), bool):
        fail()
    hide_idle_seconds = idle_hide_icons.get('idleSeconds', 30)
    if not isinstance(hide_idle_seconds, int) or not number(hide_idle_seconds, 1, 3600):
        fail()
    idle_exit_focus = properties.get('idleExitFocus', {})
    if not isinstance(idle_exit_focus, dict) or set(idle_exit_focus) - {
        'enabled',
        'idleSeconds'}:
        fail()
    if not isinstance(idle_exit_focus.get('enabled', False), bool):
        fail()
    exit_idle_seconds = idle_exit_focus.get('idleSeconds', 30)
    if not isinstance(exit_idle_seconds, int) or not number(exit_idle_seconds, 1, 3600):
        fail()
    lighting = properties.get('baseLighting', {})
    bounds = {
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
        'topElevation': (0, 89)}
    bounds['floorBrightness'] = (50, 150)
    if not isinstance(lighting, dict) or set(lighting) - set(bounds) or any(not number(value, *bounds[key]) for key, value in lighting.items()):
        fail()
    for key in ('label', 'instanceName', 'floorSelection'):
        if key in properties and not text(properties[key]):
            fail()
    scene_id = properties.get('sceneId', '')
    if not isinstance(scene_id, str) or not scene_id or not re.fullmatch('[0-9a-f]{32}', scene_id):
        fail()
    lights = properties.get('lights', [])
    if not isinstance(lights, list) or len(lights) > 128:
        fail()
    ids = set()
    for light in lights:
        if not isinstance(light, dict) or set(light) - {
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
            'hiddenClickable'}:
            fail()
        if any(not text(light.get(key, '')) for key in ('id', 'floorId', 'groupId', 'entityId', 'label')):
            fail()
        if not light.get('id') or light['id'] in ids:
            fail()
        ids.add(light['id'])
        entity = light.get('entityId', '')
        if entity and not re.fullmatch('[a-z_]+\\.[a-z0-9_]+', entity):
            fail()
        if not all(number(light.get(key), low, high) for key, low, high in (('x', -1000000, 1000000), ('y', -1000000, 1000000), ('height', 0, 20))):
            fail()
        if not positive_number(light.get('size')):
            fail()
        if 'visible' in light and not isinstance(light['visible'], bool):
            fail()
        if any(key in light and not isinstance(light[key], bool) for key in ('hiddenClickable', 'buttonHidden')):
            fail()
        if light.get('clickAction', 'focus') not in ('focus', 'turn-on-focus', 'turn-on', 'turn-on-panel'):
            fail()
        if any(key in light and not positive_number(light[key]) for key in ('iconSize', 'hitSize')):
            fail()
        if 'icon' in light and (not isinstance(light['icon'], str) or not re.fullmatch('mdi:[a-z0-9][a-z0-9-]{0,119}', light['icon'])):
            fail()
        if 'fadeDuration' in light and not number(light['fadeDuration'], 0, 10):
            fail()
        if 'effectDefaults' in light:
            defaults = light['effectDefaults']
            bounds = {
                'brightness': (0, 100),
                'kelvin': (1000, 20000)}
            if not isinstance(defaults, dict) or set(defaults) - set(bounds) or any(not number(value, *bounds[key]) for key, value in defaults.items()):
                fail()
        effect_range = light.get('effectRange')
        if effect_range is not None:
            fields = {
                'brightnessMax',
                'brightnessMin',
                'temperatureMax',
                'temperatureMin'}
            if not isinstance(effect_range, dict) or set(effect_range) != fields:
                fail()
            for minimum, maximum, low, high in (('brightnessMin', 'brightnessMax', 0, 100), ('temperatureMin', 'temperatureMax', 1000, 20000)):
                if not number(effect_range[minimum], low, high) or not number(effect_range[maximum], low, high) or effect_range[minimum] > effect_range[maximum]:
                    fail()
        validate_camera(light.get('focusCamera'))
    environment = properties.get('environment', {})
    if not isinstance(environment, dict) or set(environment) - {
        'curtains',
        'dimStrength',
        'airConditioners'}:
        fail()
    if not number(environment.get('dimStrength', 70), 0, 100):
        fail()
    air_conditioners = environment.get('airConditioners', [])
    if not isinstance(air_conditioners, list) or len(air_conditioners) > 128:
        fail()
    ids = set()
    models = set()
    for item in air_conditioners:
        fields = {
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
            'hiddenClickable'}
        if not isinstance(item, dict) or set(item) - fields:
            fail()
        if any(not text(item.get(key, '')) for key in ('id', 'floorId', 'modelId', 'entityId', 'label')):
            fail()
        if any(not item.get(key) for key in ('id', 'floorId', 'modelId')):
            fail()
        model = (item['floorId'], item['modelId'])
        if item['id'] in ids or model in models:
            fail()
        ids.add(item['id'])
        models.add(model)
        entity = item.get('entityId', '')
        if entity and not re.fullmatch('climate\\.[a-z0-9_]+', entity):
            fail()
        if any(key in item and not number(item[key], low, high) for key, low, high in (('x', -1000000, 1000000), ('y', -1000000, 1000000), ('height', 0, 20))):
            fail()
        if any(key in item and not positive_number(item[key]) for key in ('size', 'iconSize', 'hitSize')):
            fail()
        if any(key in item and not isinstance(item[key], bool) for key in ('visible', 'hiddenClickable', 'buttonHidden', 'motionEnabled', 'funMessages')):
            fail()
        if item.get('clickAction', 'focus') not in ('focus', 'turn-on-focus', 'turn-on', 'turn-on-panel'):
            fail()
        if 'icon' in item and (not isinstance(item['icon'], str) or not re.fullmatch('mdi:[a-z0-9][a-z0-9-]{0,119}', item['icon'])):
            fail()
        validate_camera(item.get('focusCamera'))
    curtains = environment.get('curtains', [])
    if not isinstance(curtains, list) or len(curtains) > 128:
        fail()
    ids = set()
    models = set()
    for item in curtains:
        fields = {
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
            'coverKind',
            'clickAction',
            'focusCamera',
            'buttonHidden',
            'curtainFabric',
            'coverDirection',
            'hiddenClickable',
            'unboundPosition',
            'iconStateReversed'}
        if not isinstance(item, dict) or set(item) - fields:
            fail()
        if any(not text(item.get(key, '')) for key in ('id', 'floorId', 'modelId', 'entityId', 'label')):
            fail()
        if not item.get('id') or item['id'] in ids:
            fail()
        ids.add(item['id'])
        model = (item.get('floorId', ''), item.get('modelId', ''))
        if all(model):
            if model in models:
                fail()
            models.add(model)
        entity = item.get('entityId', '')
        if entity and not re.fullmatch('cover\\.[a-z0-9_]+', entity):
            fail()
        if any(key in item and not positive_number(item[key]) for key in ('size', 'iconSize', 'hitSize')):
            fail()
        if any(key in item and not isinstance(item[key], bool) for key in ('visible', 'hiddenClickable', 'buttonHidden', 'motionEnabled', 'funMessages')):
            fail()
        if item.get('clickAction', 'focus') not in ('focus', 'panel'):
            fail()
        if any(key in item and not number(item[key], low, high) for key, low, high in (('x', -1000000, 1000000), ('y', -1000000, 1000000), ('height', 0, 20))):
            fail()
        if item.get('coverDirection', 'auto') not in ('auto', 'left', 'right', 'split'):
            fail()
        if item.get('coverKind', 'standard') not in ('standard', 'dream'):
            fail()
        if item.get('curtainFabric', 'cloth') not in ('cloth', 'sheer'):
            fail()
        if 'unboundPosition' in item and not number(item['unboundPosition'], 0, 100):
            fail()
        if 'iconStateReversed' in item and not isinstance(item['iconStateReversed'], bool):
            fail()
        if 'icon' in item and (not isinstance(item['icon'], str) or not re.fullmatch('mdi:[a-z0-9][a-z0-9-]{0,119}', item['icon'])):
            fail()
        validate_camera(item.get('focusCamera'))
    devices = properties.get('devices', {})
    if not isinstance(devices, dict) or set(devices) - {
        'nas',
        'vacuums',
        'televisions'}:
        fail()
    televisions = devices.get('televisions', [])
    if not isinstance(televisions, list) or len(televisions) > 128:
        fail()
    tv_ids = set()
    tv_models = set()
    for item in televisions:
        fields = {
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
            'hiddenClickable'}
        if not isinstance(item, dict) or set(item) - fields:
            fail()
        if any(not text(item.get(key, '')) for key in ('id', 'floorId', 'modelId', 'entityId', 'powerEntityId', 'label')):
            fail()
        if any(not item.get(key) for key in ('id', 'floorId', 'modelId')):
            fail()
        model = (item['floorId'], item['modelId'])
        if item['id'] in tv_ids or model in tv_models:
            fail()
        tv_ids.add(item['id'])
        tv_models.add(model)
        if item.get('entityId') and not re.fullmatch('media_player\\.[a-z0-9_]+', item['entityId']):
            fail()
        if item.get('powerEntityId') and not re.fullmatch('[a-z_]+\\.[a-z0-9_]+', item['powerEntityId']):
            fail()
        if any(key in item and not number(item[key], low, high) for key, low, high in (('x', -1000000, 1000000), ('y', -1000000, 1000000), ('height', 0, 20))):
            fail()
        if any(key in item and not positive_number(item[key]) for key in ('size', 'iconSize', 'hitSize')):
            fail()
        if any(key in item and not isinstance(item[key], bool) for key in ('visible', 'hiddenClickable', 'buttonHidden', 'motionEnabled', 'funMessages')):
            fail()
        if item.get('clickAction', 'focus-panel') not in ('focus', 'focus-panel', 'panel'):
            fail()
        if 'icon' in item and (not isinstance(item['icon'], str) or not re.fullmatch('mdi:[a-z0-9-]{1,120}', item['icon'])):
            fail()
        validate_camera(item.get('focusCamera'))
    vacuums = devices.get('vacuums', [])
    if not isinstance(vacuums, list) or len(vacuums) > 128:
        fail()
    vacuum_ids = set()
    vacuum_models = set()
    for item in vacuums:
        fields = {
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
            'relatedEntityIds'}
        if not isinstance(item, dict) or set(item) - fields:
            fail()
        if any(not text(item.get(key, '')) for key in ('id', 'floorId', 'modelId', 'entityId', 'label')):
            fail()
        if any(not item.get(key) for key in ('id', 'floorId', 'modelId')):
            fail()
        model = (item['floorId'], item['modelId'])
        if item['id'] in vacuum_ids or model in vacuum_models:
            fail()
        vacuum_ids.add(item['id'])
        vacuum_models.add(model)
        if item.get('entityId') and not re.fullmatch('vacuum\\.[a-z0-9_]+', item['entityId']):
            fail()
        if any(key in item and not number(item[key], low, high) for key, low, high in (('x', -1000000, 1000000), ('y', -1000000, 1000000), ('height', 0, 20))):
            fail()
        if any(key in item and not positive_number(item[key]) for key in ('size', 'iconSize', 'hitSize')):
            fail()
        if any(key in item and not isinstance(item[key], bool) for key in ('visible', 'hiddenClickable', 'buttonHidden', 'motionEnabled', 'funMessages')):
            fail()
        if item.get('clickAction', 'focus-panel') not in ('focus', 'focus-panel', 'panel'):
            fail()
        if 'icon' in item and (not isinstance(item['icon'], str) or not re.fullmatch('mdi:[a-z0-9-]{1,120}', item['icon'])):
            fail()
        validate_camera(item.get('focusCamera'))
        validate_camera(item.get('followCamera'))
        mapping = item.get('map', {})
        if not isinstance(mapping, dict) or set(mapping) - {
            'x',
            'y',
            'depth',
            'width',
            'opacity',
            'visible',
            'entityId',
            'rotation',
            'sourceMapId'}:
            fail()
        if 'sourceMapId' in mapping and (not isinstance(mapping['sourceMapId'], str) or not 0 < len(mapping['sourceMapId']) <= 128):
            fail()
        if mapping.get('entityId') and (not text(mapping['entityId']) or not re.fullmatch('(?:camera|image)\\.[a-z0-9_]+', mapping['entityId'])):
            fail()
        if any(key in mapping and not number(mapping[key], low, high) for key, low, high in (('x', -1000000, 1000000), ('y', -1000000, 1000000), ('width', 0.01, 1000000), ('depth', 0.01, 1000000), ('rotation', -360, 360), ('opacity', 0, 100))):
            fail()
        if 'visible' in mapping and not isinstance(mapping['visible'], bool):
            fail()
        shortcuts = item.get('shortcuts', [])
        if not isinstance(shortcuts, list) or len(shortcuts) > 64:
            fail()
        shortcut_ids = set()
        for shortcut in shortcuts:
            if not isinstance(shortcut, dict) or set(shortcut) - {
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
                'hiddenClickable'}:
                fail()
            if not text(shortcut.get('id')) or not shortcut['id'] or shortcut['id'] in shortcut_ids:
                fail()
            shortcut_ids.add(shortcut['id'])
            if not text(shortcut.get('label', '')) or not text(shortcut.get('entityId', '')):
                fail()
            if shortcut.get('entityId') and not re.fullmatch('[a-z_]+\\.[a-z0-9_]+', shortcut['entityId']):
                fail()
            if any(not number(shortcut.get(key), -1000000, 1000000) for key in ('x', 'y')):
                fail()
            if any(key in shortcut and not positive_number(shortcut[key]) for key in ('size', 'iconSize', 'hitSize', 'fontSize')):
                fail()
            if 'height' in shortcut and not number(shortcut['height'], 0, 20):
                fail()
            if 'icon' in shortcut and (not isinstance(shortcut['icon'], str) or not re.fullmatch('mdi:[a-z0-9-]{1,120}', shortcut['icon'])):
                fail()
            if any(key in shortcut and not isinstance(shortcut[key], bool) for key in ('hiddenClickable', 'buttonHidden', 'iconHidden', 'labelHidden')):
                fail()
            if 'visible' in shortcut and not isinstance(shortcut['visible'], bool):
                fail()
        if any(not text(item.get(key, '')) for key in ('deviceId', 'deviceName')):
            fail()
        related = item.get('relatedEntityIds', [])
        if not isinstance(related, list) or len(related) > 512 or any(not text(entity) or not re.fullmatch('[a-z_]+\\.[a-z0-9_]+', entity) for entity in related):
            fail()
    nas = devices.get('nas', [])
    if not isinstance(nas, list) or len(nas) > 128:
        fail()
    ids = set()
    models = set()
    for item in nas:
        fields = {
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
            'hiddenClickable'}
        if not isinstance(item, dict) or set(item) - fields:
            fail()
        if any(not text(item.get(key, '')) for key in ('id', 'floorId', 'modelId', 'entityId', 'label')):
            fail()
        if any(not item.get(key) for key in ('id', 'floorId', 'modelId')):
            fail()
        model = (item['floorId'], item['modelId'])
        if item['id'] in ids or model in models:
            fail()
        ids.add(item['id'])
        models.add(model)
        entity = item.get('entityId', '')
        if entity and not re.fullmatch('(?:binary_sensor|switch|input_boolean)\\.[a-z0-9_]+', entity):
            fail()
        if any(key in item and not number(item[key], low, high) for key, low, high in (('x', -1000000, 1000000), ('y', -1000000, 1000000), ('height', 0, 20))):
            fail()
        if any(key in item and not positive_number(item[key]) for key in ('size', 'iconSize', 'hitSize')):
            fail()
        if any(key in item and not isinstance(item[key], bool) for key in ('visible', 'hiddenClickable', 'buttonHidden', 'motionEnabled', 'funMessages')):
            fail()
        if item.get('clickAction', 'focus') not in ('focus', 'focus-panel', 'panel'):
            fail()
        if 'statusSource' in item:
            source = item['statusSource']
            required = {
                'name',
                'metrics',
                'deviceId',
                'platform',
                'primaryEntityId'}
            if not isinstance(source, dict) or not required.issubset(source) or set(source) - required - {
                'visibleMetrics',
                'groupOrder'}:
                fail()
            if not text(source['deviceId']) or not source['deviceId'] or not text(source['name']) or source['platform'] not in ('fnos', 'synology_dsm'):
                fail()
            if not isinstance(source['primaryEntityId'], str) or source['primaryEntityId'] != '' and not re.fullmatch('(?:sensor|binary_sensor)\\.[a-z0-9_]+', source['primaryEntityId']):
                fail()
            if not isinstance(source['metrics'], list) or not 0 <= len(source['metrics']) <= 48:
                fail()
            metric_ids = set()
            for metric in source['metrics']:
                if not isinstance(metric, dict) or set(metric) != {
                    'kind',
                    'group',
                    'label',
                    'entityId'}:
                    fail()
                entity_id = metric['entityId']
                if not isinstance(entity_id, str) or not re.fullmatch('(?:sensor|binary_sensor)\\.[a-z0-9_]+', entity_id) or entity_id in metric_ids:
                    fail()
                metric_ids.add(entity_id)
                if not text(metric['label']) or metric['group'] not in ('system', 'storage', 'network', 'health') or metric['kind'] not in ('number', 'status', 'problem', 'timestamp'):
                    fail()
            if metric_ids and source['primaryEntityId'] not in metric_ids or not metric_ids and source['primaryEntityId'] != '':
                fail()
            if 'visibleMetrics' in source:
                visible = source['visibleMetrics']
                if not isinstance(visible, list) or len(visible) > 48 or any(not isinstance(entity, str) or entity not in metric_ids for entity in visible) or len(set(visible)) != len(visible):
                    fail()
            if 'groupOrder' in source:
                order = source['groupOrder']
                if not isinstance(order, list) or len(order) > 4 or any(not isinstance(group, str) or group not in ('system', 'storage', 'network', 'health') for group in order) or len(set(order)) != len(order):
                    fail()
        if 'icon' in item and (not isinstance(item['icon'], str) or not re.fullmatch('mdi:[a-z0-9][a-z0-9-]{0,119}', item['icon'])):
            fail()
        validate_camera(item.get('focusCamera'))
    validate_camera(properties.get('camera'), allow_legacy_interaction=True)
    return None
