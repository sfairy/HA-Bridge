from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]
# 授权服务器：本项目自带的 ``store/`` 应用（默认监听 18082），不再依赖任何外部厂商节点。
# 体系为「服务端签发 Ed25519 签名租约 → 客户端离线验签 → 定期心跳续租」。
# 信任锚是仓库根 ``keys/`` 下的公钥镜像，真相源为 ``store/keys/local/``（由
# ``python -m store.tools.gen_keys`` 生成，公钥会自动同步回 ``keys/``）。
SELF_HOSTED_LICENSE_SERVER_URL = 'http://127.0.0.1:18082'
DEFAULT_LICENSE_SERVER_BATCHES = (('direct', (SELF_HOSTED_LICENSE_SERVER_URL,)),)
DEFAULT_LICENSE_KEY_ID = 'hb-local-2026'
DEFAULT_LICENSE_PUBLIC_KEY_FILENAME = 'license-public.pem'
DEFAULT_LICENSE_PUBLIC_KEY_SHA256 = 'a53d869318a3d9005431b0296b9f0d1d7f7b2523e088f0ede322f88c882e0c28'
DEFAULT_LICENSE_TRANSPORT_KEY_ID = 'hb-local-transport-2026'
DEFAULT_LICENSE_TRANSPORT_PUBLIC_KEY_FILENAME = 'license-transport-public.pem'
DEFAULT_LICENSE_TRANSPORT_PUBLIC_KEY_SHA256 = '1dd4a0a822b9227ebd1032fabd992342f7fb52630cdf2fedfc30db54191b2b19'
DEFAULT_LICENSE_TRUSTED_PUBLIC_KEYS = ((DEFAULT_LICENSE_KEY_ID, DEFAULT_LICENSE_PUBLIC_KEY_FILENAME, DEFAULT_LICENSE_PUBLIC_KEY_SHA256),)


def _environment_bool(name: str, default: bool = False) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in frozenset({'1', 'on', 'yes', 'true'})


def _environment_path(name: str) -> Path | None:
    value = os.getenv(name, '').strip()
    return Path(value).expanduser().resolve() if value else None


def _environment_batches(name: str) -> tuple[tuple[str, tuple[str, ...]], ...]:
    '''解析授权服务器批次覆盖项。

    格式：``名称=地址1|地址2;名称2=地址3``，地址可留空（例如 ``esa=``）。
    未设置时返回空元组，表示沿用内置的自建服务器默认批次。
    '''
    value = os.getenv(name, '').strip()
    if not value:
        return ()
    groups: list[tuple[str, tuple[str, ...]], ...] = []
    for chunk in value.split(';'):
        chunk = chunk.strip()
        if not chunk:
            continue
        label, _, servers = chunk.partition('=')
        label = label.strip() or 'direct'
        items = tuple(item.strip().rstrip('/') for item in servers.split('|') if item.strip())
        groups.append((label, items))
    return tuple(groups)


def _environment_trusted_keys(name: str) -> tuple[tuple[str, Path, str | None], ...]:
    '''解析额外的可信授权公钥。

    格式：``keyId:公钥文件路径:sha256|keyId2:路径:sha256``，sha256 可省略。
    '''
    value = os.getenv(name, '').strip()
    if not value:
        return ()
    entries: list[tuple[str, Path, str | None]] = []
    for chunk in value.split('|'):
        parts = [part.strip() for part in chunk.split(':')]
        if len(parts) < 2 or not parts[0] or not parts[1]:
            continue
        fingerprint = parts[2] if len(parts) > 2 and parts[2] else None
        entries.append((parts[0], Path(parts[1]).expanduser().resolve(), fingerprint))
    return tuple(entries)


