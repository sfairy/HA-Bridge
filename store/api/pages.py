"""页面路由、静态资源挂载、商品图与模拟收银台。

参考站是「同一个 HTML 外壳 + ``data-store-page`` 分页切换」的多页应用，
这里沿用同一套结构：所有页面路由返回同一份 ``store.html``，
由前端根据 ``location.pathname`` 显示对应分页。
"""

from __future__ import annotations

import json
import logging
from pathlib import Path

from fastapi import APIRouter, HTTPException, Request, status
from fastapi.responses import FileResponse, HTMLResponse
from sqlalchemy import select

from store import fulfill, site_settings as site_config
from store.deps import DbSession
from store.models import Order, Product
from store.security import utcnow
from store.serializers import order_payload

logger = logging.getLogger("store.pages")

router = APIRouter(tags=["pages"])


def _render_store_page(request: Request) -> HTMLResponse:
    templates: Path = request.app.state.settings.templates_dir
    template_path = templates / "store.html"
    if not template_path.exists():
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="商店页面模板缺失。",
        )
    html = template_path.read_text(encoding="utf-8")
    return HTMLResponse(html, headers={"Cache-Control": "no-store"})


def _home(request: Request) -> HTMLResponse:
    return _render_store_page(request)


router.add_api_route("/", _home, methods=["GET"], include_in_schema=False)
router.add_api_route("/products", _home, methods=["GET"], include_in_schema=False)
router.add_api_route("/item/{product_id}", _home, methods=["GET"], include_in_schema=False)
router.add_api_route(
    "/user/authentication/login", _home, methods=["GET"], include_in_schema=False
)
router.add_api_route(
    "/user/authentication/register", _home, methods=["GET"], include_in_schema=False
)
router.add_api_route(
    "/user/authentication/forget", _home, methods=["GET"], include_in_schema=False
)
router.add_api_route(
    "/user/dashboard/index", _home, methods=["GET"], include_in_schema=False
)
router.add_api_route("/user/index/query", _home, methods=["GET"], include_in_schema=False)
router.add_api_route("/user/referrals", _home, methods=["GET"], include_in_schema=False)


@router.get("/admin", include_in_schema=False)
def admin_page(request: Request) -> HTMLResponse:
    template_path: Path = request.app.state.settings.templates_dir / "admin.html"
    if not template_path.exists():
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="管理后台模板缺失。"
        )
    return HTMLResponse(
        template_path.read_text(encoding="utf-8"), headers={"Cache-Control": "no-store"}
    )


# --------------------------------------------------------------------------- #
# 商品图
# --------------------------------------------------------------------------- #
@router.get("/store/v1/product-images/{product_id}", include_in_schema=False)
def product_image(product_id: str, request: Request, session: DbSession) -> FileResponse:
    from store.models import ProductImage

    image = session.scalars(
        select(ProductImage).where(ProductImage.product_id == product_id)
    ).first()
    if image is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="商品图不存在。")
    folder: Path = request.app.state.settings.product_images_dir
    target = (folder / image.path).resolve()
    if not str(target).startswith(str(folder.resolve())) or not target.exists():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="商品图不存在。")
    return FileResponse(target, headers={"Cache-Control": "public, max-age=86400"})


