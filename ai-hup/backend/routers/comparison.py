from fastapi import APIRouter

router = APIRouter()

@router.post("/models/compare")
def compare_models(models: list[int]):
    return {
        "models_received": models,
        "result": "comparison will be built here"
    }