@dataclass(frozen=True)
class Settings:
    data_dir: Path
    project_root: Path = PROJECT_ROOT
    app_base_url: str = ''
    session_max_age_seconds: int = 28800
    cookie_secure: bool = False
    update_checks_enabled: bool = False
    update_channel: str = 'docker'
    cookie_name: str = 'ha_bridge_session'
    display_cookie_name: str = 'ha_bridge_display'
    display_cookie_max_age_seconds: int = 315360000
    ha_request_timeout_seconds: float = 10
    ha_reconcile_interval_seconds: int = 1800
    ha_websocket_max_size_bytes: int = 67108864
    license_required: bool = False
    license_server_url: str = SELF_HOSTED_LICENSE_SERVER_URL
    license_server_batches: tuple[tuple[str, tuple[str, ...]], ...] = DEFAULT_LICENSE_SERVER_BATCHES
    license_request_timeout_seconds: float = 10
    license_clock_skew_seconds: int = 300
    license_public_key_path_override: Path | None = None
    license_public_key_sha256: str | None = None
    license_legacy_key_id: str = DEFAULT_LICENSE_KEY_ID
    license_trusted_public_keys_override: tuple[tuple[str, Path, str | None], ...] = ()
    license_transport_public_key_path_override: Path | None = None
    license_transport_public_key_sha256: str = DEFAULT_LICENSE_TRANSPORT_PUBLIC_KEY_SHA256
    license_transport_key_id: str = DEFAULT_LICENSE_TRANSPORT_KEY_ID
    hardware_machine_id_override: str = ''
    hardware_board_id_override: str = ''
    credential_key_path_override: Path | None = None
    display_pairing_key_path_override: Path | None = None
    license_secret_key_path_override: Path | None = None

    @property
    def database_path(self) -> Path:
        return self.data_dir / 'app.db'

    @property
    def database_url(self) -> str:
        return f'sqlite:///{self.database_path}'

    @property
    def admin_account_path(self) -> Path:
        return self.data_dir / 'admin-account.json'

    @property
    def frontend_dir(self) -> Path:
        return self.project_root / 'frontend'

    @property
    def built_in_assets_dir(self) -> Path:
        return self.project_root / 'image'

    @property
    def user_assets_dir(self) -> Path:
        return self.data_dir / 'assets'

    @property
    def studio3d_dir(self) -> Path:
        return self.data_dir / 'studio3d'

    @property
    def studio3d_draft_path(self) -> Path:
        return self.studio3d_dir / 'draft.json'

    @property
    def studio3d_exports_dir(self) -> Path:
        return self.data_dir / 'exports'

    @property
    def effect_variants_dir(self) -> Path:
        return self.data_dir / 'cache' / 'effect-variants'

    @property
    def secrets_dir(self) -> Path:
        return self.data_dir / 'secrets'

    @property
    def credential_key_path(self) -> Path:
        return self.credential_key_path_override or self.secrets_dir / 'ha_credentials.key'

    @property
    def display_pairing_key_path(self) -> Path:
        return self.display_pairing_key_path_override or self.secrets_dir / 'display_pairing_codes.key'

    @property
    def license_secret_key_path(self) -> Path:
        return self.license_secret_key_path_override or self.secrets_dir / 'license_credentials.key'

    @property
    def instance_id_path(self) -> Path:
        return self.data_dir / 'instance-id'

    @property
    def hardware_fallback_id_path(self) -> Path:
        return self.data_dir / 'hardware-fallback-id'

    @property
    def license_public_key_path(self) -> Path:
        return self.license_public_key_path_override or self.project_root / 'keys' / DEFAULT_LICENSE_PUBLIC_KEY_FILENAME

    @property
    def license_transport_public_key_path(self) -> Path:
        return self.license_transport_public_key_path_override or self.project_root / 'keys' / DEFAULT_LICENSE_TRANSPORT_PUBLIC_KEY_FILENAME

    @property
    def license_trusted_public_keys(self) -> dict[str, tuple[Path, str | None]]:
        if self.license_trusted_public_keys_override:
            return {key_id: (path, expected_sha256) for key_id, path, expected_sha256 in self.license_trusted_public_keys_override}
        if self.license_public_key_path_override is not None:
            return {self.license_legacy_key_id: (self.license_public_key_path_override, self.license_public_key_sha256)}
        return {key_id: (self.project_root / 'keys' / filename, expected_sha256) for key_id, filename, expected_sha256 in DEFAULT_LICENSE_TRUSTED_PUBLIC_KEYS}

    @property
    def effective_license_server_batches(self) -> tuple[tuple[str, tuple[str, ...]], ...]:
        if self.license_server_batches:
            return self.license_server_batches
        if self.license_server_url:
            return (('esa', ()), ('eo', ()), ('direct', (self.license_server_url,)))
        return (('esa', ()), ('eo', ()), ('direct', ()))

    @property
    def version(self) -> str:
        return (self.project_root / 'VERSION').read_text(encoding='utf-8').strip()


