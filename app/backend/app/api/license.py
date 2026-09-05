from __future__ import annotations

from fastapi import APIRouter, HTTPException, Request, status

from dependencies import CurrentUser
from license import LicenseClientError
from schemas import LicenseActivateRequest

router = APIRouter(prefix='/license', tags=['license'])


@router.get('/status')
def license_status(request: Request, _user: CurrentUser) -> dict:
    return request.app.state.license_service.status()


@router.post('/activate')
async def activate_license(
    payload: LicenseActivateRequest,
    request: Request,
    _user: CurrentUser,
) -> dict:
    try:
        return await request.app.state.license_service.activate(
            payload.activation_code,
            payload.email,
        )
    except LicenseClientError as error:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail=str(error),
        ) from error
