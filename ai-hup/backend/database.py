from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///app.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def init_db():
    """ينشئ كل جداول قاعدة البيانات لو ما كانت موجودة أصلاً (ما يحذف بيانات موجودة)"""
    # نستورد كل ملفات الجداول هنا عشان SQLAlchemy يسجلها قبل ما ننشئها
    from models import model, provider, tag, model_version, user, role  # noqa: F401
    Base.metadata.create_all(bind=engine)