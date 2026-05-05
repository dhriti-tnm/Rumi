import os
import dotenv
from sqlmodel import SQLModel, SQLModel, create_engine, Session

dotenv.load_dotenv()
engine = create_engine(os.getenv("DATABASE_URL"), echo=True)

def init_db():
    SQLModel.metadata.create_all(engine)
    print("Database initialized successfully.")

def get_session():
    with Session(engine) as session:
        yield session

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)