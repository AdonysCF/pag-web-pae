from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.core.database import get_db
from backend.schemas.auth import (
    LoginRequest,
    RegistroRequest,
    TokenResponse,
)
from backend.services.auth_service import AuthService


router = APIRouter(
    prefix="/auth",
    tags=["Autenticación"]
)


@router.post(
    "/registro",
    status_code=status.HTTP_201_CREATED
)
def registrar(
    datos: RegistroRequest,
    db: Session = Depends(get_db)
):

    try:

        usuario = AuthService.registrar(
            db,
            datos
        )

        return {
            "message": "Usuario registrado correctamente.",
            "id_usuario": usuario.id_usuario
        }

    except ValueError as error:

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error)
        )


@router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    datos: LoginRequest,
    db: Session = Depends(get_db)
):

    try:

        token = AuthService.autenticar(
            db,
            datos.correo,
            datos.password
        )

        return {
            "access_token": token,
            "token_type": "bearer"
        }

    except ValueError as error:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(error)
        )