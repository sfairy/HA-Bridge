# Contributing to HA Bridge

## Local setup

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt -r requirements-dev.txt
python start.py
```

App: `http://127.0.0.1:18081` · License store: `http://127.0.0.1:18082`

## Checks before opening a PR

```bash
ruff check backend/app register start.py container_entrypoint.py tests
pytest -q
bash scripts/check-js.sh
```

## Version / release sync

When bumping a release, keep these aligned:

1. [`VERSION`](VERSION)
2. [`pyproject.toml`](pyproject.toml) `[project].version`
3. HTML `<meta name="ha-bridge-release">` and any visible version labels
4. Frontend cache-bust query strings (`?v=`), which should equal the `VERSION` value (e.g. `?v=0.5.3`)
5. [`release-manifest.json`](release-manifest.json) `version` / `releaseId` / artifact hashes
6. [`sbom.cdx.json`](sbom.cdx.json) metadata component version (and regenerate component pins when deps change)

## Frontend notes

- Do not edit `frontend/static/vendor/`.
- Keep Chinese UI copy.
- `frontend/modules/interaction3d/` is license-gated stage runtime; `frontend/static/modules/interaction3d/` is editor/bridge helpers; `frontend/static/3d-studio/` is the shared studio engine.
- Prefer clear identifier names; avoid 1–2 letter bindings and meaningless `Current` suffixes.

## Backend notes

- Imports are flat via `PYTHONPATH=backend/app` (see `start.py`). Do not switch to `backend.app.*` package imports in migrations.
- Prefer `asyncio.to_thread` for SQLite / license crypto on request paths.
