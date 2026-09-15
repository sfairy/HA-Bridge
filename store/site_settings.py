"""站点级运行时配置（``store_settings`` 单例）的读写与序列化。"""

from __future__ import annotations

from sqlalchemy.orm import Session

from store.config import StoreSettings
from store.models import StoreSetting
from store.security import iso, utcnow


def get_setting(session: Session) -> StoreSetting:
    """读取单例配置，不存在时创建默认值。"""
    setting = session.get(StoreSetting, 1)
    if setting is None:
        setting = StoreSetting(id=1)
        session.add(setting)
        session.flush()
    return setting


def update_setting(session: Session, **fields) -> StoreSetting:
    setting = get_setting(session)
    for key, value in fields.items():
        if value is None or not hasattr(setting, key):
            continue
        setattr(setting, key, value)
    setting.updated_at = utcnow()
    session.flush()
    return setting


def store_configuration_payload(setting: StoreSetting) -> dict:
    return {
        "siteName": setting.site_name,
        "siteTitle": setting.site_title,
        "description": setting.description,
        "announcement": setting.announcement,
        "supportEmail": setting.support_email,
        "logoUrl": setting.logo_url,
        "maintenanceMode": bool(setting.maintenance_mode),
        "maintenanceMessage": setting.maintenance_message,
        "updatedAt": iso(setting.updated_at),
    }


def _mask_secret(configured: bool) -> bool:
    return bool(configured)


def payment_configuration_payload(setting: StoreSetting, settings: StoreSettings) -> dict:
    provider = (setting.payment_provider or settings.payment_provider or "mock").lower()
    if provider == "alipay":
        app_id = settings.alipay_app_id
        # 密钥可能来自文件而不是内联环境变量，这里必须用解析后的值
        private_configured = bool(settings.alipay_private_key_text)
        public_configured = bool(settings.alipay_public_key_text)
        gateway = settings.alipay_gateway_url
        display_name = setting.payment_display_name or "支付宝"
        icon = "alipay"
    else:
        app_id = ""
        private_configured = True
        public_configured = True
        gateway = ""
        display_name = setting.payment_display_name or "模拟支付"
        icon = "mock"

    configured = bool(setting.payment_enabled) and (
        provider != "alipay" or (bool(app_id) and private_configured and public_configured)
    )
    return {
        "provider": provider,
        "enabled": bool(setting.payment_enabled),
        "displayName": display_name,
        "icon": icon,
        "appId": app_id,
        "applicationPrivateKeyConfigured": _mask_secret(private_configured),
        "alipayPublicKeyConfigured": _mask_secret(public_configured),
        "gatewayUrl": gateway,
        "transactionDescription": setting.payment_transaction_description
        or settings.alipay_transaction_description,
        "merchantOrderTemplate": setting.payment_merchant_order_template,
        "configured": configured,
        "available": configured,
        "updatedAt": iso(setting.updated_at),
    }


def site_configuration_payload(setting: StoreSetting, settings: StoreSettings) -> dict:
    return {
        "store": store_configuration_payload(setting),
        "payment": payment_configuration_payload(setting, settings),
    }


def referral_settings_payload(setting: StoreSetting) -> dict:
    return {
        "enabled": bool(setting.referral_enabled),
        "ratePercent": float(setting.referral_rate_percent or 0.0),
        "withdrawalFeePercent": float(setting.referral_withdrawal_fee_percent or 0.0),
        "withdrawalMinPoints": float(setting.referral_withdrawal_min_points or 0.0),
        "qqGroup": setting.referral_qq_group or "",
        "qqUrl": setting.referral_qq_url or "",
    }
