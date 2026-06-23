
from database import SessionLocal
from models.tag import Tag
 
 
def get_all_tags():
    session = SessionLocal()
    try:
        rows = session.query(Tag).all()
        return [{"id": t.id, "name": t.name} for t in rows]
    finally:
        session.close()
 
 
def create_tag(name: str):
    session = SessionLocal()
    try:
        name = (name or "").strip()
        if not name:
            return {"error": "Tag name is required"}
 
        existing = session.query(Tag).filter(Tag.name.ilike(name)).first()
        if existing:
            return {"error": f"Tag '{name}' already exists"}
 
        tag = Tag(name=name)
        session.add(tag)
        session.commit()
        session.refresh(tag)
        return {"id": tag.id, "name": tag.name}
    finally:
        session.close()
 
 
def delete_tag(tag_id: int):
    session = SessionLocal()
    try:
        tag = session.query(Tag).filter(Tag.id == tag_id).first()
        if not tag:
            return {"error": f"Tag {tag_id} not found"}
        session.delete(tag)
        session.commit()
        return {"message": f"Tag {tag_id} deleted"}
    finally:
        session.close()
        