
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
import models
import schemas
from fastapi import HTTPException, status

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
    # Check if exercise name already exists for this user (RN-EX01)
    existing_exercise = await get_exercise_by_name(db, exercise.name, user_id)
    if existing_exercise:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Exercício com o nome '{exercise.name}' já cadastrado para este usuário."
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
    query = select(models.Exercise).where(models.Exercise.user_id == user_id)
    result = await db.execute(query)
    return result.scalars().all()
