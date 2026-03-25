from pydantic import BaseModel, field_validator
from datetime import datetime
from typing import Optional, List

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    
    due_date: Optional[datetime] = None
    is_completed: bool = False
    priority: str = "medium"
    tags: List[str] = []
    
    @field_validator('title')
    @classmethod
    def title_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError('Title cannot be empty')
        return v.strip()

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    is_completed: Optional[bool] = None
    priority: Optional[str] = None
    tags: Optional[List[str]] = None

class TaskResponse(BaseModel):
    id: str
    title: str
    description: Optional[str]
    creation_datetime: datetime
    due_date: Optional[datetime]
    is_completed: bool
    user_email: str
    created_at: datetime
    priority: str
    tags: List[str]