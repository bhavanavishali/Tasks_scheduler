import json
from app.database.mongo_db import users_collection
from app.database.redis_db import redis_client
from app.utils.otp import generate_otp
from app.utils.send_email import send_otp_email
from app.utils.hashing import hash_password,verify_password
from app.utils.jwt_handler import create_access_token

from datetime import timedelta
import re
import json

def is_valid_name(name):
    return bool(re.fullmatch(r"[A-Za-z ]+", name.strip()))

async def register_user(user):
    try:
        # 🔹 Normalize email
        email = user.email.strip().lower()

        # 🔹 Validate email
        email_regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
        if not re.match(email_regex, email):
            return {"message": "Invalid email format", "status": "error"}

        # 🔹 Validate first name
        first_name = user.first_name.strip()
        if not is_valid_name(first_name):
            return {
                "message": "First name must contain only letters",
                "status": "error"
            }

        # 🔹 Validate last name
        last_name = user.last_name.strip()
        if not is_valid_name(last_name):
            return {
                "message": "Last name must contain only letters",
                "status": "error"
            }

        # 🔹 Validate password
        password = user.password.strip()

        if len(password) < 8:
            return {
                "message": "Password must be at least 8 characters",
                "status": "error"
            }

        # 🔹 Check existing user
        existing_user = users_collection.find_one({"email": email})
        if existing_user:
            return {"message": "User already exists", "status": "error"}

        # 🔹 OTP rate limit
        if redis_client.get(f"register:{email}"):
            return {
                "message": "OTP already sent. Please wait before retrying",
                "status": "error"
            }

        # 🔹 Generate OTP
        otp = generate_otp()

        # 🔹 Prepare user data
        user_data = user.dict()
        user_data["email"] = email
        user_data["first_name"] = first_name
        user_data["last_name"] = last_name
        user_data["password"] = hash_password(password)

        # 🔹 Store in Redis
        redis_client.setex(
            f"register:{email}",
            300,
            json.dumps(user_data)
        )

        redis_client.setex(
            f"otp:{email}",
            300,
            otp
        )

        # 🔹 Send OTP
        await send_otp_email(email, otp)

        return {
            "message": "Registration initiated. Check your email for OTP",
            "status": "success",
            "email": email
        }

    except Exception as e:
        return {
            "message": f"Registration failed: {str(e)}",
            "status": "error"
        }

async def verify_otp(email: str, otp: str):
    try:
        
        stored_otp = redis_client.get(f"otp:{email}")
        
        if not stored_otp:
            return {"message": "OTP expired or not found", "status": "error"}
        
        if stored_otp != otp:
            return {"message": "Invalid OTP", "status": "error"}
        
    
        user_data_json = redis_client.get(f"register:{email}")
        if not user_data_json:
            return {"message": "Registration data expired", "status": "error"}
        
        user_data = json.loads(user_data_json)
        
        
        users_collection.insert_one(user_data)
        
        
        redis_client.delete(f"otp:{email}")
        redis_client.delete(f"register:{email}")
        
        return {
            "message": "Registration successful! User verified and saved to database.",
            "status": "success",
            "user": {
                "first_name": user_data["first_name"],
                "last_name": user_data["last_name"],
                "email": user_data["email"]
            }
        }
        
    except Exception as e:
        return {"message": f"OTP verification failed: {str(e)}", "status": "error"}
    

async def login_user(email: str, password: str):
    try:
        
        user = users_collection.find_one({"email": email})
        if not user:
            return {"message": "user not found", "status": "error"}
        
        
        if not verify_password(password, user["password"]):
            return {"message": "invalid password", "status": "error"}
        
        
        access_token_expires = timedelta(minutes=30) 
        access_token = create_access_token(
            data={"sub": user["email"]}, expires_delta=access_token_expires
        )
        
        return {
            "message": "login successful",
            "status": "success",
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "first_name": user["first_name"],
                "last_name": user["last_name"],
                "email": user["email"]
            }
        }
        
    except Exception as e:
        return {"message": f"login failed: {str(e)}", "status": "error"}



async def request_login_otp(email: str):
    try:
        user = users_collection.find_one({"email": email})
        if not user:
            return {"message": "User not found", "status": "error"}
        
        otp = generate_otp()
        
        redis_client.setex(
            f"login_otp:{email}",
            300,  # 5 minutes expiry
            otp
        )
        
        await send_otp_email(email, otp)
        
        return {
            "message": "OTP sent to your email",
            "status": "success",
            "email": email
        }
        
    except Exception as e:
        return {"message": f"Failed to send OTP: {str(e)}", "status": "error"}


async def verify_login_otp(email: str, otp: str):
    try:
        stored_otp = redis_client.get(f"login_otp:{email}")
        
        if not stored_otp:
            return {"message": "OTP expired or not found", "status": "error"}
        
        if stored_otp != otp:
            return {"message": "Invalid OTP", "status": "error"}
        
        user = users_collection.find_one({"email": email})
        if not user:
            return {"message": "User not found", "status": "error"}
        
        access_token_expires = timedelta(minutes=30)
        access_token = create_access_token(
            data={"sub": user["email"]}, expires_delta=access_token_expires
        )
        
        redis_client.delete(f"login_otp:{email}")
        
        return {
            "message": "Login successful",
            "status": "success",
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "first_name": user["first_name"],
                "last_name": user["last_name"],
                "email": user["email"]
            }
        }
        
    except Exception as e:
        return {"message": f"OTP verification failed: {str(e)}", "status": "error"}