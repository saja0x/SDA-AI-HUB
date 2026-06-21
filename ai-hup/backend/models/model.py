from sqlalchemy import Column, Integer, String, Float, Boolean, JSON, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from models.provider import Provider  # noqa: F401  (لازم يكون مستورد عشان علاقة relationship تشتغل أيًا كان ترتيب الاستيراد)
 
 
class Model(Base):
    __tablename__ = "models"
 
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    provider_id = Column(Integer, ForeignKey("providers.id"))
 
    type = Column(String, default="LLM")
    open_source = Column(Boolean, default=False)
    description = Column(String, nullable=True)
    tags = Column(JSON, default=list)
    modality = Column(JSON, default=list)
    context_window = Column(Integer, default=0)
    pricing = Column(String, default="medium")
    latency = Column(Float, default=1.0)
    accuracy = Column(Integer, default=0)
    capabilities = Column(String, nullable=True)
    limitations = Column(String, nullable=True)
    use_cases = Column(JSON, default=list)
    sample_prompts = Column(JSON, default=list)
    release_date = Column(String, nullable=True)
    version = Column(String, nullable=True)
    visible = Column(Boolean, default=True)
 
    # الاسم التقني اللي تفهمه خدمة OpenRouter لهذا الموديل (مثال: "anthropic/claude-sonnet-4.6")
    # اختياري - لو فاضي، الموديل ما يقدر "يتكلم" بالبلاي قراوند رغم إنه يطلع بالموقع
    openrouter_id = Column(String, nullable=True)
 
    provider = relationship("Provider", backref="models")