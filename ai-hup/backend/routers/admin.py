from fastapi import APIRouter
from pydantic import BaseModel
from services.admin_service import create_model, update_model, delete_model

class ModelInput(BaseModel):
    name: str
    provider: str
    # حقول اختيارية جديدة (مالها قيمة افتراضية) - ما تكسر أي استدعاء قديم
    description: str = ""
    tags: list[str] = []
    visible: bool = True

router = APIRouter()

@router.post("/admin/models")
def add_model(data: ModelInput):
    return create_model(data.dict())

@router.put("/admin/models/{id}")
def edit_model(id: int, data: ModelInput):
    # exclude_unset=True: نحدّث بس الحقول اللي فعلاً انبعثت من الفرونت اند
    # (لو ما استخدمناها، أي تعديل من AdminDashboard كان بيصفر الـ description والـ tags لأنه ما يرسلهم)
    return update_model(id, data.dict(exclude_unset=True))

@router.delete("/admin/models/{id}")
def remove_model(id: int):
    return delete_model(id)