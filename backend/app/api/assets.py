from __future__ import annotations

import hashlib
import json
import math
import re
import warnings
from pathlib import Path
from threading import RLock
from urllib.parse import quote, unquote
from uuid import uuid4
from xml.etree import ElementTree

from fastapi import APIRouter, HTTPException, Query, Request, Response, status
from fastapi.responses import FileResponse
from PIL import Image, UnidentifiedImageError
from sqlalchemy import select

from dependencies import (
    DatabaseSession,
    LicensedUser,
    LicensedViewer,
    authenticated_viewer,
    licensed_viewer,
    require_viewer_user_asset,
    viewer_user_asset_ids,
)
from global_popups import global_popups
from models import Project, ProjectDraft
from ui_packs import UI_PACKS, get_ui_pack_for_asset_path, require_ui_pack_access

router = APIRouter(prefix='/assets', tags=['assets'])
SUPPORTED_IMAGE_SUFFIXES = {'.gif', '.jpg', '.png', '.svg', '.jpeg', '.webp'}
UPLOAD_IMAGE_SUFFIXES = {'.jpg', '.png', '.svg', '.jpeg', '.webp'}
UPLOAD_CONTENT_TYPES = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
}
MAX_UPLOAD_PIXELS = 10000000
MAX_UPLOAD_DIMENSION = 8192
MAX_UPLOAD_SVG_BYTES = 5000000
MAX_UPLOAD_SVG_ELEMENTS = 20000
EFFECT_VARIANT_PADDING = 2
EFFECT_VARIANT_MAX_AREA_RATIO = 0.98
ASSET_ID = re.compile('^[0-9a-f]{32}$')
SVG_NAMESPACE = 'http://www.w3.org/2000/svg'
XLINK_NAMESPACE = 'http://www.w3.org/1999/xlink'
SVG_LENGTH = re.compile(
    '^\\s*([+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:[eE][+-]?\\d+)?)\\s*(px|pt|pc|mm|cm|in)?\\s*$',
    re.IGNORECASE,
)
SVG_URL = re.compile('url\\(\\s*([\'\\"]?)(.*?)\\1\\s*\\)', re.IGNORECASE)
SVG_UNSAFE_STYLE = re.compile('(?:@import|expression\\s*\\(|javascript\\s*:|-moz-binding)', re.IGNORECASE)
SVG_UNSAFE_REFERENCE = re.compile('(?:javascript|vbscript)\\s*:|data\\s*:\\s*text/html', re.IGNORECASE)
SVG_BLOCKED_ELEMENTS = {
    'set',
    'audio',
    'embed',
    'video',
    'canvas',
    'iframe',
    'object',
    'script',
    'animate',
    'discard',
    'animatemotion',
    'foreignobject',
    'animatetransform',
}
SVG_LENGTH_FACTORS = {
    '': 1,
    'px': 1,
    'pt': 1.33333,
    'pc': 16,
    'mm': 3.77953,
    'cm': 37.7953,
    'in': 96,
}
ElementTree.register_namespace('', SVG_NAMESPACE)
ElementTree.register_namespace('xlink', XLINK_NAMESPACE)


def legacy_asset_ids(relative_path: str) -> list[str]:
    if relative_path == 'v1/底图/底图.png':
        return ['builtin:v1/底图.png']
    for source in ('v1/户型图示例/2D/', 'v1/户型图示例/3D/'):
        if relative_path.startswith(source):
            legacy_path = relative_path.replace('v1/户型图示例/', 'v1/', 1)
            return [f'builtin:{legacy_path}']
    return []


def user_asset_file(root: Path, asset_id: str) -> Path | None:
    if not ASSET_ID.fullmatch(asset_id):
        return None
    directory = (root / asset_id).resolve()
    if not directory.is_relative_to(root) or not directory.is_dir():
        return None
    matches = [
        path
        for path in directory.iterdir()
        if path.is_file() and not path.name.startswith('.') and path.suffix.lower() in UPLOAD_IMAGE_SUFFIXES
    ]
    return matches[0] if len(matches) == 1 else None


def user_asset_payload(
    root: Path,
    asset_id: str,
    path: Path,
    dimensions: tuple[int, int] | None = None,
) -> dict:
    stat = path.stat()
    version = f'{stat.st_mtime_ns:x}-{stat.st_size:x}'
    payload = {
        'assetId': f'user:{asset_id}',
        'name': path.name,
        'relativePath': f'{asset_id}/{path.name}',
        'folder': '我的图片',
        'source': 'user',
        'size': stat.st_size,
        'version': version,
        'url': f'/api/v1/assets/user/{asset_id}?v={version}',
    }
    if dimensions:
        payload['width'], payload['height'] = dimensions
    return payload


