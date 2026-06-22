"""
routers/chatbot.py
--------------------
شات بوت ذكي يرشح الموديل الأنسب بناءً على طلب المستخدم الحقيقي.

كيف يشتغل:
  1. المستخدم يكتب أي شي (عربي، إنجليزي، عامية، أخطاء، اختصارات...)
  2. نجيب قائمة كل الموديلات المتاحة من قاعدة البيانات (الاسم، الوصف،
     الاستخدامات، السعر، الدقة، السرعة...)
  3. نرسل طلب المستخدم + قائمة الموديلات لـ GPT-4o-mini
  4. GPT يقرأ الطلب ويقارن بين الموديلات ويختار الأنسب فعلاً مع شرح قصير
  5. لو فشل الاتصال بـ GPT: نرجع للطريقة البسيطة (بحث بكلمات مفتاحية)
     كـ fallback عشان الشات بوت ما يوقف نهائياً

الفرق عن الطريقة القديمة:
  - قبل: نبحث عن أول كلمة تطابق → غبي ومحدود
  - الحين: GPT يفهم السياق الكامل ويختار الأنسب فعلاً
"""
import os
import requests

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from models.model import Model

router = APIRouter(prefix="/chatbot", tags=["chatbot"])


class RecommendRequest(BaseModel):
    use_case: str


def get_models_summary(models) -> str:
    """
    يحوّل قائمة الموديلات من قاعدة البيانات لنص منظم يقدر GPT يفهمه
    ويقارن بينهم بناءً على الطلب.
    """
    lines = []
    for m in models:
        provider = m.provider.name if m.provider else "Unknown"
        use_cases = ", ".join(m.use_cases or []) or "general"
        tags = ", ".join(m.tags or []) or ""
        pricing = m.pricing or "medium"
        accuracy = f"{m.accuracy}%" if m.accuracy else "N/A"
        latency = f"{m.latency}s" if m.latency else "N/A"
        open_source = "open-source" if m.open_source else "proprietary"
        modality = ", ".join(m.modality or []) or "text"

        lines.append(
            f"- {m.name} ({provider}): "
            f"use cases: {use_cases} | "
            f"tags: {tags} | "
            f"price: {pricing} | "
            f"accuracy: {accuracy} | "
            f"speed: {latency} | "
            f"type: {open_source} | "
            f"supports: {modality}"
        )
    return "\n".join(lines)


def recommend_with_gpt(user_request: str, models_summary: str, model_names: list) -> dict | None:
    """
    يرسل طلب المستخدم + قائمة الموديلات لـ GPT-4o-mini ويطلب منه يختار
    الأنسب مع شرح قصير. يرجع None لو فشل الاتصال (يتفعّل الـ fallback).
    """
    api_key = os.getenv("OPENROUTER_API_KEY", "")
    if not api_key:
        return None

    names_list = ", ".join(model_names)

    try:
        resp = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": "openai/gpt-4o-mini",
                "max_tokens": 80,
                "messages": [
                    {
                        "role": "system",
                        "content": (
                            "أنت مساعد متخصص في اختيار أنسب نموذج ذكاء اصطناعي.\n"
                            "ستُعطى قائمة بالنماذج المتاحة وطلب المستخدم.\n"
                            "اختر النموذج الأنسب فعلاً بناءً على الطلب، مع مراعاة:\n"
                            "- نوع المهمة (كود، صور، ترجمة، محادثة...)\n"
                            "- السعر إذا ذكر المستخدم ميزانية\n"
                            "- الدقة والسرعة إذا كانت مهمة للطلب\n\n"
                            f"النماذج المتاحة:\n{models_summary}\n\n"
                            "أجب بهذا الشكل الحرفي فقط (سطر واحد):\n"
                            f"MODEL: [اسم النموذج من القائمة: {names_list}] | REASON: [سبب الاختيار بجملة قصيرة]"
                        ),
                    },
                    {
                        "role": "user",
                        "content": user_request,
                    },
                ],
            },
            timeout=15,
        )
        resp.raise_for_status()
        raw = resp.json()["choices"][0]["message"]["content"].strip()

        # نحلّل الرد: MODEL: xxx | REASON: yyy
        model_name = None
        reason = ""

        if "MODEL:" in raw and "REASON:" in raw:
            parts = raw.split("|")
            for part in parts:
                part = part.strip()
                if part.startswith("MODEL:"):
                    model_name = part.replace("MODEL:", "").strip()
                elif part.startswith("REASON:"):
                    reason = part.replace("REASON:", "").strip()

        # نتحقق إن الاسم موجود فعلاً بقائمة موديلاتنا
        if model_name and model_name in model_names:
            return {"model_name": model_name, "reason": reason}

        return None  # الرد غير صالح → يتفعّل الـ fallback

    except Exception:
        return None  # أي خطأ → يتفعّل الـ fallback


def fallback_recommend(user_request: str, models: list):
    """
    طريقة احتياطية بسيطة: نبحث بالكلمات المفتاحية إذا فشل GPT.
    نحسب سكور لكل موديل (كم كلمة من طلب المستخدم تطابق use_cases/tags)
    ونرجع الأعلى سكور.
    """
    user_words = user_request.lower().split()
    best_model = None
    best_score = 0

    for m in models:
        score = 0
        all_keywords = (m.use_cases or []) + (m.tags or []) + [m.name or ""]
        all_text = " ".join(all_keywords).lower()

        for word in user_words:
            if word in all_text:
                score += 1

        if score > best_score:
            best_score = score
            best_model = m

    # لو ما لقينا تطابق، نرجع أول موديل بالقائمة
    return best_model or (models[0] if models else None)


@router.post("/recommend")
def recommend_model(req: RecommendRequest, db: Session = Depends(get_db)):
    """
    المسار الرئيسي للتوصية. يمر بمرحلتين:
      1. نحاول بـ GPT (ذكي، يفهم أي لغة وسياق)
      2. لو فشل GPT، نرجع للـ fallback (بحث بكلمات مفتاحية + سكور)
    """
    models = db.query(Model).filter(Model.visible == True).all()

    if not models:
        return {"recommended_model": "No models available yet", "reason": ""}

    model_names = [m.name for m in models]
    models_summary = get_models_summary(models)

    # المرحلة 1: نحاول بـ GPT
    gpt_result = recommend_with_gpt(req.use_case, models_summary, model_names)

    if gpt_result:
        return {
            "recommended_model": gpt_result["model_name"],
            "reason": gpt_result["reason"],
        }

    # المرحلة 2: fallback بالكلمات المفتاحية
    best = fallback_recommend(req.use_case, models)
    provider = best.provider.name if best and best.provider else ""

    return {
        "recommended_model": best.name if best else "No models available",
        "provider": provider,
        "reason": "",
    }