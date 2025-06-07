from fastapi import APIRouter

from app.api.routers.user import users
from app.api.routers.user import login

router = APIRouter()

router.include_router(login.router)
router.include_router(users.router)
