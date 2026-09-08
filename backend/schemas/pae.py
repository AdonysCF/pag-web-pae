from datetime import datetime

from pydantic import BaseModel, ConfigDict


class PaeBase(BaseModel):
    id_valoracion: int
    planificacion: str | None = None
    resultados_esperados: str | None = None
    intervenciones: str | None = None
    actividades: str | None = None
    evaluacion: str | None = None


class PaeCreate(PaeBase):
    pass


class PaeUpdate(BaseModel):
    planificacion: str | None = None
    resultados_esperados: str | None = None
    intervenciones: str | None = None
    actividades: str | None = None
    evaluacion: str | None = None


class PaeResponse(PaeBase):
    model_config = ConfigDict(from_attributes=True)

    id_pae: int
    fecha_creacion: datetime
    fecha_actualizacion: datetime