
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
 
from database import SessionLocal
from services.comparison_service import compare_models_service
 
router = APIRouter()
 
 
def get_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
 
 
@router.post("/models/compare")
def compare_models(ids: list[int], session: Session = Depends(get_session)):
    result = compare_models_service(session, ids)
    return {
        "models": [
            {
                "id": m.id,
                "name": m.name,
                "provider": m.provider.name if m.provider else None,
                "modality": m.modality or [],
                "context_window": m.context_window,
                "pricing": m.pricing,
                "latency": m.latency,
                "accuracy": m.accuracy,
                "capabilities": m.capabilities,
                "limitations": m.limitations,
            }
            for m in result["models"]
        ]
    }