import pytest
from httpx import AsyncClient

pytestmark = pytest.mark.anyio


async def test_create_update_user(
    client: AsyncClient
):
    test_user = {
        "name": "test_name",
        "phone_number": "+380950000000",
        "email": "testemail@gmail.com",
        "password": "testpassword",
        "avatar_url": "static/avatars/d-avatar.jpg",
    }
    create_response = await client.post("/users/create/", json=test_user)
    assert create_response.status_code == 200
    created_user = create_response.json()
    assert created_user["name"] == test_user["name"]

    user_id = created_user["id"]

    user_update_data = {
        "name": None,
        "phone_number": None,
        "email": None,
        "avatar_url": None,
        "country": "TestCountry",
        "city": "TestCity",
        "street": "TestStreet"
    }
    merged_user_data = {
        "id": user_id,
        "name": "test_name",
        "phone_number": "+380950000000",
        "email": "testemail@gmail.com",
        "avatar_url": "static/avatars/d-avatar.jpg",
        "country": "TestCountry",
        "city": "TestCity",
        "street": "TestStreet"
    }

    update_response = await client.put(f"/users/update/{user_id}", json=user_update_data)
    assert update_response.status_code == 200
    assert update_response.json() == merged_user_data

async def test_get_users(
    client: AsyncClient
):
    response = await client.get("/users/")
    assert response.status_code == 200


async def test_create_and_delete_user(
    client: AsyncClient
):
    test_user = {
        "name": "create_delete_name",
        "phone_number": "+3809500000204",
        "email": "testcreatedelete@gmail.com",
        "password": "testpassword",
        "avatar_url": "static/avatars/d-avatar.jpg",
    }
    create_response = await client.post("/users/create/", json=test_user)
    assert create_response.status_code == 200
    created_user = create_response.json()
    assert created_user["name"] == test_user["name"]
    assert len(created_user["id"]) > 0

    user_id = created_user["id"]
    delete_response = await client.delete(f"/users/delete/{user_id}")
    assert delete_response.status_code in (200, 204)
