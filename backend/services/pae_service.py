from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from backend.models.pae import Pae
from backend.models.valoracion import Valoracion
from backend.repositories.pae_repository import PaeRepository
from backend.schemas.pae import PaeCreate, PaeUpdate


class PaeService:

    @staticmethod
    def obtener_todos(db: Session):

        return PaeRepository.obtener_todos(db)

    @staticmethod
    def obtener_por_id(
        db: Session,
        id_pae: int
    ):

        pae = PaeRepository.obtener_por_id(db, id_pae)

        if not pae:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="PAE no encontrado"
            )

        return pae

    @staticmethod
    def obtener_por_valoracion(
        db: Session,
        id_valoracion: int
    ):

        pae = PaeRepository.obtener_por_valoracion(
            db,
            id_valoracion
        )

        if not pae:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="La valoración no tiene un PAE registrado"
            )

        return pae

    @staticmethod
    def crear(
        db: Session,
        datos: PaeCreate
    ):

        # Verificar que exista la valoración
        valoracion = (
            db.query(Valoracion)
            .filter(
                Valoracion.id_valoracion == datos.id_valoracion
            )
            .first()
        )

        if not valoracion:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="La valoración indicada no existe"
            )

        # Verificar que no exista otro PAE
        pae_existente = PaeRepository.obtener_por_valoracion(
            db,
            datos.id_valoracion
        )

        if pae_existente:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Esta valoración ya tiene un PAE registrado"
            )

        pae = Pae(
            id_valoracion=datos.id_valoracion,
            planificacion=datos.planificacion,
            resultados_esperados=datos.resultados_esperados,
            intervenciones=datos.intervenciones,
            actividades=datos.actividades,
            evaluacion=datos.evaluacion
        )

        return PaeRepository.crear(db, pae)

    @staticmethod
    def actualizar(
        db: Session,
        id_pae: int,
        datos: PaeUpdate
    ):

        pae = PaeRepository.obtener_por_id(
            db,
            id_pae
        )

        if not pae:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="PAE no encontrado"
            )

        if datos.planificacion is not None:
            pae.planificacion = datos.planificacion

        if datos.resultados_esperados is not None:
            pae.resultados_esperados = datos.resultados_esperados

        if datos.intervenciones is not None:
            pae.intervenciones = datos.intervenciones

        if datos.actividades is not None:
            pae.actividades = datos.actividades

        if datos.evaluacion is not None:
            pae.evaluacion = datos.evaluacion

        return PaeRepository.actualizar(db, pae)

    @staticmethod
    def eliminar(
        db: Session,
        id_pae: int
    ):

        pae = PaeRepository.obtener_por_id(
            db,
            id_pae
        )

        if not pae:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="PAE no encontrado"
            )

        PaeRepository.eliminar(db, pae)

        return {
            "mensaje": "PAE eliminado correctamente"
        }