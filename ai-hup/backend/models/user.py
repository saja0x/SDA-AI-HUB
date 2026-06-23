"""
models/user.py
----------------
نموذج المستخدم. مطابق تمامًا لملف الأستاذ: دور المستخدم (role) عمود نصي
بسيط ("user" أو "admin") بدل جدول Role منفصل - أبسط وأسهل تتبع.
"""
from sqlalchemy import Column, Integer, String
 
from database import Base
 
 
class User(Base):
    __tablename__ = "users"
 
    id = Column(Integer, primary_key=True, index=True)
 
    email = Column(String, unique=True, index=True, nullable=False)
 
    hashed_password = Column(String, nullable=False)
 
    role = Column(String, default="user", nullable=False)