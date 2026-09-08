from sqlalchemy.orm import Session

from backend.models.valoracion import Valoracion


class ValoracionRepository:

    @staticmethod
    def crear(
        db: Session,
        valoracion: Valoracion
    ) -> Valoracion:

        db.add(valoracion)
        db.commit()
        db.refresh(valoracion)

        return valoracion


    @staticmethod
    def obtener_por_id(
        db: Session,
        id_valoracion: int
    ) -> Valoracion | None:

        return (
            db.query(Valoracion)
            .filter(
                Valoracion.id_valoracion == id_valoracion
            )
            .first()
        )


    @staticmethod
    def obtener_por_paciente(
        db: Session,
        id_paciente: int
    ) -> list[Valoracion]:

        return (
            db.query(Valoracion)
            .filter(
                Valoracion.id_paciente == id_paciente
            )
            .order_by(
                Valoracion.fecha.desc()
            )
            .all()
        )


    @staticmethod
    def obtener_todas(
        db: Session
    ) -> list[Valoracion]:

        return (
            db.query(Valoracion)
            .order_by(
                Valoracion.fecha.desc()
            )
            .all()
        )


    @staticmethod
    def actualizar(
        db: Session,
        valoracion: Valoracion
    ) -> Valoracion:

        db.commit()
        db.refresh(valoracion)

        return valoracion


    @staticmethod
    def eliminar(
        db: Session,
        valoracion: Valoracion
    ) -> None:

        db.delete(valoracion)
        db.commit()