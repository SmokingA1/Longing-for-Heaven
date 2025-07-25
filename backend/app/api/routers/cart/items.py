from typing import List, Any
from uuid import UUID

from fastapi import APIRouter, HTTPException, status, Query

from app.schemas import CartItemCreate, CartItemPublic, CartItemUpdate, Message, CartItemCreateWCart
from app.services.cart.item import (
    get_cart_item_by_id,
    get_cart_items,
    get_cart_items_by_cart_id,
    create_cart_item,
    create_cart_item_w_cart,
    update_cart_item_by_id,
    delete_cart_item_by_id
)
from app.services.cart.cart import get_cart_by_user_id
from app.api.deps import SessionDep, CurrentUser

router = APIRouter(prefix="/cart-items", tags=["CartItem"])

@router.get("/", response_model=List[CartItemPublic])
async def read_cart_items(
    db: SessionDep,
    offset: int = Query(0, title="Number of cart items to skip."),
    limit: int = Query(20, title="Number of cart items to output."),
) -> Any:
    """
    Retrieve cart items with pagination.
    """

    db_cart_items = await get_cart_items(db=db, offset=offset, limit=limit)

    if not db_cart_items:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart items not found!")
    
    return db_cart_items


@router.get("/{cart_item_id}", response_model=CartItemPublic)
async def read_cart_item_by_id(
    db: SessionDep,
    cart_item_id: UUID,
) -> Any:
    """
    Retrieve a specific cart item by id.
    """

    db_cart_item = await get_cart_item_by_id(db=db, cart_item_id=cart_item_id)

    if not db_cart_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart item not found!")
    
    return db_cart_item


@router.get("/cart/{cart_id}", response_model=List[CartItemPublic])
async def read_cart_items_by_cart_id(
    db: SessionDep,
    cart_id: UUID,
) -> Any:
    """
    Retrieve cart items by cart id.
    """

    db_cart_items = await get_cart_items_by_cart_id(db=db, cart_id=cart_id)

    if not db_cart_items:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart items not found in the cart.")
    
    return db_cart_items


@router.post("/create", response_model=CartItemPublic)
async def create_new_cart_item(
    db: SessionDep,
    cart_item_create: CartItemCreate,
) -> Any:
    """
    Creating new cart item by product id and cart id.
    """

    new_cart_item = await create_cart_item(db=db, cart_item_create=cart_item_create)

    return new_cart_item


@router.post("/create/user", response_model=CartItemPublic)
async def create_new_cart_item(
    db: SessionDep,
    cart_item_create: CartItemCreateWCart,
    current_user: CurrentUser,
) -> Any:
    """
    Creating new cart item by product id and cart by user id.
    """
    db_user_cart = await get_cart_by_user_id(db=db, user_id=current_user.id)
    
    if not db_user_cart:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart not found!")
    

    new_cart_item = await create_cart_item_w_cart(db=db, cart_item_create=cart_item_create, cart_id=db_user_cart.id)

    return new_cart_item


@router.put("/update/{cart_item_id}", response_model=CartItemPublic)
async def update_cart_item(
    db: SessionDep,
    cart_item_id: UUID,
    cart_item_update: CartItemUpdate,
) -> Any:
    """
    Update cart item by id.
    """

    updated_cart_item = await update_cart_item_by_id(db=db, cart_item_id=cart_item_id, cart_item_update=cart_item_update)

    if not updated_cart_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart item not found!")

    return updated_cart_item


@router.patch("/{cart_item_id}/increment", response_model=CartItemPublic)
async def inrement_quantity(
    *,
    db: SessionDep,
    cart_item_id: UUID,
):
    db_cart_item = await get_cart_item_by_id(db=db, cart_item_id=cart_item_id)
    if not db_cart_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Such cart item not found!")
    if db_cart_item.quantity >= db_cart_item.product.stock:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum stock reached"
        )
    else:
        db_cart_item.quantity += 1    
        await db.commit()
        await db.refresh(db_cart_item)
        return db_cart_item


@router.patch("/{cart_item_id}/decrement", response_model=CartItemPublic)
async def decrement_quantity(
    *,
    db: SessionDep,
    cart_item_id: UUID,
):
    db_cart_item = await get_cart_item_by_id(db=db, cart_item_id=cart_item_id)
    if not db_cart_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Such cart item not found!")
    if db_cart_item.quantity <= 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Minimun quantity reached"
        )
    else:
        db_cart_item.quantity -= 1    
        await db.commit()
        await db.refresh(db_cart_item)
        return db_cart_item


@router.delete("/delete/{cart_item_id}", response_model=Message)
async def delete_cart_item(
    db: SessionDep,
    cart_item_id: UUID,
) -> Any:
    """
    Delete cart item by id.
    """

    deleted_cart_item = await delete_cart_item_by_id(db=db, cart_item_id=cart_item_id)

    if not deleted_cart_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart item not found!")
    
    return Message(data="Cart item deleted successfully!")