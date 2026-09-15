"""管理后台 API：``/store-admin/v1/*``。

参考站没有公开管理台，这里自建最小可用后台，让商店「可运营」：
商品、订单、激活码、设备绑定、优惠码、提现审核、站点配置、版本发布。
"""

from __future__ import annotations

import logging
import secrets
from datetime import timedelta

from fastapi import APIRouter, File, HTTPException, Request, UploadFile, status
from sqlalchemy import delete, func, or_, select

from store import fulfill, referrals, site_settings as site_config
from store.api.store import (
    _expire_stale_orders,
    _image_map,
    _license_meta,
    _product_stats,
)
from store.deps import AdminAccount, DbSession, SettingsDep
from store.models import (
    Account,
    AccountSession,
    AuditLog,
    Coupon,
    CouponRedemption,
    Customer,
    DeviceBinding,
    DeviceReleaseEvent,
    Entitlement,
    License,
    Order,
    Product,
    ProductImage,
    ReferralWallet,
    ReferralWithdrawal,
    Release,
    StoreSetting,
    utcnow,
)
from store.schemas import (
    AdminCouponPatch,
    AdminCouponRequest,
    AdminLicenseRequest,
    AdminOrderActionRequest,
    AdminProductPatch,
    AdminProductRequest,
    AdminReleaseRequest,
    AdminSettingsRequest,
    AdminWithdrawalResolveRequest,
)
from store.security import (
    activation_code_hint,
    iso,
    new_uuid,
    utcnow,
)  # noqa: F401
from store.serializers import (
    license_payload,
    list_json,
    order_payload,
    product_payload,
)

logger = logging.getLogger("store.admin")

router = APIRouter(prefix="/store-admin/v1", tags=["admin"])


def _audit(session, actor: str, action: str, target: str = "", detail: str = "") -> None:
    session.add(AuditLog(actor=actor, action=action, target=target, detail=detail))
    session.flush()


def _product_or_404(session, product_id: str) -> Product:
    product = session.get(Product, product_id)
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="商品不存在。")
    return product


def _order_or_404(session, order_no: str) -> Order:
    order = session.scalars(select(Order).where(Order.order_no == order_no)).first()
    if order is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="订单不存在。")
    return order


def _cooldown(setting: StoreSetting, settings: SettingsDep) -> int:
    return int(
        setting.device_release_cooldown_seconds
        if setting.device_release_cooldown_seconds is not None
        else settings.device_release_cooldown_seconds
    )


# --------------------------------------------------------------------------- #
# 概览
# --------------------------------------------------------------------------- #
@router.get("/overview")
def overview(session: DbSession, _admin: AdminAccount) -> dict:
    setting = site_config.get_setting(session)
    _expire_stale_orders(session, setting)
    moment = utcnow()

    def count(statement) -> int:
        return int(session.execute(statement).scalar_one() or 0)

    paid_total = count(
        select(func.coalesce(func.sum(Order.amount_cents), 0)).where(
            Order.status.in_(["fulfilled", "paid"])
        )
    )
    return {
        "accounts": count(select(func.count(Account.id))),
        "products": count(select(func.count(Product.id))),
        "licenses": count(select(func.count(License.id))),
        "activeLicenses": count(
            select(func.count(License.id)).where(License.active.is_(True))
        ),
        "pendingOrders": count(
            select(func.count(Order.id)).where(Order.status == "pending")
        ),
        "fulfilledOrders": count(
            select(func.count(Order.id)).where(Order.status == "fulfilled")
        ),
        "revenueCents": paid_total,
        "pendingWithdrawals": count(
            select(func.count(ReferralWithdrawal.id)).where(
                ReferralWithdrawal.status == "pending"
            )
        ),
        "deviceBindings": count(
            select(func.count(DeviceBinding.id)).where(DeviceBinding.active.is_(True))
        ),
        "serverTime": iso(moment),
        "maintenanceMode": bool(setting.maintenance_mode),
    }


# --------------------------------------------------------------------------- #
# 商品
# --------------------------------------------------------------------------- #
def _product_delete_refs(session) -> tuple[dict[str, int], dict[str, int]]:
    """统计每个商品被多少条授权 / 订单引用。

    这里的口径必须和 ``admin_delete_product`` 的守卫**完全一致**：不带
    ``active`` / ``status`` 过滤，因为守卫是「只要有任意一条引用就改为下架」。
    前台的 ``_product_stats`` 只数 fulfilled 订单和 active 授权，拿它当依据会让
    确认弹窗在「其实会被下架」的时候显示成「将被彻底删除」。
    """
    licenses = {
        product_id: int(count or 0)
        for product_id, count in session.execute(
            select(License.product_id, func.count(License.id)).group_by(License.product_id)
        ).all()
    }
    orders = {
        product_id: int(count or 0)
        for product_id, count in session.execute(
            select(Order.product_id, func.count(Order.id)).group_by(Order.product_id)
        ).all()
    }
    return licenses, orders


def _admin_product_context(session) -> dict:
    """一次性查出列表渲染所需的所有辅助数据，避免逐行 N+1。"""
    licenses, orders = _product_delete_refs(session)
    return {
        "stats": _product_stats(session),
        "images": _image_map(session),
        "bundled": {item.id: item for item in session.scalars(select(Product))},
        "licenses": licenses,
        "orders": orders,
    }


