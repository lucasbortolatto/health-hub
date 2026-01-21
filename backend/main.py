
from fastapi import FastAPI, Depends, HTTPException, status, Body
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import crud, schemas, database

app = FastAPI(
    title="MyHealthHub API",
    description="Backend para gestão de saúde e performance física",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CURRENT_USER_ID = 1

@app.get("/")
async def root():
    return {"message": "MyHealthHub API is running", "phase": 1}

@app.post("/exercises/", response_model=schemas.ExerciseRead, status_code=status.HTTP_201_CREATED)
async def create_exercise(exercise: schemas.ExerciseCreate, db: AsyncSession = Depends(database.get_db)):
    """Cria um novo exercício."""
    return await crud.create_exercise(db, exercise, user_id=CURRENT_USER_ID)

@app.get("/exercises/", response_model=List[schemas.ExerciseRead])
async def read_exercises(db: AsyncSession = Depends(database.get_db)):
    """Lista todos os exercícios."""
    return await crud.get_exercises(db, user_id=CURRENT_USER_ID)

@app.put("/exercises/{exercise_id}", response_model=schemas.ExerciseRead)
async def update_exercise(exercise_id: int, exercise: schemas.ExerciseCreate, db: AsyncSession = Depends(database.get_db)):
    """Atualiza um exercício existente."""
    return await crud.update_exercise(db, exercise_id, exercise, user_id=CURRENT_USER_ID)

@app.delete("/exercises/{exercise_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_exercise(exercise_id: int, db: AsyncSession = Depends(database.get_db)):
    """Exclui um exercício individual."""
    await crud.delete_exercise(db, exercise_id, user_id=CURRENT_USER_ID)
    return None

@app.post("/exercises/{exercise_id}/duplicate", response_model=schemas.ExerciseRead)
async def duplicate_exercise(exercise_id: int, db: AsyncSession = Depends(database.get_db)):
    """Cria uma cópia de um exercício."""
    return await crud.duplicate_exercise(db, exercise_id, user_id=CURRENT_USER_ID)

@app.post("/exercises/bulk-delete", status_code=status.HTTP_204_NO_CONTENT)
async def delete_exercises_bulk(ids: List[int] = Body(...), db: AsyncSession = Depends(database.get_db)):
    """Exclui múltiplos exercícios de uma vez."""
    await crud.delete_exercises_bulk(db, ids, user_id=CURRENT_USER_ID)
    return None

@app.on_event("startup")
async def on_startup():
    await database.init_db()
