from __future__ import annotations

from pathlib import Path

from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

try:
    from issuer import public_key_payload, sign_lease
    from store import bind_order, create_order, find_order, get_order, list_orders
except ImportError:
    from register.issuer import public_key_payload, sign_lease
    from register.store import bind_order, create_order, find_order, get_order, list_orders

REGISTER_ROOT = Path(__file__).resolve().parent
PROJECT_ROOT = REGISTER_ROOT.parent
PAGES_DIR = REGISTER_ROOT / 'pages'
STATIC_DIR = REGISTER_ROOT / 'static'
FRONTEND_STATIC = PROJECT_ROOT / 'frontend' / 'static'
DATA_DIR = Path(__import__('os').environ.get('REGISTER_DATA_DIR', REGISTER_ROOT / 'data'))
DATABASE_PATH = DATA_DIR / 'license-store.db'


class RegisterRequest(BaseModel):
    email: str = Field(min_length=3, max_length=255)
    contact_name: str = Field(default='', alias='contactName', max_length=64)


class StoreActivateRequest(BaseModel):
    email: str = Field(min_length=3, max_length=255)
    activation_code: str = Field(alias='activationCode', min_length=8, max_length=128)
    instance_id: str = Field(alias='instanceId', min_length=16, max_length=64)
    product: str = 'ha-bridge'


app = FastAPI(title='HA Bridge License Store', docs_url=None, redoc_url=None)
app.mount('/store-static', StaticFiles(directory=STATIC_DIR), name='store-static')
app.mount('/bridge-static', StaticFiles(directory=FRONTEND_STATIC), name='bridge-static')


@app.get('/health/live', include_in_schema=False)
def health_live() -> dict[str, str]:
    return {'status': 'ok', 'service': 'license-store'}


@app.get('/', include_in_schema=False)
def register_page() -> FileResponse:
    return FileResponse(PAGES_DIR / 'register.html')


@app.get('/lookup', include_in_schema=False)
def lookup_page() -> FileResponse:
    return FileResponse(PAGES_DIR / 'lookup.html')


@app.get('/issued/{order_id}', include_in_schema=False)
def issued_page(order_id: str) -> FileResponse:
    if get_order(DATABASE_PATH, order_id) is None:
        raise HTTPException(status_code=404, detail='未找到该授权订单。')
    return FileResponse(PAGES_DIR / 'issued.html')


@app.post('/api/v1/store/register')
def register_license(body: RegisterRequest) -> dict:
    try:
        order = create_order(DATABASE_PATH, email=body.email, contact_name=body.contact_name)
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error)) from error
    return order.payload()


@app.get('/api/v1/store/orders/{order_id}')
def read_order(order_id: str) -> dict:
    order = get_order(DATABASE_PATH, order_id)
    if order is None:
        raise HTTPException(status_code=404, detail='未找到该授权订单。')
    return order.payload()


@app.get('/api/v1/store/public-key')
def read_public_key() -> dict:
    return public_key_payload(DATA_DIR)


@app.post('/api/v1/store/activate')
def activate_store_license(body: StoreActivateRequest) -> dict:
    if body.product != 'ha-bridge':
        raise HTTPException(status_code=422, detail='商品标识不匹配。')
    order = find_order(DATABASE_PATH, email=body.email, activation_code=body.activation_code)
    if order is None:
        raise HTTPException(status_code=422, detail='激活码无效或已停用。')
    try:
        sequence = bind_order(DATABASE_PATH, order.id, body.instance_id)
        return sign_lease(
            DATA_DIR,
            order_id=order.id,
            instance_id=body.instance_id,
            lease_sequence=sequence,
        )
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error)) from error


@app.get('/api/v1/store/orders')
def search_orders(email: str = Query(min_length=3, max_length=255)) -> dict:
    try:
        orders = list_orders(DATABASE_PATH, email)
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error)) from error
    return {'email': email.strip().lower(), 'orders': [item.payload() for item in orders]}
