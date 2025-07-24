from typing import List, Any
from uuid import UUID

from fastapi import APIRouter, HTTPException, status, Query

from app.core.config import settings
from app.api.deps import SessionDep, CurrentUser
from app.services.order.order import (
    get_order_by_id,
    get_orders,
    get_orders_by_user_id,
    create_order,
    update_order,
    delete_order
)
from app.services.user import get_user_by_id
from app.schemas import OrderPublic, OrderCreate, OrderUpdate, Message

router = APIRouter(prefix="/orders", tags=['Order'])

@router.get("/", response_model=List[OrderPublic])
async def read_orders(
    db: SessionDep, 
    offset: int = Query(0, title="Number of orders to skip."),
    limit: int = Query(20, title="Number of orders to display."),
):
    """
    Read order with pagination by limit and page.
    """

    db_orders = await get_orders(db=db, offset=offset, limit=limit)

    return db_orders


@router.get("/{order_id}", response_model=OrderPublic)
async def read_order_by_id(
    db: SessionDep,
    order_id: UUID,
):
    """
    Read order by ordre id.
    """

    db_order = await get_order_by_id(db=db, order_id=order_id)

    if not db_order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order was not found!")
    
    return db_order


@router.get("/user/{user_id}", response_model=List[OrderPublic])
async def read_orders_by_user_id(
    db:SessionDep, 
    user_id: UUID
):
    """
    Read list user orders by his id.
    """

    db_user = await get_user_by_id(db=db, user_id=user_id)

    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User by such id not found!")

    db_user_orders = await get_orders_by_user_id(
        db=db, user_id=user_id
    )

    return db_user_orders


@router.get("/current-user/", response_model=List[OrderPublic])
async def read_orders_by_user_id(
    db:SessionDep, 
    current_user: CurrentUser
):
    """
    Read list user orders by his id.
    """

    db_user_orders = await get_orders_by_user_id(
        db=db, user_id=current_user.id
    )

    return db_user_orders


@router.post("/", response_model=OrderPublic)
async def create_new_order(db: SessionDep, order_create: OrderCreate):
    """
    Creating new order by order create schema.
    """

    new_order = await create_order(db=db, order_create=order_create)

    if not new_order:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Something went wrong!")
    
    return new_order


@router.put("/{order_id}", response_model=OrderPublic)
async def update_existing_order(
    db: SessionDep, order_id: UUID, order_update: OrderUpdate
):
    """
    Updating existing order by id
    """

    updated_order = await update_order(db=db, order_id=order_id, order_update=order_update)

    if not updated_order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    
    return updated_order


@router.delete("/{order_id}", response_model=Message)
async def delete_existing_order(
    db: SessionDep, order_id: UUID
):
    """
    Deleting existing order by id
    """

    db_order = await get_order_by_id(db=db, order_id=order_id)

    if not db_order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found!")
    
    return Message(data="Order deleted successfully!")