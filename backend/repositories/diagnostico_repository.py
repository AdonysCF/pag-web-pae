from sqlalchemy.orm import Session

from backend.models.diagnostico import Diagnostico
from backend.models.diagnostico_paciente import DiagnosticoPaciente


class DiagnosticoRepository:

    # =========================================
    # DIAGNÓSTICOS
    # =========================================

    @staticmethod
    def crear(
        db: Session,
        diagnostico: Diagnostico
    ) -> Diagnostico:

        db.add(diagnostico)
        db.commit()
        db.refresh(diagnostico)

        return diagnostico


    @staticmethod
    def obtener_por_id(
        db: Session,
        id_diagnostico: int
    ) -> Diagnostico | None:

        return (
            db.query(Diagnostico)
            .filter(
                Diagnostico.id_diagnostico == id_diagnostico
            )
            .first()
        )


    @staticmethod
    def obtener_por_codigo(
        db: Session,
        codigo: str
    ) -> Diagnostico | None:

        return (
            db.query(Diagnostico)
            .filter(
                Diagnostico.codigo == codigo
            )
            .first()
        )


    @staticmethod
    def obtener_todos(
        db: Session
    ) -> list[Diagnostico]:

        return (
            db.query(Diagnostico)
            .order_by(Diagnostico.codigo)
            .all()
        )


    @staticmethod
    def actualizar(
        db: Session,
        diagnostico: Diagnostico
    ) -> Diagnostico:

        db.commit()
        db.refresh(diagnostico)

        return diagnostico


    @staticmethod
    def eliminar(
        db: Session,
        diagnostico: Diagnostico
    ) -> None:

        db.delete(diagnostico)
        db.commit()


    # =========================================
    # DIAGNÓSTICOS DEL PACIENTE
    # =========================================

    @staticmethod
    def asignar_a_paciente(
        db: Session,
        diagnostico_paciente: DiagnosticoPaciente
    ) -> DiagnosticoPaciente:

        db.add(diagnostico_paciente)
        db.commit()
        db.refresh(diagnostico_paciente)

        return diagnostico_paciente


    @staticmethod
    def obtener_diagnosticos_paciente(
        db: Session,
        id_paciente: int
    ) -> list[DiagnosticoPaciente]:

        return (
            db.query(DiagnosticoPaciente)
            .filter(
                DiagnosticoPaciente.id_paciente == id_paciente
            )
            .order_by(
                DiagnosticoPaciente.fecha.desc()
            )
            .all()
        )


    @staticmethod
    def obtener_diagnostico_paciente_por_id(
        db: Session,
        id_diagnostico_paciente: int
    ) -> DiagnosticoPaciente | None:

        return (
            db.query(DiagnosticoPaciente)
            .filter(
                DiagnosticoPaciente.id_diagnostico_paciente
                == id_diagnostico_paciente
            )
            .first()
        )


    @staticmethod
    def eliminar_diagnostico_paciente(
        db: Session,
        diagnostico_paciente: DiagnosticoPaciente
    ) -> None:

        db.delete(diagnostico_paciente)
        db.commit()