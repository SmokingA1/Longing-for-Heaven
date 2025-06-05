from fastapi import FastAPI

app = FastAPI(title="Longing for heaven")


app.get("/", response_model=dict)
async def read_home():
    return {"data": "The main router of Longing for heaven application."}