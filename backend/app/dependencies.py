from __future__ import annotations

import json
from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
from typing import Annotated

from display_access import active_display_device
from fastapi import Depends, HTTPException, Request, Response, status
from global_popups import hydrate_document_popups
from models import DisplayDevice, HAConnection, HAEntity, LoginSession, ProjectDraft, User
from panel.entity_refs import document_entity_ids
from security import session_token_hash, set_display_cookie
from sqlalchemy import and_, or_, select
from sqlalchemy.orm import Session


def get_database_session(request: Request):
    yield from request.app.state.database.sessions()


DatabaseSession = Annotated[Session, Depends(get_database_session)]


def _aware(value: datetime) -> datetime:
    return value if value.tzinfo is not None else value.replace(tzinfo=UTC)


def lookup_session_user(
    database: Session,
    *,
    token: str,
    account_user_id: str | None,
) -> User | None:
    '''Resolve an active admin user from a session cookie token (no cookie refresh).'''
    if not token or account_user_id is None:
        return None
    record = database.scalar(
        select(LoginSession).where(LoginSession.id_hash == session_token_hash(token))
    )
    now = datetime.now(UTC)
    if record is None or _aware(record.expires_at) <= now:
        if record is not None:
            database.delete(record)
            database.commit()
        return None
    if record.user_id != account_user_id:
        return None
    user = database.get(User, record.user_id)
    if user is None or not user.is_active:
        return None
    return user


def resolve_viewer_principal(
    database: Session,
    *,
    session_token: str,
    display_token: str,
    account_user_id: str | None,
) -> ViewerPrincipal | None:
    '''Build a viewer from session/display tokens without mutating cookies.'''
    user = lookup_session_user(
        database,
        token=session_token,
        account_user_id=account_user_id,
    )
    if user is not None:
        return ViewerPrincipal(user=user)
    if not display_token:
        return None
    device = active_display_device(database, display_token)
    if device is None:
        return None
    return ViewerPrincipal(display=device)


def _admin_session(request: Request, response: Response, database: DatabaseSession) -> User | None:
    account_user_id = request.app.state.admin_account.user_id
    token = request.cookies.get(request.app.state.settings.cookie_name, '')
    user = lookup_session_user(database, token=token, account_user_id=account_user_id)
    if user is None:
        return None
    record = database.scalar(
        select(LoginSession).where(LoginSession.id_hash == session_token_hash(token))
    )
    now = datetime.now(UTC)
    max_age = request.app.state.settings.session_max_age_seconds
    refresh_interval = min(300, max(1, max_age // 2))
    if record is not None and now - _aware(record.last_seen_at) >= timedelta(seconds=refresh_interval):
        record.last_seen_at = now
        record.expires_at = now + timedelta(seconds=max_age)
        database.commit()
        response.set_cookie(
            key=request.app.state.settings.cookie_name,
            value=token,
            max_age=max_age,
            httponly=True,
            secure=request.app.state.settings.cookie_secure,
            samesite='lax',
            path='/',
        )
    context = getattr(request.state, 'log_context', None)
    if context is not None:
        context['actor'] = user.username
    return user


def authenticated_user(request: Request, response: Response, database: DatabaseSession) -> User:
    user = _admin_session(request, response, database)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='登录状态已失效，请重新登录。')
    return user


CurrentUser = Annotated[User, Depends(authenticated_user)]


def licensed_user(request: Request, user: CurrentUser) -> User:
    if not request.app.state.license_service.allows('api'):
        license_status = request.app.state.license_service.status()
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                'code': 'LICENSE_RESTRICTED',
                'message': '当前授权状态不允许执行此操作。',
                'licenseStatus': license_status['status'],
            },
        )
    return user


LicensedUser = Annotated[User, Depends(licensed_user)]


