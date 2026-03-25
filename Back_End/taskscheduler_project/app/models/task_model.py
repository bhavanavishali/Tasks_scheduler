from beanie import Document
from pydantic import field_validator
from datetime import datetime, date
from typing import Optional, List
from enum import Enum

class TaskStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class TaskPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class TaskDocument(Document):
    title: str
    description: Optional[str] = None
    status: TaskStatus = TaskStatus.PENDING
    priority: TaskPriority = TaskPriority.MEDIUM
    due_date: Optional[date] = None
    user_email: str
    created_at: datetime = datetime.utcnow()
    updated_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    tags: List[str] = []
    
    class Settings:
        name = "tasks"
        indexes = [
            [("user_email", 1)],  # Index for user queries
            [("status", 1)],  # Index for status queries
            [("due_date", 1)],  # Index for due date queries
            [("user_email", 1), ("status", 1)],  # Compound index
        ]
        
    @field_validator('title')
    @classmethod
    def title_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError('Title cannot be empty')
        return v.strip()
        
    @field_validator('due_date')
    @classmethod
    def due_date_must_be_future(cls, v):
        if v and v < date.today():
            raise ValueError('Due date cannot be in the past')
        return v