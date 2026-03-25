from beanie import Document
from pydantic import EmailStr, field_validator
from datetime import datetime,timezone
from typing import Optional


class UserDocument(Document):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    verified: bool = False
    
    created_at: datetime = datetime.now(timezone.utc)
    updated_at: Optional[datetime] = None
    
    class Settings:
        name = "users"
        indexes = [
            [("email", 1)],  # Unique email index
        ]
        
    @field_validator('email')
    @classmethod
    def email_to_lowercase(cls, v):
        return v.lower()