def _product_admin_payload(session, product: Product, context: dict | None = None) -> dict:
    context = context or _admin_product_context(session)
    payload = product_payload(
        product,
        context["images"].get(product.id),
        bundled=context["bundled"],
        customer_count=int(context["stats"]["customer"].get(product.id, 0)),
        purchase_count=int(context["stats"]["purchase"].get(product.id, 0)),
    )
    # 后台比前台多几个运营字段
    payload["originalPriceCents"] = product.original_price_cents
    payload["requiresLicense"] = bool(product.requires_license)
    # 把删除守卫的判定依据原样交给前端，确认弹窗才能如实预告「真删」还是「下架」
    payload["licenseCount"] = int(context["licenses"].get(product.id, 0))
    payload["orderCount"] = int(context["orders"].get(product.id, 0))
    return payload


@router.get("/products")
def admin_list_products(session: DbSession, _admin: AdminAccount) -> dict:
    context = _admin_product_context(session)
    products = session.scalars(
        select(Product).order_by(Product.sort_order, Product.created_at)
    )
    return {"items": [_product_admin_payload(session, product, context) for product in products]}


@router.post("/products")
def admin_create_product(
    payload: AdminProductRequest, session: DbSession, admin: AdminAccount
) -> dict:
    product = Product(
        name=payload.name,
        product_code=payload.product_code or "ha-bridge",
        price_cents=payload.price_cents,
        original_price_cents=payload.original_price_cents,
        is_full_price=payload.is_full_price,
        validity_days=payload.validity_days,
        product_type=payload.product_type,
        feature_codes_json=list_json(payload.feature_codes),
        included_product_ids_json=list_json(payload.included_product_ids),
        package_contents_locked=payload.package_contents_locked,
        active=payload.active,
        note=payload.note,
        display_description=payload.display_description,
        badge_text=payload.badge_text,
        featured=payload.featured,
        sort_order=payload.sort_order,
        fulfillment_mode=payload.fulfillment_mode,
        stock_quantity=payload.stock_quantity,
        requires_license=payload.requires_license,
    )
    session.add(product)
    session.flush()
    _audit(session, admin.email, "product.create", product.id, product.name)
    return _product_admin_payload(session, product)


@router.patch("/products/{product_id}")
def admin_update_product(
    product_id: str, payload: AdminProductPatch, session: DbSession, admin: AdminAccount
) -> dict:
    product = _product_or_404(session, product_id)
    mapping = {
        "name": "name",
        "product_code": "product_code",
        "price_cents": "price_cents",
        "original_price_cents": "original_price_cents",
        "is_full_price": "is_full_price",
        "validity_days": "validity_days",
        "product_type": "product_type",
        "package_contents_locked": "package_contents_locked",
        "active": "active",
        "note": "note",
        "display_description": "display_description",
        "badge_text": "badge_text",
        "featured": "featured",
        "sort_order": "sort_order",
        "fulfillment_mode": "fulfillment_mode",
        "stock_quantity": "stock_quantity",
        "requires_license": "requires_license",
    }
    data = payload.model_dump(exclude_unset=True)
    for field, column in mapping.items():
        if field in data:
            setattr(product, column, data[field])
    if "feature_codes" in data:
        product.feature_codes_json = list_json(data["feature_codes"] or [])
    if "included_product_ids" in data:
        product.included_product_ids_json = list_json(data["included_product_ids"] or [])
    session.flush()
    _audit(session, admin.email, "product.update", product.id)
    return _product_admin_payload(session, product)


@router.delete("/products/{product_id}")
def admin_delete_product(
    product_id: str, session: DbSession, admin: AdminAccount, settings: SettingsDep
) -> dict:
    product = _product_or_404(session, product_id)

    # 有历史授权或订单的商品只下架，不做物理删除，避免历史数据悬空。
    # 注意 Order.product_id 是 NOT NULL 外键且没有 ondelete，而 SQLite 连接上开了
    # foreign_keys=ON，所以只要有订单引用该商品，物理删除就会撞 FK 约束直接 500。
    # 计数复用 _product_delete_refs，保证和列表接口暴露给前端的 licenseCount /
    # orderCount 是同一套口径，确认弹窗的预告不会和实际结果打架。
    license_counts, order_counts = _product_delete_refs(session)
    license_count = int(license_counts.get(product.id, 0))
    order_count = int(order_counts.get(product.id, 0))

    if license_count or order_count:
        product.active = False
        parts = []
        if license_count:
            parts.append(f"{license_count} 条授权")
        if order_count:
            parts.append(f"{order_count} 笔订单")
        reason = "、".join(parts) + "引用该商品，改为下架"
        session.flush()
        _audit(session, admin.email, "product.deactivate", product.id, reason)
        return {
            "id": product.id,
            "deleted": False,
            "deactivated": True,
            "licenses": license_count,
            "orders": order_count,
            "reason": reason,
        }

    # 物理删除：数据库里 product_images 是 ON DELETE CASCADE，但磁盘上的图片文件
    # 不会被连带清理，这里先把路径收集出来，删完行之后再把文件删掉。
    image_paths = [
        settings.product_images_dir / image.path
        for image in session.scalars(
            select(ProductImage).where(ProductImage.product_id == product.id)
        )
        if image.path
    ]

    session.delete(product)
    session.flush()
    for path in image_paths:
        try:
            path.unlink(missing_ok=True)
        except OSError:  # pragma: no cover - 文件被占用/权限问题时不该影响删除结果
            logger.warning("商品图文件删除失败：%s", path)

    _audit(session, admin.email, "product.delete", product.id, product.name)
    return {"id": product_id, "deleted": True, "deactivated": False}


