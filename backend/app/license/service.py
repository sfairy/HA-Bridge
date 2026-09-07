from __future__ import annotations

import hashlib
import json
import os
import secrets
import threading
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import urlparse
from uuid import uuid4

import httpx
from sqlalchemy import select

from config import Settings
from database import Database
from global_log import GlobalLogStore
from models import LicenseState
from license.crypto import LeaseVerifier, LicenseCryptoError, SecretCipher, parse_timestamp


class LicenseClientError(RuntimeError):
    def __init__(self, message: str, *, status_code: int | None = None) -> None:
        super().__init__(message)
        self.status_code = status_code


STORE_KEY_ID = 'hb-store-local'
BASE_FEATURES = {
    'api',
    'assets',
    'editor',
    'display',
    'ha.sync',
    'ui.base',
    'ha.control',
    'ha.configure',
    'projects.write',
    'runtime.websocket',
    'module.3d_interaction',
}


def aware(value: datetime | None) -> datetime | None:
    if value is None or value.tzinfo is not None:
        return value
    return value.replace(tzinfo=timezone.utc)


class LicenseService:
    def __init__(
        self,
        settings: Settings,
        database: Database,
        transport: httpx.AsyncBaseTransport | None = None,
        *,
        event_log: GlobalLogStore | None = None,
    ) -> None:
        self.settings = settings
        self.database = database
        self.event_log = event_log
        self._event_lock = threading.RLock()
        self._observed_status = None
        self._event_failures = {}
        self.verifier = LeaseVerifier(trusted_keys={})
        self.cipher = SecretCipher(settings.license_secret_key_path)
        self._transport = transport
        self._cached_instance_id = None
        self._load_cached_store_key()

    def _log_event(self, level: str, message: str) -> None:
        if self.event_log is None:
            return
        try:
            self.event_log.append(level, '授权服务', '授权', message)
        except Exception:
            return

    def _record_status(self, status: str, reason: str | None = None) -> None:
        labels = {
            'UNACTIVATED': '未激活',
            'ACTIVE': '正常',
            'LEASE_EXPIRED': '租约已到期',
            'REVOKED': '已吊销',
            'INVALID': '校验无效',
            'INSTANCE_MISMATCH': '安装标识不匹配',
            'CLOCK_ROLLBACK': '系统时间异常',
            'DEACTIVATED': '已停用',
        }
        with self._event_lock:
            previous = self._observed_status
            if previous == status:
                return
            self._observed_status = status
            message = f'授权状态：{labels.get(status, status)}'
            if previous is not None:
                message = f'授权状态变化：{labels.get(previous, previous)} → {labels.get(status, status)}'
            if reason:
                message += f'；原因：{reason}'
            if status == 'ACTIVE':
                level = 'success'
            elif status in {'DEACTIVATED', 'UNACTIVATED'}:
                level = 'info'
            else:
                level = 'warning'
            if status in {'INVALID', 'REVOKED', 'CLOCK_ROLLBACK', 'INSTANCE_MISMATCH'}:
                level = 'error'
            self._log_event(level, message)

    def _record_failure(
        self,
        operation: str,
        error: Exception | str,
        *,
        sensitive_values: tuple[str, ...] = (),
    ) -> None:
        reason = str(error)
        for value in sorted(set(sensitive_values), key=len, reverse=True):
            if not value:
                continue
            reason = reason.replace(value, '***')
        with self._event_lock:
            now = time.monotonic()
            failure = self._event_failures.setdefault(operation, {
                'count': 0,
                'logged_at': None,
                'reason': None,
            })
            failure['count'] += 1
            if failure['reason'] == reason and failure['logged_at'] is not None and now - failure['logged_at'] < 300:
                return
            failure.update(logged_at=now, reason=reason)
            status_code = getattr(error, 'status_code', None)
            suffix = f'，HTTP {status_code}' if status_code else ''
            self._log_event(
                'error' if operation in {'激活', '本地校验'} else 'warning',
                f'授权{operation}失败（累计 {failure["count"]} 次{suffix}）：{reason}',
            )

    def _record_online_success(self, operation: str) -> None:
        with self._event_lock:
            if operation == '激活':
                self._event_failures.pop('激活', None)
                self._log_event('success', '授权激活成功。')

    def _record_local_success(self) -> None:
        with self._event_lock:
            failure = self._event_failures.pop('本地校验', None)
            if failure:
                self._log_event('success', f'授权本地校验已恢复；此前校验失败 {failure["count"]} 次。')

    @staticmethod
    def _valid_instance_id(value: str) -> bool:
        return 16 <= len(value) <= 64 and all(character.isalnum() or character in '-_.:' for character in value)

    def _store_base_url(self) -> str | None:
        raw = (self.settings.license_store_url or '').strip().rstrip('/')
        if not raw:
            return None
        parsed = urlparse(raw)
        if parsed.scheme not in {'http', 'https'} or parsed.hostname not in {'127.0.0.1', 'localhost', '::1'}:
            return None
        return raw

    def _store_public_key_path(self) -> Path:
        return self.settings.secrets_dir / 'store-license-public.pem'

    def _load_cached_store_key(self) -> None:
        path = self._store_public_key_path()
        if not path.is_file():
            return
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        self.verifier.trusted_keys[STORE_KEY_ID] = (path, digest)

    async def _fetch_store_public_key(self) -> None:
        base_url = self._store_base_url()
        if base_url is None:
            return
        async with httpx.AsyncClient(
            transport=self._transport,
            timeout=self.settings.license_request_timeout_seconds,
            trust_env=False,
        ) as client:
            try:
                key_response = await client.get(f'{base_url}/api/v1/store/public-key')
            except httpx.HTTPError:
                self._load_cached_store_key()
                return
        if key_response.status_code >= 400:
            self._load_cached_store_key()
            return
        try:
            key_payload = key_response.json()
        except ValueError:
            self._load_cached_store_key()
            return
        if isinstance(key_payload, dict):
            self._trust_store_public_key(key_payload)

    def _trust_store_public_key(self, payload: dict) -> None:
        key_id = payload.get('keyId')
        pem = payload.get('publicKeyPem')
        digest = payload.get('sha256')
        if key_id != STORE_KEY_ID or not isinstance(pem, str) or not isinstance(digest, str):
            raise LicenseClientError('本地授权商店公钥无效。')
        path = self._store_public_key_path()
        path.parent.mkdir(parents=True, exist_ok=True, mode=448)
        encoded = pem.encode('ascii')
        actual = hashlib.sha256(encoded).hexdigest()
        if actual != digest:
            raise LicenseClientError('本地授权商店公钥指纹不匹配。')
        path.write_bytes(encoded)
        os.chmod(path, 384)
        self.verifier.trusted_keys[STORE_KEY_ID] = (path, digest)

    async def _activate_from_store(self, payload: dict) -> dict:
        base_url = self._store_base_url()
        if base_url is None:
            raise LicenseClientError('尚未配置本地授权商店。')
        async with httpx.AsyncClient(
            transport=self._transport,
            timeout=self.settings.license_request_timeout_seconds,
            trust_env=False,
        ) as client:
            try:
                key_response = await client.get(f'{base_url}/api/v1/store/public-key')
                activate_response = await client.post(f'{base_url}/api/v1/store/activate', json=payload)
            except httpx.HTTPError as error:
                raise LicenseClientError('无法连接本地授权商店。') from error
        if key_response.status_code >= 400:
            raise LicenseClientError('无法读取本地授权商店公钥。', status_code=key_response.status_code)
        try:
            key_payload = key_response.json()
        except ValueError as error:
            raise LicenseClientError('本地授权商店公钥格式无效。') from error
        if not isinstance(key_payload, dict):
            raise LicenseClientError('本地授权商店公钥格式无效。')
        self._trust_store_public_key(key_payload)
        if activate_response.status_code >= 400:
            raise LicenseClientError(
                self._response_error_detail(activate_response),
                status_code=activate_response.status_code,
            )
        try:
            parsed = activate_response.json()
        except ValueError as error:
            raise LicenseClientError('本地授权商店响应格式无效。') from error
        if not isinstance(parsed, dict) or not parsed.get('signedLease'):
            raise LicenseClientError('本地授权商店未返回签名租约。')
        return parsed

    def _instance_id(self, preferred_instance_id: str | None = None) -> str:
        if self._cached_instance_id:
            return self._cached_instance_id
        path = self.settings.instance_id_path
        path.parent.mkdir(parents=True, exist_ok=True, mode=448)
        try:
            saved = path.read_text(encoding='utf-8').strip()
        except OSError:
            saved = ''
        preferred = (preferred_instance_id or '').strip()
        if self._valid_instance_id(preferred):
            value = preferred
        elif self._valid_instance_id(saved):
            value = saved
        else:
            value = str(uuid4())
        if saved != value:
            temporary = path.with_name(f'.{path.name}.tmp')
            descriptor = os.open(temporary, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 384)
            with os.fdopen(descriptor, 'w', encoding='utf-8') as output:
                output.write(value + '\n')
            os.replace(temporary, path)
        os.chmod(path, 384)
        self._cached_instance_id = value
        return value

    def _state(self, database) -> LicenseState:
        state = database.scalar(select(LicenseState).limit(1))
        instance_id = self._instance_id(state.instance_id if state and state.license_id else None)
        if state is None:
            state = LicenseState(id=1, instance_id=instance_id)
            database.add(state)
            database.commit()
            database.refresh(state)
            return state
        if state.instance_id != instance_id:
            state.instance_id = instance_id
            state.lease_id = None
            state.session_id = None
            state.lease_sequence = 0
            state.signed_lease = None
            state.encrypted_session_token = None
            state.encrypted_recovery_token = None
            state.lease_issued_at = None
            state.lease_expires_at = None
            state.status = 'INSTANCE_MISMATCH' if state.license_id else 'UNACTIVATED'
            state.last_error = '检测到安装 UUID 与授权记录不一致，请重新绑定当前安装。' if state.license_id else None
            database.commit()
            self._record_status(state.status, state.last_error)
        return state

    async def start(self) -> None:
        try:
            await self._fetch_store_public_key()
        except LicenseClientError:
            self._load_cached_store_key()
        with self.database.session_factory() as database:
            state = self._state(database)
            self._validate_saved_state(state, database)
            self._record_status(state.status)

    async def stop(self) -> None:
        return

    def _validate_saved_state(self, state: LicenseState, database) -> None:
        if not state.signed_lease or state.status in {'DEACTIVATED', 'UNACTIVATED'}:
            return
        try:
            payload = self.verifier.verify(state.signed_lease, state.instance_id)
            if payload['leaseSequence'] != state.lease_sequence:
                raise LicenseCryptoError('本地租约序号与签名租约不一致。')
            expires = parse_timestamp(payload['expiresAt'])
            now = datetime.now(timezone.utc)
            last_verified = aware(state.last_verified_at)
            if last_verified and now + timedelta(seconds=self.settings.license_clock_skew_seconds) < last_verified:
                state.status = 'CLOCK_ROLLBACK'
                state.last_error = '检测到系统时间回拨，请校准系统时间后重新验证授权。'
            else:
                state.status = 'ACTIVE' if expires > now else 'LEASE_EXPIRED'
                state.last_verified_at = now
                state.last_error = None
        except LicenseCryptoError as error:
            state.status = 'INSTANCE_MISMATCH' if '当前实例' in str(error) else 'INVALID'
            state.last_error = str(error)
            self._record_failure('本地校验', error, sensitive_values=(state.signed_lease,))
        database.commit()
        self._record_status(state.status)

    @staticmethod
    def _response_error_detail(response: httpx.Response) -> str:
        try:
            parsed = response.json()
            detail = parsed.get('detail', '授权商店拒绝请求。') if isinstance(parsed, dict) else '授权商店拒绝请求。'
        except ValueError:
            detail = '授权商店拒绝请求。'
        return str(detail)

    def _apply_response(self, response: dict, *, activation_code_hint: str | None = None) -> dict:
        signed_lease = response.get('signedLease', '')
        with self.database.session_factory() as database:
            state = self._state(database)
            try:
                payload = self.verifier.verify(signed_lease, state.instance_id)
            except LicenseCryptoError as error:
                state.status = 'INSTANCE_MISMATCH' if '当前实例' in str(error) else 'INVALID'
                state.last_error = str(error)
                database.commit()
                self._record_status(state.status)
                self._record_failure('本地校验', error, sensitive_values=(signed_lease,))
                raise LicenseClientError(str(error)) from error
            expires_at = parse_timestamp(payload['expiresAt'])
            issued_at = parse_timestamp(payload['issuedAt'])
            lease_sequence = payload['leaseSequence']
            now = datetime.now(timezone.utc)
            if issued_at > now + timedelta(seconds=self.settings.license_clock_skew_seconds):
                state.status = 'CLOCK_ROLLBACK'
                state.last_error = '授权商店时间明显晚于本机时间，请先校准系统时间。'
                database.commit()
                self._record_status(state.status, state.last_error)
                raise LicenseClientError(state.last_error)
            if expires_at <= now:
                state.status = 'LEASE_EXPIRED'
                state.last_error = '授权商店返回了已到期租约。'
                database.commit()
                self._record_status(state.status, state.last_error)
                raise LicenseClientError(state.last_error)
            if payload['activationCodeId'] == state.license_id and lease_sequence <= state.lease_sequence and state.signed_lease != signed_lease:
                state.status = 'INVALID'
                state.last_error = '授权商店返回了未递增的租约序号。'
                database.commit()
                self._record_status(state.status, state.last_error)
                raise LicenseClientError(state.last_error)
            state.license_id = payload['activationCodeId']
            state.lease_id = payload['leaseId']
            state.session_id = payload['sessionId']
            state.lease_sequence = lease_sequence
            state.signed_lease = signed_lease
            state.status = 'ACTIVE'
            state.lease_issued_at = parse_timestamp(payload['issuedAt'])
            state.lease_expires_at = expires_at
            state.last_heartbeat_at = now
            state.last_verified_at = now
            state.product_edition = 'full'
            features = payload.get('features')
            if not isinstance(features, list) or not all(isinstance(item, str) for item in features):
                state.status = 'INVALID'
                state.last_error = '授权商店返回的权益列表无效。'
                database.commit()
                self._record_status(state.status, state.last_error)
                raise LicenseClientError(state.last_error)
            state.feature_set = json.dumps(features, ensure_ascii=False, separators=(',', ':'))
            state.max_projects = 0
            state.max_displays = 0
            state.heartbeat_interval_seconds = max(30, int(response.get('heartbeatIn', 300)))
            state.last_error = None
            state.deactivated_at = None
            if state.activated_at is None:
                state.activated_at = datetime.now(timezone.utc)
            if activation_code_hint:
                state.activation_code_hint = activation_code_hint
            if response.get('sessionToken'):
                state.encrypted_session_token = self.cipher.encrypt(response['sessionToken'])
            if response.get('recoveryToken'):
                state.encrypted_recovery_token = self.cipher.encrypt(response['recoveryToken'])
            database.commit()
            return self._payload(state)

    async def activate(self, activation_code: str, email: str | None = None) -> dict:
        with self.database.session_factory() as database:
            state = self._state(database)
            instance_id = state.instance_id
        payload = {
            'activationCode': activation_code.strip().upper(),
            'instanceId': instance_id,
            'product': 'ha-bridge',
            'clientVersion': self.settings.version,
            'nonce': secrets.token_urlsafe(24),
        }
        normalized_email = (email or '').strip().lower()
        if not normalized_email:
            self._record_failure('激活', '请输入购买授权时使用的邮箱。')
            raise LicenseClientError('请输入购买授权时使用的邮箱。', status_code=422)
        payload['email'] = normalized_email
        try:
            response = await self._activate_from_store(payload)
            result = self._apply_response(response, activation_code_hint=activation_code.strip()[-9:])
            self._record_online_success('激活')
            return result
        except (LicenseClientError, LicenseCryptoError) as error:
            self._record_failure(
                '激活',
                error,
                sensitive_values=(
                    activation_code,
                    activation_code.strip(),
                    payload['activationCode'],
                    email or '',
                    normalized_email,
                ),
            )
            raise

    def _payload(self, state: LicenseState) -> dict:
        effective_status = state.status
        effective_error = state.last_error
        now = datetime.now(timezone.utc)
        last_verified = aware(state.last_verified_at)
        lease_expires = aware(state.lease_expires_at)
        if last_verified and now + timedelta(seconds=self.settings.license_clock_skew_seconds) < last_verified:
            effective_status = 'CLOCK_ROLLBACK'
            effective_error = '检测到系统时间回拨，请校准系统时间后重新验证授权。'
        elif lease_expires and lease_expires <= now and effective_status in {'ACTIVE', 'CONNECTION_WARNING'}:
            effective_status = 'LEASE_EXPIRED'
            effective_error = effective_error or '授权租约已到期。'
        self._record_status(effective_status)
        allowed = self._verified_access(state)
        editor_allowed = self._verified_access(state, 'editor')
        try:
            stored_features = json.loads(state.feature_set or '[]')
        except json.JSONDecodeError:
            stored_features = []
        if not isinstance(stored_features, list):
            stored_features = []
        if 'all' in stored_features:
            visible_features = sorted(BASE_FEATURES)
        else:
            visible_features = [item for item in stored_features if isinstance(item, str)]
        if allowed and editor_allowed:
            visible_features = sorted(set(visible_features) | BASE_FEATURES)
        visible_products = []
        if state.signed_lease:
            try:
                signed_payload = self.verifier.verify(state.signed_lease, state.instance_id)
            except LicenseCryptoError:
                signed_payload = {}
            raw_products = signed_payload.get('products')
            if isinstance(raw_products, list):
                for item in raw_products:
                    if not isinstance(item, dict) or not isinstance(item.get('name'), str):
                        continue
                    product_name = item['name'].strip()
                    if not product_name:
                        continue
                    product_type = item.get('type') if isinstance(item.get('type'), str) else 'module'
                    expires_at = item.get('expiresAt') if isinstance(item.get('expiresAt'), str) else None
                    visible_products.append({
                        'name': product_name,
                        'type': product_type,
                        'expiresAt': expires_at,
                    })
        if state.license_id and not visible_products:
            visible_products = [{'name': '基础版', 'type': 'base', 'expiresAt': None}]
        return {
            'required': self.settings.license_required,
            'allowed': allowed,
            'editorAllowed': editor_allowed,
            'status': effective_status,
            'instanceId': state.instance_id,
            'activationCodeId': state.license_id,
            'leaseId': state.lease_id,
            'leaseSequence': state.lease_sequence,
            'edition': 'full' if state.license_id else None,
            'features': visible_features if state.license_id else [],
            'products': visible_products if state.license_id else [],
            'heartbeatIn': state.heartbeat_interval_seconds,
            'leaseIssuedAt': aware(state.lease_issued_at),
            'leaseExpiresAt': aware(state.lease_expires_at),
            'lastHeartbeatAt': aware(state.last_heartbeat_at),
            'lastVerifiedAt': aware(state.last_verified_at),
            'lastError': effective_error,
        }

    def status(self) -> dict:
        with self.database.session_factory() as database:
            return self._payload(self._state(database))

    def _verified_access(self, state: LicenseState, feature: str | None = None) -> bool:
        '''Re-verify the signed lease instead of trusting mutable SQLite status fields.'''
        if STORE_KEY_ID not in self.verifier.trusted_keys:
            self._load_cached_store_key()
        if not self.settings.license_required:
            return True
        if state.status not in {'ACTIVE', 'CONNECTION_WARNING'}:
            return False
        if not (state.signed_lease and state.license_id and state.lease_id and state.session_id):
            self._record_failure('本地校验', '授权记录缺少签名租约或租约关联信息。')
            return False
        try:
            payload = self.verifier.verify(state.signed_lease, state.instance_id)
            issued_at = parse_timestamp(payload['issuedAt'])
            expires_at = parse_timestamp(payload['expiresAt'])
        except LicenseCryptoError as error:
            self._record_failure('本地校验', error, sensitive_values=(state.signed_lease,))
            return False
        now = datetime.now(timezone.utc)
        last_verified = aware(state.last_verified_at)
        if last_verified and now + timedelta(seconds=self.settings.license_clock_skew_seconds) < last_verified:
            self._record_failure('本地校验', '检测到系统时间回拨，请校准系统时间后重新验证授权。')
            return False
        if issued_at > now + timedelta(seconds=self.settings.license_clock_skew_seconds):
            self._record_failure('本地校验', '授权商店时间明显晚于本机时间，请先校准系统时间。')
            return False
        if expires_at <= now:
            self._record_failure('本地校验', '授权租约已到期。')
            return False
        if payload['activationCodeId'] != state.license_id:
            self._record_failure('本地校验', '本地授权标识与签名租约不一致。')
            return False
        if payload['leaseId'] != state.lease_id or payload['sessionId'] != state.session_id:
            self._record_failure('本地校验', '本地租约或会话标识与签名租约不一致。')
            return False
        if payload['leaseSequence'] != state.lease_sequence:
            self._record_failure('本地校验', '本地租约序号与签名租约不一致。')
            return False
        features = payload.get('features')
        if not isinstance(features, list) or not all(isinstance(item, str) for item in features):
            self._record_failure('本地校验', '签名租约中的权益列表无效。')
            return False
        self._record_local_success()
        if feature is None:
            return True
        if 'all' in features:
            return feature in BASE_FEATURES
        entitlements = payload.get('entitlements')
        active_features = set()
        if isinstance(entitlements, list):
            for entitlement in entitlements:
                if not isinstance(entitlement, dict) or not isinstance(entitlement.get('code'), str):
                    continue
                expires_at = entitlement.get('expiresAt')
                if expires_at:
                    try:
                        if parse_timestamp(expires_at) <= now:
                            continue
                    except (LicenseCryptoError, TypeError, ValueError):
                        continue
                active_features.add(entitlement['code'])
            granted = feature in active_features
            has_editor = 'editor' in active_features
        else:
            granted = feature in features
            has_editor = 'editor' in features
        if not granted and feature in BASE_FEATURES and has_editor:
            return True
        return granted

    def allows(self, feature: str | None = None) -> bool:
        with self.database.session_factory() as database:
            return self._verified_access(self._state(database), feature)
