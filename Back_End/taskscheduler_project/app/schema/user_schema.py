from pydantic import BaseModel,EmailStr

class UserRegister(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str


class LoginSchema(BaseModel):
    email:EmailStr
    password:str


class Token(BaseModel):
    access_token: str
    token_type: str
 
class UserResponse(BaseModel):
    first_name: str
    last_name: str
    email: str