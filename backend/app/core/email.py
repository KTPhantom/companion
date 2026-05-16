import os
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from pydantic import EmailStr
from dotenv import load_dotenv

load_dotenv()

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
    MAIL_SERVER=os.getenv("MAIL_SERVER"),
    MAIL_STARTTLS=os.getenv("MAIL_STARTTLS", "True") == "True",
    MAIL_SSL_TLS=os.getenv("MAIL_SSL_TLS", "False") == "True",
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

async def send_magic_link(email: EmailStr, token: str):
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    link = f"{frontend_url}/auth/verify?token={token}"
    
    html = f"""
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f0f12; color: #ffffff; padding: 40px; border-radius: 24px; border: 1px solid #1f1f23;">
        <div style="margin-bottom: 32px;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #a78bfa, #7c3aec); display: flex; align-items: center; justify-content: center; font-size: 14px; color: #ffffff; font-weight: 800;">✦</div>
        </div>
        
        <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 16px; letter-spacing: -0.02em;">Step into your zone</h1>
        <p style="font-size: 16px; color: #9ca3af; line-height: 1.6; margin-bottom: 32px;">
            Click the button below to sign in to your Companion account. This link will expire in 15 minutes.
        </p>
        
        <a href="{link}" style="display: inline-block; background-color: #a78bfa; color: #ffffff; padding: 14px 32px; border-radius: 12px; font-weight: 700; text-decoration: none; font-size: 15px; box-shadow: 0 4px 20px rgba(167, 139, 250, 0.3);">
            Sign in to Companion
        </a>
        
        <p style="font-size: 13px; color: #4b5563; margin-top: 40px; border-top: 1px solid #1f1f23; padding-top: 24px;">
            If you didn't request this link, you can safely ignore this email.
        </p>
    </div>
    """

    message = MessageSchema(
        subject="Sign in to Companion",
        recipients=[email],
        body=html,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    await fm.send_message(message)
