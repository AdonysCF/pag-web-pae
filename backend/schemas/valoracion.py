from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ValoracionCreate(BaseModel):
    id_paciente: int
    fecha: datetime | None = None
    datos_clinicos: str | None = None
    signos_vitales: str | None = None
    patrones_gordon: str | None = None


class ValoracionUpdate(BaseModel):
    fecha: datetime | None = None
    datos_clinicos: str | None = None
    signos_vitales: str | None = None
    patrones_gordon: str | None = None


class ValoracionResponse(BaseModel):
    id_valoracion: int
    id_usuario: int
    id_paciente: int
    fecha: datetime
    datos_clinicos: str | None
    signos_vitales: str | None
    patrones_gordon: str | None

    model_config = ConfigDict(from_attributes=True)