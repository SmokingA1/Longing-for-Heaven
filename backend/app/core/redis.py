import redis.asyncio as aioredis_client

redis = None

async def init_redis():
    global redis
    redis = aioredis_client.from_url("redis://localhost", encoding="utf-8", decode_responses=True)
