from pydantic import BaseModel, EmailStr, field_validator
from datetime import datetime

class UserRegister(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    confirm_password: str
    
    @field_validator('confirm_password')
    @classmethod
    def passwords_match(cls, v, info):
        if 'password' in info.data and v != info.data['password']:
            raise ValueError('Passwords do not match')
        return v

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    first_name: str
    last_name: str
    email: str
    verified: bool
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str