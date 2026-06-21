from database import SessionLocal
from models.model import Model


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


def get_all_models():
    """الموديلات الظاهرة بس (اللي visible=True) - تستخدم بالصفحات العامة"""
    session = SessionLocal()
    try:
        rows = session.query(Model).filter(Model.visible == True).all()  # noqa: E712
        return [_model_to_dict(m) for m in rows]
    finally:
        session.close()


def search_models(q):
    models = get_all_models()
    return [
        model
        for model in models
        if q.lower() in model["name"].lower()
    ]