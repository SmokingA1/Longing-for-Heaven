import pytest
from typing import Any,  AsyncGenerator

from httpx import ASGITransport, AsyncClient

from app.main import app
from app.core.database import engine, Base
from app.core.redis import init_redis


@pytest.fixture(
    scope="session",
    params=[
    pytest.param(("asyncio", {}), id="asyncio"),
    # pytest.param(("trio", {"restrict_keyboard_interrupt_to_checkpoints": True}), id="trio"),
]
)
def anyio_backend(request):
    return request.param


@pytest.fixture(scope="session")
async def start_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    # for AsyncEngine created in function scope, close and
    # clean-up pooled connections
    await engine.dispose()


@pytest.fixture(scope="session")
async def client(start_db) -> AsyncGenerator[AsyncClient, Any]:  # noqa: ARG001
    transport = ASGITransport(
        app=app,
    )
    async with AsyncClient(
        base_url="http://testserver/",
        headers={"Content-Type": "application/json"},
        transport=transport,
    ) as test_client:
        yield test_client