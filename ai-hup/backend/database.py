"""
database.py
------------
كل شي يحتاجه SQLAlchemy عشان يتكلم مع قاعدة البيانات: المحرك (engine)،
ومصنع الجلسات (sessionmaker)، وكلاس Base اللي ترث منه كل جداولنا.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
 
SQLALCHEMY_DATABASE_URL = "sqlite:///app.db"
 
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
)
 
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
 
Base = declarative_base()
 
 
def get_db():
    """
    FastAPI dependency تعطي جلسة قاعدة بيانات لأي route، وتضمن إغلاقها
    لما الطلب يخلص - حتى لو صار خطأ بالنص. هذا النمط مطابق لملف الأستاذ.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
 
 
def init_db():
    """ينشئ كل جداول قاعدة البيانات لو ما كانت موجودة أصلاً (ما يحذف بيانات موجودة)"""
    from models import model, provider, tag, model_version, user  # noqa: F401
    Base.metadata.create_all(bind=engine)