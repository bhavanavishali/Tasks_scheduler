from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TaskCreate(BaseModel):
    title: str
    description: str
    creation_datetime: datetime
    due_date: datetime
    is_completed: bool = False

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    is_completed: Optional[bool] = None

class TaskResponse(BaseModel):
    id: str
    title: str
    description: str
    creation_datetime: datetime
    due_date: datetime
    is_completed: bool
    user_email: str