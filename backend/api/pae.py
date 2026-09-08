from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from backend.core.database import get_db
from backend.schemas.pae import (
    PaeCreate,
    PaeResponse,
    PaeUpdate
)
from backend.services.pae_service import PaeService


router = APIRouter(
    prefix="/pae",
    tags=["PAE"]
)


@router.get(
    "/",
    response_model=list[PaeResponse]
)
def obtener_paes(
    db: Session = Depends(get_db)
):

    return PaeService.obtener_todos(db)


@router.get(
    "/{id_pae}",
    response_model=PaeResponse
)
def obtener_pae(
    id_pae: int,
    db: Session = Depends(get_db)
):

    return PaeService.obtener_por_id(
        db,
        id_pae
    )


@router.get(
    "/valoracion/{id_valoracion}",
    response_model=PaeResponse
)
def obtener_pae_por_valoracion(
    id_valoracion: int,
    db: Session = Depends(get_db)
):

    return PaeService.obtener_por_valoracion(
        db,
        id_valoracion
    )


@router.post(
    "/",
    response_model=PaeResponse,
    status_code=status.HTTP_201_CREATED
)
def crear_pae(
    datos: PaeCreate,
    db: Session = Depends(get_db)
):

    return PaeService.crear(
        db,
        datos
    )


@router.put(
    "/{id_pae}",
    response_model=PaeResponse
)
def actualizar_pae(
    id_pae: int,
    datos: PaeUpdate,
    db: Session = Depends(get_db)
):

    return PaeService.actualizar(
        db,
        id_pae,
        datos
    )


@router.delete(
    "/{id_pae}"
)
def eliminar_pae(
    id_pae: int,
    db: Session = Depends(get_db)
):

    return PaeService.eliminar(
        db,
        id_pae
    )