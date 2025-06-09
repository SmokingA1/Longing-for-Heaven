from pydantic import Field, EmailStr, BaseModel
from uuid import UUID
from enum import Enum as PyEnum


class AdminBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=50, description="Admin name")
    email: EmailStr = Field(..., description="Admin email adress")
    phone_number: str = Field(..., min_length=8, max_length=15, description="Admin phone number")
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
    country: str | None = Field(None, min_length=2, max_length=50, description="User country for shipping")
    city: str | None = Field(None, min_length=2, max_length=100, description="User city for shipping")
    street: str | None = Field(None, min_length=2, max_length=100, description="User street for shipping")

    
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
    name: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., min_length=1, max_length=255)
    price: int = Field(...)
    stock: int = Field(0)


class ProductCreate(ProductBase):
    pass


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


class OrderStatus(PyEnum):
    PENDING = "pending"
    PAID = "paid"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    CANCELLED = "cancelled"
    RETURNED = "returned"


class OrderBase(BaseModel):
    user_id: UUID
    total_price: int = Field(..., ge=0)
    status: OrderStatus = Field(OrderStatus.PENDING)


class OrderCreate(OrderBase):
    pass


class OrderPublic(OrderBase):
    id: UUID

    order_items: list["OrderItemPublic"]

    model_config = {"from_attributes": True}


class OrderRead(OrderBase):
    id: UUID
    
    model_config = {"from_attributes": True}


class OrderUpdate(BaseModel):
    total_price: int | None = Field(None, ge=0)
    status: OrderStatus | None = Field(None)


class OrderItemBase(BaseModel):
    order_id: UUID
    product_id: UUID
    quantity: int = Field(default=1, ge=1)
    price: int = Field(default=0)


class OrderItemCreate(OrderItemBase):
    pass


class OrderItemPublic(OrderItemBase):
    id: UUID

    product: "ProductPublic"

    model_config = {"from_attributes": True}


class OrderItemUpdate(BaseModel):
    quantity: int | None = Field(None, ge=1)
    price: int | None = Field(None)


class CartBase(BaseModel):
    user_id: UUID


class CartPublic(CartBase):
    id: UUID

    cart_items: list["CartItemPublic"]

    model_config = {"from_attributes": True}


class CartItemBase(BaseModel):
    cart_id: UUID
    product_id: UUID
    quantity: int = Field(default=1, ge=1)
    price: int = Field(default=0)


class CartItemCreate(CartItemBase):
    pass


class CartItemPublic(CartItemBase):
    id: UUID

    product: "ProductPublic"

    model_config = {"from_attributes": True}


class CartItemUpdate(BaseModel):
    quantity: int | None = Field(None, ge=1)
    price: int | None = Field(None)


class TokenPayload(BaseModel):
    sub: str
    exp: float
    

class Message(BaseModel):
    data: str


OrderPublic.model_rebuild()
OrderItemPublic.model_rebuild()
CartPublic.model_rebuild()
CartItemPublic.model_rebuild()