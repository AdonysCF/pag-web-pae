from sqlalchemy.orm import Session

from backend.models.paciente import Paciente


class PacienteRepository:

    @staticmethod
    def crear(db: Session, paciente: Paciente) -> Paciente:
        db.add(paciente)
        db.commit()
        db.refresh(paciente)

        return paciente

    @staticmethod
    def obtener_por_id(db: Session, id_paciente: int) -> Paciente | None:
        return (
            db.query(Paciente)
            .filter(Paciente.id_paciente == id_paciente)
            .first()
        )

    @staticmethod
    def obtener_por_dni(db: Session, dni: str) -> Paciente | None:
        return (
            db.query(Paciente)
            .filter(Paciente.dni == dni)
            .first()
        )

    @staticmethod
    def obtener_todos(db: Session) -> list[Paciente]:
        return db.query(Paciente).order_by(Paciente.id_paciente).all()

    @staticmethod
    def eliminar(db: Session, paciente: Paciente) -> None:
        db.delete(paciente)
        db.commit()