@dataclass(frozen=True)
class ViewerPrincipal:
    user: User | None = None
    display: DisplayDevice | None = None

    @property
    def project_id(self) -> str | None:
        return self.display.project_id if self.display is not None else None

    @property
    def is_admin_session(self) -> bool:
        return self.user is not None


def _display_device(request: Request, response: Response, database: DatabaseSession) -> DisplayDevice | None:
    settings = request.app.state.settings
    token = request.cookies.get(settings.display_cookie_name, '')
    if not token:
        return None
    device = active_display_device(database, token)
    if device is None:
        return None
    now = datetime.now(UTC)
    if now - _aware(device.last_seen_at) >= timedelta(minutes=5):
        device.last_seen_at = now
        database.commit()
        set_display_cookie(response, settings, token)
    context = getattr(request.state, 'log_context', None)
    if context is not None:
        context.update(displayId=device.id, displayName=device.name, projectId=device.project_id)
    return device


def authenticated_viewer(request: Request, response: Response, database: DatabaseSession) -> ViewerPrincipal:
    user = _admin_session(request, response, database)
    if user is not None:
        return ViewerPrincipal(user=user)
    display = _display_device(request, response, database)
    if display is not None:
        return ViewerPrincipal(display=display)
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='请登录或先完成中控设备配对。')


CurrentViewer = Annotated[ViewerPrincipal, Depends(authenticated_viewer)]


def licensed_viewer(request: Request, viewer: CurrentViewer) -> ViewerPrincipal:
    if not request.app.state.license_service.allows('api'):
        license_status = request.app.state.license_service.status()
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                'code': 'LICENSE_RESTRICTED',
                'message': '当前授权状态不允许执行此操作。',
                'licenseStatus': license_status['status'],
            },
        )
    return viewer


LicensedViewer = Annotated[ViewerPrincipal, Depends(licensed_viewer)]


def authenticated_short_lived_viewer(request: Request, response: Response) -> ViewerPrincipal:
    '''Authenticate media requests without retaining a DB session for their lifetime.

    FastAPI keeps yield-based dependencies alive until a streaming response has
    finished. Camera streams can stay open indefinitely, so using
    ``DatabaseSession`` for them would reserve one pooled connection per camera.
    '''
    with request.app.state.database.session_factory() as database:
        viewer = authenticated_viewer(request, response, database)
        if viewer.user is not None:
            database.expunge(viewer.user)
        if viewer.display is not None:
            database.expunge(viewer.display)
        return viewer


ShortLivedCurrentViewer = Annotated[ViewerPrincipal, Depends(authenticated_short_lived_viewer)]


def licensed_short_lived_viewer(request: Request, viewer: ShortLivedCurrentViewer) -> ViewerPrincipal:
    return licensed_viewer(request, viewer)


ShortLivedLicensedViewer = Annotated[ViewerPrincipal, Depends(licensed_short_lived_viewer)]


def require_viewer_project(viewer: ViewerPrincipal, project_id: str) -> None:
    if viewer.project_id is not None and viewer.project_id != project_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='该中控设备未绑定此仪表盘。')


def _display_document(database: DatabaseSession, viewer: ViewerPrincipal) -> dict:
    if viewer.project_id is None:
        return {}
    draft = database.get(ProjectDraft, viewer.project_id)
    if draft is None:
        return {}
    try:
        value = json.loads(draft.document_json)
    except (TypeError, json.JSONDecodeError):
        return {}
    return hydrate_document_popups(database, value, referenced_only=True) if isinstance(value, dict) else {}


def _document_bound_values(value, suffix: str) -> set[str]:
    result = set()
    if isinstance(value, dict):
        for key, item in value.items():
            if isinstance(item, str) and key.casefold().endswith(suffix.casefold()):
                result.add(item)
                continue
            result.update(_document_bound_values(item, suffix))
    elif isinstance(value, list):
        for item in value:
            result.update(_document_bound_values(item, suffix))
    return result


