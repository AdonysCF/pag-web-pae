from sqlalchemy.orm import Session

from backend.models.usuario import Usuario
from backend.models.valoracion import Valoracion
from backend.repositories.paciente_repository import PacienteRepository
from backend.repositories.valoracion_repository import ValoracionRepository
from backend.schemas.valoracion import (
    ValoracionCreate,
    ValoracionUpdate,
)


class ValoracionService:

    @staticmethod
    def crear(
        db: Session,
        datos: ValoracionCreate,
        usuario: Usuario
    ) -> Valoracion:

        paciente = PacienteRepository.obtener_por_id(
            db,
            datos.id_paciente
        )

        if not paciente:
            raise ValueError(
                "El paciente no existe."
            )

        valoracion = Valoracion(
            id_usuario=usuario.id_usuario,
            id_paciente=datos.id_paciente,
            datos_clinicos=datos.datos_clinicos,
            signos_vitales=datos.signos_vitales,
            patrones_gordon=datos.patrones_gordon,
        )

        if datos.fecha is not None:
            valoracion.fecha = datos.fecha

        return ValoracionRepository.crear(
            db,
            valoracion
        )


    @staticmethod
    def obtener_por_id(
        db: Session,
        id_valoracion: int
    ) -> Valoracion | None:

        return ValoracionRepository.obtener_por_id(
            db,
            id_valoracion
        )


    @staticmethod
    def obtener_por_paciente(
        db: Session,
        id_paciente: int
    ) -> list[Valoracion]:

        paciente = PacienteRepository.obtener_por_id(
            db,
            id_paciente
        )

        if not paciente:
            raise ValueError(
                "El paciente no existe."
            )

        return ValoracionRepository.obtener_por_paciente(
            db,
            id_paciente
        )


    @staticmethod
    def obtener_todas(
        db: Session
    ) -> list[Valoracion]:

        return ValoracionRepository.obtener_todas(db)


    @staticmethod
    def actualizar(
        db: Session,
        valoracion: Valoracion,
        datos: ValoracionUpdate
    ) -> Valoracion:

        datos_actualizados = datos.model_dump(
            exclude_unset=True
        )

        for campo, valor in datos_actualizados.items():
            setattr(valoracion, campo, valor)

        return ValoracionRepository.actualizar(
            db,
            valoracion
        )


    @staticmethod
    def eliminar(
        db: Session,
        valoracion: Valoracion
    ) -> None:

        ValoracionRepository.eliminar(
            db,
            valoracion
        )