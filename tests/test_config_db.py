from __future__ import annotations

from config import load_settings


def test_load_settings_reads_version_once():
    settings = load_settings()
    assert settings.version
    assert settings.display_cookie_max_age_seconds == 15552000
    assert settings.license_clock_skew_seconds == 300


def test_database_uses_null_pool():
    from database import Database
    from sqlalchemy.pool import NullPool

    database = Database('sqlite:///:memory:')
    assert database.engine.pool.__class__ is NullPool
    database.dispose()
