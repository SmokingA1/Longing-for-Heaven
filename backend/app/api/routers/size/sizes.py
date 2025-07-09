from typing import Any
from uuid import UUID

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from app.schemas import SizeCreate, SizePublic, Message
from app.api.deps import SessionDep
from app.models import Size

from app.services.size import (
    get_size_by_id,
    get_sizes,
    create_size,
    delete_size
)
router = APIRouter(prefix="/sizes", tags=["Sizes"])

@router.get("/", response_model=list[SizePublic])
async def read_sizes(
    db: SessionDep
) -> Any:
    """
    Retrieve all sizes.
    """

    db_sizes = await get_sizes(db=db)

    return db_sizes


@router.get("/{size_id}", response_model=SizePublic)
async def read_size_by_id(
    db: SessionDep,
    size_id: UUID,
) -> Any:
    """
    Retrieve size by size id.
    """

    db_size = await get_size_by_id(db=db, size_id=size_id)

    if not db_size:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Size not found!")

    return db_size


@router.post("/create", response_model=SizePublic)
async def create_new_size(db: SessionDep, size_create: SizeCreate) -> Any:
    """
    Creating new size with required data.
    """

    query = select(Size).where(Size.name == size_create.name)
    db_existing_size = await db.execute(query)
    if db_existing_size.scalars().first():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Such size alreay exists")

    new_size = await create_size(db=db, size_create=size_create)

    if not new_size:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Error while creating new size, supposed a such size already exists!")
    
    return new_size


@router.delete("/delete/{size_id}", response_model=Message)
async def delete_existing_size(db: SessionDep, size_id: UUID) -> Any:
    """
    Deleting existing size by size id.
    """

    db_size = await get_size_by_id(db=db, size_id=size_id)

    if not db_size:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Such size doens't exists!")
    
    deleted_size = await delete_size(db=db, size_id=size_id)

    return Message(data="Size has been deleted successfully!")