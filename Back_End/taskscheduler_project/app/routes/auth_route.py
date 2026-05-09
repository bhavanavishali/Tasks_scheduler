from fastapi import APIRouter, Response, HTTPException, Depends
from pydantic import BaseModel
import logging

from ..schema.user_schema import UserRegister, LoginSchema
from ..services.auth_services import (
    register_user,
    verify_otp,
    login_user,
    request_login_otp,
    verify_login_otp
)

from ..utils.jwt_handler import ACCESS_TOKEN_EXPIRE_MINUTES
from ..utils.auth_dependency import get_current_user



logger = logging.getLogger(__name__)


class OTPVerify(BaseModel):
    email: str
    otp: str


class OTPLoginRequest(BaseModel):
    email: str


router = APIRouter()


@router.post("/register", status_code=200)
async def register(user: UserRegister):
    try:
        logger.info(f"Register API called for email: {user.email}")

        result = await register_user(user)

        if result["status"] == "error":
            logger.warning(
                f"Registration failed for email: {user.email}, reason: {result['message']}"
            )

            raise HTTPException(
                status_code=400,
                detail=result["message"]
            )

        logger.info(f"Registration OTP sent successfully to: {user.email}")

        return result

    except Exception as e:
        logger.exception(f"Unexpected error in register API: {str(e)}")
        raise


@router.post("/verify-otp", status_code=200)
async def verify_otp_route(otp_data: OTPVerify):
    try:
        logger.info(
            f"OTP verification API called for email: {otp_data.email}"
        )

        result = await verify_otp(
            otp_data.email,
            otp_data.otp
        )

        if result["status"] == "error":
            logger.warning(
                f"OTP verification failed for email: {otp_data.email}"
            )

            raise HTTPException(
                status_code=400,
                detail=result["message"]
            )

        logger.info(
            f"OTP verified successfully for email: {otp_data.email}"
        )

        return result

    except Exception as e:
        logger.exception(
            f"Unexpected error in verify OTP API: {str(e)}"
        )
        raise


@router.post("/login")
async def login(user_credentials: LoginSchema, response: Response):
    try:
        logger.info(
            f"Login API called for email: {user_credentials.email}"
        )

        result = await login_user(
            user_credentials.email,
            user_credentials.password
        )

        if result["status"] == "error":
            logger.warning(
                f"Login failed for email: {user_credentials.email}"
            )

            raise HTTPException(
                status_code=401,
                detail=result["message"]
            )

       
        response.set_cookie(
            key="access_token",
            value=result["access_token"],
            max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            httponly=True,
            secure=True,
            samesite="none"
        )

        logger.info(
            f"Access token cookie set successfully for email: {user_credentials.email}"
        )

        return {
            "status": "success",
            "message": result["message"],
            "user": result["user"],
            "token": result["access_token"]
        }

    except Exception as e:
        logger.exception(
            f"Unexpected error in login API: {str(e)}"
        )
        raise


@router.post("/logout")
async def logout(response: Response):
    try:
        logger.info("Logout API called")

        response.delete_cookie(
            key="access_token",
            samesite="lax"
        )

        logger.info("Access token cookie deleted successfully")

        return {
            "message": "Logged out successfully"
        }

    except Exception as e:
        logger.exception(f"Logout error: {str(e)}")

        response.delete_cookie(
            key="access_token",
            samesite="none",
            secure=True
        )

        return {
            "message": "Logged out successfully"
        }


@router.get("/me")
async def get_current_user_endpoint(
    current_user=Depends(get_current_user)
):
    try:
        logger.info(
            f"/me API accessed by email: {current_user['email']}"
        )

        return {
            "status": "success",
            "email": current_user["email"],
            "first_name": current_user["first_name"],
            "last_name": current_user["last_name"]
        }

    except Exception as e:
        logger.exception(f"Error in /me API: {str(e)}")
        raise


@router.post("/request-login-otp", status_code=200)
async def request_login_otp_route(request: OTPLoginRequest):
    try:
        logger.info(
            f"Request login OTP API called for email: {request.email}"
        )

        result = await request_login_otp(request.email)

        if result["status"] == "error":
            logger.warning(
                f"Request login OTP failed for email: {request.email}"
            )

            raise HTTPException(
                status_code=400,
                detail=result["message"]
            )

        logger.info(
            f"Login OTP sent successfully to email: {request.email}"
        )

        return result

    except Exception as e:
        logger.exception(
            f"Unexpected error in request-login-otp API: {str(e)}"
        )
        raise


@router.post("/verify-login-otp", status_code=200)
async def verify_login_otp_route(
    otp_data: OTPVerify,
    response: Response
):
    try:
        logger.info(
            f"Verify login OTP API called for email: {otp_data.email}"
        )

        result = await verify_login_otp(
            otp_data.email,
            otp_data.otp
        )

        if result["status"] == "error":
            logger.warning(
                f"Login OTP verification failed for email: {otp_data.email}"
            )

            raise HTTPException(
                status_code=401,
                detail=result["message"]
            )

        response.set_cookie(
            key="access_token",
            value=result["access_token"],
            max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            httponly=True,
            secure=True,
            samesite="none"
        )

        logger.info(
            f"Login OTP verified successfully and cookie set for email: {otp_data.email}"
        )

        return {
            "status": "success",
            "message": result["message"],
            "user": result["user"],
            "token": result["access_token"]
        }

    except Exception as e:
        logger.exception(
            f"Unexpected error in verify-login-otp API: {str(e)}"
        )
        raise