@router.post("/products/{product_id}/image")
async def admin_upload_product_image(
    product_id: str,
    request: Request,
    session: DbSession,
    admin: AdminAccount,
    file: UploadFile = File(...),
) -> dict:
    product = _product_or_404(session, product_id)
    settings = request.app.state.settings
    suffix = ""
    if file.filename and "." in file.filename:
        suffix = "." + file.filename.rsplit(".", 1)[1].lower()[:8]
    if suffix not in {".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"}:
        suffix = ".png"
    folder = settings.product_images_dir
    folder.mkdir(parents=True, exist_ok=True)
    relative = f"{product.id}{suffix}"
    target = folder / relative
    content = await file.read()
    if len(content) > 8 * 1024 * 1024:
        raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="图片不能超过 8MB。")
    target.write_bytes(content)

    image = session.scalars(
        select(ProductImage).where(ProductImage.product_id == product.id)
    ).first()
    version = secrets.token_hex(6)
    if image is None:
        image = ProductImage(product_id=product.id, path=relative, version=version)
        session.add(image)
    else:
        image.path = relative
        image.version = version
    image.updated_at = utcnow()
    session.flush()
    _audit(session, admin.email, "product.image", product.id, relative)
    return {"id": product.id, "imageUrl": f"/store/v1/product-images/{product.id}?v={version}"}


# --------------------------------------------------------------------------- #
# 订单
# --------------------------------------------------------------------------- #
@router.get("/orders")
def admin_list_orders(
    session: DbSession,
    _admin: AdminAccount,
    status_filter: str | None = None,
    keyword: str | None = None,
    limit: int = 100,
) -> dict:
    setting = site_config.get_setting(session)
    _expire_stale_orders(session, setting)
    statement = select(Order).order_by(Order.created_at.desc()).limit(max(1, min(limit, 500)))
    if status_filter:
        statement = statement.where(Order.status == status_filter)
    if keyword:
        like = f"%{keyword.strip()}%"
        statement = statement.where(
            or_(Order.order_no.like(like), Order.email.like(like))
        )
    return {"items": [order_payload(order) for order in session.scalars(statement)]}


@router.post("/orders/{order_no}/mark-paid")
def admin_mark_paid(
    order_no: str, session: DbSession, admin: AdminAccount
) -> dict:
    setting = site_config.get_setting(session)
    order = _order_or_404(session, order_no)
    if order.status == "fulfilled":
        return order_payload(order)
    if order.status not in {"pending", "paid", "payment_failed"}:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"订单状态为 {order.status}，无法标记支付。")
    order.status = "paid"
    order.paid_at = utcnow()
    order.payment_provider = order.payment_provider or "manual"
    session.flush()
    _audit(session, admin.email, "order.mark_paid", order.order_no)
    # 支付确认后立即履约（发码 / 追加增量包 / 邀请奖励）
    fulfill.fulfill_order(session, order=order, setting=setting)
    session.refresh(order)
    return order_payload(order)


@router.post("/orders/{order_no}/fulfill")
def admin_fulfill(order_no: str, session: DbSession, admin: AdminAccount) -> dict:
    setting = site_config.get_setting(session)
    order = _order_or_404(session, order_no)
    if order.status == "expired":
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="订单已超时关闭，无法履约。")
    if order.status != "fulfilled" and order.paid_at is None:
        order.paid_at = utcnow()
    fulfill.fulfill_order(session, order=order, setting=setting)
    session.refresh(order)
    _audit(session, admin.email, "order.fulfill", order.order_no)
    return order_payload(order)


@router.post("/orders/{order_no}/refund")
def admin_refund(
    order_no: str, payload: AdminOrderActionRequest, session: DbSession, admin: AdminAccount
) -> dict:
    setting = site_config.get_setting(session)
    order = _order_or_404(session, order_no)
    if order.status not in {"paid", "fulfilled"}:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"订单状态为 {order.status}，无法退款。")

    # 收回授权：停用订单产生的激活码与权益
    for license in session.scalars(select(License).where(License.order_id == order.id)):
        license.active = False
        license.revoked_at = utcnow()
        # 同 license.deactivate：多设备绑定要全部释放，不能只处理 .first()
        for binding in session.scalars(
            select(DeviceBinding).where(DeviceBinding.license_id == license.id)
        ):
            binding.active = False
            binding.released_at = utcnow()
    for entitlement in session.scalars(
        select(Entitlement).where(Entitlement.product_id == order.product_id)
    ):
        if entitlement.license_id and entitlement.license_id == order.license_id:
            entitlement.active = False

    referrals.reverse_order_reward(session, order=order, note=f"订单 {order.order_no} 退款，奖励退回")
    order.status = "refunded"
    order.refunded_at = utcnow()
    session.flush()
    _audit(session, admin.email, "order.refund", order.order_no, payload.note)
    session.refresh(order)
    return order_payload(order)


