from __future__ import annotations

import base64
import hashlib
import hmac
import json
from datetime import datetime, timezone
from pathlib import Path
from collections.abc import Mapping
from typing import Any

from cryptography.exceptions import InvalidSignature
from cryptography.fernet import Fernet, InvalidToken
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PublicKey

from secure_key_file import load_or_create_fernet_key


class LicenseCryptoError(RuntimeError):
    pass


def parse_timestamp(value: str) -> datetime:
    try:
        parsed = datetime.fromisoformat(value.replace('Z', '+00:00'))
    except (TypeError, ValueError) as error:
        raise LicenseCryptoError('租约时间格式无效。') from error
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    return parsed.astimezone(timezone.utc)


def _decode(value: str) -> bytes:
    try:
        return base64.urlsafe_b64decode(value + '=' * (-len(value) % 4))
    except (ValueError, TypeError) as error:
        raise LicenseCryptoError('租约编码无效。') from error


class LeaseVerifier:
    def __init__(
        self,
        public_key_path: Path | None = None,
        product: str = 'ha-bridge',
        expected_sha256: str | None = None,
        *,
        trusted_keys: Mapping[str, tuple[Path, str | None]] | None = None,
        legacy_key_id: str = 'legacy',
    ) -> None:
        self.product = product
        self.legacy_key_id = legacy_key_id
        if trusted_keys is not None:
            self.trusted_keys = dict(trusted_keys)
        elif public_key_path is not None:
            self.trusted_keys = {legacy_key_id: (public_key_path, expected_sha256)}
        else:
            self.trusted_keys = {}

    def verify(self, signed_lease: str, instance_id: str) -> dict[str, Any]:
        try:
            encoded_payload, encoded_signature = signed_lease.split('.', 1)
        except ValueError as error:
            raise LicenseCryptoError('签名租约格式无效。') from error
        payload_bytes = _decode(encoded_payload)
        try:
            payload = json.loads(payload_bytes)
        except (UnicodeError, json.JSONDecodeError) as error:
            raise LicenseCryptoError('租约内容无效。') from error
        key_id = payload.get('keyId', self.legacy_key_id)
        if not isinstance(key_id, str) or not key_id:
            raise LicenseCryptoError('租约 keyId 无效。')
        trusted_key = self.trusted_keys.get(key_id)
        if trusted_key is None:
            raise LicenseCryptoError(f'租约使用了不受信任的授权公钥：{key_id}')
        public_key_path, expected_fingerprint = trusted_key
        try:
            key_data = public_key_path.read_bytes()
        except OSError as error:
            raise LicenseCryptoError(f'无法读取授权公钥：{public_key_path}') from error
        if expected_fingerprint:
            actual_sha256 = hashlib.sha256(key_data).hexdigest()
            if not hmac.compare_digest(actual_sha256, expected_fingerprint):
                raise LicenseCryptoError('授权公钥指纹与本机授权店不匹配。')
        key = serialization.load_pem_public_key(key_data)
        if not isinstance(key, Ed25519PublicKey):
            raise LicenseCryptoError('授权公钥必须是 Ed25519。')
        try:
            key.verify(_decode(encoded_signature), payload_bytes)
        except InvalidSignature as error:
            raise LicenseCryptoError('租约签名无效。') from error
        if payload.get('product') != self.product:
            raise LicenseCryptoError('租约产品标识不匹配。')
        if payload.get('instanceId') != instance_id:
            raise LicenseCryptoError('租约不属于当前实例。')
        required = {
            'leaseId',
            'features',
            'issuedAt',
            'expiresAt',
            'sessionId',
            'leaseSequence',
            'activationCodeId',
        }
        if not required.issubset(payload):
            raise LicenseCryptoError('租约缺少必要字段。')
        sequence = payload['leaseSequence']
        if isinstance(sequence, bool) or not isinstance(sequence, int) or sequence < 1:
            raise LicenseCryptoError('租约序号无效。')
        parse_timestamp(payload['issuedAt'])
        parse_timestamp(payload['expiresAt'])
        return payload


class SecretCipher:
    def __init__(self, key_path: Path) -> None:
        self.key_path = key_path

    def _key(self) -> bytes:
        try:
            return load_or_create_fernet_key(self.key_path, empty_message='授权凭证密钥为空。')
        except ValueError as error:
            raise LicenseCryptoError(str(error)) from error

    def encrypt(self, value: str) -> str:
        return Fernet(self._key()).encrypt(value.encode('utf-8')).decode('ascii')

    def decrypt(self, value: str) -> str:
        try:
            return Fernet(self._key()).decrypt(value.encode('ascii')).decode('utf-8')
        except (InvalidToken, UnicodeError, ValueError) as error:
            raise LicenseCryptoError('无法解密授权凭证。') from error
