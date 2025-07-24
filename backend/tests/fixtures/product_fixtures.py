import pytest
from httpx import AsyncClient

pytestmark = pytest.mark.anyio


@pytest.fixture(scope="function")
async def created_product_id(
    client: AsyncClient
):
    product_data = {
        "name": "test_id",
        "description": "test_description",
        "price": 3500,
        "stock": 200
    }
    create_response = await client.post("/products/create", json=product_data)
    assert create_response.status_code == 200
    create_response_data = create_response.json()
    assert create_response_data["id"]

    yield create_response_data["id"]

    delete_response = await client.delete(f"/products/delete/{create_response_data["id"]}")
    assert delete_response.status_code in (200, 204)


@pytest.fixture(scope="function")
async def created_size_id(
    client: AsyncClient
):
    size_data = {
        "name": "m",
    }
    create_response = await client.post("/sizes/create", json=size_data)
    assert create_response.status_code == 200
    create_response_data = create_response.json()
    assert create_response_data["id"]

    yield create_response_data["id"]

    delete_response = await client.delete(f"/sizes/delete/{create_response_data["id"]}")
    delete_response.status_code == 200


@pytest.fixture(scope="function")
async def created_product_size_id(
    client: AsyncClient, created_product_id: str, created_size_id: str
):
    product_size_data = {
        "product_id": created_product_id,
        "size_id": created_size_id,
        "quantity": 200
    }
    create_response = await client.post(f"/product-sizes/create", json=(product_size_data))
    assert create_response.status_code == 200
    create_response_data = create_response.json()
    assert create_response_data["id"]
    
    yield create_response_data["id"]

    delete_response = await client.delete(f"/product-sizes/delete/{create_response_data["id"]}")
    delete_response.status_code == 200