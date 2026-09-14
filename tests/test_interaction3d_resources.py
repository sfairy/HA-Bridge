from __future__ import annotations

from modules.interaction3d.api import interaction3d_resource_types


def test_interaction3d_resource_scan_includes_stage():
    from pathlib import Path

    frontend = Path(__file__).resolve().parents[1] / 'frontend'
    resources = interaction3d_resource_types(frontend)
    assert resources.get('stage.js') == 'text/javascript'
    assert resources.get('stage.css') == 'text/css'
    assert resources.get('stage-control-queue.js') == 'text/javascript'
    assert 'not-a-real-file.exe' not in resources
