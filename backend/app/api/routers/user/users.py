from typing import List, Any
from uuid import UUID
from datetime import datetime, timedelta

from pydantic import ValidationError
from fastapi import APIRouter, Query, HTTPException, status, Response
import jwt
from jwt import InvalidTokenError


from app.api.deps import SessionDep, CurrentUser
from app.schemas import (
    UserCreate,
    UserPublic,
    UserUpdate,
    Message,
    EmailRequest,
    UserRecoverPassword,
    TokenPayload
)
from app.services.user import (
    get_users,
    get_user_by_email,
    get_user_by_id,
    get_user_by_phone,
    create_user,
    update_user_by_id,
    delete_user_by_id,
)
from app.utils.utils import generate_new_account_email, send_email, generate_recover_password_email
from app.core.config import settings
from app.core.security import hash_password

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
    
    if settings.emails_enabled and user_create.email:
        email_data = generate_new_account_email(
            email_to=user_create.email,
            username=user_create.name,
            password=user_create.password
        )
        send_email(
            email_to=user_create.email,
            subject=email_data.subject,
            html_content=email_data.html_content
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




@router.post("/reset-password", response_model=Message)
async def reset_password(db: SessionDep, email_request: EmailRequest):
    """
    Endpoint for sending an email for existing user by email to reset password.
    """
    db_user = await get_user_by_email(db=db, user_email=email_request.email)

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User by email not found!"
        )
    
    email_data = generate_recover_password_email(
        email=db_user.email,
        username=db_user.name
    )
    send_email(
        email_to=db_user.email,
        subject=email_data.subject,
        html_content=email_data.html_content
    )

    return Message(data="Email sent successfully")


@router.post("/recover-password", response_model=Message)
async def recover_password(db: SessionDep, user_recover: UserRecoverPassword):
    """
    Endpoint to set new password by decoding in token
    """
    try:
        token_payload = jwt.decode(user_recover.token, key=settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        token_data = TokenPayload(**token_payload)
        if token_data.exp < datetime.utcnow().timestamp():
            raise HTTPException(status_code=status.HTTP_408_REQUEST_TIMEOUT, detail="Token has expired!")
    except (ValidationError, InvalidTokenError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials!"
        )
    
    db_user = await get_user_by_email(db=db, user_email=str(token_data.sub))

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found!"
        )
    
    db_user.hashed_password = hash_password(user_recover.new_password)

    await db.commit()
    await db.refresh(db_user)

    return Message(data="Password has been successfully reset.")