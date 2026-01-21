
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import crud, schemas, database

app = FastAPI(
    title="MyHealthHub API",
    description="Backend para gestão de saúde e performance física",
    version="0.1.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific origins like ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Placeholder for current user ID until auth is implemented
CURRENT_USER_ID = 1

@app.get("/")
async def root():
    return {"message": "MyHealthHub API is running", "phase": 1}

@app.post("/exercises/", response_model=schemas.ExerciseRead, status_code=status.HTTP_201_CREATED)
async def create_exercise(
    exercise: schemas.ExerciseCreate, 
    db: AsyncSession = Depends(database.get_db)
):
    """
    Cria um novo exercício validando unicidade (RN-EX01).
    """
    return await crud.create_exercise(db, exercise, user_id=CURRENT_USER_ID)

@app.get("/exercises/", response_model=List[schemas.ExerciseRead])
async def read_exercises(
    db: AsyncSession = Depends(database.get_db)
):
    """
    Lista todos os exercícios cadastrados para o usuário.
    """
    return await crud.get_exercises(db, user_id=CURRENT_USER_ID)

# To start the DB on application startup
@app.on_event("startup")
async def on_startup():
    await database.init_db()
