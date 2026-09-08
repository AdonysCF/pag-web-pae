from datetime import datetime

from pydantic import BaseModel, ConfigDict


class CasoClinicoBase(BaseModel):
    id_paciente: int | None = None


class CasoClinicoResponse(CasoClinicoBase):
    model_config = ConfigDict(from_attributes=True)

    id_caso_clinico: int
    nombre_archivo: str
    ruta_archivo: str
    texto_extraido: str | None
    estado: str
    fecha_creacion: datetime
    fecha_actualizacion: datetime