import hashlib
import os
import binascii

from database import SessionLocal
from models.user import User
from models.role import Role


def _hash_password(password: str) -> str:
    """تشفير كلمة المرور بـ PBKDF2 (مكتبة بايثون القياسية، ما يحتاج تثبيت شي إضافي)"""
    salt = os.urandom(16)
    pwd_hash = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 100_000)
    return binascii.hexlify(salt).decode() + ":" + binascii.hexlify(pwd_hash).decode()


def _verify_password(password: str, stored: str) -> bool:
    try:
        salt_hex, hash_hex = stored.split(":")
        salt = binascii.unhexlify(salt_hex)
        expected = binascii.unhexlify(hash_hex)
    except (ValueError, binascii.Error):
        return False
    pwd_hash = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 100_000)
    return pwd_hash == expected


def register_user(email, password):
    session = SessionLocal()
    try:
        existing = session.query(User).filter(User.email == email).first()
        if existing:
            return {"error": "An account with this email already exists"}

        user_role = session.query(Role).filter(Role.name == "user").first()

        new_user = User(
            username=email.split("@")[0],
            email=email,
            password=_hash_password(password),
            role_id=user_role.id if user_role else None,
        )
        session.add(new_user)
        session.commit()
        return {"message": "User Registered", "email": email}
    finally:
        session.close()


def login_user(email, password):
    session = SessionLocal()
    try:
        user = session.query(User).filter(User.email == email).first()
        if not user or not _verify_password(password, user.password):
            return {"error": "Invalid email or password"}

        role = session.query(Role).filter(Role.id == user.role_id).first()
        return {
            "message": "Login Success",
            "token": "sample_token",
            "email": user.email,
            "role": role.name if role else "user",
        }
    finally:
        session.close()