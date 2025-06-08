from typing import Any, List
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, status

from app.schemas import ProductCreate, ProductPublic, ProductUpdate, Message
from backend.app.services.product.product import (
    get_product_by_id,
    get_products,
    create_product,
    update_product_by_id,
    delete_product_by_id
)
from app.api.deps import CurrentUser, SessionDep

router = APIRouter(prefix="/products", tags=["Product"])

@router.get("/", response_model=List[ProductPublic])
async def read_products(
    db: SessionDep,
    offset: int = Query(0, title="Number of products to skip."),
    limit: int = Query(20, title="Maximum number of products to return.")    
) -> Any:
    """
    Retrieve products with pagination
    """

    db_products = await get_products(db=db, offset=offset, limit=limit)

    if not db_products:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Products not found!")
    
    return db_products


@router.get("/{product_id}", response_model=ProductPublic)
async def read_product_by_id(db: SessionDep, product_id: UUID) -> Any:
    """
    Retrieve a specific products by id.
    """

    db_product = await get_product_by_id(db=db, product_id=product_id)

    if not db_product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found!")
    
    return db_product


@router.post("/create", response_model=ProductPublic)
async def create_new_product(db: SessionDep, product_create: ProductCreate) -> Any:
    """
    Creating new product with product_create form.
    """

    new_product = await create_new_product(db=db, product_create=product_create)

    if not new_product:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Something went wrong while creating new product."
        )
    
    return new_product


@router.put("/update/{product_id}", response_model=ProductPublic)
async def update_product(db: SessionDep, product_id: UUID, product_update: ProductUpdate) -> Any:
    """
    Updating existing product by product_id.
    """

    updated_product = await update_product_by_id(db=db, product_id=product_id, product_update=product_update)

    if not updated_product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found."
        )
    
    return updated_product


@router.delete("/delete/{product_id}", response_model=Message)
async def delete_product(db: SessionDep, product_id: UUID) -> Any:
    """
    Deleting product by id.
    """

    deleted_product = await delete_product_by_id(db=db, product_id=product_id)

    if not deleted_product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found!"
        )
    
    return deleted_product