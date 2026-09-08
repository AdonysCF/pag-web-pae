from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status
)

from sqlalchemy.orm import Session

from backend.core.database import get_db

from backend.core.dependencias import (
    obtener_usuario_actual
)

from backend.models.usuario import Usuario

from backend.schemas.diagnostico import (
    DiagnosticoCreate,
    DiagnosticoResponse,
    DiagnosticoUpdate
)

from backend.services.diagnostico_service import (
    DiagnosticoService
)


router = APIRouter(
    prefix="/diagnosticos",
    tags=["Diagnósticos"]
)


# =========================================
# CREAR DIAGNÓSTICO
# =========================================

@router.post(
    "/",
    response_model=DiagnosticoResponse,
    status_code=status.HTTP_201_CREATED
)
def crear_diagnostico(

    datos: DiagnosticoCreate,

    db: Session = Depends(get_db),

    usuario_actual: Usuario = Depends(
        obtener_usuario_actual
    )

):

    try:

        return DiagnosticoService.crear(
            db,
            datos
        )

    except ValueError as error:

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error)
        )


# =========================================
# LISTAR DIAGNÓSTICOS
# =========================================

@router.get(
    "/",
    response_model=list[DiagnosticoResponse]
)
def listar_diagnosticos(

    db: Session = Depends(get_db),

    usuario_actual: Usuario = Depends(
        obtener_usuario_actual
    )

):

    return (
        DiagnosticoService.obtener_todos(db)
    )


# =========================================
# OBTENER DIAGNÓSTICO
# =========================================

@router.get(
    "/{id_diagnostico}",
    response_model=DiagnosticoResponse
)
def obtener_diagnostico(

    id_diagnostico: int,

    db: Session = Depends(get_db),

    usuario_actual: Usuario = Depends(
        obtener_usuario_actual
    )

):

    diagnostico = (
        DiagnosticoService.obtener_por_id(
            db,
            id_diagnostico
        )
    )


    if not diagnostico:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Diagnóstico no encontrado."
        )


    return diagnostico


# =========================================
# ACTUALIZAR DIAGNÓSTICO
# =========================================

@router.put(
    "/{id_diagnostico}",
    response_model=DiagnosticoResponse
)
def actualizar_diagnostico(

    id_diagnostico: int,

    datos: DiagnosticoUpdate,

    db: Session = Depends(get_db),

    usuario_actual: Usuario = Depends(
        obtener_usuario_actual
    )

):

    diagnostico = (
        DiagnosticoService.obtener_por_id(
            db,
            id_diagnostico
        )
    )


    if not diagnostico:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Diagnóstico no encontrado."
        )


    try:

        return (
            DiagnosticoService.actualizar(
                db,
                diagnostico,
                datos
            )
        )

    except ValueError as error:

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error)
        )


# =========================================
# ELIMINAR DIAGNÓSTICO
# =========================================

@router.delete(
    "/{id_diagnostico}",
    status_code=status.HTTP_204_NO_CONTENT
)
def eliminar_diagnostico(

    id_diagnostico: int,

    db: Session = Depends(get_db),

    usuario_actual: Usuario = Depends(
        obtener_usuario_actual
    )

):

    diagnostico = (
        DiagnosticoService.obtener_por_id(
            db,
            id_diagnostico
        )
    )


    if not diagnostico:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Diagnóstico no encontrado."
        )


    DiagnosticoService.eliminar(
        db,
        diagnostico
    )


    return None


# =========================================
# ASIGNAR DIAGNÓSTICO A PACIENTE
# =========================================

@router.post(
    "/paciente/{id_paciente}/{id_diagnostico}",
    status_code=status.HTTP_201_CREATED
)
def asignar_diagnostico_paciente(

    id_paciente: int,

    id_diagnostico: int,

    descripcion: str | None = None,

    db: Session = Depends(get_db),

    usuario_actual: Usuario = Depends(
        obtener_usuario_actual
    )

):

    try:

        diagnostico_paciente = (
            DiagnosticoService.asignar_a_paciente(
                db,
                id_paciente,
                id_diagnostico,
                descripcion
            )
        )


        return {

            "message":
                "Diagnóstico asignado correctamente.",

            "id_diagnostico_paciente":
                diagnostico_paciente.id_diagnostico_paciente,

            "id_paciente":
                diagnostico_paciente.id_paciente,

            "id_diagnostico":
                diagnostico_paciente.id_diagnostico,

            "fecha":
                diagnostico_paciente.fecha

        }

    except ValueError as error:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error)
        )


# =========================================
# DIAGNÓSTICOS DE UN PACIENTE
# =========================================

@router.get(
    "/paciente/{id_paciente}"
)
def listar_diagnosticos_paciente(

    id_paciente: int,

    db: Session = Depends(get_db),

    usuario_actual: Usuario = Depends(
        obtener_usuario_actual
    )

):

    try:

        diagnosticos = (
            DiagnosticoService
            .obtener_diagnosticos_paciente(
                db,
                id_paciente
            )
        )


        return diagnosticos

    except ValueError as error:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error)
        )


# =========================================
# ELIMINAR DIAGNÓSTICO DEL PACIENTE
# =========================================

@router.delete(
    "/paciente/asignacion/{id_diagnostico_paciente}",
    status_code=status.HTTP_204_NO_CONTENT
)
def eliminar_diagnostico_paciente(

    id_diagnostico_paciente: int,

    db: Session = Depends(get_db),

    usuario_actual: Usuario = Depends(
        obtener_usuario_actual
    )

):

    try:

        (
            DiagnosticoService
            .eliminar_diagnostico_paciente(
                db,
                id_diagnostico_paciente
            )
        )

    except ValueError as error:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error)
        )


    return None