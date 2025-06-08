from typing import List, Any
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, status

from app.schemas import ProductImageCreate, ProductImagePublic, Message
from app.services.product.image import (
    get_product_im_by_id,
    get_product_ims,
    get_product_ims_by_product_id,
    create_product_im,
    delete_product_im
)
from app.api.deps import SessionDep


router = APIRouter(prefix="/product-images", tags=["ProductImage"])


@router.get("/", response_model=List[ProductImagePublic])
async def read_product_images(
    db: SessionDep,
    offset: int = Query(0, title="Number of product images to skip."),
    limit: int = Query(20, title="Maximum number of products images to return.")
) -> Any:
    """
    Retrieve product images.
    """

    db_product_ims = await get_product_ims(db=db, offset=offset, limit=limit)

    if not db_product_ims:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product images were not found!")
    
    return db_product_ims


@router.get("/{product_im_id}", response_model=ProductImagePublic)
async def read_product_im_by_id(db: SessionDep, product_im_id: UUID) -> Any:
    """
    Retrieve product image by his id.
    """

    db_product_im = await get_product_im_by_id(db=db, product_im_id=product_im_id)

    if not db_product_im:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product image was not found!")
    
    return db_product_im


@router.get("/product/{product_id}", response_model=List[ProductImagePublic])
async def read_product_im_by_product_id(db: SessionDep, product_id: UUID) -> Any:
    """
    Retrieve product images by product id.
    """
    
    db_product_ims = await get_product_ims_by_product_id(db=db, product_id=product_id)

    if not db_product_ims:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product images were not found!")

    return db_product_ims


@router.post("/create", response_model=ProductImagePublic)
async def create_new_product_im(db: SessionDep, product_im_create: ProductImageCreate) -> Any:
    """
    Creating new product image.
    """

    new_product_image = await create_product_im(db=db, product_im_create=product_im_create)

    if not new_product_image:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong while creating new product image."
        )
    
    return new_product_image



@router.delete("/delete/{product_im_id}", response_model=Message)
async def delete_product_image_by_id(db: SessionDep, product_im_id: UUID) -> Any:
    """
    Deleting product image by his id
    """

    db_product_im = await get_product_im_by_id(db=db, product_im_id=product_im_id)

    if not db_product_im:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product image was not found!")

    deleted_product_im = await delete_product_im(db=db, product_im_id=product_im_id)

    if not delete_product_im:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong while deleting product image."
        )
    
    return Message(data="Product image deleted successfully!")