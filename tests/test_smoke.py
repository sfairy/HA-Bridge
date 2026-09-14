from __future__ import annotations


def test_backend_imports():
    import config  # noqa: F401
    from modules.interaction3d.config import PROPERTY_KEYS

    assert 'sceneId' in PROPERTY_KEYS
    assert 'lights' in PROPERTY_KEYS


def test_version_file_readable():
    from pathlib import Path

    version = (Path(__file__).resolve().parents[1] / 'VERSION').read_text(encoding='utf-8').strip()
    assert version
