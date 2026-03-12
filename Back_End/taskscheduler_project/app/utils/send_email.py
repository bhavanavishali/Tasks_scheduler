from fastapi_mail import FastMail, MessageSchema
from app.utils.email_config import conf

async def send_otp_email(email: str, otp: str):

    message = MessageSchema(
        subject="Your OTP Verification",
        recipients=[email],
        body=f"Your OTP is {otp}",
        subtype="plain"
    )

    fm = FastMail(conf)

    await fm.send_message(message)