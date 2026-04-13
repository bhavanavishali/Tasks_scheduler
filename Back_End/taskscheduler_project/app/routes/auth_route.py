from fastapi import APIRouter,Response
from ..schema.user_schema import UserRegister,LoginSchema
from ..services.auth_services import register_user,verify_otp,login_user,request_login_otp,verify_login_otp
from fastapi import  HTTPException
from ..utils.jwt_handler import ACCESS_TOKEN_EXPIRE_MINUTES
from pydantic import BaseModel
from ..utils.auth_dependency import get_current_user
from fastapi import Depends
 
class OTPVerify(BaseModel):
    email: str
    otp: str

class OTPLoginRequest(BaseModel):
    email: str


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

@router.post("/login")
async def login(user_credentials: LoginSchema, response: Response):
    result = await login_user(user_credentials.email, user_credentials.password)
    
    if result["status"] == "error":
        raise HTTPException(status_code=401, detail=result["message"])
    
    # Set HTTP-only cookie
    response.set_cookie(
        key="access_token",
        value=result["access_token"],
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        httponly=True,
        secure=True,  
        samesite="none"
    )
    print(f"DEBUG: Set cookie with token: {result['access_token'][:20]}...") 
    return {
        "status": "success", 
        "message": result["message"],
        "user": result["user"],  
        "token": result["access_token"]  
    }

@router.post("/logout")
async def logout(response: Response):
    try:
       
        response.delete_cookie(key="access_token", samesite="lax")
        
        print("DEBUG: Cookie deleted successfully")
        
        return {"message": "Logged out successfully"}
    except Exception as e:
        print(f"DEBUG: Logout error: {str(e)}")
        
        # response.delete_cookie(key="access_token", samesite="lax")
        response.delete_cookie(key="access_token", samesite="none", secure=True)
        return {"message": "Logged out successfully"}


@router.get("/me")
async def get_current_user_endpoint(current_user=Depends(get_current_user)):
    return {
          "status": "success", 
        "email": current_user["email"],
        "first_name": current_user["first_name"],
        "last_name": current_user["last_name"]
    }




@router.post("/request-login-otp", status_code=200)
async def request_login_otp_route(request: OTPLoginRequest):
    result = await request_login_otp(request.email)
    if result["status"] == "error":
        raise HTTPException(status_code=400, detail=result["message"])
    return result


@router.post("/verify-login-otp", status_code=200)
async def verify_login_otp_route(otp_data: OTPVerify, response: Response):
    result = await verify_login_otp(otp_data.email, otp_data.otp)
    
    if result["status"] == "error":
        raise HTTPException(status_code=401, detail=result["message"])
    
    response.set_cookie(
        key="access_token",
        value=result["access_token"],
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        httponly=True,
        secure=True,
        samesite="none"
    )
    
    return {
        "status": "success",
        "message": result["message"],
        "user": result["user"],
        "token": result["access_token"]
    }