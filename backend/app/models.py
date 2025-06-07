from uuid import UUID, uuid4

from sqlalchemy.orm import mapped_column, Mapped, relationship
from sqlalchemy import ForeignKey, String, Integer
from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base, TimestampMixin

class Admin(Base, TimestampMixin):
    __tablename__ = "admins"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    phone_number: Mapped[str] = mapped_column(String(15), nullable=False, unique=True)
    avatar_url: Mapped[str] = mapped_column(String(255), nullable=False)
    

class User(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    email: Mapped[str] = mapped_column(String(255), nullable=False, index=True, unique=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    phone_number: Mapped[str | None] = mapped_column(String(15), default=None, nullable=True, index=True, unique=True)
    avatar_url: Mapped[str] = mapped_column(String(255), nullable=False)
    country: Mapped[str| None] = mapped_column(String(50), nullable=True)
    city: Mapped[str | None] = mapped_column(String(100), nullable=True)
    street: Mapped[str | None] = mapped_column(String(100), nullable=True)

    orders: Mapped[list["Order"]] = relationship(back_populates="user", cascade="all, delete-orphan")


class Product(Base, TimestampMixin):
    __tablename__ = "products"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True, index=True)
    description: Mapped[str] = mapped_column(String(255), nullable=False)
    price: Mapped[int] = mapped_column(Integer, nullable=False)
    stock: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    images: Mapped[list["ProductImage"]] = relationship(back_populates="product", cascade="all, delete-orphan")
    orders: Mapped[list["Order"]] = relationship(back_populates="product", cascade="all, delete-orphan")


class ProductImage(Base, TimestampMixin):
    __tablename__ = "productimages"
    
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    product_id: Mapped[UUID] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    photo_url: Mapped[str] = mapped_column(String(255), nullable=False)
    
    product: Mapped["Product"] = relationship(back_populates="images")


class Order(Base, TimestampMixin):
    __tablename__ = "orders"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    product_id: Mapped[UUID] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    quantity: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    total_price: Mapped[int] = mapped_column(Integer, nullable=False)  # фиксируем цену на момент заказа
    status: Mapped[str] = mapped_column(String(20), default="pending")  # например: pending, paid, shipped

    user: Mapped["User"] = relationship(back_populates="orders")
    product: Mapped["Product"] = relationship(back_populates="orders")