def load_settings() -> Settings:
    data_dir = Path(os.getenv('APP_DATA_DIR', PROJECT_ROOT / 'data')).expanduser().resolve()
    ha_key_path = os.getenv('APP_HA_CREDENTIAL_FILE', '').strip()
    display_pairing_key_path = os.getenv('APP_DISPLAY_PAIRING_KEY_FILE', '').strip()
    license_key_path = os.getenv('APP_LICENSE_CREDENTIAL_FILE', '').strip()

    # 授权服务器指向：默认即项目自带的自建授权服务器（store/，18082）；
    # 只给 URL 时自动收敛成单条 direct 批次，避免把请求散到其它批次节点。
    custom_license_url = os.getenv('APP_LICENSE_SERVER_URL', '').strip().rstrip('/')
    custom_license_batches = _environment_batches('APP_LICENSE_SERVER_BATCHES')
    if custom_license_batches:
        license_batches = custom_license_batches
    elif custom_license_url:
        license_batches = (('direct', (custom_license_url,)),)
    else:
        license_batches = DEFAULT_LICENSE_SERVER_BATCHES

    return Settings(**{
        'data_dir': data_dir,
        'app_base_url': os.getenv('APP_BASE_URL', '').strip().rstrip('/'),
        'session_max_age_seconds': int(os.getenv('APP_SESSION_MAX_AGE_SECONDS', '28800')),
        'cookie_secure': _environment_bool('APP_COOKIE_SECURE'),
        'update_checks_enabled': True,
        'update_channel': os.getenv('APP_UPDATE_CHANNEL', 'docker').strip().lower(),
        'ha_request_timeout_seconds': float(os.getenv('APP_HA_REQUEST_TIMEOUT_SECONDS', '10')),
        'ha_reconcile_interval_seconds': int(os.getenv('APP_HA_RECONCILE_INTERVAL_SECONDS', '1800')),
        'ha_websocket_max_size_bytes': int(os.getenv('APP_HA_WEBSOCKET_MAX_SIZE_BYTES', str(67108864))),
        'license_required': True,
        'license_server_url': custom_license_url or SELF_HOSTED_LICENSE_SERVER_URL,
        'license_server_batches': license_batches,
        'license_request_timeout_seconds': float(os.getenv('APP_LICENSE_REQUEST_TIMEOUT_SECONDS', '10')),
        'license_public_key_path_override': _environment_path('APP_LICENSE_PUBLIC_KEY_FILE'),
        'license_public_key_sha256': os.getenv('APP_LICENSE_PUBLIC_KEY_SHA256', '').strip() or DEFAULT_LICENSE_PUBLIC_KEY_SHA256,
        'license_legacy_key_id': os.getenv('APP_LICENSE_KEY_ID', '').strip() or DEFAULT_LICENSE_KEY_ID,
        'license_trusted_public_keys_override': _environment_trusted_keys('APP_LICENSE_TRUSTED_PUBLIC_KEYS'),
        'license_transport_public_key_path_override': _environment_path('APP_LICENSE_TRANSPORT_PUBLIC_KEY_FILE'),
        'license_transport_public_key_sha256': os.getenv('APP_LICENSE_TRANSPORT_PUBLIC_KEY_SHA256', '').strip() or DEFAULT_LICENSE_TRANSPORT_PUBLIC_KEY_SHA256,
        'license_transport_key_id': os.getenv('APP_LICENSE_TRANSPORT_KEY_ID', '').strip() or DEFAULT_LICENSE_TRANSPORT_KEY_ID,
        'credential_key_path_override': Path(ha_key_path).expanduser().resolve() if ha_key_path else None,
        'display_pairing_key_path_override': Path(display_pairing_key_path).expanduser().resolve() if display_pairing_key_path else None,
        'license_secret_key_path_override': Path(license_key_path).expanduser().resolve() if license_key_path else None,
    })
