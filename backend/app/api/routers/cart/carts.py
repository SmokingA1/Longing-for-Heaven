from typing import List, Any
from uuid import UUID

from fastapi import APIRouter, Query, HTTPException, status

from app.schemas import CartCreate, CartPublic, Message
from app.services.cart.cart import (
    get_cart_by_id,
    get_cart_by_user_id,
    get_carts,
    get_or_create_cart_by_user_id,
    create_cart,
    delete_cart_by_id,
)
from app.api.deps import CurrentUser, SessionDep

router = APIRouter(prefix="/carts", tags=["Cart"])


@router.get("/", response_model=List[CartPublic])
async def read_carts(
    db: SessionDep,
    offset: int = Query(0, title="Number of carts to skip."),
    limit: int = Query(20, title="Number of carts to display."),
) -> Any:
    """
    Retrieve all carts with pagination.
    """

    db_carts = await get_carts(db=db, offset=offset, limit=limit)

    if not db_carts:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Carts not found!")
    
    return db_carts


@router.get("/{cart_id}", response_model=CartPublic)
async def read_cart_by_id(db: SessionDep, cart_id: UUID) -> Any:
    """
    Retrieve a specific cart by id.
    """

    db_cart = await get_cart_by_id(db=db, cart_id=cart_id)

    if not db_cart:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart not found!")
    
    return db_cart


@router.get("/user/me", response_model=CartPublic)
async def read_my_cart(
    db: SessionDep,
    current_user: CurrentUser,
) -> Any:
    """
    Retrieve current user cart.
    """

    db_user_cart = await get_cart_by_user_id(db=db, user_id=current_user.id)
    
    if not db_user_cart:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart not found!")
    
    return db_user_cart


@router.get("/user/{user_id}", response_model=CartPublic)
async def read_cart_by_user_id(
    db: SessionDep,
    user_id: UUID,
) -> Any:
    """
    Retrieve user cart by his id.
    """

    db_user_cart = await get_cart_by_user_id(db=db, user_id=user_id)

    if not db_user_cart:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart not found!")
    
    return db_user_cart


@router.get("/user-goc/{user_id}", response_model=CartPublic)
async def read_or_create_cart_by_user_id(
    db: SessionDep,
    user_id: UUID,
) -> Any:
    """
    Retrieve or create new cart for user by id.
    """

    db_cart = await get_or_create_cart_by_user_id(db=db, user_id=user_id)

    if not db_cart:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart not found!")
    
    return db_cart


# create delete
@router.post("/create", response_model=CartPublic)
async def create_new_cart(
    db: SessionDep,
    cart_create: CartCreate,
) -> Any:
    """
    Creating new cart or user if not created yet.
    """

    db_cart = await get_cart_by_user_id(db=db, user_id=cart_create.user_id)

    if db_cart:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="User already has cart.")
    
    new_cart = await create_cart(db=db, cart_create=cart_create)
    return new_cart


@router.delete("/delete/{cart_id}", response_model=Message)
async def delete_existing_cart(
    db: SessionDep,
    cart_id: UUID,
) -> Any:
    """
    Deleting cart by id.
    """

    deleted_cart = await delete_cart_by_id(db=db, cart_id=cart_id)

    if not deleted_cart:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart not found!")
    
    return Message(data="Cart deleted successfully!")