
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    """Body of POST /auth/register."""

    email: EmailStr
    password: str = Field(min_length=6)

class UserLogin(BaseModel):
    """Body of POST /auth/login."""
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: EmailStr
    role: str

    model_config = {"from_attributes": True}


class Token(BaseModel):

    access_token: str
    token_type: str = "bearer"



class ModelInput(BaseModel):
    """كل الحقول اللي يقدر الأدمن يعبيها لما يضيف أو يعدّل موديل."""
    name: str
    provider: str
    type: str = "LLM"
    open_source: bool = False
    description: str = ""
    tags: List[str] = []
    modality: List[str] = ["text"]
    context_window: int = 0
    pricing: str = "medium"
    latency: float = 1.0
    accuracy: int = 0
    capabilities: str = ""
    limitations: str = ""
    use_cases: List[str] = []
    sample_prompts: List[str] = []
    release_date: str = ""
    version: str = ""
    visible: bool = True
    openrouter_id: Optional[str] = None