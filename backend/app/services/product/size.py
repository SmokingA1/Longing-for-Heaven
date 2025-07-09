from typing import List
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import joinedload


from app.models import ProductSize
from app.schemas import ProductSizeCreate

async def get_product_size_by_id(
    db: AsyncSession,
    product_id: UUID,
    size_id: UUID,
) -> ProductSize | None:
    query = select(ProductSize).where(
        ProductSize.product_id == product_id,
        ProductSize.size_id == size_id
    )

    result = await db.execute(query)
    return result.scalar_one_or_none()


async def get_product_sizes(
    db: AsyncSession,
    offset: int = 0,
    limit: int = 20, 
) -> List[ProductSize]:
    query = select(ProductSize).options(
        joinedload(ProductSize.size), joinedload(ProductSize.product)
        )

    query = query.offset(offset=offset).limit(limit=limit)

    result = await db.execute(query)
    db_product_sizes = result.unique().scalars().all()

    return db_product_sizes


async def create_product_size(
    db: AsyncSession, 
    product_size_create: ProductSizeCreate
) -> ProductSize:
    new_product_size = ProductSize(**product_size_create.model_dump())

    db.add(new_product_size)
    await db.commit()
    await db.refresh(new_product_size)

    return new_product_size


async def delete_product_size(
    db: AsyncSession,
    product_id: UUID,
    size_id: UUID,
) -> ProductSize | None:
    db_product_size = await get_product_size_by_id(db, product_id, size_id)

    if not db_product_size:
        return None

    await db.delete(db_product_size)
    await db.commit()
    return db_product_size