from __future__ import annotations

import json
import os
import shutil
import tempfile
import zipfile
from datetime import datetime, timezone
from pathlib import Path
from threading import RLock
from urllib.parse import unquote
from uuid import uuid4

from fastapi import APIRouter, HTTPException, Request, Response, status
from sqlalchemy import select

from dependencies import DatabaseSession, LicensedUser
from global_popups import global_popups
from models import Project, ProjectDraft
from panel.document_walk import any_leaf
from schemas import Studio3DDraftUpdate

router = APIRouter(prefix='/studio3d', tags=['studio3d'])
MAX_DRAFT_BYTES = 33554432
MAX_EXPORT_ARCHIVE_BYTES = 536870912
MAX_EXPORT_EXPANDED_BYTES = 1073741824
MAX_EXPORT_FILES = 512
REQUIRED_EXPORT_FILES = {}
_storage_lock = RLock()


def _utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _atomic_json_write(path: Path, payload: dict) -> None:
    encoded = json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode('utf-8')
    if len(encoded) > MAX_DRAFT_BYTES:
        raise HTTPException(status_code=413, detail='户型图数据过大，无法保存。')
    (descriptor, temporary_name) = tempfile.mkstemp(prefix='.draft-', suffix='.tmp', dir=path.parent)
    temporary_path = Path(temporary_name)
    try:
        with os.fdopen(descriptor, 'wb') as output:
            output.write(encoded)
            output.flush()
            os.fsync(output.fileno())
        temporary_path.chmod(384)
        os.replace(temporary_path, path)
    except BaseException:
        if temporary_path.exists():
            temporary_path.unlink()
        raise
    if temporary_path.exists():
        temporary_path.unlink()


def _read_draft(path: Path) -> dict | None:
    if not path.is_file():
        return None
    try:
        payload = json.loads(path.read_text(encoding='utf-8'))
    except (OSError, json.JSONDecodeError) as error:
        raise HTTPException(status_code=500, detail='独立户型图草稿已损坏，请从 NAS 备份恢复。') from error
    if not isinstance(payload, dict) or not isinstance(payload.get('revision'), int):
        raise HTTPException(status_code=500, detail='独立户型图草稿格式无效，请从 NAS 备份恢复。')
    return payload


def _migrate_legacy_scene(request: Request, database: DatabaseSession) -> dict | None:
    selected_scene = None
    changed = False
    drafts = database.scalars(select(ProjectDraft).order_by(ProjectDraft.updated_at.desc())).all()
    for draft in drafts:
        try:
            document = json.loads(draft.document_json)
        except (TypeError, json.JSONDecodeError):
            continue
        scene = document.pop('studio3d', None)
        if scene is None:
            continue
        if selected_scene is None and isinstance(scene, dict):
            selected_scene = scene
        draft.document_json = json.dumps(document, ensure_ascii=False, sort_keys=True, separators=(',', ':'))
        changed = True
    if changed:
        database.commit()
    if selected_scene is None:
        return None
    payload = {'revision': 1, 'scene': selected_scene, 'updatedAt': _utc_now()}
    _atomic_json_write(request.app.state.settings.studio3d_draft_path, payload)
    return payload


def _folder_name(request: Request) -> str:
    encoded = request.headers.get('x-export-folder', '')
    try:
        name = unquote(encoded).strip()
    except (UnicodeError, ValueError) as error:
        raise HTTPException(status_code=422, detail='导出文件夹名称无效。') from error
    invalid_characters = '<>:"/\\|?*'
    if (
        not name
        or name in frozenset({'.', '..'})
        or name.startswith('.')
        or name.endswith(('.', ' '))
        or any((character in invalid_characters) for character in name)
        or any((ord(character) < 32 or ord(character) == 127) for character in name)
        or len(name.encode('utf-8')) > 180
        or Path(name).name != name
    ):
        raise HTTPException(status_code=422, detail='文件夹名不能包含路径符号、控制字符或系统保留符号。')
    return name


def _document_uses_asset_prefix(value, prefix: str) -> bool:
    return any_leaf(value, lambda leaf: isinstance(leaf, str) and leaf.startswith(prefix))


