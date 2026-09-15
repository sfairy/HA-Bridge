from __future__ import annotations

from datetime import datetime, timezone

from fastapi import HTTPException, Request

from ...license.crypto import LicenseCryptoError, parse_timestamp
from .config import validate_config

FEATURE = 'module.3d_interaction'
COMPONENT_TYPE = 'interaction3d'
MAX_GRANT_SECONDS = 15


def allowed(request: Request, *, database=None) -> bool:
    service = request.app.state.license_service
    return service.allows('editor', database=database) or service.allows(FEATURE, database=database)


def require_access(request: Request, *, database=None) -> None:
    if not allowed(request, database=database):
        raise HTTPException(403, detail={
            'code': 'INTERACTION3D_RESTRICTED',
            'message': '当前授权未开通 3D 交互功能增量包，或该权益已失效。',
        })
    return None


def access_grant(request: Request) -> dict:
    '''A short UI lifetime, never a credential accepted by any backend route.'''
    require_access(request)
    service = request.app.state.license_service
    lifetime = float(MAX_GRANT_SECONDS)
    if service.settings.license_required:
        with service.database.session_factory() as database:
            state = service._state(database)
            try:
                payload = service.verifier.verify(state.signed_lease or '', state.instance_id)
                deadlines = [parse_timestamp(payload['expiresAt'])]
                for item in payload.get('entitlements', []):
                    if not isinstance(item, dict):
                        continue
                    if item.get('code') not in {'editor', FEATURE}:
                        continue
                    if not item.get('expiresAt'):
                        continue
                    deadlines.append(parse_timestamp(item['expiresAt']))
                lifetime = min(lifetime, (min(deadlines) - datetime.now(timezone.utc)).total_seconds())
            except (LicenseCryptoError, KeyError, TypeError, ValueError) as error:
                raise HTTPException(403, detail='3D 交互授权校验失败。') from error
        if lifetime <= 0:
            raise HTTPException(403, detail='3D 交互授权已到期。')
    return {
        'allowed': True,
        'feature': FEATURE,
        'phase': 'authorization-shell',
        'validForSeconds': lifetime,
    }


def module_components(value, path=()):
    '''Visit nested groups/templates too; list positions must not block normal edits.'''
    if isinstance(value, dict):
        if value.get('type') == COMPONENT_TYPE:
            yield (path, value)
        for key, item in value.items():
            yield from module_components(item, (*path, key))
        return
    if isinstance(value, list):
        for index, item in enumerate(value):
            identity = item.get('id', item.get('path', index)) if isinstance(item, dict) else index
            yield from module_components(item, (*path, str(identity)))


def validate_module_component(component: dict) -> None:
    if component.get('componentVersion', 1) != 1:
        raise HTTPException(422, detail='不支持的 3D 交互控件版本。')
    if component.get('bindings') or component.get('actions') or component.get('children'):
        raise HTTPException(422, detail='当前版本的 3D 交互控件不支持此设备绑定、交互动作或子控件配置。')
    validate_config(component.get('properties', {}))
    return None


def require_document_changes(request: Request, document: dict, previous: dict | None = None, *, database=None) -> None:
    incoming = list(module_components(document))
    if not incoming:
        return None
    if allowed(request, database=database):
        for _, component in incoming:
            validate_module_component(component)
        return None
    old = dict(module_components(previous or {}))
    for path, component in incoming:
        if protected_config(old.get(path)) != protected_config(component):
            require_access(request, database=database)
    ids = {item.get('id') for item in document.get('sharedComponents', []) if any(module_components(item))}
    old_pages = {page.get('id'): page for page in (previous or {}).get('pages', [])}
    for page in document.get('pages', []):
        prior = old_pages.get(page.get('id'), {})
        if (set(page.get('sharedComponentIds', [])) & ids) - set(prior.get('sharedComponentIds', [])):
            require_access(request, database=database)
    return None


def protected_config(component):
    if component is None:
        return None
    return {
        **component,
        'position': {key: value for key, value in component.get('position', {}).items() if key != 'zIndex'},
    }
