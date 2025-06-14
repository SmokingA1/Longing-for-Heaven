from typing import List, Any
from uuid import UUID

from fastapi import APIRouter, Query, HTTPException, status, Response

from app.api.deps import SessionDep, CurrentUser
from app.schemas import UserCreate, UserPublic, UserUpdate, Message
from app.services.user import (
    get_users,
    get_user_by_email,
    get_user_by_id,
    get_user_by_phone,
    create_user,
    update_user_by_id,
    delete_user_by_id,
)

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/", response_model=List[UserPublic])
async def read_users(
    db: SessionDep,
    offset: int = Query(0, title="Number of users to skip."),
    limit: int = Query(20, title="Maximum number of users to return.")
) -> Any:
    """
    Retrieve all users with pagination.
    """

    db_users = await get_users(db=db, offset=offset, limit=limit)

    if not db_users:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Users not found!"
        )

    return db_users


@router.get("/me", response_model=UserPublic)
async def read_user_me(current_user: CurrentUser) -> Any:
    """
    Retrieve user by token from cookie with depending.
    """

    return current_user


@router.get("/{user_id}", response_model=UserPublic)
async def read_user_by_id(db: SessionDep, user_id: UUID) -> Any:
    """
    Retrieve a specific user by his id.
    """

    db_user = await get_user_by_id(db=db, user_id=user_id)

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found!"
        )
    
    return db_user


@router.get("/email/{user_email}", response_model=UserPublic)
async def read_user_by_email(db: SessionDep, user_email: str) -> Any:
    """
    Retrieve a specific user by his email.
    """

    db_user = await get_user_by_email(db=db, user_email=user_email)

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found!"
        )
    
    return db_user


@router.get("/phone/{user_phone}", response_model=UserPublic)
async def read_user_by_phone(db: SessionDep, user_phone: str) -> Any:
    """
    Retrieve a specific user by his phone number.
    """

    db_user = await get_user_by_phone(db=db, user_phone=user_phone)

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found!"
        )
    
    return db_user


@router.post("/create/", response_model=UserPublic)
async def create_new_user(db: SessionDep, user_create: UserCreate) -> Any:
    """
    Creating new user by UserCreate form.
    """
    db_user_email = await get_user_by_email(db=db, user_email=user_create.email)
    db_user_phone = await get_user_by_phone(db=db, user_phone=user_create.phone_number)

    if db_user_email:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Such email already exists.")
    if db_user_phone and db_user_phone.phone_number != None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Such phone number already exists.")
        

    new_user = await create_user(db=db, user_create=user_create)

    if not new_user:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server error while creating new user."
        )
    
    return new_user


@router.put("/update/me", response_model=UserPublic)
async def update_user_me(
    db: SessionDep,
    current_user: CurrentUser,
    user_update: UserUpdate
) -> Any:
    """
    Updating current user by access_token from cookie.
    """

    db_user_email = await get_user_by_email(db=db, user_email=user_update.email)
    db_user_phone = await get_user_by_phone(db=db, user_phone=user_update.phone_number)

    if db_user_email and db_user_email.email != current_user.email:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Such email already exists.")
    if db_user_phone and db_user_phone.phone_number != None and db_user_phone.phone_number != current_user.phone_number:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Such phone number already exists.")

    updated_user = await update_user_by_id(db=db, user_id=current_user.id, user_update=user_update)

    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server error while updating current user."
        )
    
    return updated_user


@router.put("/update/{user_id}", response_model=UserPublic)
async def update_user(
    db: SessionDep,
    user_id: UUID,
    user_update: UserUpdate,
) -> Any:
    """
    Updating a specific user by id.
    """

    db_user_email = await get_user_by_email(db=db, user_email=user_update.email)
    db_user_phone = await get_user_by_phone(db=db, user_phone=user_update.phone_number)

    if db_user_email and db_user_email.email != user_update.email:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Such email already exists.")
    if db_user_phone and db_user_phone.phone_number != None and db_user_phone.phone_number != user_update.phone_number:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Such phone number already exists.")

    db_user = await get_user_by_id(db=db, user_id=user_id)

    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    updated_user = await update_user_by_id(db=db, user_id=user_id, user_update=user_update)

    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server error while updating specific user."
        )
    
    return updated_user


@router.delete("/delete/me", response_model=Message)
async def delete_me(db: SessionDep, current_user: CurrentUser):
    """
    Deleting current user.
    """

    deleted_user = await delete_user_by_id(db=db, user_id=current_user.id)

    if not deleted_user:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong while deleting user."
        )

    return Message(data="User deleted successfully.")


@router.delete("/delete/{user_id}", response_model=Message)
async def delete_user(db: SessionDep, user_id: UUID) -> Any:
    """
    Deleting a specific user by id.
    """

    db_user = await get_user_by_id(db=db, user_id=user_id)

    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
    
    deleted_user = await delete_user_by_id(db=db, user_id=user_id)

    if not deleted_user:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong while deleting user."
        )

    return Message(data="User deleted successfully.")