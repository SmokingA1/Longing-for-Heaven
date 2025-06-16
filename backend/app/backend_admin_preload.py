from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Admin
from app.core.config import settings
from app.core.security import hash_password

async def initializate_admin(db: AsyncSession):
    db_admin = await db.execute(select(Admin).where(Admin.email == settings.ADMIN_EMAIL))
    db_admin = db_admin.scalar_one_or_none()

    if db_admin:
        return db_admin
    
    new_admin = Admin(
        name="Name",
        email=settings.ADMIN_EMAIL,
        hashed_password=hash_password(settings.ADMIN_PASSWORD),
        avatar_url=f"{settings.AVATAR_UPLOAD_DIR}/d-avatar.jpg",
        phone_number=settings.ADMIN_PHONE_NUMBER,
    )

    db.add(new_admin)
    await db.commit()
    await db.refresh(new_admin)

    return new_admin