def effect_variant_payload(
    path: Path,
    full_asset_id: str,
    version: str,
    cache_root: Path,
) -> tuple[dict, Path] | None:
    '''Build a non-destructive alpha-cropped PNG used only by the runtime renderer.'''
    if path.suffix.lower() not in {'.png', '.webp'}:
        return None
    cache_key = hashlib.sha256(f'{full_asset_id}\x00{version}'.encode('utf-8')).hexdigest()
    variant_path = cache_root / f'{cache_key}.png'
    metadata_path = cache_root / f'{cache_key}.json'
    variant_url = (
        f'/api/v1/assets/effect-variant?assetId={quote(full_asset_id, safe="")}&v={quote(version, safe="")}'
    )
    if variant_path.is_file() and metadata_path.is_file():
        try:
            metadata = json.loads(metadata_path.read_text(encoding='utf-8'))
            original_width = int(metadata['originalWidth'])
            original_height = int(metadata['originalHeight'])
            left = int(metadata['cropX'])
            top = int(metadata['cropY'])
            crop_width = int(metadata['width'])
            crop_height = int(metadata['height'])
            if not (
                original_width > 0
                and original_height > 0
                and left >= 0
                and top >= 0
                and crop_width > 0
                and crop_height > 0
                and left + crop_width <= original_width
                and top + crop_height <= original_height
            ):
                raise ValueError('invalid effect variant metadata')
            metadata['url'] = variant_url
            return (metadata, variant_path)
        except (KeyError, TypeError, ValueError, json.JSONDecodeError, OSError):
            pass
    try:
        with Image.open(path) as source:
            if getattr(source, 'is_animated', False):
                return None
            rgba = source.convert('RGBA')
            bbox = rgba.getchannel('A').getbbox()
            if bbox is None:
                return None
            left, top, right, bottom = bbox
            left = max(0, left - EFFECT_VARIANT_PADDING)
            top = max(0, top - EFFECT_VARIANT_PADDING)
            right = min(rgba.width, right + EFFECT_VARIANT_PADDING)
            bottom = min(rgba.height, bottom + EFFECT_VARIANT_PADDING)
            crop_width = right - left
            crop_height = bottom - top
            if crop_width <= 0 or crop_height <= 0:
                return None
            if crop_width * crop_height >= rgba.width * rgba.height * EFFECT_VARIANT_MAX_AREA_RATIO:
                return None
            cropped = rgba.crop((left, top, right, bottom))
            cache_root.mkdir(parents=True, exist_ok=True)
            metadata = {
                'originalWidth': rgba.width,
                'originalHeight': rgba.height,
                'cropX': left,
                'cropY': top,
                'width': crop_width,
                'height': crop_height,
                'url': variant_url,
            }
            tmp_image = cache_root / f'.{cache_key}.{uuid4().hex}.tmp'
            tmp_meta = cache_root / f'.{cache_key}.{uuid4().hex}.json.tmp'
            try:
                cropped.save(tmp_image, format='PNG', optimize=True)
                tmp_image.chmod(384)
                tmp_image.replace(variant_path)
                tmp_meta.write_text(
                    json.dumps(metadata, ensure_ascii=False, separators=(',', ':')),
                    encoding='utf-8',
                )
                tmp_meta.chmod(384)
                tmp_meta.replace(metadata_path)
            finally:
                tmp_image.unlink(missing_ok=True)
                tmp_meta.unlink(missing_ok=True)
            return (metadata, variant_path)
    except (Image.DecompressionBombError, UnidentifiedImageError, OSError):
        return None


def studio3d_export_metadata(folder: Path) -> tuple[dict[str, str], dict[str, int]]:
    manifest_path = folder / 'lights.json'
    if not manifest_path.is_file():
        return ({}, {})
    try:
        manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
    except (OSError, json.JSONDecodeError):
        return ({}, {})
    roles: dict[str, str] = {}
    for key, role in (
        ('floorPlanImage', 'floor-plan'),
        ('backgroundImage', 'background'),
        ('baseImage', 'background-with-plan'),
    ):
        filename = manifest.get(key)
        if isinstance(filename, str) and filename:
            roles[filename] = role
    for key, role in (('televisionOnImages', 'television'), ('vehicleChargingImages', 'vehicle')):
        for filename in manifest.get(key) or []:
            if isinstance(filename, str) and filename:
                roles[filename] = role
    order = {
        filename: index
        for index, filename in enumerate(manifest.get('exportedFiles') or [])
        if isinstance(filename, str) and filename
    }
    return (roles, order)


