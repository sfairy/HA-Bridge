"""API 层公共依赖：数据库会话与登录态。"""

from __future__ import annotations

from typing import Annotated, Iterator

from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from store.models import Account, AccountSession
from store.config import StoreSettings
from store.security import token_hash, utcnow

SESSION_COOKIE = "ha_bridge_store_session"


def get_session(request: Request) -> Iterator[Session]:
    database = request.app.state.database
    with database.session() as session:
        yield session


DbSession = Annotated[Session, Depends(get_session)]


def _resolve_session(request: Request, session: Session) -> AccountSession | None:
    token = request.cookies.get(request.app.state.settings.cookie_name)
    if not token:
        return None
    record = session.get(AccountSession, token_hash(token))
    if record is None:
        return None
    if record.expires_at <= utcnow():
        session.delete(record)
        session.flush()
        return None
    return record


def current_account(request: Request, session: DbSession) -> Account | None:
    record = _resolve_session(request, session)
    if record is None:
        return None
    account = session.get(Account, record.account_id)
    if account is None or not account.is_active:
        return None
    return account


CurrentAccount = Annotated[Account | None, Depends(current_account)]


def require_account(account: CurrentAccount) -> Account:
    if account is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="请先登录。"
        )
    return account


AuthedAccount = Annotated[Account, Depends(require_account)]


def require_admin(account: AuthedAccount) -> Account:
    if not account.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="需要管理员权限。"
        )
    return account


AdminAccount = Annotated[Account, Depends(require_admin)]


def get_settings(request: Request) -> StoreSettings:
    return request.app.state.settings


SettingsDep = Annotated[StoreSettings, Depends(get_settings)]
