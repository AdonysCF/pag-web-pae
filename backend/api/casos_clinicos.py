from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlalchemy.orm import Session

from backend.core.database import get_db
from backend.schemas.caso_clinico import CasoClinicoResponse
from backend.services.caso_clinico_service import CasoClinicoService


router = APIRouter(
    prefix="/casos-clinicos",
    tags=["Casos Clínicos"]
)


@router.get(
    "/",
    response_model=list[CasoClinicoResponse]
)
def obtener_casos(
    db: Session = Depends(get_db)
):
    return CasoClinicoService.obtener_todos(db)


@router.get(
    "/{id_caso_clinico}",
    response_model=CasoClinicoResponse
)
def obtener_caso(
    id_caso_clinico: int,
    db: Session = Depends(get_db)
):
    return CasoClinicoService.obtener_por_id(
        db,
        id_caso_clinico
    )


@router.get(
    "/paciente/{id_paciente}",
    response_model=list[CasoClinicoResponse]
)
def obtener_casos_por_paciente(
    id_paciente: int,
    db: Session = Depends(get_db)
):
    return CasoClinicoService.obtener_por_paciente(
        db,
        id_paciente
    )


@router.post(
    "/subir",
    response_model=CasoClinicoResponse
)
async def subir_caso_clinico(
    archivo: UploadFile = File(...),
    id_paciente: int | None = Form(None),
    db: Session = Depends(get_db)
):
    return await CasoClinicoService.subir_pdf(
        db=db,
        archivo=archivo,
        id_paciente=id_paciente
    )


@router.delete(
    "/{id_caso_clinico}"
)
def eliminar_caso(
    id_caso_clinico: int,
    db: Session = Depends(get_db)
):
    CasoClinicoService.eliminar(
        db,
        id_caso_clinico
    )

    return {
        "mensaje": "Caso clínico eliminado correctamente."
    }