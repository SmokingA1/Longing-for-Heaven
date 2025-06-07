from pydantic import Field, EmailStr, BaseModel
from uuid import UUID

class AdminBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    email: EmailStr = Field(...)
    phone_number: str = Field(..., min_length=8, max_length=15)
    avatar_url: str = Field("static/avatars/d-avatar.jpg", min_length=1)


class AdminCreate(AdminBase):
    password: str = Field(..., min_length=8, max_length=50)


class AdminRead(AdminBase):
    id: UUID

    model_config = {"from_attributes": True}


class UserBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    email: EmailStr = Field(...)
    phone_number: str | None = Field(None, min_length=8, max_length=15)
    avatar_url: str = Field("static/avatars/d-avatar.jpg", min_length=1)
    country: str | None = Field(None, min_length=2, max_length=50)
    city: str | None = Field(None, min_length=2, max_length=100)
    street: str | None = Field(None, min_length=2, max_length=100)

    
class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=50)


class UserPublic(UserBase):
    id: UUID

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=50)
    email: EmailStr | None= Field(None)
    phone_number: str | None = Field(None, min_length=8, max_length=15)
    avatar_url: str | None = Field(None, min_length=1)
    country: str | None = Field(None, min_length=2, max_length=50)
    city: str | None = Field(None, min_length=2, max_length=100)
    street: str | None = Field(None, min_length=2, max_length=100)


class ProductBase(BaseModel):
    # user_id: UUID = Field(...)
    name: str = Field(..., min_length=1, max_length=100)
    price: int = Field(...)
    stock: int = Field(0)


class ProductCreate(ProductBase):
    password: str = Field(..., min_length=8, max_length=50)


class ProductPublic(ProductBase):
    id: UUID

    model_config = {"from_attributes": True}


class ProductUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=100)
    description: str | None = Field(None, min_length=1, max_length=255)
    price: int | None = Field(None)
    stock: int | None = Field(None)


class ProductImageBase(BaseModel):
    product_id: UUID = Field(...)
    photo_url: str = Field(..., min_length=1, max_length=255)


class ProductImageCreate(ProductImageBase):
    pass


class ProductImagePublic(ProductImageBase):
    id: UUID

    model_config = {"from_attributes": True}


class OrderBase(BaseModel):
    user_id: UUID
    product_id: UUID
    quantity: int = Field(1, ge=1)
    total_price: int = Field(..., ge=0)
    status: str = Field("pending", max_length=20)


class OrderCreate(OrderBase):
    pass


class OrderPublic(OrderBase):
    id: UUID

    model_config = {"from_attributes": True}


class OrderUpdate(BaseModel):
    quantity: int | None = Field(None, ge=1)
    total_price: int | None = Field(None, ge=0)
    status: str | None = Field(None, max_length=20)


class TokenPayload(BaseModel):
    sub: str
    exp: float
    

class Message(BaseModel):
    data: str