from __future__ import annotations

import base64
import hashlib
import json
import os
from datetime import datetime, timedelta, timezone
from pathlib import Path
from uuid import uuid4

from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey

try:
    from store import BASE_FEATURES, PRODUCT_ID, PRODUCT_NAME, PRODUCT_TYPE
except ImportError:
    from register.store import BASE_FEATURES, PRODUCT_ID, PRODUCT_NAME, PRODUCT_TYPE

STORE_KEY_ID = 'hb-store-local'


def _encode(value: bytes) -> str:
    return base64.urlsafe_b64encode(value).rstrip(b'=').decode('ascii')


def ensure_signing_keys(data_dir: Path) -> tuple[Ed25519PrivateKey, bytes, str]:
    data_dir.mkdir(parents=True, exist_ok=True, mode=448)
    private_path = data_dir / 'store-license-private.pem'
    public_path = data_dir / 'store-license-public.pem'
    if private_path.is_file() and public_path.is_file():
        private_key = serialization.load_pem_private_key(private_path.read_bytes(), password=None)
        if not isinstance(private_key, Ed25519PrivateKey):
            raise RuntimeError('商店授权私钥必须是 Ed25519。')
        public_pem = public_path.read_bytes()
        return private_key, public_pem, hashlib.sha256(public_pem).hexdigest()
    private_key = Ed25519PrivateKey.generate()
    private_pem = private_key.private_bytes(
        serialization.Encoding.PEM,
        serialization.PrivateFormat.PKCS8,
        serialization.NoEncryption(),
    )
    public_pem = private_key.public_key().public_bytes(
        serialization.Encoding.PEM,
        serialization.PublicFormat.SubjectPublicKeyInfo,
    )
    descriptor = os.open(private_path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 384)
    with os.fdopen(descriptor, 'wb') as output:
        output.write(private_pem)
    public_path.write_bytes(public_pem)
    os.chmod(public_path, 384)
    return private_key, public_pem, hashlib.sha256(public_pem).hexdigest()


def public_key_payload(data_dir: Path) -> dict[str, str]:
    _, public_pem, fingerprint = ensure_signing_keys(data_dir)
    return {
        'keyId': STORE_KEY_ID,
        'sha256': fingerprint,
        'publicKeyPem': public_pem.decode('ascii'),
    }


def sign_lease(data_dir: Path, *, order_id: str, instance_id: str, lease_sequence: int) -> dict[str, str | int]:
    private_key, _, _ = ensure_signing_keys(data_dir)
    now = datetime.now(timezone.utc).replace(microsecond=0)
    payload = {
        'activationCodeId': order_id,
        'expiresAt': (now + timedelta(days=3650)).isoformat().replace('+00:00', 'Z'),
        'features': sorted(BASE_FEATURES),
        'instanceId': instance_id,
        'issuedAt': now.isoformat().replace('+00:00', 'Z'),
        'keyId': STORE_KEY_ID,
        'leaseId': str(uuid4()),
        'leaseSequence': lease_sequence,
        'product': PRODUCT_ID,
        'products': [{'name': PRODUCT_NAME, 'type': PRODUCT_TYPE, 'expiresAt': None}],
        'sessionId': str(uuid4()),
    }
    payload_bytes = json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode('utf-8')
    signature = private_key.sign(payload_bytes)
    return {
        'signedLease': f'{_encode(payload_bytes)}.{_encode(signature)}',
        'heartbeatIn': 86400,
        'sessionToken': f'store-session-{uuid4()}',
        'recoveryToken': f'store-recovery-{uuid4()}',
    }
