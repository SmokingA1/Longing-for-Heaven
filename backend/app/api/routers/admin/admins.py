from uuid import UUID
from typing import List

from fastapi import APIRouter, HTTPException, status

from app.schemas import AdminCreate, AdminRead, Message
from app.services.admin import get_admin_by_id, get_admins, create_admin, delete_admin_by_id
from app.api.deps import SessionDep, CurrentAdmin

router = APIRouter(prefix="/admins", tags=["Admin"])

@router.get("/", response_model=List[AdminRead])
async def read_admins(db: SessionDep):
    """
    Retrieve list of admins.
    """

    db_admins = await get_admins(db=db)

    if not db_admins:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Admins not found!")
    
    return db_admins


@router.get("/current", response_class=AdminRead)
async def read_admin_by_id(db: SessionDep, current_admin: CurrentAdmin):
    """
    Retrieve admin by his id.
    """

    return current_admin


@router.get("/{amdin_id}", response_class=AdminRead)
async def read_admin_by_id(db: SessionDep, admin_id: UUID):
    """
    Retrieve admin by his id.
    """

    db_admin = await get_admin_by_id(db=db, admin_id=admin_id)

    if not db_admin:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Admin not found!")
        
    return db_admin


@router.post("/create", response_model=AdminRead)
async def create_new_admin(db: SessionDep, admin_create: AdminCreate):
    """
    Creating new admin.
    """

    new_admin = await create_admin(db=db, admin_create=admin_create)

    if not new_admin:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong while creating new admin."
        )
    
    return new_admin


@router.delete("/delete/{admin_id}", response_model=Message)
async def delete_admin(db: SessionDep, admin_id: UUID):
    """
    Deleting admin by id.
    """

    db_admin = await get_admin_by_id(db=db, admin_id=admin_id)

    if not db_admin:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Admin not found!")
        
    deleted_admin = await delete_admin_by_id(db=db, admin_id=admin_id)

    if not deleted_admin:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong while deleting admin."
        )
    
    return Message(data="Admin deleted successfully!")