def _validate_archive(archive_path: Path) -> list[zipfile.ZipInfo]:
    try:
        archive = zipfile.ZipFile(archive_path)
    except zipfile.BadZipFile as error:
        raise HTTPException(status_code=422, detail='导出数据不是有效的 ZIP 文件。') from error
    with archive:
        entries = archive.infolist()
        if not entries or len(entries) > MAX_EXPORT_FILES:
            raise HTTPException(status_code=422, detail='导出文件数量无效。')
        names = {entry.filename for entry in entries}
        if not names:
            raise HTTPException(status_code=422, detail='导出包不能为空。')
        expanded_size = 0
        for entry in entries:
            name = entry.filename
            if (
                entry.is_dir()
                or not name
                or name.startswith('.')
                or Path(name).name != name
                or '/' in name
                or '\\' in name
                or Path(name).suffix.lower() not in frozenset({'.png', '.json', '.webp'})
            ):
                raise HTTPException(status_code=422, detail='导出包包含无效文件路径或文件类型。')
            expanded_size += entry.file_size
            if expanded_size > MAX_EXPORT_EXPANDED_BYTES:
                raise HTTPException(status_code=413, detail='导出内容超过 NAS 保存上限。')
        for json_name in (name for name in names if name.lower().endswith('.json')):
            try:
                value = json.loads(archive.read(json_name))
            except (UnicodeDecodeError, json.JSONDecodeError, KeyError) as error:
                raise HTTPException(status_code=422, detail=f'{json_name} 内容无效。') from error
            if not isinstance(value, dict):
                raise HTTPException(status_code=422, detail=f'{json_name} 内容无效。')
        for image_name in (name for name in names if Path(name).suffix.lower() in frozenset({'.png', '.webp'})):
            image_data = archive.read(image_name)
            suffix = Path(image_name).suffix.lower()
            if suffix == '.png':
                valid = image_data.startswith(b'\x89PNG\r\n\x1a\n')
            else:
                valid = len(image_data) >= 12 and image_data[:4] == b'RIFF' and image_data[8:12] == b'WEBP'
            if not valid:
                format_name = 'PNG' if suffix == '.png' else 'WebP'
                raise HTTPException(status_code=422, detail=f'{image_name} 不是有效的 {format_name} 文件。')
        return entries


@router.get('')
def get_studio3d_draft(request: Request, database: DatabaseSession, _user: LicensedUser) -> dict:
    with _storage_lock:
        payload = _read_draft(request.app.state.settings.studio3d_draft_path)
        if payload is None:
            payload = _migrate_legacy_scene(request, database)
        return payload or {'revision': 0, 'scene': None, 'updatedAt': None}


@router.put('')
def update_studio3d_draft(payload: Studio3DDraftUpdate, request: Request, _user: LicensedUser) -> dict:
    with _storage_lock:
        current = _read_draft(request.app.state.settings.studio3d_draft_path)
        current_revision = current['revision'] if current else 0
        if payload.revision != current_revision:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail={
                    'code': 'STUDIO3D_REVISION_CONFLICT',
                    'message': '户型图草稿已在其他页面更新。',
                    'currentRevision': current_revision,
                },
            )
        updated = {
            'revision': current_revision + 1,
            'scene': payload.scene,
            'updatedAt': _utc_now(),
        }
        _atomic_json_write(request.app.state.settings.studio3d_draft_path, updated)
        request.app.state.global_log.append(
            'success',
            '3D户型图编辑器',
            '配置',
            f'3D 户型图草稿已保存（修订 {updated["revision"]}）',
        )
        return updated


@router.get('/exports/check')
def check_studio3d_export(request: Request, _user: LicensedUser) -> dict:
    folder_name = _folder_name(request)
    target = request.app.state.settings.studio3d_exports_dir / folder_name
    with _storage_lock:
        return {'folderName': folder_name, 'exists': target.exists()}


