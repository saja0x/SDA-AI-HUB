from sqlalchemy.orm import Session
from models.model import Model


def compare_models_service(session: Session, ids: list[int]):
    models = session.query(Model).filter(Model.id.in_(ids)).all()

    return {
        "models": models
    }
