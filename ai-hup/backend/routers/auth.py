"""
routers/auth.py
-----------------
مسارات تسجيل حساب جديد وتسجيل الدخول - الوحيدة اللي ما تحتاج توكن
(هي اللي تعطيك التوكن أصلًا). نفس بنية ملف الأستاذ بالضبط، بالمسار
/auth/register و /auth/login.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
 
from database import get_db
from models.user import User
import schemas
from security import create_access_token, hash_password, verify_password
 
router = APIRouter(prefix="/auth", tags=["auth"])
 
 
@router.post("/register", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    """
    وقت ما هذي الدالة تشتغل، FastAPI أصلًا تحقق من البيانات حسب UserCreate -
    إيميل بصيغة غلط أو كلمة مرور قصيرة ما توصل لهنا أبدًا.
    """
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
 
    user = User(
        email=user_in.email,
        hashed_password=hash_password(user_in.password),
        role="user",
    )
 
    db.add(user)
    db.commit()
    db.refresh(user)  # نرجع نجيب البيانات اللي ولّدتها قاعدة البيانات (الـ id)
 
    return user  # response_model=UserOut يحوّلها تلقائيًا ويشيل كلمة المرور
 
 
@router.post("/login", response_model=schemas.Token)
def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
 
    # نفس رسالة الخطأ سواء الإيميل غير موجود أو كلمة المرور غلط - عشان
    # ما نعطي أي معلومة تساعد حد يخمن "هل هذا الإيميل مسجل أصلًا أو لا"
    if user is None or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
 
    return schemas.Token(access_token=create_access_token(user))