from sqlalchemy.orm import Session

from backend.models.pae import Pae


class PaeRepository:

    @staticmethod
    def obtener_por_id(db: Session, id_pae: int):
        return (
            db.query(Pae)
            .filter(Pae.id_pae == id_pae)
            .first()
        )

    @staticmethod
    def obtener_por_valoracion(
        db: Session,
        id_valoracion: int
    ):
        return (
            db.query(Pae)
            .filter(Pae.id_valoracion == id_valoracion)
            .first()
        )

    @staticmethod
    def obtener_todos(db: Session):
        return (
            db.query(Pae)
            .order_by(Pae.fecha_creacion.desc())
            .all()
        )

    @staticmethod
    def crear(db: Session, pae: Pae):
        db.add(pae)
        db.commit()
        db.refresh(pae)

        return pae

    @staticmethod
    def actualizar(db: Session, pae: Pae):
        db.commit()
        db.refresh(pae)

        return pae

    @staticmethod
    def eliminar(db: Session, pae: Pae):
        db.delete(pae)
        db.commit()