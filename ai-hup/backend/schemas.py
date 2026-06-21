"""
schemas.py
----------
نماذج Pydantic لكل البيانات اللي تدخل وتطلع من الـ API. FastAPI يستخدمها
يتحقق تلقائيًا من البيانات قبل ما توصل لأي كود، ويصيغ الردود.
 
ملاحظة: Schemas مو نفسها نماذج قاعدة البيانات (بملف models/). النماذج
توصف الجداول، والـ Schemas توصف شكل بيانات الـ API - هذا الفرق يخلينا
مثلًا نستقبل كلمة مرور نصية وقت التسجيل، بس أبدًا ما نرجعها بأي رد.
"""
from typing import List, Optional, Literal
from pydantic import BaseModel, EmailStr, Field
 
 
# ============== المصادقة (Authentication) - مطابقة لملف الأستاذ ==============
 
class UserCreate(BaseModel):
    """Body of POST /auth/register."""
 
    email: EmailStr  # يتحقق تلقائيًا من صيغة الإيميل - "asdasdasd" يرفض بخطأ 422
    password: str = Field(min_length=6)
 
    # قائمة اختيار الدور موجودة هنا عشان نقدر نجرب صلاحيات الأدمن بسهولة
    # وقت العرض (نفس فكرة ملف الأستاذ بالضبط). بمشروع حقيقي السيرفر هو
    # اللي يحدد الدور، مو المستخدم نفسه وقت التسجيل.
    role: Literal["user", "admin"] = "user"
 
 
class UserLogin(BaseModel):
    """Body of POST /auth/login."""
    email: EmailStr
    password: str
 
 
class UserOut(BaseModel):
    """شكل بيانات المستخدم اللي نرجعها - بدون كلمة المرور المشفّرة إطلاقًا."""
    id: int
    email: EmailStr
    role: str
 
    model_config = {"from_attributes": True}
 
 
class Token(BaseModel):
    """رد POST /auth/login: التوكن + نوعه."""
    access_token: str
    token_type: str = "bearer"
 
 
# ============== الموديلات (Models) ==============
 
class ModelInput(BaseModel):
    """كل الحقول اللي يقدر الأدمن يعبيها لما يضيف أو يعدّل موديل."""
    name: str
    provider: str
    type: str = "LLM"
    open_source: bool = False
    description: str = ""
    tags: List[str] = []
    modality: List[str] = ["text"]
    context_window: int = 0
    pricing: str = "medium"
    latency: float = 1.0
    accuracy: int = 0
    capabilities: str = ""
    limitations: str = ""
    use_cases: List[str] = []
    sample_prompts: List[str] = []
    release_date: str = ""
    version: str = ""
    visible: bool = True
    openrouter_id: Optional[str] = None