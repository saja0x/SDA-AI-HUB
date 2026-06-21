"""
routers/users.py
------------------
مسارات لأي مستخدم مسجل دخول (بغض النظر عن دوره - أدمن أو user عادي).

- GET /users/me      -> يستخدمه AuthContext يتحقق من التوكن ويجيب بيانات المستخدم
- GET /users/profile -> صفحة بروفايل بسيطة (فكرة من ملف الأستاذ) - تثبت
                        إن أي مسار جديد نضيفه يصير "محمي" بسطر واحد بس
                        (Depends(get_current_user))
"""
from fastapi import APIRouter, Depends

from models.user import User
import schemas
from security import get_current_user

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=schemas.UserOut)
def read_me(current_user: User = Depends(get_current_user)):
    """
    Depends(get_current_user) هو كل آلية الحماية هنا. ما فيه توكن صحيح
    بـ Authorization header -> الـ Dependency نفسها ترفض الطلب بـ 401
    وهذي الدالة ما تشتغل أصلًا.
    """
    return current_user


@router.get("/profile")
def read_profile(current_user: User = Depends(get_current_user)):
    """
    صفحة بروفايل ثانية، بس هذي ترجع dict عادي بدل schema ثابت - FastAPI
    يحولها JSON تلقائيًا. تستخدمها صفحة Profile بالفرونت اند.
    """
    return {
        "message": f"مرحبًا {current_user.email}، هذي بيانات حسابك بـ Lumia.",
        "id": current_user.id,
        "email": current_user.email,
        "role": current_user.role,
    }