_XIAOMI_PLATFORMS = frozenset({'xiaomi_home', 'xiaomi_miot'})
_AUTO_LIGHT_SOURCE_DOMAINS = frozenset({'fan', 'climate'})
_WATER_HEATER_TARGET_DOMAINS = frozenset({'button', 'number', 'select', 'switch'})
_COVER_BINARY_TARGET_DOMAINS = frozenset({'select', 'switch'})
_COVER_POSITION_TARGET_DOMAINS = frozenset({'number', 'sensor'})
_VACUUM_STATE_TRANSLATION_KEYS = frozenset({'state', 'status', 'task_status'})
_AIRER_MARKERS = ('airer', 'clothes rack', 'laundry rack', '晾衣机', '晾衣架')
_AIRER_LIGHT_MARKERS = ('light', 'lamp', '灯光', '照明', '晾衣机 灯', '晾衣架 灯')
_AIRER_POSITION_MARKERS = (
    'set_position',
    'set position',
    'target_position',
    'target position',
    '设定位置',
    '设置位置',
    '目标位置',
    'current_position',
    'current position',
    '当前位置',
    '当前高度',
)
_MOTION_MARKERS = ('no_motion', 'no motion', '无移动', '无人移动')
_XIAOMI_RELATED_DOMAINS = ('climate', 'cover', 'fan', 'light', 'switch', 'select', 'number', 'sensor')


def _entity_identity(entity: HAEntity, *, include_icon: bool = False) -> str:
    '''Case-folded, space-joined blob of an entity's identifying fields for marker matching.'''
    fields = [entity.entity_id, entity.name, entity.original_name, entity.translation_key]
    if include_icon:
        fields.append(entity.icon)
    return ' '.join(filter(None, fields)).casefold()


def _has_marker(text: str, markers) -> bool:
    return any(marker in text for marker in markers)


def _is_auto_related_entity(source: HAEntity, candidate: HAEntity) -> bool:
    '''Whether `candidate` looks like a second entity of the same physical device as `source`.

    Home Assistant integrations expose one device as several entities (a light plus its
    switch, a vacuum plus its battery sensor, ...). A dashboard usually binds only one of
    them, so the rest of the device is allowed automatically to keep panels intact.
    '''
    if source.platform in _XIAOMI_PLATFORMS and candidate.platform != source.platform:
        return False
    candidate_domain = candidate.domain
    identity = _entity_identity(candidate, include_icon=True)
    source_identity = _entity_identity(source)
    if source.domain in _AUTO_LIGHT_SOURCE_DOMAINS and candidate_domain == 'light':
        return True
    if source.domain == 'water_heater' and candidate_domain in _WATER_HEATER_TARGET_DOMAINS:
        return True
    if source.domain == 'vacuum':
        if candidate_domain == 'select':
            return candidate.translation_key == 'cleaning_mode' or 'cleaning_mode' in identity
        if candidate_domain == 'sensor':
            return (
                candidate.translation_key == 'battery'
                or 'battery' in identity
                or '电量' in identity
            )
        return False
    if source.domain == 'event' and candidate_domain == 'sensor':
        return _has_marker(identity, _MOTION_MARKERS)
    if source.domain == 'cover':
        # Two cover clauses are OR-ed together: a binary target may be matched by the
        # motor_reverse marker, or by the airer heuristic for light/switch targets.
        if candidate_domain in _COVER_BINARY_TARGET_DOMAINS and (
            'motor_reverse' in identity or '电机反向' in identity
        ):
            return True
        if not _has_marker(source_identity, _AIRER_MARKERS):
            return False
        if candidate_domain in ('light', 'switch'):
            return candidate_domain == 'light' or _has_marker(identity, _AIRER_LIGHT_MARKERS)
        if candidate_domain in _COVER_POSITION_TARGET_DOMAINS:
            return _has_marker(identity, _AIRER_POSITION_MARKERS)
        return False
    if source.domain == 'sensor' and candidate_domain == 'vacuum':
        return source.translation_key in _VACUUM_STATE_TRANSLATION_KEYS
    return False


