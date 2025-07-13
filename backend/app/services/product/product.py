from typing import List
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import joinedload, with_loader_criteria

from app.models import Product, ProductSize, ProductImage
from app.schemas import ProductCreate, ProductUpdate

from app.utils.logger import logger

async def get_product_by_id(*, db: AsyncSession, product_id: UUID) -> Product:
    query = select(Product).options(joinedload(Product.images), joinedload(Product.sizes).joinedload(ProductSize.size)).where(Product.id == product_id)
    result = await db.execute(query)
    db_product = result.scalars().first()
    return db_product


async def get_products(
    *,
    db: AsyncSession,
    offset: int = 0,
    limit: int = 20,
    
) -> List[Product]:
    query = select(Product).options(
        #в каждом Продукте подгружаю изображения, а так же подгружаю размеры продукта, и к каждому размеру продукта я подгружаю название размера то-есть размер
            joinedload(Product.images),
            joinedload(Product.sizes).joinedload(ProductSize.size)
        )

    query = query.offset(offset=offset).limit(limit=limit)

    result = await db.execute(query)
    db_products = result.unique().scalars().all()

    return db_products


async def create_product(*, db: AsyncSession, product_create: ProductCreate) -> Product:
    new_product = Product(**product_create.model_dump())

    logger.info(f"New product: {new_product}")

    db.add(new_product)
    await db.commit()
    await db.refresh(new_product)

    query = select(Product).where(Product.id == new_product.id).options(joinedload(Product.images), joinedload(Product.sizes).joinedload(ProductSize.size))
    # почему это здесь, к каждому продукту после создания я подтягиваю фотки(по сути пустой масив), размеры(тоже пусто так как нету созданых размеров у только что появившегося) ну и для каждого размера его название size ладно все
    result = await db.execute(query)
    new_product = result.unique().scalars().first()

    return new_product


async def update_product_by_id(
    *,
    db: AsyncSession,
    product_id: UUID,
    product_update: ProductUpdate,
) -> Product:
    db_product = await get_product_by_id(db=db, product_id=product_id)

    if not db_product:
        return None
    
    for k, v in product_update.dict(exclude_unset=True).items():
        if v is not None:  # Если value является не None if value != None: setattr
            setattr(db_product, k, v)

    await db.commit()
    await db.refresh(db_product)

    return db_product


async def delete_product_by_id(
    *,
    db: AsyncSession,
    product_id: UUID,
) -> Product | None:
    db_product = await get_product_by_id(db=db, product_id=product_id)

    if not db_product:
        return None
    
    await db.delete(db_product)
    await db.commit()

    return db_product