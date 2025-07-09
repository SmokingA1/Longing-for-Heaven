from typing import Any
from uuid import UUID

from fastapi import APIRouter, HTTPException, status, Query

from app.schemas import ProductSizeCreate, ProductSizePublic, Message
from app.services.product.size import (
    get_product_size_by_id,
    get_product_sizes,
    create_product_size,
    delete_product_size
)
from app.api.deps import SessionDep

router = APIRouter(prefix="/product-sizes", tags=["ProductSize"])

@router.get("/", response_model=list[ProductSizePublic])
async def read_product_sizes(
    db: SessionDep, 
    offset: int = Query(0, title="Number of users to skip."),
    limit: int = Query(20, title="Maximum number of users to return.")
) -> Any:
    """
    Retrieve list of product_size
    """

    db_product_sizes = await get_product_sizes(db=db, offset=offset, limit=limit)

    return db_product_sizes


@router.get("/product/{product_id}/size/{size_id}", response_model=ProductSizePublic)
async def read_product_size_by_id(
    db: SessionDep,
    product_id: UUID,
    size_id: UUID
) -> Any:
    """
    Retrieve product_size by product and size id
    """

    db_product_size = await get_product_size_by_id(db=db, product_id=product_id, size_id=size_id)

    if not db_product_size:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Such product size not found")
    
    return db_product_size


@router.post("/create", response_model=ProductSizePublic)
async def create_new_product_size(
    db: SessionDep,
    product_size_create: ProductSizeCreate,
) -> Any:
    """
    Creating new product size by product_id and size_id as primary key
    """

    new_product_size = await create_product_size(db=db, product_size_create=product_size_create)

    if not new_product_size:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error while creating new product")
    
    return new_product_size


@router.delete("/delete/product/{product_id}/size/{size_id}", response_model=Message)
async def delete_existing_product_size(
    db: SessionDep,
    product_id: UUID,
    size_id: UUID
) -> Any:
    """
    Deleting product size by product and size id. 
    """

    deleted_product_size = await delete_product_size(db=db, product_id=product_id, size_id=size_id)

    if not deleted_product_size:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Such product size not found!")

    return Message(data="Product size deleted successfully!")