def studio3d_export_payload(
    folder_name: str,
    path: Path,
    role: str = '',
    export_order: int | None = None,
) -> dict:
    stat = path.stat()
    version = f'{stat.st_mtime_ns:x}-{stat.st_size:x}'
    payload = {
        'assetId': f'studio3d:{folder_name}/{path.name}',
        'name': path.name,
        'relativePath': f'exports/{folder_name}/{path.name}',
        'folder': folder_name,
        'source': 'studio3d-export',
        'size': stat.st_size,
        'version': version,
        'url': (
            f'/api/v1/assets/studio3d-export/{quote(folder_name, safe="")}/'
            f'{quote(path.name, safe="")}?v={version}'
        ),
    }
    if role:
        payload['exportRole'] = role
    if export_order is not None:
        payload['exportOrder'] = export_order
    return payload


def user_asset_sort_key(item: dict) -> tuple[str, int, int, str]:
    name = str(item.get('name', ''))
    base_name = Path(name).stem
    studio3d_role_order = {
        'television': 0,
        'vehicle': 1,
        'floor-plan': 2,
        'background': 3,
        'background-with-plan': 4,
    }
    if '电视' in base_name:
        fallback_role = 'television'
    elif '汽车' in base_name or '车辆' in base_name:
        fallback_role = 'vehicle'
    elif base_name == '00户型图':
        fallback_role = 'floor-plan'
    elif base_name == '00底图':
        fallback_role = 'background'
    elif base_name == '00底图带户型':
        fallback_role = 'background-with-plan'
    else:
        fallback_role = ''
    role = str(item.get('exportRole') or fallback_role)
    priority = studio3d_role_order.get(role, 5) if item.get('source') == 'studio3d-export' else 5
    export_order = item.get('exportOrder')
    user_order = export_order if isinstance(export_order, int) else 1000000
    return (str(item.get('folder', '')).casefold(), priority, user_order, name.casefold())


def studio3d_export_file(root: Path, folder_name: str, filename: str) -> Path | None:
    if (
        not folder_name
        or folder_name in {'.', '..'}
        or Path(folder_name).name != folder_name
        or folder_name.startswith('.')
        or not filename
        or filename in {'.', '..'}
        or Path(filename).name != filename
        or filename.startswith('.')
        or Path(filename).suffix.lower() not in {'.png', '.webp'}
    ):
        return None
    folder = (root / folder_name).resolve()
    path = (folder / filename).resolve()
    if not folder.is_relative_to(root) or not path.is_relative_to(folder) or not path.is_file():
        return None
    return path


def xml_local_name(value: str) -> str:
    return value.rsplit('}', 1)[-1].lower()


def svg_reference_is_safe(value: str) -> bool:
    normalized = value.strip()
    if normalized.startswith('#'):
        return True
    if not normalized.lower().startswith('data:image/'):
        return False
    media_type = normalized[11:].split(';', 1)[0].lower()
    return media_type in {'gif', 'jpg', 'png', 'jpeg', 'webp'} and ';base64,' in normalized.lower()


def svg_style_is_safe(value: str) -> bool:
    if SVG_UNSAFE_STYLE.search(value):
        return False
    return all(svg_reference_is_safe(match.group(2)) for match in SVG_URL.finditer(value))


def parse_svg_length(value: str | None) -> float | None:
    if not value:
        return None
    match = SVG_LENGTH.fullmatch(value)
    if match is None:
        return None
    number = float(match.group(1))
    if not math.isfinite(number) or number <= 0:
        return None
    return number * SVG_LENGTH_FACTORS[(match.group(2) or '').lower()]


