"""
routers/playground.py
------------------------
يخلي المستخدم يجرب يحادث أي موديل ظاهر بالموقع، عن طريق خدمة خارجية
حقيقية اسمها OpenRouter.
 
تغيير مهم #1: قبل كذا الموديلات كانت تتجاب من ملف ثابت (data.py) يتحمّل
مرة وحدة بس وقت تشغيل السيرفر. الحين تتجاب من قاعدة البيانات الحقيقية،
فأي موديل يضيفه/يعدّله/يحذفه الأدمن ينعكس هنا فورًا.
 
تغيير مهم #2: قبل كذا قائمة "model_map" كانت أسماء ثابتة بالكود (9 موديلات
بس). الحين كل موديل بقاعدة البيانات له حقل اسمه openrouter_id - لو الأدمن
عبّاه وقت إضافة الموديل، الموديل يقدر "يتكلم" بالبلاي قراوند، ولو تركه
فاضي يطلع بالقائمة بس يرفض المحادثة برسالة واضحة.
"""
import os
import requests
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from dotenv import load_dotenv
from sqlalchemy.orm import Session
 
from database import SessionLocal
from models.model import Model
 
load_dotenv()
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
 
router = APIRouter()
 
 
def get_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
 
 
class MessageRequest(BaseModel):
    message: str
    model: str
 
 
def _model_to_dict(m):
    return {
        "id": m.id,
        "name": m.name,
        "provider": m.provider.name if m.provider else None,
        "type": m.type,
        "description": m.description,
        "openrouter_id": m.openrouter_id,
    }
 
 
@router.get("/playground/models")
def get_models(session: Session = Depends(get_session)):
    """يرجع كل الموديلات الظاهرة - يستخدمها ModelSwitcher لبناء أزرار الاختيار."""
    rows = session.query(Model).filter(Model.visible == True).all()  # noqa: E712
    return [_model_to_dict(m) for m in rows]
 
 
@router.post("/playground/chat")
def chat(request: MessageRequest, session: Session = Depends(get_session)):
    model_row = session.query(Model).filter(Model.name == request.model).first()
 
    if not model_row:
        return {"reply": "هذا الموديل غير موجود."}
 
    if model_row.type == "embedding":
        return {"reply": "هذا الموديل مخصص للبحث الذكي (embeddings) وليس للمحادثة المباشرة."}
 
    technical_name = model_row.openrouter_id
 
    if not technical_name:
        return {
            "reply": "هذا الموديل غير متاح للمحادثة الحقيقية حالياً "
                     "(ما له معرّف OpenRouter - راجعي الأدمن لإضافته)."
        }
 
    if not OPENROUTER_API_KEY:
        return {"reply": "⚠️ ما فيه مفتاح OpenRouter مُعد بملف .env بالباكند."}
 
    try:
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": technical_name,
                "messages": [{"role": "user", "content": request.message}],
                "max_tokens": 500
            },
            timeout=30,
        )
        data = response.json()
        reply = data["choices"][0]["message"]["content"]
    except requests.RequestException as e:
        return {"reply": f"تعذر الاتصال بخدمة OpenRouter: {e}"}
    except (KeyError, IndexError):
        return {"reply": f"خطأ من الخدمة: {data}"}
 
    return {"reply": reply}
 
 
@router.get("/api/v1/models")
def get_all_models_public(session: Session = Depends(get_session)):
    """Public API endpoint - يرجع كل الموديلات الظاهرة بس (مو المخفية)."""
    rows = session.query(Model).filter(Model.visible == True).all()  # noqa: E712
    models = [_model_to_dict(m) for m in rows]
    return {"success": True, "count": len(models), "models": models}
 
 
@router.get("/api/v1/models/{model_name}")
def get_model_by_name(model_name: str, session: Session = Depends(get_session)):
    model_row = (
        session.query(Model)
        .filter(Model.name.ilike(model_name), Model.visible == True)  # noqa: E712
        .first()
    )
    if model_row:
        return {"success": True, "model": _model_to_dict(model_row)}
    return {"success": False, "message": "Model not found"}