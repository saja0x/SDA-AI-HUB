import os
import requests
from fastapi import APIRouter
from pydantic import BaseModel
from dotenv import load_dotenv
from data import models

load_dotenv()
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

class MessageRequest(BaseModel):
    message: str
    model: str

router = APIRouter()

# خريطة تربط اسم الموديل عندنا بالاسم التقني اللي يفهمه OpenRouter
model_map = {
    "GPT-5.5": "openai/gpt-5.5",                              
    "GPT-4.1": "openai/gpt-4.1",
    "Claude Opus 4.7": "anthropic/claude-opus-4.7",
    "Claude Sonnet 4.6": "anthropic/claude-sonnet-4.6",
    "Gemini 3.1 Pro": "google/gemini-3.1-pro-preview",        
    "Gemini 3 Flash": "google/gemini-3-flash-preview",        
    "DeepSeek V4": "deepseek/deepseek-v3.2",                  
    "Llama 4 Scout": "meta-llama/llama-4-scout",              
    "Qwen 3.6": "qwen/qwen3.6-plus",                          
}
@router.get("/playground/models")
def get_models():
    return models

@router.post("/playground/chat")
def chat(request: MessageRequest):
    if request.model == "Text Embedding 3":
        return {"reply": "هذا الموديل مخصص للبحث الذكي (embeddings) وليس للمحادثة المباشرة."}

    technical_name = model_map.get(request.model)

    if not technical_name:
        return {"reply": "هذا الموديل غير متاح للمحادثة الحقيقية حالياً."}

    response = requests.post(
        url="https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": technical_name,
            "messages": [
                {"role": "user", "content": request.message}
            ],
            "max_tokens": 500
        }
    )

    data = response.json()

    try:
        reply = data["choices"][0]["message"]["content"]
    except (KeyError, IndexError):
        reply = f"خطأ: {data}"

    return {"reply": reply}


@router.get("/api/v1/models")
def get_all_models_public():
    """
    Public API endpoint for external access to model metadata.
    Returns all available AI models with their details.
    """
    return {
        "success": True,
        "count": len(models),
        "models": models
    }


@router.get("/api/v1/models/{model_name}")
def get_model_by_name(model_name: str):
    """
    Public API endpoint to get details of a specific model by name.
    """
    for model in models:
        if model["name"].lower() == model_name.lower():
            return {"success": True, "model": model}

    return {"success": False, "message": "Model not found"}