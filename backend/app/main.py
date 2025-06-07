from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import app.core.redis as redis_module
from app.api import main

app = FastAPI(title="Longing for heaven")

app.include_router(main.router)

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

@app.on_event("startup")
async def startup_event():
    print("Startup: initializing Redis...")
    redis_module.init_redis()
    if redis_module.redis is not None:
        print("Redis успешно инициализирован")
    else:
        print("Redis не инициализирован!")
    

@app.on_event("shutdown")
async def shutdown_event():
    if redis_module.redis is not None:
        await redis_module.redis.close()


@app.get("/", response_model=dict)
async def read_home():
    return {"data": "The main router of Longing for heaven application."}