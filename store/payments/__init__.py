"""支付渠道实现。"""

from __future__ import annotations

from store.config import StoreSettings
from store.payments.alipay import AlipayProvider
from store.payments.base import PaymentError, PaymentIntent, PaymentProvider
from store.payments.mock import MockPaymentProvider

__all__ = [
    "AlipayProvider",
    "MockPaymentProvider",
    "PaymentError",
    "PaymentIntent",
    "PaymentProvider",
    "resolve_provider",
]


def resolve_provider(settings: StoreSettings, setting=None) -> PaymentProvider:
    """按站点配置选择支付渠道（站点配置优先于环境变量）。"""
    name = (
        getattr(setting, "payment_provider", None)
        or settings.payment_provider
        or "mock"
    ).lower()
    if name == "alipay":
        return AlipayProvider()
    return MockPaymentProvider()
