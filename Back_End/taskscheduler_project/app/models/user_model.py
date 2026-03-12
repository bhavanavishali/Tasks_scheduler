from pydantic import BaseModel,EmailStr

class UserModel(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    verified: bool = False
