import json
from app.database.mongo_db import users_collection
from app.database.redis_db import redis_client
from app.utils.otp import generate_otp
from app.utils.send_email import send_otp_email
from app.utils.hashing import hash_password,verify_password
from app.utils.jwt_handler import create_access_token

from datetime import timedelta

async def register_user(user):
    try:
        
        existing_user = users_collection.find_one({"email": user.email})
        if existing_user:
            return {"message": "User with this email already exists", "status": "error"}
        
        
        otp = generate_otp()
        
        
        user_data = user.dict()
        user_data["password"] = hash_password(user_data["password"])
        
        
        redis_client.setex(
            f"register:{user.email}",
            300,
            json.dumps(user_data)
        )
        
        
        redis_client.setex(
            f"otp:{user.email}",
            360,
            otp
        )
        
    
        await send_otp_email(user.email, otp)
        
        return {
            "message": "Registration initiated. Please check your email for OTP.",
            "status": "success",
            "email": user.email
        }
        
    except Exception as e:
        return {"message": f"Registration failed: {str(e)}", "status": "error"}

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
