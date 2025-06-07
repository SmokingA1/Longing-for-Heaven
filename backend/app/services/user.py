from typing import List
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models import User
from app.schemas import UserUpdate, UserCreate
from app.core.security import hash_password
from app.core.security import verify_password

async def get_user_by_id(*, db: AsyncSession, user_id: UUID) -> User:
    db_user = await db.get(User, user_id)
    return db_user


async def get_user_by_email(*, db: AsyncSession, user_email: str) -> User:
    query = await db.execute(select(User).where(User.email == user_email))
    db_user = query.scalars().first()
    return db_user


async def get_user_by_phone(*, db: AsyncSession, user_phone: str) -> User:
    query = await db.execute(select(User).where(User.phone_number == user_phone))
    db_user = query.scalars().first()
    return db_user


async def get_users(
    *,
    db: AsyncSession,
    offset: int = 0,
    limit: int = 20,
) -> List[User]:
    query = select(User)

    query = query.offset(offset).limit(limit)

    result = await db.execute(query)
    db_users = result.scalars().all()

    return db_users


async def create_user(*, db: AsyncSession, user_create: UserCreate) -> User:
    new_user = User(name = user_create.name,
                    hashed_password = hash_password(user_create.password),
                    email = user_create.email,
                    phone_number = user_create.phone_number,
                    avatar_url = user_create.avatar_url,
                    country = user_create.country,
                    city = user_create.city,
                    street = user_create.street
                    )   

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    return new_user


async def update_user_by_id(*, db: AsyncSession, user_id: UUID, user_update: UserUpdate) -> User | None:
    db_user = await get_user_by_id(db=db, user_id=user_id)

    if not db_user: 
        return None

    for k, v in user_update.dict(exclude_unset=True).items():
        if v is not None:
            setattr(db_user, k, v)

    await db.commit()
    await db.refresh(db_user)

    return db_user


async def delete_user_by_id(*, db: AsyncSession, user_id: UUID) -> User | None:
    db_user = await get_user_by_id(db=db, user_id=user_id)

    if not db_user: 
        return None

    await db.delete(db_user)
    await db.commit()

    return db_user


async def authenticate(db: AsyncSession, user_email: str, password: str) -> User | None:
    db_user = await get_user_by_email(db=db, user_email=user_email)

    if not db_user or not verify_password(password, db_user.hashed_password):
        return None
    
    return db_user