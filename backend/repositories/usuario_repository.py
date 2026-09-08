from sqlalchemy.orm import Session

from backend.models.usuario import Usuario


class UsuarioRepository:

    @staticmethod
    def obtener_por_correo(
        db: Session,
        correo: str
    ) -> Usuario | None:

        return (
            db.query(Usuario)
            .filter(Usuario.correo == correo)
            .first()
        )

    @staticmethod
    def crear(
        db: Session,
        usuario: Usuario
    ) -> Usuario:

        db.add(usuario)
        db.commit()
        db.refresh(usuario)

        return usuario