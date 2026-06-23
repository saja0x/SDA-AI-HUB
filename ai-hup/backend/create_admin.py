import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from database import SessionLocal, init_db
from models.user import User
from security import hash_password


def create_admin(email: str, password: str):
    init_db()
    db = SessionLocal()

    try:
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            if existing.role == "admin":
                print(f"  {email} مسجل بالفعل كأدمن.")
            else:
                existing.role = "admin"
                db.commit()
                print(f" تم ترقية {email} لأدمن.")
            return

        admin = User(
            username=email.split("@")[0], 
            email=email,
            hashed_password=hash_password(password),
            role="admin",
        )
        db.add(admin)
        db.commit()
        print(f" تم إنشاء حساب الأدمن: {email}")

    finally:
        db.close()


if __name__ == "__main__":
    print("=== إضافة حساب أدمن ===")
    email = input("الإيميل: ").strip()
    password = input("كلمة المرور (6 أحرف على الأقل): ").strip()

    if len(password) < 6:
        print(" كلمة المرور قصيرة جداً — لازم 6 أحرف على الأقل.")
        sys.exit(1)

    create_admin(email, password)