@router.post("/orders/{order_no}/cancel")
def admin_cancel(
    order_no: str, payload: AdminOrderActionRequest, session: DbSession, admin: AdminAccount
) -> dict:
    order = _order_or_404(session, order_no)
    if order.status != "pending":
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="只有待支付订单可以取消。")
    product = session.get(Product, order.product_id) if order.product_id else None
    order.status = "cancelled"
    order.cancelled_at = utcnow()
    fulfill.release_reserved_stock(session, product, 1)
    session.flush()
    _audit(session, admin.email, "order.cancel", order.order_no, payload.note)
    session.refresh(order)
    return order_payload(order)


@router.delete("/orders/{order_no}")
def admin_delete_order(order_no: str, session: DbSession, admin: AdminAccount) -> dict:
    """删除订单（用于清理测试单 / 垃圾单）。

    订单是营收与授权来源的凭证，所以只允许删除**确定没有产生授权**的历史单据：
      · 状态必须是终态 ``cancelled`` 或 ``expired``（待支付单请先取消，才会释放库存）；
      · 不能关联任何授权（``license_id`` 与 ``target_license_id`` 都为空）。

    已付款/已履约的订单请走「退款」，用退款保留资金流水的可追溯性。
    """
    order = _order_or_404(session, order_no)

    if order.status not in {"cancelled", "expired"}:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"状态为 {order.status} 的订单不能删除；待支付请先取消，已支付请走退款。",
        )
    if order.license_id or order.target_license_id:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="该订单已关联授权，不能删除；如需收回授权请使用退款。",
        )

    session.delete(order)
    session.flush()
    _audit(session, admin.email, "order.delete", order_no, f"状态 {order.status}")
    return {"orderNo": order_no, "deleted": True}


# --------------------------------------------------------------------------- #
# 激活码
# --------------------------------------------------------------------------- #
@router.get("/licenses")
def admin_list_licenses(
    session: DbSession,
    settings: SettingsDep,
    _admin: AdminAccount,
    keyword: str | None = None,
    limit: int = 200,
) -> dict:
    statement = select(License).order_by(License.created_at.desc()).limit(max(1, min(limit, 500)))
    if keyword:
        like = f"%{keyword.strip()}%"
        statement = statement.where(
            or_(License.activation_code.like(like), License.code_hint.like(like))
        )
    licenses = list(session.scalars(statement))
    meta = _license_meta(session, licenses)
    setting = site_config.get_setting(session)
    return {
        "items": [
            license_payload(
                license,
                customer=meta.get(license.id, {}).get("customer"),
                binding=meta.get(license.id, {}).get("binding"),
                cooldown_seconds=_cooldown(setting, settings),
                last_released_at=meta.get(license.id, {}).get("last_released_at"),
            )
            for license in licenses
        ]
    }


@router.post("/licenses")
def admin_issue_license(
    payload: AdminLicenseRequest, session: DbSession, admin: AdminAccount
) -> dict:
    product = _product_or_404(session, payload.product_id)
    email = payload.email.strip().lower()
    account = session.scalars(select(Account).where(func.lower(Account.email) == email)).first()
    if account is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="该邮箱尚未注册账号。")
    customer = session.scalars(
        select(Customer).where(Customer.account_id == account.id)
    ).first()
    if customer is None:
        customer = Customer(account_id=account.id, email=email, name=email)
        session.add(customer)
        session.flush()

    from store.fulfill import _unique_activation_code

    moment = utcnow()
    validity_days = payload.validity_days if payload.validity_days is not None else product.validity_days
    code = _unique_activation_code(session)
    license = License(
        activation_code=code,
        code_hint=activation_code_hint(code),
        customer_id=customer.id,
        account_id=account.id,
        product_id=product.id,
        product_name=product.name,
        product_type=product.product_type,
        price_cents=product.price_cents,
        validity_days=validity_days,
        issuance_source="manual",
        active=True,
        issued_at=moment,
        access_started_at=moment,
        access_expires_at=(moment + timedelta(days=int(validity_days)) if validity_days else None),
    )
    session.add(license)
    session.flush()
    _audit(session, admin.email, "license.issue", license.id, code)
    return {"activationCodeId": license.id, "activationCode": code, "email": email}


@router.post("/licenses/{license_id}/deactivate")
def admin_deactivate_license(
    license_id: str, payload: AdminOrderActionRequest, session: DbSession, admin: AdminAccount
) -> dict:
    license = session.get(License, license_id)
    if license is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="授权不存在。")
    license.active = False
    license.revoked_at = utcnow()
    # 一条授权可能在多台设备上绑定过（每个 instance_id 一行），停用必须把它们
    # 全部释放。只释放 .first() 会留下仍为 active 的绑定行，既让客户端以为还
    # 能用，也会让「删除授权」的活跃绑定守卫形同虚设。
    for binding in session.scalars(
        select(DeviceBinding).where(DeviceBinding.license_id == license.id)
    ):
        binding.active = False
        binding.released_at = utcnow()
    session.flush()
    _audit(session, admin.email, "license.deactivate", license.id, payload.note)
    return {"activationCodeId": license.id, "active": False}


