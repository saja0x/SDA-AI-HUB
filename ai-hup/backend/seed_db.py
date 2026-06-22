"""
سكربت تعبئة قاعدة البيانات بالبيانات الأولية من models_seed.json
يشتغل تلقائيًا عند تشغيل السيرفر (main.py) - وما يكرر التعبئة لو البيانات موجودة أصلًا
 
تغيير: أضفنا استيراد usage_limit عشان SQLAlchemy يشوف الجدول الجديد
ويسويه تلقائيًا بأول تشغيل (مو محتاجين نحذف app.db).
"""
import json
import os
 
from database import SessionLocal, init_db
from models.provider import Provider
from models.model import Model
from models.model_version import ModelVersion
 
 
def seed_database():
    # ضيفنا usage_limit هنا عشان init_db يلقاه ويعمل الجدول لو ما كان موجود
    from models import usage_limit  # noqa: F401
 
    init_db()
    session = SessionLocal()
 
    try:
        if session.query(Model).count() > 0:
            return
 
        SEED_PATH = os.path.join(os.path.dirname(__file__), "models_seed.json")
        with open(SEED_PATH, "r", encoding="utf-8") as f:
            seed_models = json.load(f)
 
        provider_names = sorted({m["provider"] for m in seed_models})
        provider_map = {}
        for pname in provider_names:
            provider = Provider(name=pname)
            session.add(provider)
            session.flush()
            provider_map[pname] = provider.id
 
        for m in seed_models:
            model_row = Model(
                name=m["name"],
                provider_id=provider_map[m["provider"]],
                type=m.get("type", "LLM"),
                open_source=m.get("open_source", False),
                description=m.get("description", ""),
                tags=m.get("tags", []),
                modality=m.get("modality", []),
                context_window=m.get("context_window", 0),
                pricing=m.get("pricing", "medium"),
                latency=m.get("latency", 1),
                accuracy=m.get("accuracy", 0),
                capabilities=m.get("capabilities", ""),
                limitations=m.get("limitations", ""),
                use_cases=m.get("use_cases", []),
                sample_prompts=m.get("sample_prompts", []),
                release_date=m.get("release_date", ""),
                version=m.get("version", ""),
                visible=True,
                openrouter_id=m.get("openrouter_id"),
            )
            session.add(model_row)
            session.flush()
 
            session.add(ModelVersion(
                model_id=model_row.id,
                version=m.get("version", ""),
                notes="Initial seed version",
            ))
 
        session.commit()
        print(f"✅ Seeded {len(seed_models)} models into the database")
    finally:
        session.close()
 
 
if __name__ == "__main__":
    seed_database()