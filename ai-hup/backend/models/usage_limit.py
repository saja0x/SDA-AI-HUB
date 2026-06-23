

from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
 
from database import Base
 
 
class UsageLimit(Base):
    __tablename__ = "usage_limits"
 
    id = Column(Integer, primary_key=True, index=True)
 
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
 
    model_id = Column(Integer, ForeignKey("models.id"), nullable=False)
 
   
    message_count = Column(Integer, default=0, nullable=False)

    __table_args__ = (
        UniqueConstraint("user_id", "model_id", name="uq_user_model"),
    )