@router.post("/licenses/{license_id}/activate")
def admin_activate_license(license_id: str, session: DbSession, admin: AdminAccount) -> dict:
    license = session.get(License, license_id)
    if license is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="授权不存在。")
    license.active = True
    license.revoked_at = None
    session.flush()
    _audit(session, admin.email, "license.activate", license.id)
    return {"activationCodeId": license.id, "active": True}


@router.delete("/licenses/{license_id}")
def admin_delete_license(license_id: str, session: DbSession, admin: AdminAccount) -> dict:
    """彻底删除一条授权（含级联的权益、绑定、租约与会话）。

    这是不可恢复操作，所以两道守卫：
      1. 必须**先停用**——强制「停用 → 再删」两步，避免误点直接抹掉在用授权；
      2. 不允许存在仍然活跃的设备绑定（说明还有设备在用）。
    ``orders.license_id`` / ``orders.target_license_id`` 是 ON DELETE SET NULL，
    订单本身会保留，只是不再指向这条授权。
    """
    license = session.get(License, license_id)
    if license is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="授权不存在。")

    if license.active:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="请先停用该授权，确认无设备在用后再删除。",
        )

    active_binding = session.scalars(
        select(DeviceBinding).where(
            DeviceBinding.license_id == license.id, DeviceBinding.active.is_(True)
        )
    ).first()
    if active_binding is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="该授权仍有活跃设备绑定，请先强制解绑。",
        )

    code = license.activation_code
    binding_count = int(
        session.execute(
            select(func.count(DeviceBinding.id)).where(DeviceBinding.license_id == license.id)
        ).scalar_one()
        or 0
    )
    session.delete(license)
    session.flush()
    _audit(
        session,
        admin.email,
        "license.delete",
        license_id,
        f"{code}（连带清理 {binding_count} 条绑定记录）",
    )
    return {"activationCodeId": license_id, "deleted": True, "bindings": binding_count}


# --------------------------------------------------------------------------- #
# 设备绑定
# --------------------------------------------------------------------------- #
@router.get("/bindings")
def admin_list_bindings(
    session: DbSession, _admin: AdminAccount, active_only: bool = False
) -> dict:
    statement = select(DeviceBinding).order_by(DeviceBinding.updated_at.desc())
    if active_only:
        statement = statement.where(DeviceBinding.active.is_(True))
    items = []
    for binding in session.scalars(statement):
        license = session.get(License, binding.license_id)
        items.append(
            {
                "bindingId": binding.id,
                "licenseId": binding.license_id,
                "activationCodeHint": license.code_hint if license else None,
                "instanceId": binding.instance_id,
                "clientVersion": binding.client_version,
                "lastIp": binding.last_ip,
                "active": bool(binding.active),
                "activatedAt": iso(binding.activated_at),
                "lastHeartbeatAt": iso(binding.last_heartbeat_at),
                "releasedAt": iso(binding.released_at),
            }
        )
    return {"items": items}


@router.post("/bindings/{binding_id}/release")
def admin_release_binding(
    binding_id: str, payload: AdminOrderActionRequest, session: DbSession, admin: AdminAccount
) -> dict:
    binding = session.get(DeviceBinding, binding_id)
    if binding is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="设备绑定不存在。")
    license = session.get(License, binding.license_id)
    account_id = license.account_id if license is not None else None
    binding.active = False
    binding.released_at = utcnow()
    session.add(
        DeviceReleaseEvent(
            license_id=binding.license_id,
            account_id=account_id,
            instance_id=binding.instance_id,
            source="admin",
        )
    )
    if account_id:
        account = session.get(Account, account_id)
        if account is not None:
            account.last_device_release_at = utcnow()
    session.flush()
    _audit(session, admin.email, "binding.release", binding.id, payload.note)
    return {"bindingId": binding.id, "released": True}


# --------------------------------------------------------------------------- #
# 优惠码
# --------------------------------------------------------------------------- #
@router.get("/coupons")
def admin_list_coupons(session: DbSession, _admin: AdminAccount) -> dict:
    counts = _coupon_redemption_counts(session)
    items = [
        _coupon_payload(coupon, counts.get(coupon.id, 0))
        for coupon in session.scalars(select(Coupon).order_by(Coupon.created_at.desc()))
    ]
    return {"items": items}


def _coupon_redemption_counts(session) -> dict[str, int]:
    """按核销记录表统计每个优惠码的实际用量。

    刻意不用 ``Coupon.redeemed_count`` 这个反规范化计数列：它是发放时的快照，
    一旦和 ``coupon_redemptions`` 漂移，删除守卫（数记录）与界面提示（读计数列）
    就会各说各话——确认弹窗写着「尚未被使用」，点下去却只停用。
    """
    return {
        coupon_id: int(count or 0)
        for coupon_id, count in session.execute(
            select(CouponRedemption.coupon_id, func.count(CouponRedemption.id)).group_by(
                CouponRedemption.coupon_id
            )
        ).all()
    }


