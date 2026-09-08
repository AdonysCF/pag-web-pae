from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.core.database import Base


class Paciente(Base):
    __tablename__ = "paciente"

    id_paciente: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    dni: Mapped[str] = mapped_column(
        String(20),
        unique=True,
        nullable=False,
    )

    nombres: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    apellidos: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    sexo: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
    )

    edad: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    valoraciones = relationship(
        "Valoracion",
        back_populates="paciente",
    )

    diagnosticos = relationship(
        "DiagnosticoPaciente",
        back_populates="paciente",
    )

    casos_clinicos = relationship(
        "CasoClinico",
        back_populates="paciente",
        cascade="all, delete-orphan"
    )