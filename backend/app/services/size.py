from typing import List
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models import Size
from app.schemas import SizeCreate



async def get_size_by_id(db: AsyncSession, size_id: UUID) -> Size | None:
    db_size = await db.get(Size, size_id)

    if not db_size:
        return None
    
    return db_size


async def get_sizes(
    db: AsyncSession
) -> List[Size]:
    query = await db.execute(select(Size))
    db_sizes = query.scalars().all()

    return db_sizes


async def create_size(
    db: AsyncSession,
    size_create: SizeCreate
) -> Size:
    new_size = Size(**size_create.model_dump())

    db.add(new_size)
    await db.commit()
    await db.refresh(new_size)

    return new_size


async def delete_size(
    db: AsyncSession,
    size_id: UUID,
) -> Size:
    db_size = await get_size_by_id(db=db, size_id=size_id)

    if not db_size:
        return None
    
    await db.delete(db_size)
    await db.commit()

    return db_size