def _coupon_redemption_count(session, coupon_id: str) -> int:
    """单个优惠码的核销数（供非列表场景复用，避免全表 group by）。"""
    return int(
        session.execute(
            select(func.count(CouponRedemption.id)).where(
                CouponRedemption.coupon_id == coupon_id
            )
        ).scalar_one()
        or 0
    )


def _coupon_payload(coupon: Coupon, redeemed_count: int) -> dict:
    return {
        "id": coupon.id,
        "code": coupon.code,
        "description": coupon.description,
        "discountType": coupon.discount_type,
        "percent": float(coupon.percent or 0.0),
        "amountCents": int(coupon.amount_cents or 0),
        "minAmountCents": int(coupon.min_amount_cents or 0),
        "maxRedemptions": coupon.max_redemptions,
        "redeemedCount": int(redeemed_count),
        "perAccountLimit": int(coupon.per_account_limit or 0),
        "applicableProductIds": [
            str(item) for item in list_json(coupon.applicable_product_ids_json)
        ],
        "startsAt": iso(coupon.starts_at),
        "expiresAt": iso(coupon.expires_at),
        "active": bool(coupon.active),
        "createdAt": iso(coupon.created_at),
    }


@router.post("/coupons")
def admin_create_coupon(
    payload: AdminCouponRequest, session: DbSession, admin: AdminAccount
) -> dict:
    code = payload.code.strip().upper()
    exists = session.scalars(select(Coupon).where(func.upper(Coupon.code) == code)).first()
    if exists is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="优惠码已存在。")
    coupon = Coupon(
        code=code,
        description=payload.description,
        discount_type=payload.discount_type,
        percent=payload.percent,
        amount_cents=payload.amount_cents,
        min_amount_cents=payload.min_amount_cents,
        max_redemptions=payload.max_redemptions,
        per_account_limit=payload.per_account_limit,
        applicable_product_ids_json=list_json(payload.applicable_product_ids),
        active=payload.active,
    )
    session.add(coupon)
    session.flush()
    _audit(session, admin.email, "coupon.create", coupon.id, code)
    return _coupon_payload(coupon, 0)


@router.delete("/coupons/{coupon_id}")
def admin_delete_coupon(coupon_id: str, session: DbSession, admin: AdminAccount) -> dict:
    """删除优惠码。

    ``coupon_redemptions`` 对优惠码是 ON DELETE CASCADE，物理删会把兑换历史一起
    抹掉。所以只有**从未被使用**的优惠码才真删；用过的只能停用，保住核销记录。
    """
    coupon = session.get(Coupon, coupon_id)
    if coupon is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="优惠码不存在。")

    redemption_count = _coupon_redemption_count(session, coupon.id)
    if redemption_count:
        coupon.active = False
        reason = f"该优惠码已被使用 {redemption_count} 次，已停用而非删除"
        session.flush()
        _audit(session, admin.email, "coupon.deactivate", coupon.id, reason)
        return {
            "id": coupon.id,
            "deleted": False,
            "deactivated": True,
            "reason": reason,
            "redemptions": redemption_count,
        }

    code = coupon.code
    session.delete(coupon)
    session.flush()
    _audit(session, admin.email, "coupon.delete", coupon_id, code)
    return {"id": coupon_id, "deleted": True, "deactivated": False}


@router.patch("/coupons/{coupon_id}")
def admin_patch_coupon(
    coupon_id: str, payload: AdminCouponPatch, session: DbSession, admin: AdminAccount
) -> dict:
    """启用 / 停用优惠码（不删除核销记录）。"""
    coupon = session.get(Coupon, coupon_id)
    if coupon is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="优惠码不存在。")
    redeemed = _coupon_redemption_count(session, coupon.id)
    if payload.active is None:
        return _coupon_payload(coupon, redeemed)
    coupon.active = bool(payload.active)
    session.flush()
    _audit(
        session,
        admin.email,
        "coupon.activate" if payload.active else "coupon.pause",
        coupon.id,
        coupon.code,
    )
    return _coupon_payload(coupon, redeemed)


# --------------------------------------------------------------------------- #
# 提现审核
# --------------------------------------------------------------------------- #
@router.get("/withdrawals")
def admin_list_withdrawals(
    session: DbSession, _admin: AdminAccount, status_filter: str | None = None
) -> dict:
    statement = select(ReferralWithdrawal).order_by(ReferralWithdrawal.created_at.desc())
    if status_filter:
        statement = statement.where(ReferralWithdrawal.status == status_filter)
    items = []
    for row in session.scalars(statement):
        account = session.get(Account, row.account_id)
        items.append(
            {
                "id": row.id,
                "accountId": row.account_id,
                "email": account.email if account else None,
                "points": f"{float(row.points or 0.0):.2f}",
                "feePoints": f"{float(row.fee_points or 0.0):.2f}",
                "feePercent": float(row.fee_percent or 0.0),
                "netPoints": f"{float(row.net_points or 0.0):.2f}",
                "qq": row.qq,
                "status": row.status,
                "note": row.note,
                "createdAt": iso(row.created_at),
                "resolvedAt": iso(row.resolved_at),
            }
        )
    return {"items": items}


