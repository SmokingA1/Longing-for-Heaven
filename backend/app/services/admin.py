from typing import List
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models import Admin
from app.schemas import AdminCreate
from app.core.security import hash_password, verify_password

async def get_admin_by_id(*, db: AsyncSession, admin_id: UUID) -> Admin:
    db_admin = await db.get(Admin, admin_id)
    return db_admin


async def get_admin_by_email(*, db: AsyncSession, admin_email: str) -> Admin:
    query = await db.execute(select(Admin).where(Admin.email == admin_email))
    db_admin = query.scalars().first()
    return db_admin


async def get_admins(db: AsyncSession) -> List[Admin]:
    query = await db.execute(select(Admin))
    db_admins = query.scalars().all()

    return db_admins


async def create_admin(*, db: AsyncSession, admin_create: AdminCreate) -> Admin:
    new_admin = Admin(
        name = admin_create.name,
        phone_number = admin_create.phone_number,
        email = admin_create.email,
        hashed_password = hash_password(admin_create.password),
        avatar_url = admin_create.avatar_url,
    )

    db.add(new_admin)
    await db.commit()
    await db.refresh(new_admin)

    return new_admin


async def delete_admin_by_id(*, db: AsyncSession, admin_id: UUID) -> Admin:
    db_admin = await get_admin_by_id(db, admin_id)

    if not db_admin:
        return None
    
    await db.delete(db_admin)
    await db.commit()

    return db_admin


async def authenticate(db: AsyncSession, admin_email: str, password: str) -> Admin | None:
    db_admin = await get_admin_by_email(db=db, admin_email=admin_email)

    if not db_admin or not verify_password(password, db_admin.hashed_password):
        return None
    
    return db_admin