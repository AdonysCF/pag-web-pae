from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.core.database import get_db
from backend.core.dependencias import obtener_usuario_actual
from backend.models.usuario import Usuario
from backend.schemas.valoracion import (
    ValoracionCreate,
    ValoracionResponse,
    ValoracionUpdate,
)
from backend.services.valoracion_service import ValoracionService


router = APIRouter(
    prefix="/valoraciones",
    tags=["Valoraciones"]
)


@router.post(
    "/",
    response_model=ValoracionResponse,
    status_code=status.HTTP_201_CREATED
)
def crear_valoracion(
    datos: ValoracionCreate,
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(
        obtener_usuario_actual
    )
):

    try:

        return ValoracionService.crear(
            db,
            datos,
            usuario_actual
        )

    except ValueError as error:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error)
        )


@router.get(
    "/",
    response_model=list[ValoracionResponse]
)
def listar_valoraciones(
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(
        obtener_usuario_actual
    )
):

    return ValoracionService.obtener_todas(db)


@router.get(
    "/paciente/{id_paciente}",
    response_model=list[ValoracionResponse]
)
def listar_valoraciones_paciente(
    id_paciente: int,
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(
        obtener_usuario_actual
    )
):

    try:

        return ValoracionService.obtener_por_paciente(
            db,
            id_paciente
        )

    except ValueError as error:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error)
        )


@router.get(
    "/{id_valoracion}",
    response_model=ValoracionResponse
)
def obtener_valoracion(
    id_valoracion: int,
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(
        obtener_usuario_actual
    )
):

    valoracion = ValoracionService.obtener_por_id(
        db,
        id_valoracion
    )

    if not valoracion:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Valoración no encontrada."
        )

    return valoracion


@router.put(
    "/{id_valoracion}",
    response_model=ValoracionResponse
)
def actualizar_valoracion(
    id_valoracion: int,
    datos: ValoracionUpdate,
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(
        obtener_usuario_actual
    )
):

    valoracion = ValoracionService.obtener_por_id(
        db,
        id_valoracion
    )

    if not valoracion:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Valoración no encontrada."
        )

    return ValoracionService.actualizar(
        db,
        valoracion,
        datos
    )


@router.delete(
    "/{id_valoracion}",
    status_code=status.HTTP_204_NO_CONTENT
)
def eliminar_valoracion(
    id_valoracion: int,
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(
        obtener_usuario_actual
    )
):

    valoracion = ValoracionService.obtener_por_id(
        db,
        id_valoracion
    )

    if not valoracion:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Valoración no encontrada."
        )

    ValoracionService.eliminar(
        db,
        valoracion
    )

    return None