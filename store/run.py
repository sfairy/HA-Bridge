"""启动授权商店服务：``python -m store.run``。

默认监听 ``0.0.0.0:18082``，可用 ``STORE_HOST`` / ``STORE_PORT`` 覆盖。
"""

from __future__ import annotations

import logging

import uvicorn

from store.app import create_app
from store.config import load_settings


def main() -> None:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)-7s %(name)s | %(message)s",
    )
    settings = load_settings()
    app = create_app(settings)
    uvicorn.run(app, host=settings.host, port=settings.port, log_level="info")


if __name__ == "__main__":
    main()
