from uuid import UUID
from typing import List

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import joinedload

from app.models import OrderItem
from app.schemas import OrderItemCreate, OrderItemUpdate


async def get_order_item_by_id(*, db: AsyncSession, order_item_id: UUID) -> OrderItem:
    query = select(OrderItem).options(
        joinedload(OrderItem.product), joinedload(OrderItem.size)
    ).where(OrderItem.id == order_item_id)

    db_order_item = await db.execute(query)
    return db_order_item.unique().scalars().first()


async def get_order_items(
    *,
    db: AsyncSession,
    offset: int = 0,
    limit: int = 20,
) -> List[OrderItem]:
    query = select(OrderItem)

    query = query.offset(offset=offset).limit(limit=limit).options(
        joinedload(OrderItem.product), joinedload(OrderItem.size)
    )
    result = await db.execute(query)
    db_order_items = result.unique().scalars().all()

    return db_order_items


async def get_order_items_by_order_id(
    *,
    db: AsyncSession,
    order_id: UUID,
) -> List[OrderItem]:
    query = select(OrderItem).options(
        joinedload(OrderItem.product), joinedload(OrderItem.size)
    ).where(OrderItem.order_id == order_id)

    result = await db.execute(query)
    db_order_items = result.unique().scalars().all()

    return db_order_items


async def create_order_item(
    *,
    db: AsyncSession,
    order_item_create: OrderItemCreate,
) -> OrderItem:
    new_order_item = OrderItem(**order_item_create.model_dump())

    db.add(new_order_item)
    await db.commit()
    await db.refresh(new_order_item)

    query = select(OrderItem).options(
        joinedload(OrderItem.product), joinedload(OrderItem.size)
    ).where(OrderItem.id == new_order_item.id)
    result = await db.execute(query)
    res = result.unique().scalars().first()

    return res



async def update_order_item_by_id(
    *,
    db: AsyncSession,
    order_item_id: int,
    order_item_update: OrderItemUpdate,
) -> OrderItem | None:
    db_order_item = await get_order_item_by_id(db=db, order_item_id=order_item_id)

    if not db_order_item:
        return None
    
    for k, v in order_item_update.dict(exclude_unset=True).items():
        if v is not None:
            setattr(db_order_item, k, v)    

    await db.commit()
    await db.refresh(db_order_item)

    return db_order_item


async def delete_order_item_by_id(
    *,
    db: AsyncSession,
    order_item_id: UUID,
) -> OrderItem | None:
    db_order_item = await get_order_item_by_id(db=db, order_item_id=order_item_id)

    if not db_order_item:
        return None
    
    await db.delete(db_order_item)
    await db.commit()

    return db_order_item