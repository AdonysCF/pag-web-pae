from fastapi import HTTPException, status


class NursifyException(Exception):
    """Excepción base de Nursify."""

    def __init__(self, message: str):
        self.message = message
        super().__init__(message)


class RecursoNoEncontradoException(NursifyException):
    """Se utiliza cuando no se encuentra un recurso."""

    pass


class RecursoYaExisteException(NursifyException):
    """Se utiliza cuando un recurso ya existe."""

    pass


class NoAutorizadoException(NursifyException):
    """Se utiliza cuando el usuario no tiene autorización."""

    pass


def recurso_no_encontrado(message: str = "Recurso no encontrado"):
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=message,
    )


def no_autorizado(message: str = "No autorizado"):
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail=message,
    )