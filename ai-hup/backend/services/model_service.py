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
        "openrouter_id": m.openrouter_id,
    }


def get_all_models():
    session = SessionLocal()
    try:
        rows = session.query(Model).filter(Model.visible == True).all()
        return [_model_to_dict(m) for m in rows]
    finally:
        session.close()


def search_models(q):
    q_lower = q.lower()
    return [
        model for model in get_all_models()
        if q_lower in model["name"].lower()
        or q_lower in (model.get("description") or "").lower()
        or any(q_lower in t.lower() for t in (model.get("tags") or []))
        or any(q_lower in uc.lower() for uc in (model.get("use_cases") or []))
    ]