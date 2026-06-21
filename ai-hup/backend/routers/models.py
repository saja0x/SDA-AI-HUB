from fastapi import APIRouter
from services.model_service import get_all_models
from services.model_service import search_models

router = APIRouter()

@router.get("/models")
def get_models():
    return get_all_models()

@router.get("/models/search")
def search(q: str):
    return search_models(q)