from typing import List
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import joinedload

from app.models import Order, OrderItem
from app.schemas import OrderCreate, OrderUpdate


async def get_order_by_id(*, db: AsyncSession, order_id: UUID) -> Order:
    query = select(Order).options(
        joinedload(Order.order_items).options(joinedload(OrderItem.product), joinedload(OrderItem.size))
    ).where(Order.id == order_id)

    db_order = await db.execute(query)
    return db_order.unique().scalars().first()


async def get_orders(
    *,
    db: AsyncSession,
    offset: int = 0,
    limit: int = 20,
) -> List[Order]:
    query = select(Order)

    query = query.options(joinedload
        (Order.order_items).options(joinedload(OrderItem.product), joinedload(OrderItem.size))
    )
    query = query.offset(offset=offset).limit(limit=limit)


    result = await db.execute(query)
    db_orders = result.unique().scalars().all()

    return db_orders


async def get_orders_by_user_id(
    *,
    db: AsyncSession,
    user_id: UUID,
) -> List[Order]:
    query = select(Order).where(Order.user_id == user_id)
    query = query.options(
        joinedload(Order.order_items).options(joinedload(OrderItem.product), joinedload(OrderItem.size))
    )

    result = await db.execute(query)
    db_orders = result.unique().scalars().all()

    return db_orders


async def create_order(*, db: AsyncSession, order_create: OrderCreate) -> Order:
    new_order = Order(**order_create.model_dump())

    db.add(new_order)
    await db.commit()
    await db.refresh(new_order)

    query = select(Order).options(
        joinedload(Order.order_items).options(joinedload(OrderItem.product), joinedload(OrderItem.size))
    ).where(Order.id == new_order.id)
    result = await db.execute(query)
    new_order = result.unique().scalars().first()

    return new_order


async def update_order(*, db: AsyncSession, order_id: UUID, order_update: OrderUpdate) -> Order | None:
    db_order = await get_order_by_id(db=db, order_id=order_id)

    if not db_order:
        return None 
    
    for k, v in order_update.dict(exclude_unset=True).items():
        if v is not None:
            setattr(db_order, k, v)

    await db.commit()
    await db.refresh(db_order)

    return db_order


async def delete_order(*, db: AsyncSession, order_id: UUID) -> Order | None:
    db_order = await get_order_by_id(db=db, order_id=order_id)

    if not db_order:
        return None 
    
    await db.delete(db_order)
    await db.commit()

    return db_order