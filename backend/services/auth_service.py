from sqlalchemy.orm import Session

from backend.core.seguridad import (
    crear_access_token,
    hash_password,
    verificar_password,
)

from backend.models.usuario import Usuario
from backend.repositories.usuario_repository import UsuarioRepository
from backend.schemas.auth import RegistroRequest


class AuthService:

    @staticmethod
    def registrar(
        db: Session,
        datos: RegistroRequest
    ) -> Usuario:

        usuario_existente = (
            UsuarioRepository.obtener_por_correo(
                db,
                datos.correo
            )
        )

        if usuario_existente:
            raise ValueError(
                "Ya existe un usuario con ese correo."
            )

        password_hash = hash_password(
            datos.password
        )

        usuario = Usuario(
            nombre=datos.nombre,
            apellido=datos.apellido,
            correo=datos.correo,
            password_hash=password_hash,
            id_rol=datos.id_rol,
        )

        return UsuarioRepository.crear(
            db,
            usuario
        )

    @staticmethod
    def autenticar(
        db: Session,
        correo: str,
        password: str
    ) -> str:

        usuario = UsuarioRepository.obtener_por_correo(
            db,
            correo
        )

        if not usuario:
            raise ValueError(
                "Correo o contraseña incorrectos."
            )

        if not verificar_password(
            password,
            usuario.password_hash
        ):
            raise ValueError(
                "Correo o contraseña incorrectos."
            )

        token = crear_access_token({
            "sub": str(usuario.id_usuario),
            "correo": usuario.correo,
            "id_rol": usuario.id_rol,
        })

        return token