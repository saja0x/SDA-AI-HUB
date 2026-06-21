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
 
    # unique=True يخلي قاعدة البيانات نفسها ترفض أي إيميل مكرر، مو بس كودنا
    email = Column(String, unique=True, index=True, nullable=False)
 
    # ما نخزن كلمة المرور الحقيقية أبدًا - بس نسخة مشفّرة بـ bcrypt
    hashed_password = Column(String, nullable=False)
 
    # RBAC (التحكم بالصلاحيات حسب الدور) بأبسط شكل: عمود نصي "user" أو "admin".
    # أي route يحتاج صلاحية أدمن يتحقق من هذي القيمة قبل ما يسمح بالطلب.
    role = Column(String, default="user", nullable=False)