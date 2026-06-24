
import os
import requests

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from dotenv import load_dotenv
from sqlalchemy.orm import Session

from database import get_db
from models.model import Model
from models.usage_limit import UsageLimit
from models.user import User
from security import get_current_user

# للمسج ليميت  يقرا ملف env الي فيه المفتاح 
load_dotenv()

router = APIRouter(prefix="/playground", tags=["playground"])

MESSAGE_LIMIT = 10 
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")


# جيسون لعشان يفهمه الفرونت
def _model_to_dict(m):
    return {
        "id": m.id,
        "name": m.name,
        "provider": m.provider.name if m.provider else None,
        "type": m.type,
        "description": m.description,
        "openrouter_id": m.openrouter_id,
    }


#شكل البيانات , سترينق رساله اليوزر
class ChatRequest(BaseModel):
    message: str
    model: str
    model_id: int | None = None
# رقمه بالداتا بيس

#تعرض موديلات بالبلاي قراوند
@router.get("/models")
def list_playground_models(db: Session = Depends(get_db)):
    """قائمة الموديلات المرئية فقط عشان يختار منها المستخدم بالبلاي قراوند."""
    models = db.query(Model).filter(Model.visible == True).all()
    return [_model_to_dict(m) for m in models]


#يستقبل رساله الفرونت ويرسلها للموديل 
@router.post("/chat")
def chat(
    req: ChatRequest,
    #مهمه عشان محد يكتب . تحقق
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db), 
):
    
   
   # رقم المودل من الفرونت
    model_id = req.model_id
    if model_id is None:
        model_obj = db.query(Model).filter(Model.name == req.model).first()
        model_id = model_obj.id if model_obj else None

    limit_row = None
    if model_id is not None:
        limit_row = (
            db.query(UsageLimit)
            .filter(
                UsageLimit.user_id == current_user.id,
                UsageLimit.model_id == model_id,
            )
            .first()
        )
        
      #بو اول مره يسوي سجل له
        if limit_row is None:
            limit_row = UsageLimit(user_id=current_user.id, model_id=model_id, message_count=0)
            db.add(limit_row)
            db.flush()

        if limit_row.message_count >= MESSAGE_LIMIT:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"You've reached the {MESSAGE_LIMIT}-message limit for this model. Try exploring other models on the platform!",
            )

        limit_row.message_count += 1
        db.commit()

    # --- الإرسال للـ LLM ---
    model_obj = db.query(Model).filter(Model.name == req.model).first()

    if not model_obj:
        return {"reply": "هذا الموديل غير موجود."}

    if model_obj.type == "embedding":
        return {"reply": "هذا الموديل مخصص للبحث الذكي (embeddings) وليس للمحادثة المباشرة."}

    openrouter_id = model_obj.openrouter_id

    if not openrouter_id:
        return {
            "reply": "هذا الموديل غير متاح للمحادثة الحقيقية حالياً "
                     "(ما له معرّف OpenRouter - راجعي الأدمن لإضافته)."
        }

    if not OPENROUTER_API_KEY:
        return {"reply": "⚠️ ما فيه مفتاح OpenRouter مُعد بملف .env بالباكند."}

    try:
        resp = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": openrouter_id,
                "messages": [{"role": "user", "content": req.message}],
                "max_tokens": 500,
            },
            timeout=30,
        )
        resp.raise_for_status()
        data = resp.json()
        reply = data["choices"][0]["message"]["content"]
    except requests.RequestException as e:
        return {"reply": f"تعذر الاتصال بخدمة OpenRouter: {e}"}
    except (KeyError, IndexError):
        return {"reply": "خطأ في استجابة الخدمة."}

    remaining = max(0, MESSAGE_LIMIT - limit_row.message_count) if limit_row else None
    return {"reply": reply, "remaining": remaining}


@router.get("/usage/{model_id}")
def get_usage(
    model_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """يرجع كم رسالة تبقت للمستخدم لهذا الموديل (الفرونت اند يعرضها)."""
    limit_row = (
        db.query(UsageLimit)
        .filter(
            UsageLimit.user_id == current_user.id,
            UsageLimit.model_id == model_id,
        )
        .first()
    )
    used = limit_row.message_count if limit_row else 0
    return {
        "model_id": model_id,
        "used": used,
        "limit": MESSAGE_LIMIT,
        "remaining": max(0, MESSAGE_LIMIT - used),
    }


@router.get("/api/v1/models")
def get_all_models_public(db: Session = Depends(get_db)):
    """Public API - يرجع كل الموديلات الظاهرة بدون تسجيل دخول."""
    models = db.query(Model).filter(Model.visible == True).all()
    return {"success": True, "count": len(models), "models": [_model_to_dict(m) for m in models]}


@router.get("/api/v1/models/{model_name}")
def get_model_by_name(model_name: str, db: Session = Depends(get_db)):
    """Public API - يبحث عن موديل بالاسم."""
    model_row = (
        db.query(Model)
        .filter(Model.name.ilike(model_name), Model.visible == True)
        .first()
    )
    if model_row:
        return {"success": True, "model": _model_to_dict(model_row)}
    return {"success": False, "message": "Model not found"}