def svg_dimensions(root: ElementTree.Element) -> tuple[int, int]:
    view_box = None
    raw_view_box = root.attrib.get('viewBox') or root.attrib.get('viewbox')
    if raw_view_box:
        try:
            parts = [float(part) for part in re.split('[\\s,]+', raw_view_box.strip()) if part]
        except ValueError:
            parts = []
        if (
            len(parts) == 4
            and all(math.isfinite(part) for part in parts)
            and parts[2] > 0
            and parts[3] > 0
        ):
            view_box = (parts[2], parts[3])
    width = parse_svg_length(root.attrib.get('width'))
    height = parse_svg_length(root.attrib.get('height'))
    if width is None and height is not None and view_box:
        width = height * view_box[0] / view_box[1]
    elif height is None and width is not None and view_box:
        height = width * view_box[1] / view_box[0]
    elif width is None and height is None and view_box:
        width, height = view_box
    if width is None or height is None:
        width, height = (300, 150)
    dimensions = (max(1, round(width)), max(1, round(height)))
    if (
        dimensions[0] > MAX_UPLOAD_DIMENSION
        or dimensions[1] > MAX_UPLOAD_DIMENSION
        or dimensions[0] * dimensions[1] > MAX_UPLOAD_PIXELS
    ):
        raise ValueError('图片像素尺寸过大，请压缩后重试。')
    return dimensions


def validate_and_sanitize_uploaded_svg(path: Path) -> tuple[int, int]:
    if path.stat().st_size > MAX_UPLOAD_SVG_BYTES:
        raise ValueError('SVG 文件过大，请精简后重试。')
    source = path.read_bytes()
    lowered = source.lower()
    if b'<!doctype' in lowered or b'<!entity' in lowered:
        raise ValueError('SVG 不允许包含文档类型或实体声明。')
    try:
        root = ElementTree.fromstring(source)
    except ElementTree.ParseError as error:
        raise ValueError('SVG 文件已损坏或无法解析。') from error
    if xml_local_name(root.tag) != 'svg':
        raise ValueError('图片内容与文件扩展名不一致。')
    elements = list(root.iter())
    if len(elements) > MAX_UPLOAD_SVG_ELEMENTS:
        raise ValueError('SVG 元素数量过多，请精简后重试。')
    for parent in elements:
        for child in list(parent):
            namespace = child.tag[1:].split('}', 1)[0] if isinstance(child.tag, str) and child.tag.startswith('{') else ''
            if namespace not in {'', SVG_NAMESPACE} or xml_local_name(child.tag) in SVG_BLOCKED_ELEMENTS:
                parent.remove(child)
    for element in root.iter():
        if xml_local_name(element.tag) == 'style' and not svg_style_is_safe(element.text or ''):
            element.text = ''
        for attribute, value in list(element.attrib.items()):
            local_name = xml_local_name(attribute)
            namespace = attribute[1:].split('}', 1)[0] if attribute.startswith('{') else ''
            if local_name.startswith('on') or namespace not in {'', XLINK_NAMESPACE}:
                del element.attrib[attribute]
                continue
            if SVG_UNSAFE_REFERENCE.search(value):
                del element.attrib[attribute]
                continue
            if local_name in {'src', 'href'} and not svg_reference_is_safe(value):
                del element.attrib[attribute]
                continue
            if 'url(' not in value.lower() and local_name != 'style':
                continue
            if not svg_style_is_safe(value):
                del element.attrib[attribute]
    dimensions = svg_dimensions(root)
    path.write_bytes(ElementTree.tostring(root, encoding='utf-8', xml_declaration=True))
    return dimensions


def validate_uploaded_image(suffix: str, path: Path) -> tuple[int, int]:
    if suffix == '.svg':
        return validate_and_sanitize_uploaded_svg(path)
    expected_format = {
        '.png': 'PNG',
        '.jpg': 'JPEG',
        '.jpeg': 'JPEG',
        '.webp': 'WEBP',
    }[suffix]
    with warnings.catch_warnings():
        warnings.simplefilter('error', Image.DecompressionBombWarning)
        with Image.open(path) as image:
            if image.format != expected_format:
                raise ValueError('图片内容与文件扩展名不一致。')
            width, height = image.size
            if (
                width <= 0
                or height <= 0
                or width > MAX_UPLOAD_DIMENSION
                or height > MAX_UPLOAD_DIMENSION
                or width * height > MAX_UPLOAD_PIXELS
            ):
                raise ValueError('图片像素尺寸过大，请压缩后重试。')
            image.load()
            return (width, height)


