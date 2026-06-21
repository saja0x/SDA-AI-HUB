"""
routers/chatbot.py
---------------------
شات بوت بسيط يرشح أنسب موديل بناءً على وش يبيه المستخدم يسوي.
 
تغيير مهم: قبل كذا كان يقرا من ملف ثابت (data.py)، فأي موديل يضيفه الأدمن
ما كان يترشّح أبدًا. الحين يقرا من قاعدة البيانات الحقيقية مباشرة.
"""
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
 
from database import SessionLocal
from models.model import Model
 
router = APIRouter()
 
 
def get_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
 
 
class RecommendRequest(BaseModel):
    use_case: str
 
 
@router.post("/chatbot/recommend")
def recommend(request: RecommendRequest, session: Session = Depends(get_session)):
    user_msg = request.use_case.lower()
 
    rows = session.query(Model).filter(Model.visible == True).all()  # noqa: E712
 
    best_model = None
    highest_score = 0
 
    for model in rows:
        score = 0
        for keyword in (model.use_cases or []):
            if keyword.lower() in user_msg:
                score += 1
        if score > highest_score:
            highest_score = score
            best_model = model
 
    if best_model and highest_score > 0:
        return {
            "recommended_model": best_model.name,
            "provider": best_model.provider.name if best_model.provider else None,
        }
 
    # ما لقينا تطابق - نرشح أول موديل ظاهر بدل اسم ثابت بالكود ("GPT-4" قديمًا)
    fallback = rows[0] if rows else None
    return {
        "recommended_model": fallback.name if fallback else "No models available",
        "provider": fallback.provider.name if fallback and fallback.provider else None,
    }