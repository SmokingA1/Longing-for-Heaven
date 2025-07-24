from typing import AsyncGenerator
from datetime import datetime, timezone, tzinfo

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import DateTime, TypeDecorator

from app.core.config import settings

class Base(DeclarativeBase):
    pass

class TZDateTime(TypeDecorator):
    impl = DateTime
    cache_ok = True

    def process_bind_param(self, value, dialect):
        if value is not None:
            if not value.tzinfo:
                raise TypeError("tzinfo is required")
            value = value.astimezone(timezone.utc).replace(tzinfo=None)
        return value

    def process_result_value(self, value, dialect):
        if value is not None:
            value = value.replace(tzinfo=timezone.utc)
        return value

class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(TZDateTime(), default=datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(TZDateTime(), default=datetime.now(timezone.utc) ,onupdate=datetime.now(timezone.utc))


engine = create_async_engine(settings.asyncpg_DB_URL, echo=True)
async_session = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    autoflush=False,
    autocommit=False,
)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as async_s:
        yield async_s