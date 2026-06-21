from database import SessionLocal
from models.model import Model
from models.provider import Provider


def _get_or_create_provider(session, name: str) -> int:
    provider = session.query(Provider).filter(Provider.name == name).first()
    if provider:
        return provider.id
    provider = Provider(name=name)
    session.add(provider)
    session.flush()
    return provider.id


def _model_to_dict(m: Model) -> dict:
    return {
        "id": m.id,
        "name": m.name,
        "provider": m.provider.name if m.provider else None,
        "type": m.type,
        "open_source": m.open_source,
        "description": m.description,
        "tags": m.tags or [],
        "modality": m.modality or [],
        "context_window": m.context_window,
        "pricing": m.pricing,
        "latency": m.latency,
        "accuracy": m.accuracy,
        "capabilities": m.capabilities,
        "limitations": m.limitations,
        "use_cases": m.use_cases or [],
        "sample_prompts": m.sample_prompts or [],
        "release_date": m.release_date,
        "version": m.version,
        "visible": m.visible,
    }


def get_all_models_admin():
    """كل الموديلات بدون استثناء (حتى المخفية) - تستخدم بلوحة الأدمن بس"""
    session = SessionLocal()
    try:
        rows = session.query(Model).all()
        return [_model_to_dict(m) for m in rows]
    finally:
        session.close()


def search_models(query):
    return {
        "search": query
    }


def create_model(data):
    session = SessionLocal()
    try:
        name = (data.get("name") or "").strip()
        provider_name = (data.get("provider") or "").strip()

        # تحقق شكلي: الاسم والمزوّد لازم يكونون موجودين
        if not name or not provider_name:
            return {"error": "Name and provider are required"}

        # تحقق: ما نسمح بتكرار نفس اسم الموديل
        existing = session.query(Model).filter(Model.name.ilike(name)).first()
        if existing:
            return {"error": f"A model named '{name}' already exists"}

        provider_id = _get_or_create_provider(session, provider_name)

        new_model = Model(
            name=name,
            provider_id=provider_id,
            type=data.get("type", "LLM"),
            open_source=data.get("open_source", False),
            description=data.get("description", ""),
            tags=data.get("tags", []),
            modality=data.get("modality", ["text"]),
            context_window=data.get("context_window", 0),
            pricing=data.get("pricing", "medium"),
            latency=data.get("latency", 1),
            accuracy=data.get("accuracy", 0),
            capabilities=data.get("capabilities", ""),
            limitations=data.get("limitations", ""),
            use_cases=data.get("use_cases", []),
            sample_prompts=data.get("sample_prompts", []),
            release_date=data.get("release_date", ""),
            version=data.get("version", ""),
            visible=data.get("visible", True),
        )
        session.add(new_model)
        session.commit()
        session.refresh(new_model)
        return {"message": "Model Added", "model": _model_to_dict(new_model)}
    finally:
        session.close()


def update_model(model_id, data):
    session = SessionLocal()
    try:
        model_row = session.query(Model).filter(Model.id == model_id).first()
        if not model_row:
            return {"error": f"Model {model_id} not found"}

        data = dict(data)  # نسخة عشان نقدر نشيل منها provider بدون ما نأثر على الأصل

        if "provider" in data:
            provider_name = (data.pop("provider") or "").strip()
            if provider_name:
                model_row.provider_id = _get_or_create_provider(session, provider_name)

        # نحدث بس الحقول اللي فعلاً انبعثت من الفرونت اند
        for key, value in data.items():
            if hasattr(model_row, key):
                setattr(model_row, key, value)

        session.commit()
        session.refresh(model_row)
        return {"message": f"Model {model_id} Updated", "model": _model_to_dict(model_row)}
    finally:
        session.close()


def delete_model(model_id):
    session = SessionLocal()
    try:
        model_row = session.query(Model).filter(Model.id == model_id).first()
        if not model_row:
            return {"error": f"Model {model_id} not found"}
        session.delete(model_row)
        session.commit()
        return {"message": f"Model {model_id} Deleted"}
    finally:
        session.close()