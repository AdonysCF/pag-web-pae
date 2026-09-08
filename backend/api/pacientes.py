from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.core.database import get_db
from backend.schemas.paciente import (
    PacienteCreate,
    PacienteResponse,
    PacienteUpdate,
)
from backend.services.paciente_service import PacienteService
from backend.core.dependencias import obtener_usuario_actual
from backend.models.usuario import Usuario


router = APIRouter(
    prefix="/pacientes",
    tags=["Pacientes"]
)


@router.post(
    "/",
    response_model=PacienteResponse,
    status_code=status.HTTP_201_CREATED
)
def crear_paciente(
    datos: PacienteCreate,
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(obtener_usuario_actual)
):

    try:
        return PacienteService.crear(db, datos)

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error)
        )


@router.get(
    "/",
    response_model=list[PacienteResponse]
)
def listar_pacientes(
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(obtener_usuario_actual)
):

    return PacienteService.obtener_todos(db)


@router.get(
    "/{id_paciente}",
    response_model=PacienteResponse
)
def obtener_paciente(
    id_paciente: int,
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(obtener_usuario_actual)
):

    paciente = PacienteService.obtener_por_id(
        db,
        id_paciente
    )

    if not paciente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Paciente no encontrado."
        )

    return paciente


@router.put(
    "/{id_paciente}",
    response_model=PacienteResponse
)
def actualizar_paciente(
    id_paciente: int,
    datos: PacienteUpdate,
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(obtener_usuario_actual)
):

    paciente = PacienteService.obtener_por_id(
        db,
        id_paciente
    )

    if not paciente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Paciente no encontrado."
        )

    try:
        return PacienteService.actualizar(
            db,
            paciente,
            datos
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error)
        )


@router.delete(
    "/{id_paciente}",
    status_code=status.HTTP_204_NO_CONTENT
)
def eliminar_paciente(
    id_paciente: int,
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(obtener_usuario_actual)
):

    paciente = PacienteService.obtener_por_id(
        db,
        id_paciente
    )

    if not paciente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Paciente no encontrado."
        )

    PacienteService.eliminar(db, paciente)

    return None