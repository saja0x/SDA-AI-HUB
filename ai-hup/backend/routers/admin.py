"""
routers/admin.py
-----------------
كل مسارات لوحة تحكم الأدمن: إضافة/تعديل/حذف موديلات، وإدارة التاجات.
 
تغيير مهم: كل مسار هنا الحين محمي بـ Depends(require_admin) - يعني FastAPI
يتحقق تلقائيًا (قبل ما يدخل الكود نفسه) إن فيه تسجيل دخول صحيح وإن المستخدم
دوره "admin" فعليًا. قبل كذا ما كان فيه أي تحقق، وأي حد يقدر يضيف/يحذف موديلات.
 
تغيير ثاني: أضفنا GET /admin/models يرجع كل الموديلات (حتى المخفية) - قبل
كذا لوحة الأدمن ما كانت تقدر تشوف موديل مخفي أصلًا.
"""
from fastapi import APIRouter, Depends
 
from schemas import ModelInput
from auth_utils import require_admin
from services.admin_service import (
    create_model,
    update_model,
    delete_model,
    get_all_models_admin,
)
from services.tag_service import get_all_tags, create_tag, delete_tag
 
router = APIRouter(prefix="/admin", tags=["admin"])
 
 
# ---------- الموديلات ----------
 
@router.get("/models")
def list_all_models(current_admin: str = Depends(require_admin)):
    """يرجع كل الموديلات بدون استثناء (حتى المخفية) - تستخدمها لوحة الأدمن."""
    return get_all_models_admin()
 
 
@router.post("/models")
def add_model(data: ModelInput, current_admin: str = Depends(require_admin)):
    return create_model(data.dict())
 
 
@router.put("/models/{id}")
def edit_model(id: int, data: ModelInput, current_admin: str = Depends(require_admin)):
    # exclude_unset=True: نحدّث بس الحقول اللي فعلاً انبعثت من الفرونت اند
    return update_model(id, data.dict(exclude_unset=True))
 
 
@router.delete("/models/{id}")
def remove_model(id: int, current_admin: str = Depends(require_admin)):
    return delete_model(id)
 
 
# ---------- التاجات ----------
 
@router.get("/tags")
def list_tags(current_admin: str = Depends(require_admin)):
    return get_all_tags()
 
 
@router.post("/tags")
def add_tag(name: str, current_admin: str = Depends(require_admin)):
    return create_tag(name)
 
 
@router.delete("/tags/{tag_id}")
def remove_tag(tag_id: int, current_admin: str = Depends(require_admin)):
    return delete_tag(tag_id)