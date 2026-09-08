from pydantic import BaseModel, ConfigDict, Field


class PacienteBase(BaseModel):
    dni: str = Field(min_length=8, max_length=20)
    nombres: str = Field(min_length=1, max_length=100)
    apellidos: str = Field(min_length=1, max_length=100)
    sexo: str | None = Field(default=None, max_length=20)
    edad: int | None = Field(default=None, ge=0, le=150)


class PacienteCreate(PacienteBase):
    pass


class PacienteUpdate(BaseModel):
    dni: str | None = Field(default=None, min_length=8, max_length=20)
    nombres: str | None = Field(default=None, min_length=1, max_length=100)
    apellidos: str | None = Field(default=None, min_length=1, max_length=100)
    sexo: str | None = Field(default=None, max_length=20)
    edad: int | None = Field(default=None, ge=0, le=150)


class PacienteResponse(PacienteBase):
    id_paciente: int

    model_config = ConfigDict(from_attributes=True)