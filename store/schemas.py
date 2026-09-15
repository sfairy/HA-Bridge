"""请求体模型。响应统一使用参考站风格的 camelCase dict。"""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field


class _Camel(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="ignore")


# --------------------------------------------------------------------------- #
# 账号
# --------------------------------------------------------------------------- #
class VerificationRequest(_Camel):
    email: str = Field(min_length=3, max_length=255)
    purpose: str = Field(default="register", pattern="^(register|reset)$")


class RegisterRequest(_Camel):
    email: str = Field(min_length=3, max_length=255)
    code: str = Field(min_length=4, max_length=12)
    password: str = Field(min_length=6, max_length=128)
    confirm_password: str = Field(default="", alias="confirmPassword", max_length=128)
    referral_code: str | None = Field(default=None, alias="referralCode", max_length=16)


class LoginRequest(_Camel):
    email: str = Field(min_length=3, max_length=255)
    password: str = Field(min_length=1, max_length=128)


class PasswordResetRequest(_Camel):
    email: str = Field(min_length=3, max_length=255)
    code: str = Field(min_length=4, max_length=12)
    password: str = Field(min_length=6, max_length=128)
    confirm_password: str = Field(default="", alias="confirmPassword", max_length=128)


class LabelRequest(_Camel):
    label: str | None = Field(default=None, max_length=50)


class ReleaseDeviceRequest(_Camel):
    password: str = Field(min_length=1, max_length=128)


# --------------------------------------------------------------------------- #
# 订单
# --------------------------------------------------------------------------- #
class CreateOrderRequest(_Camel):
    product_id: str = Field(alias="productId", min_length=1, max_length=64)
    coupon_code: str | None = Field(default=None, alias="couponCode", max_length=64)
    #: 增量包需要指定要追加到哪一份授权
    target_license_id: str | None = Field(default=None, alias="customerId", max_length=64)


class CouponPreviewRequest(_Camel):
    product_id: str = Field(alias="productId", min_length=1, max_length=64)
    coupon_code: str = Field(alias="couponCode", min_length=1, max_length=64)


class OrderLookupRequest(_Camel):
    order_no: str = Field(alias="orderNo", min_length=4, max_length=64)


# --------------------------------------------------------------------------- #
# 邀请
# --------------------------------------------------------------------------- #
class WithdrawalRequest(_Camel):
    points: float = Field(gt=0)
    qq: str = Field(min_length=5, max_length=20)
    request_key: str = Field(alias="requestKey", min_length=8, max_length=64)
    expected_fee_percent: float | None = Field(default=None, alias="expectedFeePercent")


# --------------------------------------------------------------------------- #
# 管理后台
# --------------------------------------------------------------------------- #
class AdminProductRequest(_Camel):
    name: str = Field(min_length=1, max_length=255)
    product_code: str = Field(default="ha-bridge", alias="productCode", max_length=64)
    price_cents: int = Field(default=0, alias="priceCents", ge=0)
    original_price_cents: int | None = Field(default=None, alias="originalPriceCents", ge=0)
    is_full_price: bool = Field(default=False, alias="isFullPrice")
    validity_days: int | None = Field(default=None, alias="validityDays", ge=1)
    product_type: str = Field(default="base", alias="productType", max_length=32)
    feature_codes: list[str] = Field(default_factory=list, alias="featureCodes")
    included_product_ids: list[str] = Field(default_factory=list, alias="includedProductIds")
    package_contents_locked: bool = Field(default=False, alias="packageContentsLocked")
    active: bool = True
    note: str | None = Field(default=None, max_length=512)
    display_description: str | None = Field(default=None, alias="displayDescription", max_length=512)
    badge_text: str | None = Field(default=None, alias="badgeText", max_length=64)
    featured: bool = False
    sort_order: int = Field(default=100, alias="sortOrder")
    fulfillment_mode: str = Field(default="automatic", alias="fulfillmentMode", max_length=32)
    stock_quantity: int | None = Field(default=None, alias="stockQuantity", ge=0)
    requires_license: bool = Field(default=False, alias="requiresLicense")


