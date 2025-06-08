from fastapi import APIRouter

from app.api.routers.user import users
from app.api.routers.user import login as user_login
from app.api.routers.product import products
from app.api.routers.product import images
from app.api.routers.admin import admins
from app.api.routers.admin import login as admin_login

router = APIRouter()

router.include_router(user_login.router)
router.include_router(users.router)
router.include_router(products.router)
router.include_router(images.router)
router.include_router(admins.router)
router.include_router(admin_login.router)