class AssetCatalog:
    '''Process-local catalog; customer deployments run a single app worker.'''

    def __init__(
        self,
        built_in_root: Path,
        user_root: Path,
        studio3d_exports_root: Path | None,
        effect_variants_root: Path | None,
    ) -> None:
        self.built_in_root = built_in_root.resolve()
        self.user_root = user_root.resolve()
        self.studio3d_exports_root = studio3d_exports_root.resolve() if studio3d_exports_root else None
        self.effect_variants_root = (
            effect_variants_root.resolve()
            if effect_variants_root
            else self.user_root.parent / 'cache' / 'effect-variants'
        )
        self.mutation_lock = RLock()
        self._builtin_loaded = False
        self._user_loaded = False
        self._builtin_items: dict[str, dict] = {}
        self._builtin_paths: dict[str, Path] = {}
        self._builtin_aliases: dict[str, str] = {}
        self._user_items: dict[str, dict] = {}
        self._effect_variant_paths: dict[str, Path] = {}
        self._builtin_revision = uuid4().hex
        self._user_revision = uuid4().hex

    def _attach_effect_variant(self, payload: dict, path: Path) -> None:
        try:
            generated = effect_variant_payload(
                path,
                str(payload['assetId']),
                str(payload['version']),
                self.effect_variants_root,
            )
        except OSError:
            return
        if generated is None:
            return
        metadata, variant_path = generated
        payload['effectVariant'] = metadata
        self._effect_variant_paths[str(payload['assetId'])] = variant_path

    def _load_builtin(self) -> None:
        with self.mutation_lock:
            if self._builtin_loaded:
                return
            if not self.built_in_root.is_dir():
                self._builtin_loaded = True
                return
            for path in self.built_in_root.rglob('*'):
                if not path.is_file() or path.name.startswith('.') or path.suffix.lower() not in SUPPORTED_IMAGE_SUFFIXES:
                    continue
                resolved = path.resolve()
                if not resolved.is_relative_to(self.built_in_root):
                    continue
                relative_path = resolved.relative_to(self.built_in_root).as_posix()
                ui_pack = get_ui_pack_for_asset_path(relative_path)
                if ui_pack is None:
                    continue
                try:
                    stat = resolved.stat()
                except OSError:
                    continue
                version = f'{stat.st_mtime_ns:x}-{stat.st_size:x}'
                asset_id = f'builtin:{relative_path}'
                folder = resolved.parent.relative_to(self.built_in_root).as_posix() or '.'
                payload = {
                    'assetId': asset_id,
                    'name': path.name,
                    'relativePath': relative_path,
                    'folder': folder,
                    'source': 'builtin',
                    'uiPackId': ui_pack.id,
                    'legacyAssetIds': legacy_asset_ids(relative_path),
                    'version': version,
                    'url': '/assets/builtin/' + '/'.join(relative_path.split('/')) + '?v=' + version,
                }
                self._attach_effect_variant(payload, resolved)
                self._builtin_items[asset_id] = payload
                self._builtin_paths[relative_path] = resolved
                for alias in payload['legacyAssetIds']:
                    self._builtin_aliases[alias] = asset_id
            self._builtin_loaded = True

    def _load_user(self) -> None:
        with self.mutation_lock:
            if self._user_loaded:
                return
            try:
                directories = list(self.user_root.iterdir())
            except OSError:
                directories = []
            for directory in directories:
                try:
                    path = user_asset_file(self.user_root, directory.name)
                    if path is None:
                        continue
                    payload = user_asset_payload(self.user_root, directory.name, path)
                    self._attach_effect_variant(payload, path)
                    self._user_items[f'user:{directory.name}'] = payload
                except OSError:
                    continue
            if self.studio3d_exports_root is not None and self.studio3d_exports_root.is_dir():
                try:
                    folders = list(self.studio3d_exports_root.iterdir())
                except OSError:
                    folders = []
                for folder in folders:
                    if not folder.is_dir() or folder.name.startswith('.'):
                        continue
                    export_roles, export_order = studio3d_export_metadata(folder)
                    try:
                        files = list(folder.iterdir())
                    except OSError:
                        continue
                    for path in files:
                        if (
                            not path.is_file()
                            or path.name.startswith('.')
                            or path.suffix.lower() not in {'.png', '.webp'}
                        ):
                            continue
                        try:
                            payload = studio3d_export_payload(
                                folder.name,
                                path,
                                export_roles.get(path.name, ''),
                                export_order.get(path.name),
                            )
                            self._attach_effect_variant(payload, path)
                            self._user_items[payload['assetId']] = payload
                        except OSError:
                            continue
            self._user_loaded = True

    def versions(self) -> dict[str, str]:
        self._load_builtin()
        self._load_user()
        return {
            'builtin': self._builtin_revision,
            'user': self._user_revision,
        }

    def builtin_items(self, allowed_ui_pack_ids) -> list[dict]:
        self._load_builtin()
        with self.mutation_lock:
            items = [dict(item) for item in self._builtin_items.values() if item['uiPackId'] in allowed_ui_pack_ids]
        items.sort(key=lambda item: (item['folder'], item['name'].casefold()))
        return items

    def user_items(self) -> list[dict]:
        self._load_user()
        with self.mutation_lock:
            stale_ids = []
            for asset_id, item in self._user_items.items():
                source = item.get('source')
                if source == 'user':
                    if user_asset_file(self.user_root, asset_id.removeprefix('user:')) is None:
                        stale_ids.append(asset_id)
                elif source == 'studio3d-export' and self.studio3d_exports_root is not None:
                    relative = str(item.get('relativePath') or '')
                    filename = Path(str(item.get('name') or '')).name
                    folder_name = str(item.get('folder') or '')
                    if studio3d_export_file(self.studio3d_exports_root, folder_name, filename) is None:
                        stale_ids.append(asset_id)
            for asset_id in stale_ids:
                self._user_items.pop(asset_id, None)
                self._effect_variant_paths.pop(asset_id, None)
            if stale_ids:
                self._user_revision = uuid4().hex
            items = [dict(item) for item in self._user_items.values()]
        items.sort(key=user_asset_sort_key)
        return items

    def builtin_path(self, relative_path: str):
        self._load_builtin()
        normalized = relative_path.strip('/')
        with self.mutation_lock:
            path = self._builtin_paths.get(normalized)
        ui_pack = get_ui_pack_for_asset_path(normalized)
        if path is None or ui_pack is None:
            return None
        return (path, ui_pack.id)

    def ui_pack_id_for_asset(self, asset_id: str) -> str | None:
        self._load_builtin()
        with self.mutation_lock:
            canonical = self._builtin_aliases.get(asset_id, asset_id)
            item = self._builtin_items.get(canonical)
            return item['uiPackId'] if item else None

    def asset_exists(self, asset_id: str) -> bool:
        if asset_id.startswith('user:'):
            self._load_user()
            with self.mutation_lock:
                return asset_id in self._user_items
        if asset_id.startswith('builtin:'):
            return self.ui_pack_id_for_asset(asset_id) is not None
        if asset_id.startswith('studio3d:'):
            self._load_user()
            with self.mutation_lock:
                return asset_id in self._user_items
        return False

    def register_user(self, asset_id: str, path: Path, dimensions: tuple[int, int] | None = None) -> dict:
        self._load_user()
        payload = user_asset_payload(self.user_root, asset_id, path, dimensions)
        self._attach_effect_variant(payload, path)
        with self.mutation_lock:
            self._user_items[payload['assetId']] = payload
            self._user_revision = uuid4().hex
            return dict(payload)

    def register_studio3d_export(self, folder_name: str, path: Path) -> dict:
        self._load_user()
        export_roles, export_order = studio3d_export_metadata(path.parent)
        payload = studio3d_export_payload(
            folder_name,
            path,
            export_roles.get(path.name, ''),
            export_order.get(path.name),
        )
        self._attach_effect_variant(payload, path)
        with self.mutation_lock:
            self._user_items[payload['assetId']] = payload
            self._user_revision = uuid4().hex
            return dict(payload)

    def remove_user(self, full_asset_id: str) -> None:
        self._load_user()
        with self.mutation_lock:
            self._user_items.pop(full_asset_id, None)
            self._effect_variant_paths.pop(full_asset_id, None)
            self._user_revision = uuid4().hex

    def remove_studio3d_folder(self, folder_name: str) -> None:
        self._load_user()
        prefix = f'studio3d:{folder_name}/'
        with self.mutation_lock:
            removed = [asset_id for asset_id in self._user_items if asset_id.startswith(prefix)]
            for asset_id in removed:
                self._user_items.pop(asset_id, None)
                self._effect_variant_paths.pop(asset_id, None)
            if removed:
                self._user_revision = uuid4().hex

    def effect_variant_path(self, asset_id: str) -> Path | None:
        self._load_builtin()
        self._load_user()
        with self.mutation_lock:
            canonical = self._builtin_aliases.get(asset_id, asset_id)
            path = self._effect_variant_paths.get(canonical)
            return path if path is not None and path.is_file() else None


