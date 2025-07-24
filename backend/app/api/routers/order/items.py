from typing import List
from uuid import UUID

from fastapi import APIRouter, HTTPException, status, Query

from app.services.order.item import (
    get_order_item_by_id,
    get_order_items,
    get_order_items_by_order_id,
    create_order_item,
    update_order_item_by_id,
    delete_order_item_by_id
)
from app.services.order.order import get_order_by_id
from app.schemas import OrderItemCreate, OrderItemPublic, OrderItemUpdate, Message
from app.api.deps import SessionDep

router = APIRouter(prefix="/order-items", tags=['OrderItem'])

@router.get("/", response_model=List[OrderItemPublic])
async def read_order_items(
    db: SessionDep,
    offset: int = Query(0, title="Number of order items to skip."),
    limit: int = Query(20, title="Number of order items to display.")
):
    """
    Receiving order items with pagination
    """

    db_order_items = await get_order_items(db=db, offset=offset, limit=limit)

    return db_order_items


@router.get("/{order_item_id}", response_model=OrderItemPublic)
async def read_order_item_by_id(
    db: SessionDep,
    order_item_id: UUID
):
    """
    Receiving order item by id.
    """

    db_order_item = await get_order_item_by_id(db=db, order_item_id=order_item_id)

    if not db_order_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order item not found!")
    
    return db_order_item


@router.get("/order/{order_id}", response_model=List[OrderItemPublic])
async def read_orders_by_order_id(
    db: SessionDep,
    order_id: UUID
):
    """
    Receiving order items by order id .
    """
    db_order = await get_order_by_id(db=db, order_id=order_id)

    if not db_order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order by id not found!")

    db_order_items = await get_order_items_by_order_id(
        db=db, order_id=order_id
    )

    return db_order_items


@router.post("/", response_model=OrderItemPublic)
async def create_new_order_item(
    db: SessionDep, 
    order_item_create: OrderItemCreate
):
    """
    Creating new order item
    """

    new_order_item = await create_order_item(db=db, order_item_create=order_item_create)
    
    if not new_order_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Something went wrong!")
    
    return new_order_item


@router.put("/{order_item_id}", response_model=OrderItemPublic)
async def update_existing_order_item(
    db: SessionDep,
    order_item_id: UUID,
    order_item_update: OrderItemUpdate
):
    """
    Updating order item by id.
    """

    updated_order_item = await update_order_item_by_id(
        db=db, order_item_id=order_item_id, order_item_update=order_item_update
    )

    if not updated_order_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order item nout found!")
    
    return updated_order_item


@router.delete("/{order_item_id}", response_model=Message)
async def delete_existing_order_item(
    db: SessionDep,
    order_item_id: UUID
):
    """
    Deleting existing order item by id.
    """

    deleted_order_item = await delete_order_item_by_id(db=db, order_item_id=order_item_id)

    if not deleted_order_item:
        raise  HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order item nout found!")
    
    return deleted_order_item