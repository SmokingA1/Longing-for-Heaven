from datetime import timedelta, datetime

import jwt 

import app.core.redis as redis_module
from passlib.context import CryptContext
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
MAX_ATTEMPTS = 5
BLOCK_TIME_SECONDS = 60 * 5


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(sub: str, expires_delta: timedelta | None = None):
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode = {"sub": str(sub), "exp": expire}
    encoded_jwt = jwt.encode(to_encode, key=settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


async def is_blocked(key: str) -> bool:
    attempts = await redis_module.redis.get(key)
    if attempts is not None and int(attempts) >= MAX_ATTEMPTS:
        return True
    return False


async def increment_attempts(key: str):
    current = await redis_module.redis.incr(key)
    if current == 1:
        await redis_module.redis.expire(key, BLOCK_TIME_SECONDS)