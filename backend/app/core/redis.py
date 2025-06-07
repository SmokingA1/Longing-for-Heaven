import redis.asyncio as aioredis_client

redis = None

def init_redis():
    global redis
    redis = aioredis_client.from_url("redis://localhost", encoding="utf-8", decode_responses=True)
