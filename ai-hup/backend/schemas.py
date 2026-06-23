from pydantic import BaseModel, EmailStr, Field
 
 
class UserCreate(BaseModel):
    username: str = Field(min_length=2, max_length=50)
    email: EmailStr
    password: str = Field(min_length=6)
    role: str = "user"
 
 
class UserLogin(BaseModel):
    email: EmailStr
    password: str
 
 
class UserOut(BaseModel):
    id: int
    username: str
    email: str
    role: str
 
    model_config = {"from_attributes": True}
 
 
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
 
 
class ModelInput(BaseModel):
    name: str
    provider: str
    type: str = "LLM"
    open_source: bool = False
    description: str = ""
    tags: list[str] = []
    modality: list[str] = []
    context_window: int = 0
    pricing: str = "medium"
    latency: float = 1.0
    accuracy: int = 0
    capabilities: str = ""
    limitations: str = ""
    use_cases: list[str] = []
    sample_prompts: list[str] = []
    release_date: str = ""
    version: str = ""
    visible: bool = True
    openrouter_id: str | None = None