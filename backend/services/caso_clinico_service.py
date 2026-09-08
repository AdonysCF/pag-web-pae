from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from backend.models.caso_clinico import CasoClinico
from backend.repositories.caso_clinico_repository import CasoClinicoRepository
from backend.lectores.pdf_reader import extraer_texto_pdf


class CasoClinicoService:

    CARPETA_CASOS = Path("storage/casos_clinicos")

    @classmethod
    async def subir_pdf(
        cls,
        db: Session,
        archivo: UploadFile,
        id_paciente: int | None = None
    ) -> CasoClinico:

        if not archivo.filename:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No se recibió ningún archivo."
            )

        extension = Path(archivo.filename).suffix.lower()

        if extension != ".pdf":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Solo se permiten archivos PDF."
            )

        cls.CARPETA_CASOS.mkdir(
            parents=True,
            exist_ok=True
        )

        nombre_original = Path(archivo.filename).name

        nombre_unico = (
            f"{uuid4().hex}{extension}"
        )

        ruta = cls.CARPETA_CASOS / nombre_unico

        contenido = await archivo.read()

        if not contenido:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El archivo está vacío."
            )

        with open(ruta, "wb") as archivo_destino:
            archivo_destino.write(contenido)

        try:
            texto = extraer_texto_pdf(str(ruta))
        except Exception as error:

            if ruta.exists():
                ruta.unlink()

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"No se pudo leer el PDF: {error}"
            )

        if not texto:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "No se pudo extraer texto del PDF. "
                    "Es posible que sea un documento escaneado "
                    "como imagen."
                )
            )

        caso = CasoClinico(
            id_paciente=id_paciente,
            nombre_archivo=nombre_original,
            ruta_archivo=str(ruta),
            texto_extraido=texto,
            estado="extraido"
        )

        return CasoClinicoRepository.crear(
            db,
            caso
        )

    @staticmethod
    def obtener_por_id(
        db: Session,
        id_caso_clinico: int
    ) -> CasoClinico:

        caso = CasoClinicoRepository.obtener_por_id(
            db,
            id_caso_clinico
        )

        if not caso:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Caso clínico no encontrado."
            )

        return caso

    @staticmethod
    def obtener_todos(
        db: Session
    ) -> list[CasoClinico]:

        return CasoClinicoRepository.obtener_todos(db)

    @staticmethod
    def obtener_por_paciente(
        db: Session,
        id_paciente: int
    ) -> list[CasoClinico]:

        return CasoClinicoRepository.obtener_por_paciente(
            db,
            id_paciente
        )

    @staticmethod
    def eliminar(
        db: Session,
        id_caso_clinico: int
    ) -> None:

        caso = CasoClinicoService.obtener_por_id(
            db,
            id_caso_clinico
        )

        ruta = Path(caso.ruta_archivo)

        CasoClinicoRepository.eliminar(
            db,
            caso
        )

        if ruta.exists():
            ruta.unlink()