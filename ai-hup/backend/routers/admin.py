
from fastapi import APIRouter, Depends
 
from schemas import ModelInput
from models.user import User
from security import require_admin
from services.admin_service import (
    create_model,
    update_model,
    delete_model,
    get_all_models_admin,
)
from services.tag_service import get_all_tags, create_tag, delete_tag
 
router = APIRouter(prefix="/admin", tags=["admin"])
 
 

 
@router.get("/models")
def list_all_models(current_admin: User = Depends(require_admin)):
  
    return get_all_models_admin()
 
 
@router.post("/models")
def add_model(data: ModelInput, current_admin: User = Depends(require_admin)):
    return create_model(data.dict())
 
 
@router.put("/models/{id}")
def edit_model(id: int, data: ModelInput, current_admin: User = Depends(require_admin)):
    return update_model(id, data.dict(exclude_unset=True))
 
 
@router.delete("/models/{id}")
def remove_model(id: int, current_admin: User = Depends(require_admin)):
    return delete_model(id)
 
 

 
@router.get("/tags")
def list_tags(current_admin: User = Depends(require_admin)):
    return get_all_tags()
 
 
@router.post("/tags")
def add_tag(name: str, current_admin: User = Depends(require_admin)):
    return create_tag(name)
 
 
@router.delete("/tags/{tag_id}")
def remove_tag(tag_id: int, current_admin: User = Depends(require_admin)):
    return delete_tag(tag_id)