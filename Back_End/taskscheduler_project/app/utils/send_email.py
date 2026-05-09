# from fastapi_mail import FastMail, MessageSchema
# from app.utils.email_config import conf

# async def send_otp_email(email: str, otp: str):

#     message = MessageSchema(
#         subject="Your OTP Verification",
#         recipients=[email],
#         body=f"Your OTP is {otp}",
#         subtype="plain"
#     )

#     fm = FastMail(conf)

#     await fm.send_message(message)



from fastapi_mail import FastMail, MessageSchema
from app.utils.email_config import conf


async def send_otp_email(email: str, otp: str):

    html = f"""
    <html>
        <body style="
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 30px;
        ">
            <div style="
                max-width: 500px;
                margin: auto;
                background: white;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            ">
                
                <!-- Header -->
                <div style="
                    background: #2563eb;
                    color: white;
                    padding: 20px;
                    text-align: center;
                ">
                    <h1 style="margin: 0;">OTP Verification</h1>
                </div>

                <!-- Body -->
                <div style="padding: 30px; text-align: center;">
                    
                    <h2 style="color: #111827;">
                        Verify Your Email
                    </h2>

                    <p style="
                        color: #6b7280;
                        font-size: 16px;
                        line-height: 1.6;
                    ">
                        Use the OTP below to complete your verification process.
                    </p>

                    <!-- OTP Box -->
                    <div style="
                        margin: 30px auto;
                        background: #eff6ff;
                        color: #2563eb;
                        font-size: 32px;
                        font-weight: bold;
                        letter-spacing: 8px;
                        padding: 15px 25px;
                        border-radius: 8px;
                        display: inline-block;
                    ">
                        {otp}
                    </div>

                    <p style="
                        color: #9ca3af;
                        font-size: 14px;
                        margin-top: 20px;
                    ">
                        This OTP is valid for 5 minutes.
                    </p>

                    <p style="
                        color: #9ca3af;
                        font-size: 14px;
                    ">
                        If you did not request this email, please ignore it.
                    </p>
                </div>

                <!-- Footer -->
                <div style="
                    background: #f9fafb;
                    padding: 15px;
                    text-align: center;
                    font-size: 13px;
                    color: #6b7280;
                ">
                    © 2026 Your Company. All rights reserved.
                </div>
            </div>
        </body>
    </html>
    """

    message = MessageSchema(
        subject="Your OTP Verification",
        recipients=[email],
        body=html,
        subtype="html"
    )

    fm = FastMail(conf)

    await fm.send_message(message)