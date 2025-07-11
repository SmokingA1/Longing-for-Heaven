from uuid import UUID, uuid4
from enum import Enum as PyEnum

from sqlalchemy.orm import mapped_column, Mapped, relationship
from sqlalchemy import ForeignKey, String, Integer, Enum, PrimaryKeyConstraint
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
    carts: Mapped[list["Cart"]] = relationship(back_populates="user", cascade="all, delete-orphan")


class Product(Base, TimestampMixin):
    __tablename__ = "products"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True, index=True)
    description: Mapped[str] = mapped_column(String(255), nullable=False)
    price: Mapped[int] = mapped_column(Integer, nullable=False)
    stock: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    sizes: Mapped[list["ProductSize"]] = relationship(back_populates="product", cascade="all, delete-orphan") # Связи с размерами, доступными для этого продукта
    images: Mapped[list["ProductImage"]] = relationship(back_populates="product", cascade="all, delete-orphan")
    order_items: Mapped[list["OrderItem"]] = relationship(back_populates="product", cascade="all, delete-orphan")
    cart_items: Mapped[list["CartItem"]] = relationship(back_populates="product", cascade="all, delete-orphan")


class SizeEnum(str, PyEnum):
    M = "m"
    L = "l"
    XL = "xl"
    XXL = "xxl"


class Size(Base, TimestampMixin):
    __tablename__ = "sizes"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    name: Mapped[SizeEnum] = mapped_column(Enum(SizeEnum, name="sizeenum"), nullable=False, unique=True)

    products: Mapped[list["ProductSize"]] = relationship(back_populates="size", cascade="all, delete-orphan") # продукты связаные с этим размером
    cart_items: Mapped[list["CartItem"]] = relationship(back_populates="size", cascade="all, delete-orphan")


class ProductSize(Base, TimestampMixin):
    __tablename__ = "productsizes"

    product_id: Mapped[UUID] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    size_id: Mapped[UUID] = mapped_column(ForeignKey("sizes.id", ondelete="CASCADE"), nullable=False)
    quantity: Mapped[int] = mapped_column(default=0, nullable=False)
    
    size: Mapped["Size"] = relationship(back_populates="products")
    product: Mapped["Product"] = relationship(back_populates="sizes")

    __table_args__ = (
        PrimaryKeyConstraint("product_id", "size_id"),
        # НЕ МОЖЕТЬ БЫТЬ ПРОДУКТ1, L ; ПРОДУКТ1, L; а вот PRODUCT1, L; PRODUCT1, XL; or PRODUCT1, L; PRODUCT2, L;
    )


class ProductImage(Base, TimestampMixin):
    __tablename__ = "product_images"
    
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    product_id: Mapped[UUID] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    photo_url: Mapped[str] = mapped_column(String(255), nullable=False)
    
    product: Mapped["Product"] = relationship(back_populates="images")


# under the most intereset magic xd ORDERS
class StatusEnum(PyEnum):
    PENDING = "pending"
    PAID = "paid"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"
    RETURNED = "returned"
    

class PaymentStatusEnum(PyEnum):
    PENDING = "pending"
    PAID = "paid"
    REFUNDED = "refunded"


class PaymentMethodEnum(PyEnum):
    CARD = "card"
    COD = "cod"


class Order(Base, TimestampMixin):
    __tablename__ = "orders"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    total_price: Mapped[int] = mapped_column(Integer, nullable=False)  # фиксируем цену на момент заказа
    status: Mapped[StatusEnum] = mapped_column(Enum(StatusEnum, name="statusenum"), default=StatusEnum.PENDING, nullable=False)
    shipping_country: Mapped[str] = mapped_column(String(50), nullable=False)
    shipping_city: Mapped[str] = mapped_column(String(50), nullable=False)
    shipping_street: Mapped[str] = mapped_column(String(255), nullable=False) #post address ?
    post_index: Mapped[int] = mapped_column(Integer, nullable=False)
    payment_method: Mapped[PaymentMethodEnum] = mapped_column(Enum(PaymentMethodEnum, name="paymentmethod"), nullable=False, default=PaymentMethodEnum.CARD)
    payment_status: Mapped[PaymentStatusEnum] = mapped_column(Enum(PaymentStatusEnum, name="paymentstatus"), nullable=False, default=PaymentStatusEnum.PENDING)

    user: Mapped["User"] = relationship(back_populates="orders")
    order_items: Mapped[list["OrderItem"]] = relationship(back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base, TimestampMixin):
    __tablename__ = "order_items"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    order_id: Mapped[UUID] = mapped_column(ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    product_id: Mapped[UUID] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    price: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    order: Mapped["Order"] = relationship(back_populates="order_items")
    product: Mapped["Product"] = relationship(back_populates="order_items")







# CART CART CART CART ITEM
class Cart(Base, TimestampMixin):
    __tablename__ = "carts"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    user: Mapped["User"] = relationship(back_populates="carts")
    cart_items: Mapped[list["CartItem"]] = relationship(back_populates="cart", cascade="all, delete-orphan")


class CartItem(Base, TimestampMixin):
    __tablename__ = "cart_items"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    cart_id: Mapped[UUID] = mapped_column(ForeignKey("carts.id", ondelete="CASCADE"), nullable=False)
    size_id: Mapped[UUID] = mapped_column(ForeignKey("sizes.id", ondelete="CASCADE"), nullable=False)
    product_id: Mapped[UUID] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    # price: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    thumbnail: Mapped[str] = mapped_column(String, nullable=False)

    cart: Mapped["Cart"] = relationship(back_populates="cart_items")
    product: Mapped["Product"] = relationship(back_populates="cart_items")
    size: Mapped["Size"] = relationship(back_populates="cart_items")

# Something yet payment, reviews etc.