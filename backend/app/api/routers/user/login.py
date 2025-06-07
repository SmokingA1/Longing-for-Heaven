from typing import Annotated, Any

from fastapi import APIRouter, Depends, Response, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm

from app.schemas import Message
from app.api.deps import SessionDep
from app.core.security import create_access_token, is_blocked, increment_attempts
from app.services.user import authenticate
import app.core.redis as redis_module
from app.utils.logger import logger

router = APIRouter(tags=["Login"])

@router.post("/login", response_model=Message)
async def login(
    db: SessionDep,
    response: Response,
    request: Request,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> Any:
    """
    Authenticate a user using their email and password, and set an access token as a cookie.
    """

    ip = request.client.host
    key = f"login_attempts:{ip}"

    if redis_module.redis is None:
        raise RuntimeError("Redis не инициализирован — вызови init_redis при старте приложения")

    attempts = await redis_module.redis.get(key)
    logger.info(f"LOGIN ATTEMPTS FOR IP: {ip} - {attempts}")

    if await is_blocked(key=key):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many login attempts. Try again later."
        )
    
    db_user = await authenticate(db=db, user_email=form_data.username, password=form_data.password)

    if not db_user:
        await increment_attempts(key=key)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password!"
        )
    
    access_token = create_access_token(sub=db_user.id)
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite="lax"
    )

    await redis_module.redis.delete(key)

    return Message(data="Signed in successfully!")

