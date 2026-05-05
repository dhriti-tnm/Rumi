from fastapi import FastAPI
from app.config import create_db_and_tables
from app.routes import auth_router

app = FastAPI()

app.include_router(auth_router)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()


@app.get("/")
def home():
    return {"message": "Backend is running"}

