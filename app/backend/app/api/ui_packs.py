from __future__ import annotations

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import FileResponse

from dependencies import LicensedViewer
from ui_packs import DEFAULT_UI_PACK_ID, UI_PACKS, require_ui_pack_access

router = APIRouter(prefix='/ui-packs', tags=['ui-packs'])


@router.get('')
def list_ui_packs(request: Request, _viewer: LicensedViewer) -> dict:
    items = [
        item.payload(allowed=request.app.state.license_service.allows(item.feature_code))
        for item in UI_PACKS
    ]
    return {
        'items': items,
        'defaultId': DEFAULT_UI_PACK_ID,
        'assetLibrary': {
            'status': 'available',
            'userUploads': True,
            'advancedCatalog': 'planned',
        },
    }


@router.get('/{ui_pack_id}/runtime.js')
def read_ui_pack_runtime(
    ui_pack_id: str,
    request: Request,
    _viewer: LicensedViewer,
) -> FileResponse:
    ui_pack = require_ui_pack_access(request, ui_pack_id)
    root = (request.app.state.settings.frontend_dir / 'ui-packs').resolve()
    path = (root / ui_pack.runtime_module).resolve()
    if not path.is_relative_to(root) or not path.is_file():
        raise HTTPException(status_code=404, detail='UI 方案运行时不存在。')
    response = FileResponse(path, media_type='text/javascript; charset=utf-8')
    response.headers['Cache-Control'] = 'private, no-cache'
    return response