@router.post("/withdrawals/{withdrawal_id}/resolve")
def admin_resolve_withdrawal(
    withdrawal_id: str,
    payload: AdminWithdrawalResolveRequest,
    session: DbSession,
    admin: AdminAccount,
) -> dict:
    withdrawal = session.get(ReferralWithdrawal, withdrawal_id)
    if withdrawal is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="提现申请不存在。")
    if withdrawal.status != "pending":
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="该申请已处理。")
    referrals.resolve_withdrawal(
        session, withdrawal, approve=payload.approve, note=payload.note
    )
    _audit(
        session,
        admin.email,
        "withdrawal.resolve",
        withdrawal.id,
        f"approve={payload.approve}",
    )
    return {"id": withdrawal.id, "status": withdrawal.status}


@router.delete("/withdrawals/{withdrawal_id}")
def admin_delete_withdrawal(
    withdrawal_id: str, session: DbSession, admin: AdminAccount
) -> dict:
    """删除提现申请记录（仅限**已结算**的申请）。

    待审核（pending）的申请带着被冻结的积分，删掉会让冻结额度对不上账，
    所以必须先通过或驳回。已结算的申请删除后，积分流水（referral_ledger）
    仍然保留，资金审计不受影响。
    """
    withdrawal = session.get(ReferralWithdrawal, withdrawal_id)
    if withdrawal is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="提现申请不存在。")

    if withdrawal.status == "pending":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="待审核的申请不能删除；请先通过或驳回，以退回/结算冻结积分。",
        )

    status_label = withdrawal.status
    points = float(withdrawal.points or 0.0)
    session.delete(withdrawal)
    session.flush()
    _audit(
        session,
        admin.email,
        "withdrawal.delete",
        withdrawal_id,
        f"{status_label} · {points:.2f} 积分",
    )
    return {"id": withdrawal_id, "deleted": True}


# --------------------------------------------------------------------------- #
# 站点配置
# --------------------------------------------------------------------------- #
@router.get("/settings")
def admin_get_settings(session: DbSession, _admin: AdminAccount, settings: SettingsDep) -> dict:
    setting = site_config.get_setting(session)
    return site_config.site_configuration_payload(setting, settings) | {
        "referral": site_config.referral_settings_payload(setting),
        "deviceReleaseCooldownSeconds": setting.device_release_cooldown_seconds,
        "announcement": setting.announcement,
    }


@router.put("/settings")
def admin_update_settings(
    payload: AdminSettingsRequest,
    session: DbSession,
    admin: AdminAccount,
    settings: SettingsDep,
) -> dict:
    data = payload.model_dump(exclude_unset=True)
    mapping = {
        "site_name": "site_name",
        "site_title": "site_title",
        "description": "description",
        "announcement": "announcement",
        "support_email": "support_email",
        "maintenance_mode": "maintenance_mode",
        "maintenance_message": "maintenance_message",
        "payment_provider": "payment_provider",
        "payment_display_name": "payment_display_name",
        "payment_enabled": "payment_enabled",
        "payment_transaction_description": "payment_transaction_description",
        "referral_enabled": "referral_enabled",
        "referral_rate_percent": "referral_rate_percent",
        "referral_withdrawal_fee_percent": "referral_withdrawal_fee_percent",
        "referral_withdrawal_min_points": "referral_withdrawal_min_points",
        "referral_qq_group": "referral_qq_group",
        "referral_qq_url": "referral_qq_url",
        "device_release_cooldown_seconds": "device_release_cooldown_seconds",
    }
    updates = {column: data[field] for field, column in mapping.items() if field in data}
    setting = site_config.update_setting(session, **updates)
    _audit(session, admin.email, "settings.update", "1", ",".join(sorted(updates)))
    return site_config.site_configuration_payload(setting, settings) | {
        "referral": site_config.referral_settings_payload(setting),
        "deviceReleaseCooldownSeconds": setting.device_release_cooldown_seconds,
        "announcement": setting.announcement,
    }


# --------------------------------------------------------------------------- #
# 版本发布
# --------------------------------------------------------------------------- #
@router.get("/releases")
def admin_list_releases(session: DbSession, _admin: AdminAccount) -> dict:
    items = [
        {
            "id": release.id,
            "product": release.product,
            "channel": release.channel,
            "version": release.version,
            "releaseDate": release.release_date,
            "upgradeNotes": release.upgrade_notes,
            "createdAt": iso(release.created_at),
        }
        for release in session.scalars(select(Release).order_by(Release.created_at.desc()))
    ]
    return {"items": items}


@router.post("/releases")
def admin_create_release(
    payload: AdminReleaseRequest, session: DbSession, admin: AdminAccount
) -> dict:
    release = Release(
        product=payload.product or "ha-bridge",
        channel=payload.channel or "docker",
        version=payload.version,
        release_date=payload.release_date or "",
        upgrade_notes=payload.upgrade_notes or "",
    )
    session.add(release)
    session.flush()
    _audit(session, admin.email, "release.create", release.id, release.version)
    return {
        "id": release.id,
        "product": release.product,
        "channel": release.channel,
        "version": release.version,
        "releaseDate": release.release_date,
        "upgradeNotes": release.upgrade_notes,
    }


