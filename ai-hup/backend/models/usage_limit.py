"""
models/usage_limit.py
-----------------------
جدول يعدّ كم رسالة أرسل كل مستخدم لكل موديل بالبلاي قراوند.
كل صف = مستخدم × موديل → عداد ثابت لا يُصفَّر أبدًا.
 
المنطق:
- أول رسالة لمستخدم+موديل: نضيف صف جديد بعداد = 1
- كل رسالة بعدها: نزيد العداد 1
- لو العداد وصل 10: نرفض الطلب قبل ما يوصل للـ LLM
"""
from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
 
from database import Base
 
 
class UsageLimit(Base):
    __tablename__ = "usage_limits"
 
    id = Column(Integer, primary_key=True, index=True)
 
    # مين المستخدم
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
 
    # أي موديل (id من جدول models)
    model_id = Column(Integer, ForeignKey("models.id"), nullable=False)
 
    # كم رسالة أرسل — ثابت للأبد، لا يُصفَّر
    message_count = Column(Integer, default=0, nullable=False)
 
    # user_id + model_id لازم يكونون فريدين مع بعض:
    # صف وحيد لكل مستخدم × كل موديل
    __table_args__ = (
        UniqueConstraint("user_id", "model_id", name="uq_user_model"),
    )