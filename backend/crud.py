
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, delete
import models, schemas
from fastapi import HTTPException, status
from typing import List

async def get_exercise_by_id(db: AsyncSession, exercise_id: int, user_id: int):
    """
    Busca um exercício específico por ID e UserID.
    """
    query = select(models.Exercise).where(
        models.Exercise.id == exercise_id,
        models.Exercise.user_id == user_id
    )
    result = await db.execute(query)
    return result.scalars().first()

async def get_exercise_by_name(db: AsyncSession, name: str, user_id: int):
    """
    Helper to find an exercise by name for a specific user, case-insensitive.
    Used to satisfy RN-EX01.
    """
    query = select(models.Exercise).where(
        models.Exercise.user_id == user_id,
        func.lower(models.Exercise.name) == name.lower()
    )
    result = await db.execute(query)
    return result.scalars().first()

async def create_exercise(db: AsyncSession, exercise: schemas.ExerciseCreate, user_id: int):
    """
    Creates a new exercise after validating RN-EX01.
    """
    existing_exercise = await get_exercise_by_name(db, exercise.name, user_id)
    if existing_exercise:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Exercício com o nome '{exercise.name}' já cadastrado."
        )
    
    db_exercise = models.Exercise(
        **exercise.model_dump(),
        user_id=user_id
    )
    db.add(db_exercise)
    await db.commit()
    await db.refresh(db_exercise)
    return db_exercise

async def get_exercises(db: AsyncSession, user_id: int):
    """
    Returns all exercises for a specific user.
    """
    query = select(models.Exercise).where(models.Exercise.user_id == user_id).order_by(models.Exercise.name)
    result = await db.execute(query)
    return result.scalars().all()

async def update_exercise(db: AsyncSession, exercise_id: int, exercise_update: schemas.ExerciseCreate, user_id: int):
    """
    Updates an exercise, checking for name collisions (RN-EX01).
    """
    db_exercise = await get_exercise_by_id(db, exercise_id, user_id)
    
    if not db_exercise:
        raise HTTPException(status_code=404, detail="Exercício não encontrado.")

    # Collision check se o nome mudou
    if db_exercise.name.lower() != exercise_update.name.lower():
        existing = await get_exercise_by_name(db, exercise_update.name, user_id)
        if existing:
            raise HTTPException(status_code=400, detail="Já existe outro exercício com este nome.")

    for key, value in exercise_update.model_dump().items():
        setattr(db_exercise, key, value)
    
    await db.commit()
    await db.refresh(db_exercise)
    return db_exercise

async def delete_exercise(db: AsyncSession, exercise_id: int, user_id: int):
    """Deletes a single exercise."""
    query = delete(models.Exercise).where(models.Exercise.id == exercise_id, models.Exercise.user_id == user_id)
    result = await db.execute(query)
    await db.commit()
    return True

async def duplicate_exercise(db: AsyncSession, exercise_id: int, user_id: int):
    """
    Busca exercício original e cria uma cópia com sufixo.
    """
    original = await get_exercise_by_id(db, exercise_id, user_id)
    if not original:
        raise HTTPException(status_code=404, detail="Exercício original não encontrado.")
    
    new_data = schemas.ExerciseCreate(
        name=f"{original.name} (Cópia)",
        muscle_group=original.muscle_group
    )
    
    return await create_exercise(db, new_data, user_id)

async def delete_exercises_bulk(db: AsyncSession, exercise_ids: List[int], user_id: int):
    """Deletes multiple exercises."""
    query = delete(models.Exercise).where(models.Exercise.id.in_(exercise_ids), models.Exercise.user_id == user_id)
    await db.execute(query)
    await db.commit()
    return True
