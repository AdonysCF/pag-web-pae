from pydantic import BaseModel, ConfigDict, Field


class DiagnosticoBase(BaseModel):

    codigo: str = Field(
        min_length=1,
        max_length=50
    )

    nombre: str = Field(
        min_length=1,
        max_length=255
    )

    definicion: str | None = None

    tipo: str = Field(
        min_length=1,
        max_length=20
    )


class DiagnosticoCreate(DiagnosticoBase):
    pass


class DiagnosticoUpdate(BaseModel):

    codigo: str | None = Field(
        default=None,
        min_length=1,
        max_length=50
    )

    nombre: str | None = Field(
        default=None,
        min_length=1,
        max_length=255
    )

    definicion: str | None = None

    tipo: str | None = Field(
        default=None,
        min_length=1,
        max_length=20
    )


class DiagnosticoResponse(DiagnosticoBase):

    id_diagnostico: int

    model_config = ConfigDict(
        from_attributes=True
    )