def document_uses_asset(value, asset_id: str) -> bool:
    if isinstance(value, dict):
        return any(document_uses_asset(item, asset_id) for item in value.values())
    if isinstance(value, list):
        return any(document_uses_asset(item, asset_id) for item in value)
    return value == asset_id


@router.get('/builtin')
def list_builtin_assets(request: Request, _viewer: LicensedViewer) -> dict:
    if not request.app.state.license_service.allows('assets'):
        raise HTTPException(
            status_code=403,
            detail={'code': 'LICENSE_RESTRICTED', 'message': '当前授权不允许读取素材。'},
        )
    allowed_ui_pack_ids = {
        item.id for item in UI_PACKS if request.app.state.license_service.allows(item.feature_code)
    }
    items = request.app.state.asset_catalog.builtin_items(allowed_ui_pack_ids)
    versions = request.app.state.asset_catalog.versions()
    return {
        'items': items,
        'total': len(items),
        'catalogVersion': versions['builtin'],
    }


@router.get('/user')
def list_user_assets(request: Request, database: DatabaseSession, viewer: LicensedViewer) -> dict:
    items = request.app.state.asset_catalog.user_items()
    allowed_asset_ids = viewer_user_asset_ids(database, viewer)
    if allowed_asset_ids is not None:
        items = [item for item in items if item['assetId'].removeprefix('user:') in allowed_asset_ids]
    versions = request.app.state.asset_catalog.versions()
    return {
        'items': items,
        'total': len(items),
        'maxUploadPixels': MAX_UPLOAD_PIXELS,
        'catalogVersion': versions['user'],
    }


