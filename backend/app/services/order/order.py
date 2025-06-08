# from typing import List
# from uuid import UUID

# from sqlalchemy.ext.asyncio import AsyncSession
# from sqlalchemy import select

# from app.models import Order
# from app.schemas import OrderCreate, OrderUpdate


# async def get_order_by_id(*, db: AsyncSession, order_id: UUID) -> Order:
#     db_order = await db.get(Order, order_id)
#     return db_order


# async def get_orders(
#     *,
#     db: AsyncSession,
#     offset: int = 0,
#     limit: int = 20,
# ) -> List[Order]:
#     query = select(Order)

#     query = query.offset(offset=offset).limit(limit=limit)

#     result = await db.execute(query)
#     db_orders = result.scalars().all()

#     return db_orders


# async def get_orders_by_user_id(
#     *,
#     db: AsyncSession,
#     user_id: UUID,
# ) -> List[Order]:
#     query = select(Order).where(Order.user_id == user_id)

#     result = await db.execute(query)
#     db_orders = result.scalars().all()

#     return db_orders


# async def get_orders_by_prdouct_id(
#     *,
#     db: AsyncSession,
#     product_id: UUID,
# ) -> List[Order]:
#     query = select(Order).where(Order.product_id == product_id)

#     result = await db.execute(query)
#     db_orders = result.scalars().all()

#     return db_orders


# async def create_order(*, db: AsyncSession, order_create: OrderCreate) -> Order:
#     new_order = Order(**order_create)

#     if not new_order:
#         return None
    
#     db.add(new_order)
#     await db.commit()
#     await db.refresh(new_order)

#     return new_order


# async def update_order(*, db: AsyncSession, order_id: UUID, order_update: OrderUpdate) -> Order | None:
#     db_order = await get_order_by_id(db=db, order_id=order_id)

#     if not db_order:
#         return None 
    
#     for k, v in order_update.dict(exclude_unset=True).items():
#         setattr(db_order, k, v)

#     await db.commit()
#     await db.refresh(db_order)

#     return db_order


# async def delete_order(*, db: AsyncSession, order_id: UUID) -> Order | None:
#     db_order = await get_order_by_id(db=db, order_id=order_id)

#     if not db_order:
#         return None 
    
#     await db.delete(db_order)
#     await db.commit()

#     return db_order