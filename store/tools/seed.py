"""初始化商店数据：管理员账号、商品目录、版本记录。

用法::

    python -m store.tools.seed

幂等：重复执行只会补齐缺失的数据，不会覆盖已有商品与账号。
管理员凭据取自 ``STORE_ADMIN_EMAIL`` / ``STORE_ADMIN_PASSWORD``，
未设置时使用 :data:`DEFAULT_ADMIN_EMAIL` / :data:`DEFAULT_ADMIN_PASSWORD`（并打印警告）。

.. warning::
   默认凭据仅用于本机开发。上生产前必须用 ``STORE_ADMIN_EMAIL`` /
   ``STORE_ADMIN_PASSWORD`` 覆盖，并确认 ``store/data/store.db`` 里没有残留的默认管理员。
"""

from __future__ import annotations

import logging

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from store.app import create_app
from store.config import load_settings
from store.models import Account, Product, ProductImage, Release, StoreSetting
from store.security import hash_password
from store.serializers import list_json

logging.basicConfig(level=logging.INFO, format="%(levelname)-7s %(message)s")
logger = logging.getLogger("store.seed")

DEFAULT_ADMIN_EMAIL = "156120718@qq.com"
DEFAULT_ADMIN_PASSWORD = "fcx6041246"

#: 与参考站 pay.habridge.cn 实测完全一致的功能码清单
BASE_PRODUCT_FEATURES = [
    "api",
    "assets",
    "display",
    "editor",
    "ha.configure",
    "ha.control",
    "ha.sync",
    "projects.write",
    "runtime.websocket",
    "ui.base",
]
MODULE_3D_FEATURES = ["module.3d_interaction"]


def seed_admin(session: Session, email: str, password: str) -> Account:
    account = session.scalars(
        select(Account).where(func.lower(Account.email) == email.lower())
    ).first()
    if account is not None:
        if not account.is_admin:
            account.is_admin = True
            session.flush()
        logger.info("管理员已存在：%s", email)
        return account
    account = Account(
        email=email.lower(),
        password_hash=hash_password(password),
        is_admin=True,
        is_active=True,
    )
    session.add(account)
    session.flush()
    logger.info("已创建管理员：%s", email)
    return account


def seed_products(session: Session) -> dict[str, Product]:
    """写入三条与参考站对齐的商品。返回 {'base','module','package': Product}。"""
    existing = {product.product_type: product for product in session.scalars(select(Product))}
    if {"base", "module", "package"}.issubset(existing.keys()):
        logger.info("商品目录已存在，跳过。")
        return existing

    base = existing.get("base")
    if base is None:
        base = Product(
            name="编辑器+栖光UI+绘制工具",
            product_code="ha-bridge",
            price_cents=4990,
            validity_days=None,
            product_type="base",
            feature_codes_json=list_json(BASE_PRODUCT_FEATURES),
            included_product_ids_json=list_json([]),
            active=True,
            display_description="如需3D交互可后续再账号中心升级",
            sort_order=100,
            fulfillment_mode="automatic",
        )
        session.add(base)
        session.flush()

    module = existing.get("module")
    if module is None:
        module = Product(
            name="3D交互包",
            product_code="ha-bridge",
            price_cents=3990,
            validity_days=None,
            product_type="module",
            feature_codes_json=list_json(MODULE_3D_FEATURES),
            included_product_ids_json=list_json([]),
            active=True,
            sort_order=100,
            fulfillment_mode="automatic",
            requires_license=True,
        )
        session.add(module)
        session.flush()

    package = existing.get("package")
    if package is None:
        package = Product(
            name="编辑器+栖光UI+绘制工具+3D交互",
            product_code="ha-bridge",
            price_cents=7990,
            validity_days=None,
            product_type="package",
            feature_codes_json=list_json(BASE_PRODUCT_FEATURES + MODULE_3D_FEATURES),
            included_product_ids_json=list_json([module.id]),
            active=True,
            sort_order=100,
            fulfillment_mode="automatic",
        )
        session.add(package)
        session.flush()

    logger.info(
        "已写入商品：%s / %s / %s", base.name, module.name, package.name
    )
    return {"base": base, "module": module, "package": package}


def seed_release(session: Session) -> None:
    exists = session.scalars(select(Release).limit(1)).first()
    if exists is not None:
        logger.info("版本记录已存在，跳过。")
        return
    session.add(
        Release(
            product="ha-bridge",
            channel="docker",
            version="0.4.6",
            release_date="2026-09-01",
            upgrade_notes=(
                "1. 自动户型图支持选择全楼或指定楼层生成。\n"
                "2. 管理员账号改为独立存储。\n"
                "3. 优化 3D 灯光预加载与反向代理下的模型加载。"
            ),
        )
    )
    session.flush()
    logger.info("已写入 docker 渠道版本记录 0.4.6")


def seed_settings(session: Session) -> StoreSetting:
    setting = session.get(StoreSetting, 1)
    if setting is None:
        setting = StoreSetting(id=1)
        session.add(setting)
        session.flush()
        logger.info("已写入站点默认配置。")
    return setting


def main() -> None:
    settings = load_settings()
    admin_email = settings.bootstrap_admin_email or DEFAULT_ADMIN_EMAIL
    admin_password = settings.bootstrap_admin_password or DEFAULT_ADMIN_PASSWORD
    if not settings.bootstrap_admin_email:
        logger.warning(
            "未设置 STORE_ADMIN_EMAIL / STORE_ADMIN_PASSWORD，使用默认管理员 %s / %s",
            DEFAULT_ADMIN_EMAIL,
            DEFAULT_ADMIN_PASSWORD,
        )

    app = create_app(settings)
    with app.state.database.session() as session:
        seed_settings(session)
        seed_admin(session, admin_email, admin_password)
        seed_products(session)
        seed_release(session)

    print()
    print("初始化完成。")
    print(f"  数据目录: {settings.data_dir}")
    print(f"  数据库:   {settings.database_path}")
    print(f"  密钥目录: {settings.license_keys_dir}")
    print(f"  管理后台: {settings.public_base_url}/admin")
    print(f"  管理员:   {admin_email}")
    print()


if __name__ == "__main__":
    main()
