from __future__ import annotations

from collections.abc import Iterator

from sqlalchemy import create_engine, event
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker
from sqlalchemy.pool import NullPool


class Base(DeclarativeBase):
    pass


class Database:
    def __init__(self, database_url: str) -> None:
        # SQLite does not benefit from a multi-connection QueuePool; NullPool
        # opens a connection per checkout and avoids writer contention buildup.
        self.engine = create_engine(
            database_url,
            connect_args={'check_same_thread': False, 'timeout': 30},
            poolclass=NullPool,
            pool_pre_ping=True,
        )
        event.listen(self.engine, 'connect', self._configure_sqlite)
        self.session_factory = sessionmaker(bind=self.engine, autoflush=False, expire_on_commit=False)

    @staticmethod
    def _configure_sqlite(connection, _record) -> None:
        cursor = connection.cursor()
        cursor.execute('PRAGMA foreign_keys=ON')
        cursor.execute('PRAGMA journal_mode=WAL')
        cursor.execute('PRAGMA busy_timeout=30000')
        cursor.close()

    def sessions(self) -> Iterator[Session]:
        with self.session_factory() as session:
            yield session

    def dispose(self) -> None:
        self.engine.dispose()
