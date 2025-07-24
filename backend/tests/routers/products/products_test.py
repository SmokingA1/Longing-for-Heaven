import pytest
from httpx import AsyncClient

from tests.fixtures.product_fixtures import created_product_size_id, created_product_id, created_size_id
pytestmark = pytest.mark.anyio


async def test_create_product(
    client: AsyncClient
):
    product_data = {
        "name": "test_name",
        "description": "test_description",
        "price": 3500,
        "stock": 200
    }
    create_response = await client.post("/products/create", json=product_data)
    assert create_response.status_code == 200
    create_response_data = create_response.json()
    assert create_response_data["name"] == product_data["name"] and create_response_data["stock"] == product_data["stock"]


async def test_get_products(
    client: AsyncClient
):
    response = await client.get("/products/")
    print(response.json())
    assert response.status_code == 200
    assert len(response.json()) >= 1


async def test_get_product_by_id(
    client: AsyncClient, created_product_id: str
):
    response = await client.get(f"/products/{created_product_id}")
    assert response.status_code == 200
    response_data = response.json()
    assert response_data["name"] == "test_id"


async def test_update_product_by_id(
    client: AsyncClient, created_product_id: str
): 
    product_update_data = {
        "name": None,
        "description": "Other description",
        "price": None,
        "stock": 100
    }
    update_response = await client.put(f"/products/update/{created_product_id}", json=product_update_data)
    assert update_response.status_code == 200
    update_response_data = update_response.json()
    assert update_response_data["stock"] == 100


async def test_delete_product_by_id(
    client: AsyncClient
):
    product_data = {
        "name": "test_del",
        "description": "test_del",
        "price": 10,
        "stock": 10
    }
    create_response = await client.post("/products/create", json=product_data)
    assert create_response.status_code == 200
    create_response_data = create_response.json()
    assert create_response_data["id"]

    product_id = create_response_data["id"]
    delete_response = await client.delete(f"/products/delete/{product_id}")
    assert delete_response.status_code in (200, 204)


#Size
async def test_create_size(
    client: AsyncClient
):
    # sizes - list = m, l, xl, xxl
    size_data = {
        "name": "l",
    }
    create_response = await client.post("/sizes/create", json=size_data)
    assert create_response.status_code == 200
    assert create_response.json()["name"] == "l"




async def test_get_size_by_id(
    client: AsyncClient, created_size_id: str
):
    response = await client.get(f"/sizes/{created_size_id}")
    assert response.status_code == 200
    response_data = response.json()
    assert response_data["name"] == "m"


#Product image
async def test_create_product_image(
    client: AsyncClient, created_product_id: str
):
    product_image_data = {
        "product_id": created_product_id,
        "photo_url": "static/products/test_photo.jpg"

    }
    create_response = await client.post("/product-images/create", json=product_image_data)
    assert create_response.status_code == 200
    create_response_data = create_response.json()
    assert create_response_data["product_id"] == created_product_id
    assert create_response_data["photo_url"] == "static/products/test_photo.jpg"


#ProductSize
async def test_create_product_size(
    client: AsyncClient, created_size_id: str, created_product_id: str
):
    product_size_data = {
        "product_id": created_product_id,
        "size_id": created_size_id,
        "quantity": 200
    }
    create_response = await client.post(f"/product-sizes/create", json=(product_size_data))
    assert create_response.status_code == 200
    create_response_data = create_response.json()
    assert create_response_data["product_id"] == created_product_id and create_response_data["size_id"] == created_size_id