@router.get('/version')
def asset_catalog_version(request: Request, _viewer: LicensedViewer) -> dict:
    return request.app.state.asset_catalog.versions()


@router.post('/user', status_code=status.HTTP_201_CREATED)
async def upload_user_asset(request: Request, _user: LicensedUser) -> dict:
    encoded_name = request.headers.get('x-file-name', '')
    try:
        filename = unquote(encoded_name)
    except (UnicodeError, ValueError):
        raise HTTPException(status_code=422, detail='图片文件名无效。') from None
    if (
        not filename
        or filename in {'.', '..'}
        or filename.startswith('.')
        or Path(filename).name != filename
        or '/' in filename
        or '\\' in filename
        or any(ord(character) < 32 or ord(character) == 127 for character in filename)
        or len(filename.encode('utf-8')) > 240
    ):
        raise HTTPException(status_code=422, detail='图片文件名无效，请保留普通文件名后重试。')
    suffix = Path(filename).suffix.lower()
    if suffix not in UPLOAD_IMAGE_SUFFIXES:
        raise HTTPException(status_code=422, detail='仅支持 PNG、JPG、JPEG、WebP 和 SVG 图片。')
    root = request.app.state.settings.user_assets_dir.resolve()
    asset_id = uuid4().hex
    directory = root / asset_id
    directory.mkdir(mode=448)
    path = directory / filename
    has_content = False
    try:
        with path.open('xb') as descriptor:
            async for chunk in request.stream():
                if chunk:
                    has_content = True
                    descriptor.write(chunk)
            descriptor.flush()
        if not has_content:
            raise HTTPException(status_code=422, detail='请选择需要上传的图片。')
        try:
            dimensions = validate_uploaded_image(suffix, path)
        except ValueError as error:
            raise HTTPException(status_code=422, detail=str(error)) from error
        path.chmod(384)
    except Exception:
        if path.exists():
            path.unlink()
        try:
            directory.rmdir()
        except OSError:
            pass
        raise
    return request.app.state.asset_catalog.register_user(asset_id, path, dimensions)


@router.get('/user/{asset_id}')
def read_user_asset(
    asset_id: str,
    request: Request,
    database: DatabaseSession,
    viewer: LicensedViewer,
) -> FileResponse:
    require_viewer_user_asset(database, viewer, asset_id)
    root = request.app.state.settings.user_assets_dir.resolve()
    path = user_asset_file(root, asset_id)
    if path is None:
        raise HTTPException(status_code=404, detail='图片不存在。')
    response = FileResponse(path, media_type=UPLOAD_CONTENT_TYPES.get(path.suffix.lower()))
    response.headers['Cache-Control'] = 'private, max-age=31536000, immutable'
    return response


