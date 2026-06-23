from sqlalchemy.orm import Session
from models.model import Model
from models.model_version import ModelVersion


def get_model_detail_service(session: Session, model_id: int):
    model = session.query(Model).filter(
        Model.id == model_id,
        Model.visible == True
    ).first()

    versions = session.query(ModelVersion).filter(
        ModelVersion.model_id == model_id
    ).all()

    return {
        "model": model,
        "versions": versions
    }