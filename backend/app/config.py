from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]
PRODUCTION_LICENSE_SERVER_URL = 'https://hbjh1.habridge.cn'
PRODUCTION_LICENSE_ESA_SERVERS = ('https://hbjheas1.onestrm.cn', 'https://hbjheas2.onestrm.cn')
PRODUCTION_LICENSE_EO_SERVERS = ('https://hbjheo1.onestrm.cn', 'https://hbjheo2.onestrm.cn')
PRODUCTION_LICENSE_DIRECT_SERVERS = (PRODUCTION_LICENSE_SERVER_URL, 'https://hbjh2.habridge.cn')
PRODUCTION_LICENSE_SERVER_BATCHES = (
    ('esa', PRODUCTION_LICENSE_ESA_SERVERS),
    ('eo', PRODUCTION_LICENSE_EO_SERVERS),
    ('direct', PRODUCTION_LICENSE_DIRECT_SERVERS),
)
PRODUCTION_LICENSE_CURRENT_KEY_ID = 'hb-2026-01'
PRODUCTION_LICENSE_PUBLIC_KEY_SHA256 = '56ad5028f6a48378b2475be119bed0dc912d317c399b94726e7ba43c3c8beab7'
PRODUCTION_LICENSE_TRANSPORT_KEY_ID = 'hb-transport-2026-01'
PRODUCTION_LICENSE_TRANSPORT_PUBLIC_KEY_SHA256 = '5b9856b097de0fecb3699a4fae7c698de1cfbe60046e7658f345c1e95c6018d8'
PRODUCTION_LICENSE_TRUSTED_PUBLIC_KEYS = (
    (PRODUCTION_LICENSE_CURRENT_KEY_ID, 'license-public.pem', PRODUCTION_LICENSE_PUBLIC_KEY_SHA256),
)


def _environment_bool(name: str, default: bool = False) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in frozenset({'1', 'on', 'yes', 'true'})


@dataclass(frozen=True)
class Settings:
    data_dir: Path
    project_root: Path = PROJECT_ROOT
    app_base_url: str = ''
    session_max_age_seconds: int = 28800
    cookie_secure: bool = False
    cookie_name: str = 'ha_bridge_session'
    display_cookie_name: str = 'ha_bridge_display'
    display_cookie_max_age_seconds: int = 315360000
    ha_request_timeout_seconds: float = 10
    ha_reconcile_interval_seconds: int = 1800
    ha_websocket_max_size_bytes: int = 67108864
    license_required: bool = True
    license_server_url: str = PRODUCTION_LICENSE_SERVER_URL
    license_server_batches: tuple[tuple[str, tuple[str, ...]], ...] = ()
    license_request_timeout_seconds: float = 10
    license_clock_skew_seconds: int = 300
    license_public_key_path_override: Path | None = None
    license_public_key_sha256: str | None = None
    license_legacy_key_id: str = PRODUCTION_LICENSE_CURRENT_KEY_ID
    license_trusted_public_keys_override: tuple[tuple[str, Path, str | None], ...] = ()
    license_transport_public_key_path_override: Path | None = None
    license_transport_public_key_sha256: str = PRODUCTION_LICENSE_TRANSPORT_PUBLIC_KEY_SHA256
    license_transport_key_id: str = PRODUCTION_LICENSE_TRANSPORT_KEY_ID
    hardware_machine_id_override: str = ''
    hardware_board_id_override: str = ''
    credential_key_path_override: Path | None = None
    display_pairing_key_path_override: Path | None = None
    license_secret_key_path_override: Path | None = None
    license_store_url: str = 'http://127.0.0.1:18082'

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
        return self.credential_key_path_override or (self.secrets_dir / 'ha_credentials.key')

    @property
    def display_pairing_key_path(self) -> Path:
        return self.display_pairing_key_path_override or (self.secrets_dir / 'display_pairing_codes.key')

    @property
    def license_secret_key_path(self) -> Path:
        return self.license_secret_key_path_override or (self.secrets_dir / 'license_credentials.key')

    @property
    def instance_id_path(self) -> Path:
        return self.data_dir / 'instance-id'

    @property
    def hardware_fallback_id_path(self) -> Path:
        return self.data_dir / 'hardware-fallback-id'

    @property
    def license_public_key_path(self) -> Path:
        return self.license_public_key_path_override or (self.project_root / 'keys' / 'license-public.pem')

    @property
    def license_transport_public_key_path(self) -> Path:
        return self.license_transport_public_key_path_override or (
            self.project_root / 'keys' / 'license-transport-public.pem'
        )

    @property
    def license_trusted_public_keys(self) -> dict[str, tuple[Path, str | None]]:
        if self.license_trusted_public_keys_override:
            return {
                key_id: (path, expected_sha256)
                for key_id, path, expected_sha256 in self.license_trusted_public_keys_override
            }
        if self.license_public_key_path_override is not None:
            return {
                self.license_legacy_key_id: (
                    self.license_public_key_path_override,
                    self.license_public_key_sha256,
                )
            }
        return {
            key_id: (self.project_root / 'keys' / filename, expected_sha256)
            for key_id, filename, expected_sha256 in PRODUCTION_LICENSE_TRUSTED_PUBLIC_KEYS
        }

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
    return Settings(
        data_dir=data_dir,
        app_base_url=os.getenv('APP_BASE_URL', '').strip().rstrip('/'),
        session_max_age_seconds=int(os.getenv('APP_SESSION_MAX_AGE_SECONDS', '28800')),
        cookie_secure=_environment_bool('APP_COOKIE_SECURE'),
        ha_request_timeout_seconds=float(os.getenv('APP_HA_REQUEST_TIMEOUT_SECONDS', '10')),
        ha_reconcile_interval_seconds=int(os.getenv('APP_HA_RECONCILE_INTERVAL_SECONDS', '1800')),
        ha_websocket_max_size_bytes=int(os.getenv('APP_HA_WEBSOCKET_MAX_SIZE_BYTES', str(67108864))),
        license_required=True,
        license_server_url=PRODUCTION_LICENSE_SERVER_URL,
        license_server_batches=PRODUCTION_LICENSE_SERVER_BATCHES,
        license_request_timeout_seconds=float(os.getenv('APP_LICENSE_REQUEST_TIMEOUT_SECONDS', '10')),
        license_public_key_sha256=PRODUCTION_LICENSE_PUBLIC_KEY_SHA256,
        license_legacy_key_id=PRODUCTION_LICENSE_CURRENT_KEY_ID,
        license_transport_public_key_sha256=PRODUCTION_LICENSE_TRANSPORT_PUBLIC_KEY_SHA256,
        license_transport_key_id=PRODUCTION_LICENSE_TRANSPORT_KEY_ID,
        credential_key_path_override=Path(ha_key_path).expanduser().resolve() if ha_key_path else None,
        display_pairing_key_path_override=(
            Path(display_pairing_key_path).expanduser().resolve() if display_pairing_key_path else None
        ),
        license_secret_key_path_override=Path(license_key_path).expanduser().resolve() if license_key_path else None,
        license_store_url=os.getenv('APP_LICENSE_STORE_URL', 'http://127.0.0.1:18082').strip().rstrip('/'),
    )
