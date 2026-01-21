
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field
from models import MuscleGroup

# --- Exercise Schemas ---

class ExerciseBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    muscle_group: MuscleGroup

class ExerciseCreate(ExerciseBase):
    """Schema for creating a new exercise. user_id is typically injected from auth context."""
    pass

class ExerciseRead(ExerciseBase):
    id: int
    user_id: int
    
    model_config = ConfigDict(from_attributes=True)

# --- Template Exercise Schemas ---

class TemplateExerciseBase(BaseModel):
    exercise_id: int
    sets: int = Field(..., gt=0)
    reps_range: Optional[str] = Field(None, max_length=50)
    rest_seconds: int = Field(60, ge=0)
    instructions: Optional[str] = None

class TemplateExerciseCreate(TemplateExerciseBase):
    pass

class TemplateExerciseRead(TemplateExerciseBase):
    id: int
    template_id: int
    # Optional: include exercise details in read
    exercise: Optional[ExerciseRead] = None
    
    model_config = ConfigDict(from_attributes=True)

# --- Workout Template Schemas ---

class WorkoutTemplateBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    phase: Optional[str] = Field(None, max_length=50)
    period_start: datetime
    period_end: datetime
    goal: Optional[str] = Field(None, max_length=255)
    level: Optional[str] = Field(None, max_length=50)
    is_archived: bool = False

class WorkoutTemplateCreate(WorkoutTemplateBase):
    """Schema for creating a template, optionally with its exercises (RN-PL01)."""
    exercises: List[TemplateExerciseCreate] = []

class WorkoutTemplateRead(WorkoutTemplateBase):
    id: int
    user_id: int
    exercises: List[TemplateExerciseRead] = []
    
    model_config = ConfigDict(from_attributes=True)

# --- Set Log Schemas ---

class SetLogBase(BaseModel):
    exercise_id: int
    set_number: int = Field(..., gt=0)
    weight: float = Field(..., ge=0)
    reps_performed: int = Field(..., ge=0)
    source: str = Field("App", max_length=50)

class SetLogCreate(SetLogBase):
    pass

class SetLogRead(SetLogBase):
    id: int
    workout_log_id: int
    
    model_config = ConfigDict(from_attributes=True)

# --- Workout Log Schemas ---

class WorkoutLogBase(BaseModel):
    template_id: int
    start_time: datetime = Field(default_factory=datetime.now)
    end_time: Optional[datetime] = None

class WorkoutLogCreate(WorkoutLogBase):
    """Schema for finishing a session (RN-EXE05/RN-HIS02)."""
    sets: List[SetLogCreate] = []

class WorkoutLogRead(WorkoutLogBase):
    id: int
    user_id: int
    sets: List[SetLogRead] = []
    
    model_config = ConfigDict(from_attributes=True)

# --- User Schemas (Minimal for context) ---

class UserRead(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
