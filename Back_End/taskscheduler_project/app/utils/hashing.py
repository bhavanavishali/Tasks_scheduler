# from passlib.context import CryptContext

# pwd_content= CryptContext(schemes=["bcrypt"],deprecated="auto")

# def hash_password(password:str):
#     return pwd_content.hash(password)

import bcrypt

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))