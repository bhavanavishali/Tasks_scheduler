from fastapi import APIRouter
from ..schema.user_schema import UserRegister
from ..services.auth_services import register_user,verify_otp
from fastapi import  HTTPException

from pydantic import BaseModel
 
class OTPVerify(BaseModel):
    email: str
    otp: str

router=APIRouter()

@router.post("/register", status_code=200)
async def register(user: UserRegister):
    result = await register_user(user)
    if result["status"] == "error":
        raise HTTPException(status_code=400, detail=result["message"])
    return result


@router.post("/verify-otp", status_code=200)
async def verify_otp_route(otp_data: OTPVerify):
    result = await verify_otp(otp_data.email, otp_data.otp)
    if result["status"] == "error":
        raise HTTPException(status_code=400, detail=result["message"])
    return result