@router.get('/effect-variant')
def read_effect_variant(request: Request, asset_id: str = Query(alias='assetId')) -> FileResponse:
    catalog = request.app.state.asset_catalog
    authorization_response = Response()
    with request.app.state.database.session_factory() as database:
        viewer = licensed_viewer(request, authenticated_viewer(request, authorization_response, database))
        if asset_id.startswith('user:'):
            require_viewer_user_asset(database, viewer, asset_id.removeprefix('user:'))
        elif asset_id.startswith('builtin:'):
            ui_pack_id = catalog.ui_pack_id_for_asset(asset_id)
            if ui_pack_id is None:
                raise HTTPException(status_code=404, detail='效果图片不存在。')
            require_ui_pack_access(request, ui_pack_id)
        elif not asset_id.startswith('studio3d:'):
            raise HTTPException(status_code=404, detail='效果图片不存在。')
    path = catalog.effect_variant_path(asset_id)
    if path is None:
        raise HTTPException(status_code=404, detail='效果图片不存在。')
    response = FileResponse(path, media_type='image/png')
    for header_name, header_value in authorization_response.raw_headers:
        if header_name.lower() == b'set-cookie':
            response.raw_headers.append((header_name, header_value))
    return response


@router.get('/studio3d-export/{folder_name}/{filename}')
def read_studio3d_export(
    folder_name: str,
    filename: str,
    request: Request,
    _viewer: LicensedViewer,
) -> FileResponse:
    root = request.app.state.settings.studio3d_exports_dir.resolve()
    path = studio3d_export_file(root, unquote(folder_name), unquote(filename))
    if path is None:
        raise HTTPException(status_code=404, detail='导出图片不存在。')
    media_type = 'image/webp' if path.suffix.lower() == '.webp' else 'image/png'
    response = FileResponse(path, media_type=media_type)
    response.headers['Cache-Control'] = 'private, max-age=31536000, immutable'
    return response


@router.delete('/user/{asset_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_user_asset(
    asset_id: str,
    request: Request,
    database: DatabaseSession,
    _user: LicensedUser,
) -> Response:
    catalog = request.app.state.asset_catalog
    with catalog.mutation_lock:
        root = request.app.state.settings.user_assets_dir.resolve()
        path = user_asset_file(root, asset_id)
        if path is None:
            raise HTTPException(status_code=404, detail='图片不存在。')
        full_asset_id = f'user:{asset_id}'
        projects = {item.id: item.name for item in database.scalars(select(Project))}
        usages = []
        for draft in database.scalars(select(ProjectDraft)):
            try:
                document = json.loads(draft.document_json)
            except (TypeError, json.JSONDecodeError):
                continue
            if document_uses_asset(document, full_asset_id):
                usages.append(projects.get(draft.project_id, draft.project_id))
        if document_uses_asset({'customPopups': global_popups(database)}, full_asset_id):
            usages.append('全局组合弹窗')
        if usages:
            unique_usages = list(dict.fromkeys(usages))
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail={
                    'code': 'ASSET_IN_USE',
                    'message': f'图片正在被仪表盘“{"、".join(unique_usages)}”使用，请先替换或移除后再删除。',
                    'projects': unique_usages,
                },
            )
        studio_draft_path = request.app.state.settings.studio3d_draft_path
        if studio_draft_path.is_file():
            try:
                studio_draft = json.loads(studio_draft_path.read_text(encoding='utf-8'))
            except (OSError, json.JSONDecodeError):
                studio_draft = {}
            if document_uses_asset(studio_draft.get('scene'), full_asset_id):
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail={
                        'code': 'ASSET_IN_USE',
                        'message': '图片正在被户型图绘制使用，请先替换或移除后再删除。',
                    },
                )
        path.unlink()
        catalog.remove_user(full_asset_id)
        try:
            path.parent.rmdir()
        except OSError:
            pass
        return Response(status_code=status.HTTP_204_NO_CONTENT)


def read_builtin_asset(relative_path: str, request: Request) -> FileResponse:
    if not request.app.state.license_service.allows('assets'):
        raise HTTPException(status_code=403, detail='当前授权状态不允许读取该资源。')
    match = request.app.state.asset_catalog.builtin_path(relative_path)
    if match is None:
        raise HTTPException(status_code=404, detail='素材不存在。')
    path, ui_pack_id = match
    require_ui_pack_access(request, ui_pack_id)
    response = FileResponse(path)
    response.headers['Cache-Control'] = (
        'private, max-age=31536000, immutable' if request.query_params.get('v') else 'private, no-cache'
    )
    return response
