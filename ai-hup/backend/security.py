"""
security.py
------------
كل أدوات الأمان بمكان واحد: تشفير كلمات المرور، تسوية/التحقق من JWT،
والـ Dependencies اللي تحمي المسارات. الملفات بـ routers/ تستورد من هنا -
هذا الملف يحدد "كيف" تشتغل المصادقة، والراوترز تحدد "وين" نطبقها.
 
(هذا الملف يستبدل auth_utils.py القديم - احذفي auth_utils.py القديم
بعد ما تضيفين هذا)
 
تسلسل العمل:
  تسجيل حساب -> نشفّر كلمة المرور ونحفظ المستخدم
  تسجيل دخول -> نتحقق من كلمة المرور ونعطي توكن JWT موقّع
  أي route محمي -> العميل يرسل "Authorization: Bearer <token>"،
                    get_current_user يفك التوكن ويجيب المستخدم
  route للأدمن بس -> require_admin تشغّل get_current_user أول، وبعدها
                      تتحقق من عمود الدور (role) أيضًا
"""
import os
from datetime import datetime, timedelta, timezone
 
import bcrypt
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
 
from database import get_db
from models.user import User
 
# بمشروع حقيقي هذا يجي من متغير بيئة (.env)، أبدًا من كود مصدري -
# أي حد يعرف هذا المفتاح يقدر يزوّر توكنات لأي مستخدم.
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "change-me-in-production-this-is-a-classroom-demo")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
 
# HTTPBearer يسحب التوكن من Header اسمه "Authorization: Bearer xxx" تلقائيًا،
# ويرجع 403 لو الـ Header مفقود بالكامل.
bearer_scheme = HTTPBearer()
 
 
# ---------------------------------------------------------------------------
# كلمات المرور
# ---------------------------------------------------------------------------
 
def hash_password(password: str) -> str:
    """
    bcrypt تشفير اتجاه واحد مخصص لكلمات المرور: بطيء عمدًا (يصعّب محاولات
    التخمين)، ويضيف "ملح" (salt) تلقائيًا فيخلي كلمتين مرور متطابقتين
    ينتجون تشفير مختلف.
    """
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
 
 
def verify_password(plain: str, hashed: str) -> bool:
    """ما تقدرين "تفكّين" تشفير bcrypt. checkpw تشفّر المحاولة بنفس الملح وتقارن."""
    return bcrypt.checkpw(plain.encode(), hashed.encode())
 
 
# ---------------------------------------------------------------------------
# JWT
# ---------------------------------------------------------------------------
 
def create_access_token(user: User) -> str:
    """
    JWT عبارة عن 3 أجزاء: header.payload.signature. أي حد يقدر يقرا الـ
    payload (حتى من غير المفتاح السري) - فما نحط فيه أسرار. اللي يخليه
    آمن هو التوقيع: محسوب بالمفتاح السري، فلو حد عبث بالبيانات يصير
    التوقيع غير متطابق ونرفض التوكن.
    """
    payload = {
        # "sub" (subject) = صاحب التوكن - هنا رقم المستخدم (id)
        "sub": str(user.id),
        # نحط الدور جوا التوكن عشان الفرونت اند يقدر يخفي/يظهر واجهة الأدمن
        # بدون طلب إضافي - بس الباكند دايمًا يتحقق من الدور بقاعدة البيانات
        # مرة ثانية بأي route حساس، ما يثق بالتوكن وحده.
        "role": user.role,
        # "exp" تتحقق منها jwt.decode() تلقائيًا - توكن منتهي يرفض من نفسه
        "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
 
 
# ---------------------------------------------------------------------------
# Dependencies لحماية المسارات
# ---------------------------------------------------------------------------
 
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    """
    Dependency لأي route يحتاج تسجيل دخول بس. تفك التوكن، وتجيب المستخدم
    من قاعدة البيانات. أي خلل (توقيع غلط، منتهي، المستخدم انحذف بعد ما
    صدر التوكن) يوقف الطلب بخطأ 401.
    """
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )
 
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.PyJWTError:
        raise unauthorized
 
    user = db.query(User).filter(User.id == int(payload["sub"])).first()
    if user is None:
        raise unauthorized
 
    return user
 
 
def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """
    RBAC يصير هنا. هذا الـ Dependency يبني فوق get_current_user (يعني
    التحقق من التوكن صار أصلًا)، وبعدها يضيف شرط وحيد: الدور لازم "admin".
    401 = "ما نعرف مين انت"، 403 = "نعرف مين انت، بس ما يحق لك."
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user