@router.delete("/releases/{release_id}")
def admin_delete_release(release_id: str, session: DbSession, admin: AdminAccount) -> dict:
    """删除版本记录。

    ``releases`` 是叶子表（没有任何外键指向它），物理删除不会影响授权数据；
    客户端的「检查更新」会自动回退到次新的那条记录。
    """
    release = session.get(Release, release_id)
    if release is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="版本记录不存在。")
    label = f"{release.product}/{release.channel} {release.version}"
    session.delete(release)
    session.flush()
    _audit(session, admin.email, "release.delete", release_id, label)
    return {"id": release_id, "deleted": True, "label": label}


# --------------------------------------------------------------------------- #
# 账号
# --------------------------------------------------------------------------- #
@router.get("/accounts")
def admin_list_accounts(
    session: DbSession, _admin: AdminAccount, keyword: str | None = None, limit: int = 100
) -> dict:
    statement = select(Account).order_by(Account.created_at.desc()).limit(max(1, min(limit, 500)))
    if keyword:
        statement = statement.where(Account.email.like(f"%{keyword.strip()}%"))
    items = []
    for account in session.scalars(statement):
        wallet = session.scalars(
            select(ReferralWallet).where(ReferralWallet.account_id == account.id)
        ).first()
        items.append(
            {
                "id": account.id,
                "email": account.email,
                "isAdmin": bool(account.is_admin),
                "isActive": bool(account.is_active),
                "emailVerifiedAt": iso(account.email_verified_at),
                "lastLoginAt": iso(account.last_login_at),
                "createdAt": iso(account.created_at),
                "referralCode": wallet.code if wallet else account.referral_code,
                "balance": f"{float(wallet.balance or 0.0):.2f}" if wallet else "0.00",
                "licenseCount": int(
                    session.execute(
                        select(func.count(License.id)).where(License.account_id == account.id)
                    ).scalar_one()
                    or 0
                ),
            }
        )
    return {"items": items}


@router.post("/accounts/{account_id}/activate")
def admin_activate_account(account_id: str, session: DbSession, admin: AdminAccount) -> dict:
    account = session.get(Account, account_id)
    if account is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="账号不存在。")
    account.is_active = True
    session.flush()
    _audit(session, admin.email, "account.activate", account.id)
    return {"id": account.id, "isActive": True}


@router.post("/accounts/{account_id}/deactivate")
def admin_deactivate_account(account_id: str, session: DbSession, admin: AdminAccount) -> dict:
    account = session.get(Account, account_id)
    if account is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="账号不存在。")
    account.is_active = False
    for record in session.scalars(
        select(AccountSession).where(AccountSession.account_id == account.id)
    ):
        session.delete(record)
    session.flush()
    _audit(session, admin.email, "account.deactivate", account.id)
    return {"id": account.id, "isActive": False}


# --------------------------------------------------------------------------- #
# 审计日志
# --------------------------------------------------------------------------- #
@router.get("/audit-logs")
def admin_audit_logs(session: DbSession, _admin: AdminAccount, limit: int = 100) -> dict:
    items = [
        {
            "id": row.id,
            "actor": row.actor,
            "action": row.action,
            "target": row.target,
            "detail": row.detail,
            "createdAt": iso(row.created_at),
        }
        for row in session.scalars(
            select(AuditLog).order_by(AuditLog.created_at.desc()).limit(max(1, min(limit, 500)))
        )
    ]
    return {"items": items}


@router.delete("/audit-logs/{log_id}")
def admin_delete_audit_log(log_id: str, session: DbSession, admin: AdminAccount) -> dict:
    log = session.get(AuditLog, log_id)
    if log is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="审计记录不存在。")
    label = f"{log.action} {log.target}".strip()
    session.delete(log)
    session.flush()
    _audit(session, admin.email, "audit.delete", log_id, label)
    return {"id": log_id, "deleted": True, "label": label}


@router.delete("/audit-logs")
def admin_purge_audit_logs(
    session: DbSession, admin: AdminAccount, older_than_days: int
) -> dict:
    """按时间批量清理审计日志。

    ``older_than_days`` 是**必填**查询参数且最小为 1 天：这样「一键清空全部」
    在接口层面就不成立，只能清理明确指定天数之前的记录。本次清理动作自己也会
    写入一条审计记录（其时间为当前时刻，落在保留区内，不会被自己删掉）。
    """
    if older_than_days < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="older_than_days 至少为 1 天。"
        )

    cutoff = utcnow() - timedelta(days=older_than_days)
    # 先统计再删，响应里给出数量，便于前端明确提示「清理了多少条」
    to_delete = list(session.scalars(select(AuditLog.id).where(AuditLog.created_at < cutoff)))
    if to_delete:
        session.execute(delete(AuditLog).where(AuditLog.created_at < cutoff))
        session.flush()

    _audit(
        session,
        admin.email,
        "audit.purge",
        f"older_than_days={older_than_days}",
        f"清理 {len(to_delete)} 条",
    )
    return {
        "deleted": len(to_delete),
        "olderThanDays": older_than_days,
        "cutoff": iso(cutoff),
    }
