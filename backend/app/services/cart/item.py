from typing import List
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import joinedload

from app.models import CartItem, Product
from app.schemas import CartItemCreate, CartItemUpdate

async def get_cart_item_by_id(
    *,
    db: AsyncSession,
    cart_item_id: UUID,
) -> CartItem:
    query = select(CartItem).options(
        joinedload(CartItem.product).joinedload(Product.images)
    ).where(CartItem.id == cart_item_id)
    result = await db.execute(query)
    db_cart_item = result.unique().scalars().first()
    
    return db_cart_item


async def get_cart_items(
    *,
    db: AsyncSession,
    offset: int = 0,
    limit: int = 20,
) -> List[CartItem]:
    query = select(CartItem).options(
        joinedload(CartItem.product).joinedload(Product.images)
    )

    query = query.offset(offset=offset).limit(limit=limit)

    results = await db.execute(query)
    db_cart_items = results.unique().scalars().all()

    return db_cart_items


async def get_cart_items_by_cart_id(
    *,
    db: AsyncSession,
    cart_id: UUID,
    offset: int = 0,
    limit: int = 20,
) -> List[CartItem]:
    query = select(CartItem).options(
        joinedload(CartItem.product).joinedload(Product.images)
    ).where(CartItem.cart_id == cart_id)
    query = query.offset(offset=offset).limit(limit=limit)

    results = await db.execute(query)
    db_cart_items = results.unique().scalars().all()

    return db_cart_items


async def create_cart_item(
    *,
    db: AsyncSession,
    cart_item_create: CartItemCreate,
) -> CartItem:
    new_cart_item = CartItem(**cart_item_create.model_dump())

    db.add(new_cart_item)
    await db.commit()
    await db.refresh(new_cart_item)

    query = select(CartItem).where(CartItem.id == new_cart_item.id).options(
        joinedload(CartItem.product).joinedload(Product.images)
    )
    result = await db.execute(query)
    new_cart_item = result.unique().scalars().first()

    return new_cart_item


async def update_cart_item_by_id(
    *,
    db: AsyncSession,
    cart_item_id: UUID,
    cart_item_update: CartItemUpdate,
) -> CartItem | None:
    db_cart_item = await get_cart_item_by_id(db=db, cart_item_id=cart_item_id)

    if not db_cart_item:
        return None
    
    for k, v in cart_item_update.dict(exclude_unset=True).items():
        if v is not None:
            setattr(db_cart_item, k, v)

    await db.commit()
    await db.refresh(db_cart_item)

    return db_cart_item


async def delete_cart_item_by_id(
    *,
    db: AsyncSession,
    cart_item_id: UUID,
) -> CartItem | None:
    db_cart_item = await get_cart_item_by_id(db=db, cart_item_id=cart_item_id)

    if not db_cart_item:
        return None
    
    await db.delete(db_cart_item)
    await db.commit()

    return db_cart_item