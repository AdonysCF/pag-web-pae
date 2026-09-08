from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.models.caso_clinico import CasoClinico


class CasoClinicoRepository:

    @staticmethod
    def obtener_por_id(
        db: Session,
        id_caso_clinico: int
    ) -> CasoClinico | None:

        return db.get(CasoClinico, id_caso_clinico)

    @staticmethod
    def obtener_todos(
        db: Session
    ) -> list[CasoClinico]:

        statement = (
            select(CasoClinico)
            .order_by(CasoClinico.fecha_creacion.desc())
        )

        return list(db.scalars(statement).all())

    @staticmethod
    def obtener_por_paciente(
        db: Session,
        id_paciente: int
    ) -> list[CasoClinico]:

        statement = (
            select(CasoClinico)
            .where(CasoClinico.id_paciente == id_paciente)
            .order_by(CasoClinico.fecha_creacion.desc())
        )

        return list(db.scalars(statement).all())

    @staticmethod
    def crear(
        db: Session,
        caso: CasoClinico
    ) -> CasoClinico:

        db.add(caso)
        db.commit()
        db.refresh(caso)

        return caso

    @staticmethod
    def eliminar(
        db: Session,
        caso: CasoClinico
    ) -> None:

        db.delete(caso)
        db.commit()