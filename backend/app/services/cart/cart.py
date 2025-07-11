from typing import List
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import joinedload

from app.models import Cart, CartItem, Product, ProductSize
from app.schemas import CartCreate


async def get_carts(
    *,
    db: AsyncSession,
    offset: int = 0, 
    limit: int = 20,
) -> List[Cart]:
    query = select(Cart).options(
        joinedload(Cart.cart_items).options(joinedload(CartItem.product), joinedload(CartItem.size))
    ).offset(offset=offset).limit(limit=limit)

    result = await db.execute(query)
    db_carts = result.unique().scalars().all()

    return db_carts


async def get_cart_by_id(
    *,
    db: AsyncSession,
    cart_id: UUID,
) -> Cart:
    query = select(Cart).where(Cart.id == cart_id).options(
        joinedload(Cart.cart_items).options(joinedload(CartItem.product), joinedload(CartItem.size))
    )
    result = await db.execute(query)
    db_cart = result.unique().scalars().first()
    return db_cart


async def get_cart_by_user_id(
    *,
    db: AsyncSession,
    user_id: UUID,
) -> Cart:
    query = select(Cart).where(Cart.user_id == user_id).options(
        joinedload(Cart.cart_items).options(joinedload(CartItem.product), joinedload(CartItem.size))
    )
    result = await db.execute(query)
    db_cart = result.unique().scalars().first()
    return db_cart


# this gpt advice is pretty usefull i guess this method allow avoid 2 function above and below like getting by user id and creating!
async def get_or_create_cart_by_user_id(*, db: AsyncSession, user_id: UUID) -> Cart:
    cart = await get_cart_by_user_id(db=db, user_id=user_id)
    if cart:
        return cart
    new_cart = Cart(user_id=user_id)
    db.add(new_cart)
    await db.commit()
    await db.refresh(new_cart)

    query = select(Cart).where(Cart.id == new_cart.id).options(
        joinedload(Cart.cart_items).options(joinedload(CartItem.product), joinedload(CartItem.size))
    )
    result = await db.execute(query)
    new_cart = result.scalars().first()

    return new_cart


async def create_cart(
    *,
    db: AsyncSession,
    cart_create: CartCreate,
) -> Cart:
    new_cart = Cart(**cart_create.model_dump())

    db.add(new_cart)
    await db.commit()
    await db.refresh(new_cart)


    query = select(Cart).where(Cart.id == new_cart.id).options(
        joinedload(Cart.cart_items).options(joinedload(CartItem.product), joinedload(CartItem.size))
    )
    result = await db.execute(query)
    new_cart = result.scalars().first()

    return new_cart


async def delete_cart_by_id(
    *,
    db: AsyncSession,
    cart_id: UUID,
) -> Cart | None:
    db_cart = await db.get(Cart, cart_id)

    if not db_cart:
        return None
    
    await db.delete(db_cart)
    await db.commit()

    return db_cart