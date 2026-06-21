"""
routers/comparison.py
-----------------------
يرجع بيانات كاملة لمجموعة موديلات بمرة وحدة، عشان تتقارن.
 
تغيير مهم: قبل كذا كان هذا المسار "حشو" بس، يرجع رسالة ثابتة
("comparison will be built here") من غير ما يسوي شي فعلي - حتى إن
فيه ملف services/comparison_service.py مكتوب وجاهز بس محد كان يستخدمه.
الحين يستخدمه فعليًا.
 
ملاحظة: الفرونت اند حاليًا يحسب المقارنة بنفسه من بيانات عنده مسبقًا،
فهذا المسار مو ضروري للمقارنة تشتغل بالواجهة، بس صار موجود وشغال لأي
استخدام مستقبلي (مثلًا لو حبيتوا تسوون رابط مشاركة لمقارنة معينة).
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
 
from database import SessionLocal
from services.comparison_service import compare_models_service
 
router = APIRouter()
 
 
def get_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
 
 
@router.post("/models/compare")
def compare_models(ids: list[int], session: Session = Depends(get_session)):
    result = compare_models_service(session, ids)
    return {
        "models": [
            {
                "id": m.id,
                "name": m.name,
                "provider": m.provider.name if m.provider else None,
                "modality": m.modality or [],
                "context_window": m.context_window,
                "pricing": m.pricing,
                "latency": m.latency,
                "accuracy": m.accuracy,
                "capabilities": m.capabilities,
                "limitations": m.limitations,
            }
            for m in result["models"]
        ]
    }