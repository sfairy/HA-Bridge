from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]


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
    license_request_timeout_seconds: float = 10
    license_clock_skew_seconds: int = 300
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
        license_request_timeout_seconds=float(os.getenv('APP_LICENSE_REQUEST_TIMEOUT_SECONDS', '10')),
        credential_key_path_override=Path(ha_key_path).expanduser().resolve() if ha_key_path else None,
        display_pairing_key_path_override=(
            Path(display_pairing_key_path).expanduser().resolve() if display_pairing_key_path else None
        ),
        license_secret_key_path_override=Path(license_key_path).expanduser().resolve() if license_key_path else None,
        license_store_url=os.getenv('APP_LICENSE_STORE_URL', 'http://127.0.0.1:18082').strip().rstrip('/'),
    )
