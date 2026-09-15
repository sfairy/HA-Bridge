"""模拟收银台。

本地联调用：下单后返回一个站内收银台地址，同时把该地址作为二维码内容，
前端用 jquery.qrcode 渲染，等价于真实扫码支付的交互路径。
"""

from __future__ import annotations

from store.config import StoreSettings
from store.models import Order, StoreSetting
from store.payments.base import PaymentIntent


class MockPaymentProvider:
    name = "mock"

    def is_configured(self, settings: StoreSettings) -> bool:
        return True

    def create_payment(
        self,
        *,
        order: Order,
        settings: StoreSettings,
        setting: StoreSetting,
        base_url: str,
    ) -> PaymentIntent:
        pay_url = f"{base_url}/store/mock/pay/{order.order_no}"
        return PaymentIntent(
            provider=self.name,
            payload={
                "type": "mock",
                "qrCode": pay_url,
                "payUrl": pay_url,
                "displayName": setting.payment_display_name or "模拟支付",
                "note": "本地联调收银台，确认后立即发码",
            },
            pay_url=pay_url,
            qr_code=pay_url,
        )
