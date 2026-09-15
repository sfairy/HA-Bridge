"""主动查单对账：异步通知的兜底。

异步通知要求回调地址公网可达。本地开发靠内网穿透时，隧道掉线、支付宝重推延迟
都很常见，只依赖通知会出现「用户付了钱、订单一直显示待支付」。

所以订单在被轮询时顺带向支付宝查一次单。前端每 3 秒轮一次，这里做同订单节流，
避免把网关打爆（真实环境有频率限制）。
"""

from __future__ import annotations

import logging
import threading
import time

from sqlalchemy.orm import Session

from store.config import StoreSettings
from store.models import Order, StoreSetting
from store.payments.alipay import (
    SUCCESS_TRADE_STATUSES,
    AlipayProvider,
    cents_from_yuan,
)
from store.payments.base import PaymentError
from store.payments.settlement import settle_paid_order

logger = logging.getLogger("store.payments.reconcile")

#: 同一订单两次主动查单的最小间隔（秒）
MIN_QUERY_INTERVAL_SECONDS = 3.0

#: 节流表上限，超过就整体清空（订单号不会长期复用）
_MAX_TRACKED_ORDERS = 1024

_last_query_at: dict[str, float] = {}
_lock = threading.Lock()


def _allow_query(order_no: str) -> bool:
    now = time.monotonic()
    with _lock:
        previous = _last_query_at.get(order_no, 0.0)
        if now - previous < MIN_QUERY_INTERVAL_SECONDS:
            return False
        if len(_last_query_at) >= _MAX_TRACKED_ORDERS:
            _last_query_at.clear()
        _last_query_at[order_no] = now
        return True


def reconcile_alipay_order(
    session: Session,
    *,
    order: Order,
    settings: StoreSettings,
    setting: StoreSetting,
    force: bool = False,
) -> bool:
    """若订单待支付且走支付宝，则查单确认；已确认到账返回 True。"""
    if order.status != "pending":
        return False
    if (order.payment_provider or "").lower() != "alipay":
        return False
    if not force and not _allow_query(order.order_no):
        return False

    provider = AlipayProvider()
    if not provider.is_configured(settings):
        return False

    try:
        node = provider.query_payment(settings, order)
    except PaymentError as error:
        # 查单失败绝不影响用户：可能只是网络抖动，下次轮询会重试
        logger.warning("主动查单失败 order=%s error=%s", order.order_no, error)
        return False

    if not node:
        return False

    trade_status = str(node.get("trade_status", ""))
    if trade_status not in SUCCESS_TRADE_STATUSES:
        return False

    expected = int(order.amount_cents or 0)
    actual = cents_from_yuan(node.get("total_amount"))
    if actual is None or actual != expected:
        logger.error(
            "查单金额不符，拒绝入账 order=%s 期望=%s 实际=%s",
            order.order_no,
            expected,
            node.get("total_amount"),
        )
        return False

    settle_paid_order(
        session,
        order=order,
        setting=setting,
        trade_no=str(node.get("trade_no") or ""),
        source="alipay.query",
    )
    return True
