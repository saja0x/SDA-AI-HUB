"""
routers/model_detail.py
-------------------------
يرجع تفاصيل موديل واحد كاملة + سجل كل إصداراته.
 
تغيير مهم: قبل كذا كان يقرا من ملف JSON ثابت (data.py) ما يتحدث أبدًا،
فأي موديل يضيفه الأدمن صفحة تفاصيله كانت تطلع فاضية. الحين يقرا من
قاعدة البيانات الحقيقية مباشرة (عن طريق model_detail_service.py اللي
كان مكتوب جاهز من قبل بس محد كان يستخدمه!).
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import SessionLocal
from services.model_detail_service import get_model_detail_service

router = APIRouter(prefix="/models", tags=["Model Detail"])


def get_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


def _model_to_dict(m):
    if not m:
        return None
    return {
        "id": m.id,
        "name": m.name,
        "provider": m.provider.name if m.provider else None,
        "type": m.type,
        "open_source": m.open_source,
        "description": m.description,
        "tags": m.tags or [],
        "modality": m.modality or [],
        "context_window": m.context_window,
        "pricing": m.pricing,
        "latency": m.latency,
        "accuracy": m.accuracy,
        "capabilities": m.capabilities,
        "limitations": m.limitations,
        "use_cases": m.use_cases or [],
        "sample_prompts": m.sample_prompts or [],
        "release_date": m.release_date,
        "version": m.version,
        "visible": m.visible,
        "openrouter_id": m.openrouter_id,
    }


@router.get("/{model_id}")
def get_model_detail(model_id: int, session: Session = Depends(get_session)):
    result = get_model_detail_service(session, model_id)
    model = result["model"]
    versions = result["versions"]

    return {
        "model": _model_to_dict(model),
        "versions": [
            {
                "version": v.version,
                "release_date": str(v.release_date) if v.release_date else None,
                "notes": v.notes,
            }
            for v in versions
        ],
    }