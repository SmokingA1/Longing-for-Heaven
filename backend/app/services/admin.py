from typing import List
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models import Admin
from app.schemas import AdminCreate
from app.core.security import hash_password

async def get_admin_by_id(*, db: AsyncSession, admin_id: UUID) -> Admin:
    db_admin = await db.get(Admin, admin_id)
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
