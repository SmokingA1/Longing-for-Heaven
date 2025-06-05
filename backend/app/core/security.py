from datetime import timedelta, datetime

import jwt 

from passlib.context import CryptContext
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def created_access_token(sub: str, expires_delta: timedelta | None = None):
    expire = datetime.utcnow + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EPXIRE_MINUTES))
    to_encode = {"sub": sub, "exp": expire}
    encoded_jwt = jwt.encode(to_encode, key=settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt