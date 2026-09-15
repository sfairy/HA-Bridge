"""登录与验证码的失败限流（基于数据库，跨进程一致）。"""

from __future__ import annotations

from datetime import timedelta

from sqlalchemy import delete, func, select
from sqlalchemy.orm import Session

from store.models import LoginAttempt, utcnow

MAX_ATTEMPTS = 8
WINDOW_MINUTES = 10


def record_attempt(session: Session, scope: str, *, succeeded: bool) -> None:
    session.add(LoginAttempt(scope=scope, succeeded=succeeded))
    session.flush()


def _count_recent(session: Session, scope: str) -> int:
    since = utcnow() - timedelta(minutes=WINDOW_MINUTES)
    statement = (
        select(func.count())
        .select_from(LoginAttempt)
        .where(LoginAttempt.scope == scope)
        .where(LoginAttempt.succeeded.is_(False))
        .where(LoginAttempt.created_at >= since)
    )
    return int(session.execute(statement).scalar_one() or 0)


def retry_after_seconds(session: Session, scope: str) -> int:
    """超限时返回需要等待的秒数，未超限返回 0。"""
    failures = _count_recent(session, scope)
    if failures < MAX_ATTEMPTS:
        return 0
    since = utcnow() - timedelta(minutes=WINDOW_MINUTES)
    oldest = session.execute(
        select(func.min(LoginAttempt.created_at))
        .where(LoginAttempt.scope == scope)
        .where(LoginAttempt.succeeded.is_(False))
        .where(LoginAttempt.created_at >= since)
    ).scalar_one_or_none()
    if oldest is None:
        return 0
    elapsed = (utcnow() - oldest).total_seconds()
    return max(1, int(WINDOW_MINUTES * 60 - elapsed))


def clear(session: Session, scope: str) -> None:
    session.execute(delete(LoginAttempt).where(LoginAttempt.scope == scope))


def prune(session: Session) -> None:
    """清理过期记录，避免表无限增长。"""
    cutoff = utcnow() - timedelta(hours=6)
    session.execute(delete(LoginAttempt).where(LoginAttempt.created_at < cutoff))