class AdminProductPatch(_Camel):
    name: str | None = Field(default=None, max_length=255)
    product_code: str | None = Field(default=None, alias="productCode", max_length=64)
    price_cents: int | None = Field(default=None, alias="priceCents", ge=0)
    original_price_cents: int | None = Field(default=None, alias="originalPriceCents", ge=0)
    is_full_price: bool | None = Field(default=None, alias="isFullPrice")
    validity_days: int | None = Field(default=None, alias="validityDays", ge=1)
    product_type: str | None = Field(default=None, alias="productType", max_length=32)
    feature_codes: list[str] | None = Field(default=None, alias="featureCodes")
    included_product_ids: list[str] | None = Field(default=None, alias="includedProductIds")
    package_contents_locked: bool | None = Field(default=None, alias="packageContentsLocked")
    active: bool | None = None
    note: str | None = Field(default=None, max_length=512)
    display_description: str | None = Field(default=None, alias="displayDescription", max_length=512)
    badge_text: str | None = Field(default=None, alias="badgeText", max_length=64)
    featured: bool | None = None
    sort_order: int | None = Field(default=None, alias="sortOrder")
    fulfillment_mode: str | None = Field(default=None, alias="fulfillmentMode", max_length=32)
    stock_quantity: int | None = Field(default=None, alias="stockQuantity", ge=0)
    requires_license: bool | None = Field(default=None, alias="requiresLicense")


class AdminCouponRequest(_Camel):
    code: str = Field(min_length=2, max_length=64)
    description: str = Field(default="", max_length=255)
    discount_type: str = Field(default="percent", alias="discountType", max_length=16)
    percent: float = Field(default=0.0, ge=0, le=100)
    amount_cents: int = Field(default=0, alias="amountCents", ge=0)
    min_amount_cents: int = Field(default=0, alias="minAmountCents", ge=0)
    max_redemptions: int | None = Field(default=None, alias="maxRedemptions", ge=1)
    per_account_limit: int = Field(default=1, alias="perAccountLimit", ge=0)
    applicable_product_ids: list[str] = Field(default_factory=list, alias="applicableProductIds")
    active: bool = True


class AdminCouponPatch(_Camel):
    """优惠码的部分更新：目前只用于启用 / 停用。"""

    active: bool | None = None


class AdminSettingsRequest(_Camel):
    site_name: str | None = Field(default=None, alias="siteName", max_length=128)
    site_title: str | None = Field(default=None, alias="siteTitle", max_length=256)
    description: str | None = Field(default=None, max_length=512)
    announcement: str | None = None
    support_email: str | None = Field(default=None, alias="supportEmail", max_length=255)
    maintenance_mode: bool | None = Field(default=None, alias="maintenanceMode")
    maintenance_message: str | None = Field(default=None, alias="maintenanceMessage", max_length=512)
    payment_provider: str | None = Field(default=None, alias="paymentProvider", max_length=32)
    payment_display_name: str | None = Field(default=None, alias="paymentDisplayName", max_length=64)
    payment_enabled: bool | None = Field(default=None, alias="paymentEnabled")
    payment_transaction_description: str | None = Field(
        default=None, alias="paymentTransactionDescription", max_length=128
    )
    referral_enabled: bool | None = Field(default=None, alias="referralEnabled")
    referral_rate_percent: float | None = Field(default=None, alias="referralRatePercent", ge=0, le=100)
    referral_withdrawal_fee_percent: float | None = Field(
        default=None, alias="referralWithdrawalFeePercent", ge=0, le=100
    )
    referral_withdrawal_min_points: float | None = Field(
        default=None, alias="referralWithdrawalMinPoints", ge=0
    )
    referral_qq_group: str | None = Field(default=None, alias="referralQqGroup", max_length=64)
    referral_qq_url: str | None = Field(default=None, alias="referralQqUrl", max_length=512)
    device_release_cooldown_seconds: int | None = Field(
        default=None, alias="deviceReleaseCooldownSeconds", ge=0
    )


class AdminLicenseRequest(_Camel):
    email: str = Field(min_length=3, max_length=255)
    product_id: str = Field(alias="productId", min_length=1, max_length=64)
    validity_days: int | None = Field(default=None, alias="validityDays", ge=1)
    note: str | None = Field(default=None, max_length=255)


class AdminReleaseRequest(_Camel):
    product: str = Field(default="ha-bridge", max_length=64)
    channel: str = Field(default="docker", max_length=32)
    version: str = Field(min_length=1, max_length=32)
    release_date: str = Field(default="", alias="releaseDate", max_length=32)
    upgrade_notes: str = Field(default="", alias="upgradeNotes")


class AdminWithdrawalResolveRequest(_Camel):
    approve: bool = True
    note: str = Field(default="", max_length=255)


class AdminOrderActionRequest(_Camel):
    note: str = Field(default="", max_length=255)
