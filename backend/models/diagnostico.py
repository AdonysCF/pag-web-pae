from sqlalchemy import Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.core.database import Base


class Diagnostico(Base):
    __tablename__ = "diagnostico"

    id_diagnostico: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    codigo: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
    )

    nombre: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    definicion: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    tipo: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    diagnosticos_paciente = relationship(
        "DiagnosticoPaciente",
        back_populates="diagnostico",
    )