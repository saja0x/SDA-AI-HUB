from fastapi import APIRouter
from pydantic import BaseModel
from data import models

class RecommendRequest(BaseModel):
    use_case: str

router = APIRouter()

@router.post("/chatbot/recommend")
def recommend(request: RecommendRequest):
    user_msg = request.use_case.lower()
    
    best_model = None
    highest_score = 0

    for model in models:
        score = 0
        for keyword in model["use_cases"]:
            if keyword in user_msg:
                score += 1
        if score > highest_score:
            highest_score = score
            best_model = model

    if best_model and highest_score > 0:
        return {"recommended_model": best_model["name"], "provider": best_model["provider"]}
    
    return {"recommended_model": "GPT-4", "provider": "OpenAI"}