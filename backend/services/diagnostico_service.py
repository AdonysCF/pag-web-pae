from sqlalchemy.orm import Session

from backend.models.diagnostico import Diagnostico
from backend.models.diagnostico_paciente import DiagnosticoPaciente

from backend.repositories.diagnostico_repository import (
    DiagnosticoRepository
)

from backend.repositories.paciente_repository import (
    PacienteRepository
)

from backend.schemas.diagnostico import (
    DiagnosticoCreate,
    DiagnosticoUpdate
)


class DiagnosticoService:

    # =========================================
    # CREAR DIAGNÓSTICO
    # =========================================

    @staticmethod
    def crear(
        db: Session,
        datos: DiagnosticoCreate
    ) -> Diagnostico:

        diagnostico_existente = (
            DiagnosticoRepository.obtener_por_codigo(
                db,
                datos.codigo
            )
        )

        if diagnostico_existente:

            raise ValueError(
                "Ya existe un diagnóstico con ese código."
            )


        diagnostico = Diagnostico(

            codigo=datos.codigo,

            nombre=datos.nombre,

            definicion=datos.definicion,

            tipo=datos.tipo

        )

        return DiagnosticoRepository.crear(
            db,
            diagnostico
        )


    # =========================================
    # OBTENER POR ID
    # =========================================

    @staticmethod
    def obtener_por_id(
        db: Session,
        id_diagnostico: int
    ) -> Diagnostico | None:

        return (
            DiagnosticoRepository.obtener_por_id(
                db,
                id_diagnostico
            )
        )


    # =========================================
    # LISTAR TODOS
    # =========================================

    @staticmethod
    def obtener_todos(
        db: Session
    ) -> list[Diagnostico]:

        return (
            DiagnosticoRepository.obtener_todos(db)
        )


    # =========================================
    # ACTUALIZAR
    # =========================================

    @staticmethod
    def actualizar(
        db: Session,
        diagnostico: Diagnostico,
        datos: DiagnosticoUpdate
    ) -> Diagnostico:

        datos_actualizados = (
            datos.model_dump(
                exclude_unset=True
            )
        )


        if "codigo" in datos_actualizados:

            diagnostico_existente = (
                DiagnosticoRepository
                .obtener_por_codigo(
                    db,
                    datos_actualizados["codigo"]
                )
            )

            if (
                diagnostico_existente
                and diagnostico_existente.id_diagnostico
                != diagnostico.id_diagnostico
            ):

                raise ValueError(
                    "Ya existe otro diagnóstico con ese código."
                )


        for campo, valor in datos_actualizados.items():

            setattr(
                diagnostico,
                campo,
                valor
            )


        return (
            DiagnosticoRepository.actualizar(
                db,
                diagnostico
            )
        )


    # =========================================
    # ELIMINAR
    # =========================================

    @staticmethod
    def eliminar(
        db: Session,
        diagnostico: Diagnostico
    ) -> None:

        DiagnosticoRepository.eliminar(
            db,
            diagnostico
        )


    # =========================================
    # ASIGNAR DIAGNÓSTICO A PACIENTE
    # =========================================

    @staticmethod
    def asignar_a_paciente(
        db: Session,
        id_paciente: int,
        id_diagnostico: int,
        descripcion: str | None = None
    ) -> DiagnosticoPaciente:

        paciente = (
            PacienteRepository.obtener_por_id(
                db,
                id_paciente
            )
        )

        if not paciente:

            raise ValueError(
                "El paciente no existe."
            )


        diagnostico = (
            DiagnosticoRepository.obtener_por_id(
                db,
                id_diagnostico
            )
        )

        if not diagnostico:

            raise ValueError(
                "El diagnóstico no existe."
            )


        diagnostico_paciente = DiagnosticoPaciente(

            id_paciente=id_paciente,

            id_diagnostico=id_diagnostico,

            descripcion=descripcion

        )


        return (
            DiagnosticoRepository.asignar_a_paciente(
                db,
                diagnostico_paciente
            )
        )


    # =========================================
    # OBTENER DIAGNÓSTICOS DEL PACIENTE
    # =========================================

    @staticmethod
    def obtener_diagnosticos_paciente(
        db: Session,
        id_paciente: int
    ) -> list[DiagnosticoPaciente]:

        paciente = (
            PacienteRepository.obtener_por_id(
                db,
                id_paciente
            )
        )

        if not paciente:

            raise ValueError(
                "El paciente no existe."
            )


        return (
            DiagnosticoRepository
            .obtener_diagnosticos_paciente(
                db,
                id_paciente
            )
        )


    # =========================================
    # ELIMINAR DIAGNÓSTICO DEL PACIENTE
    # =========================================

    @staticmethod
    def eliminar_diagnostico_paciente(
        db: Session,
        id_diagnostico_paciente: int
    ) -> None:

        diagnostico_paciente = (
            DiagnosticoRepository
            .obtener_diagnostico_paciente_por_id(
                db,
                id_diagnostico_paciente
            )
        )

        if not diagnostico_paciente:

            raise ValueError(
                "El diagnóstico del paciente no existe."
            )


        (
            DiagnosticoRepository
            .eliminar_diagnostico_paciente(
                db,
                diagnostico_paciente
            )
        )