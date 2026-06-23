from fastapi import APIRouter, Depends
 
from models.user import User
import schemas
from security import get_current_user
 
router = APIRouter(prefix="/users", tags=["users"])
 
 
@router.get("/me", response_model=schemas.UserOut)
def read_me(current_user: User = Depends(get_current_user)):
    return current_user
 
 
@router.get("/profile")
def read_profile(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role,
    }