# --------------------------------------------------------------------------- #
# 模拟收银台
# --------------------------------------------------------------------------- #
def _cashier_html(order: Order, product: Product | None) -> str:
    payload = order_payload(order)
    amount = payload["amountCents"] / 100
    safe = json.dumps(payload, ensure_ascii=False)
    return f"""<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>模拟收银台 · {payload['orderNo']}</title>
<link rel="stylesheet" href="/store-static/bootstrap.min.css">
<link rel="stylesheet" href="/store-static/theme.css?v=20260915153337">
<link rel="icon" href="/store-static/favicon-rounded.png">
<style>
  /* 统一主题已在 theme.css 里给出暗色画布与 Bootstrap 皮肤，
     这里只保留收银台自己的版式与「仅本地联调」角标。 */
  .cashier {{ max-width: 460px; margin: 8vh auto; }}
  .cashier .badge-mock {{ border: 1px solid var(--hb-accent-line); background: var(--hb-accent-soft); color: var(--hb-accent-bright); border-radius: 999px; padding: 2px 10px; font-size: 12px; font-weight: 650; }}
  .cashier .amount {{ color: var(--hb-accent-bright); font-size: 34px; font-weight: 700; font-family: var(--hb-font-mono); }}
  .cashier .meta dt {{ color: var(--hb-muted); font-weight: 500; }}
</style>
</head>
<body>
<div class="cashier">
  <div class="card shadow-sm">
    <div class="card-body p-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="mb-0">模拟收银台</h5>
        <span class="badge-mock">仅本地联调</span>
      </div>
      <div class="amount mb-1">¥{amount:.2f}</div>
      <div class="text-muted mb-3">{payload['productName']}</div>
      <dl class="row meta small mb-3">
        <dt class="col-4">订单号</dt><dd class="col-8 text-break">{payload['orderNo']}</dd>
        <dt class="col-4">下单邮箱</dt><dd class="col-8 text-break">{payload['email']}</dd>
        <dt class="col-4">状态</dt><dd class="col-8">{payload['status']}</dd>
      </dl>
      <div id="cashier-message" class="alert alert-secondary py-2 small mb-3">确认支付后将立即发码，请勿关闭本页。</div>
      <div class="d-flex gap-2">
        <button id="cashier-confirm" class="btn btn-primary flex-grow-1">确认支付</button>
        <button id="cashier-cancel" class="btn btn-outline-secondary">取消订单</button>
      </div>
      <a class="btn btn-link w-100 mt-2" href="/user/dashboard/index">返回账号中心</a>
    </div>
  </div>
</div>
<script>
const ORDER = {safe};
const message = document.getElementById('cashier-message');
const confirmButton = document.getElementById('cashier-confirm');
const cancelButton = document.getElementById('cashier-cancel');
async function act(action) {{
  confirmButton.disabled = true; cancelButton.disabled = true;
  try {{
    const response = await fetch(`/store/v1/orders/${{ORDER.orderNo}}/mock/${{action}}`, {{
      method: 'POST', headers: {{ 'Content-Type': 'application/json' }},
      body: JSON.stringify({{ orderToken: ORDER.lookupToken }}),
    }});
    const body = await response.json().catch(() => ({{}}));
    if (!response.ok) throw new Error(body.detail || '操作失败。');
    message.className = 'alert alert-success py-2 small mb-3';
    message.textContent = action === 'pay' ? '支付成功，正在前往账号中心…' : '订单已取消。';
    setTimeout(() => {{ location.href = '/user/dashboard/index'; }}, 700);
  }} catch (error) {{
    message.className = 'alert alert-danger py-2 small mb-3';
    message.textContent = error.message;
    confirmButton.disabled = false; cancelButton.disabled = false;
  }}
}}
confirmButton.addEventListener('click', () => act('pay'));
cancelButton.addEventListener('click', () => act('cancel'));
</script>
</body>
</html>
"""


@router.get("/store/mock/pay/{order_no}", include_in_schema=False)
def mock_cashier(order_no: str, request: Request, session: DbSession) -> HTMLResponse:
    order = session.scalars(select(Order).where(Order.order_no == order_no)).first()
    if order is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="订单不存在。")
    product = session.get(Product, order.product_id) if order.product_id else None
    return HTMLResponse(_cashier_html(order, product), headers={"Cache-Control": "no-store"})


def _order_or_404(session, order_no: str) -> Order:
    order = session.scalars(select(Order).where(Order.order_no == order_no)).first()
    if order is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="订单不存在。")
    return order


def _authorize_mock(order: Order, order_token: str | None) -> None:
    if not order_token or order_token != order.lookup_token:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="订单凭证不正确。")


@router.post("/store/v1/orders/{order_no}/mock/pay", include_in_schema=False)
def mock_pay(order_no: str, request: Request, session: DbSession, payload: dict | None = None) -> dict:
    _ensure_mock_provider(request, session)
    order = _order_or_404(session, order_no)
    token = (payload or {}).get("orderToken") or request.headers.get("x-order-token")
    _authorize_mock(order, token)
    setting = site_config.get_setting(session)

    if order.status == "fulfilled":
        return order_payload(order)
    if order.status in {"expired", "cancelled"}:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="订单已关闭，请重新下单。")

    order.status = "paid"
    order.paid_at = order.paid_at or utcnow()
    order.payment_trade_no = order.payment_trade_no or f"MOCK{order.order_no[-10:]}"
    session.flush()

    # 手动发卡商品只标记已支付，等待管理员发码
    if order.fulfillment_mode != "manual":
        fulfill.fulfill_order(session, order=order, setting=setting)
    session.refresh(order)
    logger.info("模拟支付成功 order=%s status=%s", order.order_no, order.status)
    return order_payload(order)


@router.post("/store/v1/orders/{order_no}/mock/cancel", include_in_schema=False)
def mock_cancel(order_no: str, request: Request, session: DbSession, payload: dict | None = None) -> dict:
    _ensure_mock_provider(request, session)
    order = _order_or_404(session, order_no)
    token = (payload or {}).get("orderToken") or request.headers.get("x-order-token")
    _authorize_mock(order, token)
    if order.status != "pending":
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="只有待支付订单可以取消。")
    product = session.get(Product, order.product_id) if order.product_id else None
    order.status = "cancelled"
    order.cancelled_at = utcnow()
    fulfill.release_reserved_stock(session, product, 1)
    session.flush()
    session.refresh(order)
    return order_payload(order)


def _ensure_mock_provider(request: Request, session) -> None:
    provider = request.app.state.resolve_payment_provider(site_config.get_setting(session))
    if getattr(provider, "name", "") != "mock":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="当前支付渠道不是模拟支付，该端点不可用。",
        )