@router.post('/exports', status_code=status.HTTP_201_CREATED)
async def save_studio3d_export(request: Request, _user: LicensedUser) -> dict:
    folder_name = _folder_name(request)
    overwrite = request.headers.get('x-export-overwrite', '').strip().lower() == 'true'
    settings = request.app.state.settings
    target = settings.studio3d_exports_dir / folder_name
    temporary_archive = settings.studio3d_exports_dir / f'.upload-{uuid4().hex}.zip'
    written = 0
    try:
        with temporary_archive.open('xb') as output:
            async for chunk in request.stream():
                if not chunk:
                    continue
                written += len(chunk)
                if written > MAX_EXPORT_ARCHIVE_BYTES:
                    raise HTTPException(status_code=413, detail='导出 ZIP 超过 NAS 保存上限。')
                output.write(chunk)
            output.flush()
            os.fsync(output.fileno())
        temporary_archive.chmod(384)
        if written == 0:
            raise HTTPException(status_code=422, detail='导出 ZIP 为空。')
        entries = _validate_archive(temporary_archive)
        with _storage_lock:
            target_exists = target.exists()
            if target_exists and not overwrite:
                raise HTTPException(
                    status_code=409,
                    detail={
                        'code': 'STUDIO3D_EXPORT_EXISTS',
                        'message': '该文件夹已存在，请确认覆盖或换一个文件夹名。',
                        'folderName': folder_name,
                    },
                )
            staging = settings.studio3d_exports_dir / f'.export-{uuid4().hex}'
            staging.mkdir(mode=448)
            try:
                with zipfile.ZipFile(temporary_archive) as archive:
                    for entry in entries:
                        output_path = staging / entry.filename
                        with archive.open(entry) as source:
                            with output_path.open('xb') as output:
                                shutil.copyfileobj(source, output)
                        output_path.chmod(384)
                archive_name = f'{folder_name}.zip'
                shutil.copyfile(temporary_archive, staging / archive_name)
                (staging / archive_name).chmod(384)
                if target_exists:
                    backup = settings.studio3d_exports_dir / f'.previous-{uuid4().hex}'
                    os.replace(target, backup)
                    try:
                        os.replace(staging, target)
                        shutil.rmtree(backup, ignore_errors=True)
                    except Exception:
                        os.replace(backup, target)
                        raise
                else:
                    os.replace(staging, target)
            except BaseException:
                if staging.exists():
                    shutil.rmtree(staging)
                raise
            if staging.exists():
                shutil.rmtree(staging)
        catalog = getattr(request.app.state, 'asset_catalog', None)
        if catalog is not None:
            for entry in entries:
                if Path(entry.filename).suffix.lower() in frozenset({'.png', '.webp'}):
                    catalog.register_studio3d_export(folder_name, target / entry.filename)
        request.app.state.global_log.append('success', '3D户型图编辑器', '导出', f'3D 户型图已导出到：{folder_name}')
        result = {
            'folderName': folder_name,
            'relativePath': f'exports/{folder_name}',
            'overwritten': target_exists,
            'files': sorted([entry.filename for entry in entries] + [f'{folder_name}.zip']),
        }
    except BaseException:
        if temporary_archive.exists():
            temporary_archive.unlink()
        raise
    if temporary_archive.exists():
        temporary_archive.unlink()
    return result


@router.delete('/exports', status_code=status.HTTP_204_NO_CONTENT)
def delete_studio3d_export_folder(request: Request, database: DatabaseSession, _user: LicensedUser) -> Response:
    folder_name = _folder_name(request)
    asset_prefix = f'studio3d:{folder_name}/'
    projects = {item.id: item.name for item in database.scalars(select(Project))}
    usages = []
    for draft in database.scalars(select(ProjectDraft)):
        try:
            document = json.loads(draft.document_json)
        except (TypeError, json.JSONDecodeError):
            continue
        if not _document_uses_asset_prefix(document, asset_prefix):
            continue
        usages.append(projects.get(draft.project_id, draft.project_id))
    if _document_uses_asset_prefix({'customPopups': global_popups(database)}, asset_prefix):
        usages.append('全局组合弹窗')
    studio_draft_path = request.app.state.settings.studio3d_draft_path
    if studio_draft_path.is_file():
        try:
            studio_draft = json.loads(studio_draft_path.read_text(encoding='utf-8'))
        except (OSError, json.JSONDecodeError):
            studio_draft = {}
        if _document_uses_asset_prefix(studio_draft.get('scene', {}), asset_prefix):
            usages.append('户型图绘制')
    if usages:
        unique_usages = list(dict.fromkeys(usages))
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                'code': 'STUDIO3D_EXPORT_IN_USE',
                'message': f'该文件夹中的图片正在被“{"、".join(unique_usages)}”使用，请先替换或移除后再删除。',
                'folderName': folder_name,
                'projects': unique_usages,
            },
        )
    settings = request.app.state.settings
    root = settings.studio3d_exports_dir.resolve()
    target = (root / folder_name).resolve()
    if not target.is_relative_to(root) or target.parent != root:
        raise HTTPException(status_code=422, detail='导出文件夹名称无效。')
    with _storage_lock:
        if not target.is_dir():
            raise HTTPException(status_code=404, detail='导图文件夹不存在。')
        discarded = root / f'.deleted-{uuid4().hex}'
        os.replace(target, discarded)
        catalog = getattr(request.app.state, 'asset_catalog', None)
        if catalog is not None:
            catalog.remove_studio3d_folder(folder_name)
        shutil.rmtree(discarded, ignore_errors=True)
    request.app.state.global_log.append('success', '图片管理', '删除', f'已删除自动导图文件夹：{folder_name}')
    return Response(status_code=status.HTTP_204_NO_CONTENT)
