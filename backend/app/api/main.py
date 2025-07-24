from fastapi import APIRouter

from app.api.routers.user import users
from app.api.routers.user import login as user_login
from app.api.routers.product import products
from app.api.routers.product import images
from app.api.routers.product import sizes as product_sizes
from app.api.routers.size import sizes
from app.api.routers.admin import admins
from app.api.routers.admin import login as admin_login
from app.api.routers.cart import carts
from app.api.routers.cart import items as cart_items
from app.api.routers.np import nova_poshta
from app.api.routers.order import orders, items as order_items

router = APIRouter()

router.include_router(user_login.router)
router.include_router(users.router)
router.include_router(products.router)
router.include_router(sizes.router)
router.include_router(product_sizes.router)
router.include_router(images.router)
router.include_router(admins.router)
router.include_router(admin_login.router)
router.include_router(carts.router)
router.include_router(cart_items.router)
router.include_router(nova_poshta.router)
router.include_router(orders.router)
router.include_router(order_items.router)