def _xiaomi_related_entity_ids(
    database: DatabaseSession, active_connection_id, allowed: set[str]
) -> set[str]:
    '''Every active entity of the same Xiaomi device+platform as an already-allowed entity.

    Xiaomi splits one device across many entities; binding one should keep its siblings visible.
    '''
    xiaomi_sources = database.scalars(
        select(HAEntity).where(
            HAEntity.connection_id == active_connection_id,
            HAEntity.entity_id.in_(allowed),
            HAEntity.platform.in_(tuple(_XIAOMI_PLATFORMS)),
            HAEntity.device_id.is_not(None),
        )
    ).all()
    xiaomi_pairs = {
        (item.device_id, item.platform)
        for item in xiaomi_sources
        if item.device_id and item.platform
    }
    if not xiaomi_pairs:
        return set()
    related_filter = or_(
        *(
            and_(
                HAEntity.connection_id == active_connection_id,
                HAEntity.device_id == device_id,
                HAEntity.platform == platform,
            )
            for device_id, platform in xiaomi_pairs
        )
    )
    return set(
        database.scalars(
            select(HAEntity.entity_id).where(
                related_filter,
                HAEntity.domain.in_(_XIAOMI_RELATED_DOMAINS),
                HAEntity.sync_status == 'active',
                HAEntity.disabled_by.is_(None),
            )
        ).all()
    )


def viewer_entity_ids(database: DatabaseSession, viewer: ViewerPrincipal) -> set[str] | None:
    if viewer.project_id is None:
        return None
    allowed = document_entity_ids(_display_document(database, viewer))
    if not allowed:
        return allowed
    active_connection_id = database.scalar(
        select(HAConnection.id).where(HAConnection.is_active.is_(True))
    )
    if active_connection_id is None:
        return allowed
    bound_sources = database.scalars(
        select(HAEntity).where(
            HAEntity.connection_id == active_connection_id,
            HAEntity.entity_id.in_(allowed),
        )
    ).all()
    sources_by_device = {}
    for item in bound_sources:
        if not item.device_id:
            continue
        sources_by_device.setdefault((item.connection_id, item.device_id), []).append(item)
    if sources_by_device:
        device_filter = or_(
            *(
                and_(HAEntity.connection_id == connection_id, HAEntity.device_id == device_id)
                for connection_id, device_id in sources_by_device
            )
        )
        candidates = database.scalars(
            select(HAEntity).where(
                device_filter,
                HAEntity.sync_status == 'active',
                HAEntity.disabled_by.is_(None),
            )
        ).all()
        for candidate in candidates:
            sources = sources_by_device.get((candidate.connection_id, candidate.device_id), [])
            if not sources or any(candidate.entity_id == source.entity_id for source in sources):
                continue
            if any(_is_auto_related_entity(source, candidate) for source in sources):
                allowed.add(candidate.entity_id)
    allowed.update(_xiaomi_related_entity_ids(database, active_connection_id, allowed))
    return allowed


def require_viewer_entity(database: DatabaseSession, viewer: ViewerPrincipal, entity_id: str) -> None:
    allowed = viewer_entity_ids(database, viewer)
    if allowed is not None and entity_id not in allowed:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='该实体不属于当前中控仪表盘。')


def viewer_user_asset_ids(database: DatabaseSession, viewer: ViewerPrincipal) -> set[str] | None:
    if viewer.project_id is None:
        return None
    return {
        item.removeprefix('user:')
        for item in _document_bound_values(_display_document(database, viewer), 'assetId')
        if item.startswith('user:')
    }


def require_viewer_user_asset(database: DatabaseSession, viewer: ViewerPrincipal, asset_id: str) -> None:
    allowed = viewer_user_asset_ids(database, viewer)
    if allowed is not None and asset_id not in allowed:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='该图片不属于当前中控仪表盘。')
