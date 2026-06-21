from fastapi import APIRouter
from data import models

router = APIRouter(prefix="/models", tags=["Model Detail"])

@router.get("/{model_id}")
def get_model_detail(model_id: int):
    for model in models:
        if model["id"] == model_id:
            return {"model": model}
    return {"model": None}