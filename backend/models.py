
import enum
from datetime import datetime
from typing import List, Optional
from sqlalchemy import (
    Column, 
    Integer, 
    String, 
    ForeignKey, 
    Boolean, 
    DateTime, 
    Enum, 
    Float, 
    Text, 
    UniqueConstraint, 
    func
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

class Base(DeclarativeBase):
    """Base class for SQLAlchemy models using PEP 484 type hints."""
    pass

class MuscleGroup(str, enum.Enum):
    SUPERIOR = "Superior"
    INFERIOR = "Inferior"

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    # Relationships
    exercises: Mapped[List["Exercise"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    workout_templates: Mapped[List["WorkoutTemplate"]] = relationship(back_populates="user")
    workout_logs: Mapped[List["WorkoutLog"]] = relationship(back_populates="user")

class Exercise(Base):
    __tablename__ = "exercises"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    muscle_group: Mapped[MuscleGroup] = mapped_column(Enum(MuscleGroup), nullable=False)
    
    # RN-EX01: Unique constraint per user (case-insensitive via SQL function usually, 
    # but defined here as a logical constraint).
    __table_args__ = (
        UniqueConstraint('user_id', 'name', name='_user_exercise_name_uc'),
    )

    user: Mapped["User"] = relationship(back_populates="exercises")
    template_links: Mapped[List["TemplateExercise"]] = relationship(back_populates="exercise")
    set_logs: Mapped[List["SetLog"]] = relationship(back_populates="exercise")

class WorkoutTemplate(Base):
    """Represents a 'Phase' of training."""
    __tablename__ = "workout_templates"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    phase: Mapped[str] = mapped_column(String(50))  # e.g., "Adaptação", "Hipertrofia"
    
    # RN-PL01: Mandatory start and end dates
    period_start: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    period_end: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    
    goal: Mapped[Optional[str]] = mapped_column(String(255))
    level: Mapped[Optional[str]] = mapped_column(String(50))
    
    # RN-PL02: Archiving instead of deleting
    is_archived: Mapped[bool] = mapped_column(Boolean, default=False)
    
    user: Mapped["User"] = relationship(back_populates="workout_templates")
    exercises: Mapped[List["TemplateExercise"]] = relationship(back_populates="template", cascade="all, delete-orphan")
    logs: Mapped[List["WorkoutLog"]] = relationship(back_populates="template")

class TemplateExercise(Base):
    """The association between a template and an exercise with training parameters."""
    __tablename__ = "template_exercises"

    id: Mapped[int] = mapped_column(primary_key=True)
    template_id: Mapped[int] = mapped_column(ForeignKey("workout_templates.id"), index=True)
    exercise_id: Mapped[int] = mapped_column(ForeignKey("exercises.id"), index=True)
    
    sets: Mapped[int] = mapped_column(Integer, nullable=False)
    reps_range: Mapped[str] = mapped_column(String(50))  # e.g., "8-12"
    rest_seconds: Mapped[int] = mapped_column(Integer, default=60)
    instructions: Mapped[Optional[str]] = mapped_column(Text)

    template: Mapped["WorkoutTemplate"] = relationship(back_populates="exercises")
    exercise: Mapped["Exercise"] = relationship(back_populates="template_links")

class WorkoutLog(Base):
    """A session log (Execution)."""
    __tablename__ = "workout_logs"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    template_id: Mapped[int] = mapped_column(ForeignKey("workout_templates.id"), index=True)
    
    # RN-EXE01: Time tracking
    start_time: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    end_time: Mapped[Optional[datetime]] = mapped_column(DateTime)

    user: Mapped["User"] = relationship(back_populates="workout_logs")
    template: Mapped["WorkoutTemplate"] = relationship(back_populates="logs")
    sets: Mapped[List["SetLog"]] = relationship(back_populates="workout_log", cascade="all, delete-orphan")

class SetLog(Base):
    """Detailed history of each set performed."""
    __tablename__ = "set_logs"

    id: Mapped[int] = mapped_column(primary_key=True)
    workout_log_id: Mapped[int] = mapped_column(ForeignKey("workout_logs.id"), index=True)
    exercise_id: Mapped[int] = mapped_column(ForeignKey("exercises.id"), index=True)
    
    set_number: Mapped[int] = mapped_column(Integer, nullable=False)
    weight: Mapped[float] = mapped_column(Float, nullable=False)
    reps_performed: Mapped[int] = mapped_column(Integer, nullable=False)
    
    # Added for RN-HIS03 extensibility
    source: Mapped[str] = mapped_column(String(50), default="App") 

    workout_log: Mapped["WorkoutLog"] = relationship(back_populates="sets")
    exercise: Mapped["Exercise"] = relationship(back_populates="set_logs")
