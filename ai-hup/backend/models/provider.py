from sqlalchemy import Column, Integer, String
from database import Base


class Provider(Base):
    __tablename__ = "providers"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    description = Column(String, nullable=True)
