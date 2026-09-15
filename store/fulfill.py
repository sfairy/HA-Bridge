"""订单履约：发放激活码、追加减量包、记邀请奖励。

无论支付渠道是模拟收银台还是真实支付宝，最终都汇聚到这里，
保证切换 provider 时履约行为完全一致。
"""

from __future__ import annotations

import logging
from datetime import datetime, timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from store import referrals
from store.config import StoreSettings
from store.models import (
    Customer,
    Entitlement,
    License,
    Order,
    Product,
    StoreSetting,
)
from store.security import (
    activation_code_hint,
    new_activation_code,
    utcnow,
)
from store.serializers import json_list

logger = logging.getLogger("store.fulfill")


def _unique_activation_code(session: Session) -> str:
    for _ in range(32):
        candidate = new_activation_code()
        exists = session.scalars(
            select(License.id).where(License.activation_code == candidate)
        ).first()
        if exists is None:
            return candidate
    raise RuntimeError("无法生成唯一激活码。")


def create_license_for_order(
    session: Session,
    *,
    order: Order,
    product: Product,
    customer: Customer,
    now: datetime | None = None,
) -> License:
    moment = now or utcnow()
    code = _unique_activation_code(session)
    validity_days = product.validity_days
    license = License(
        activation_code=code,
        code_hint=activation_code_hint(code),
        customer_id=customer.id,
        account_id=order.account_id,
        product_id=product.id,
        order_id=order.id,
        product_name=product.name,
        product_type=product.product_type,
        price_cents=order.amount_cents,
        validity_days=validity_days,
        issuance_source="manual" if product.fulfillment_mode == "manual" else "payment_automatic",
        active=True,
        issued_at=moment,
        access_started_at=moment,
        access_expires_at=(
            moment + timedelta(days=int(validity_days)) if validity_days else None
        ),
    )
    session.add(license)
    session.flush()
    order.license_id = license.id
    return license


def apply_addon_to_license(
    session: Session,
    *,
    order: Order,
    product: Product,
    license: License,
    customer: Customer,
    now: datetime | None = None,
) -> int:
    """把增量包的功能码写成该授权上的权益，返回新增/更新的权益条数。"""
    moment = now or utcnow()
    validity_days = product.validity_days
    expires_at = (
        moment + timedelta(days=int(validity_days)) if validity_days else None
    )
    created = 0
    for feature_code in json_list(product.feature_codes_json):
        feature_code = str(feature_code)
        existing = session.scalars(
            select(Entitlement)
            .where(Entitlement.license_id == license.id)
            .where(Entitlement.feature_code == feature_code)
        ).first()
        if existing is not None:
            existing.active = True
            existing.product_id = product.id
            existing.product_name = product.name
            existing.product_type = product.product_type
            existing.starts_at = moment
            existing.expires_at = expires_at
        else:
            session.add(
                Entitlement(
                    customer_id=customer.id,
                    license_id=license.id,
                    product_id=product.id,
                    product_name=product.name,
                    product_type=product.product_type,
                    feature_code=feature_code,
                    active=True,
                    starts_at=moment,
                    expires_at=expires_at,
                )
            )
        created += 1
    # 追加购买视为续期：若授权本身有时限，一并延后
    if validity_days and license.access_expires_at is not None:
        license.access_expires_at = license.access_expires_at + timedelta(
            days=int(validity_days)
        )
    license.access_started_at = license.access_started_at or moment
    order.license_id = license.id
    session.flush()
    return created


def release_reserved_stock(session: Session, product: Product | None, quantity: int = 1) -> None:
    if product is None:
        return
    product.reserved_stock = max(0, int(product.reserved_stock or 0) - max(0, quantity))
    session.flush()


def reserve_stock(session: Session, product: Product, quantity: int = 1) -> None:
    product.reserved_stock = int(product.reserved_stock or 0) + max(0, quantity)
    session.flush()


def fulfill_order(
    session: Session,
    *,
    order: Order,
    setting: StoreSetting,
    settings: StoreSettings | None = None,
    now: datetime | None = None,
) -> dict:
    """履约。幂等：已履约的订单直接返回。"""
    moment = now or utcnow()
    if order.status == "fulfilled":
        return {"alreadyFulfilled": True, "licenseId": order.license_id}

    product = session.get(Product, order.product_id) if order.product_id else None
    if product is None:
        raise RuntimeError(f"订单 {order.order_no} 对应的商品不存在。")

    customer = session.get(Customer, order.customer_id) if order.customer_id else None
    if customer is None:
        raise RuntimeError(f"订单 {order.order_no} 对应的客户不存在。")

    if order.license_action == "patch":
        license = session.get(License, order.target_license_id) if order.target_license_id else None
        if license is None:
            raise RuntimeError(f"订单 {order.order_no} 缺少可追加的目标授权。")
        apply_addon_to_license(
            session, order=order, product=product, license=license, customer=customer, now=moment
        )
    else:
        create_license_for_order(
            session, order=order, product=product, customer=customer, now=moment
        )

    order.status = "fulfilled"
    order.fulfilled_at = moment
    release_reserved_stock(session, product, 1)

    reward = referrals.grant_order_reward(
        session,
        order=order,
        rate_percent=float(setting.referral_rate_percent or 0.0),
        enabled=bool(setting.referral_enabled),
    )
    session.flush()

    logger.info(
        "订单已履约 order=%s type=%s license=%s reward=%s",
        order.order_no,
        order.order_type,
        order.license_id,
        reward,
    )
    return {
        "alreadyFulfilled": False,
        "licenseId": order.license_id,
        "referralRewardPoints": reward,
    }
