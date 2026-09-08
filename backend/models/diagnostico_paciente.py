from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.core.database import Base


class DiagnosticoPaciente(Base):
    __tablename__ = "diagnostico_paciente"

    id_diagnostico_paciente: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    id_paciente: Mapped[int] = mapped_column(
        ForeignKey("paciente.id_paciente"),
        nullable=False,
    )

    id_diagnostico: Mapped[int] = mapped_column(
        ForeignKey("diagnostico.id_diagnostico"),
        nullable=False,
    )

    fecha: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    descripcion: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    paciente = relationship(
        "Paciente",
        back_populates="diagnosticos",
    )

    diagnostico = relationship(
        "Diagnostico",
        back_populates="diagnosticos_paciente",
    )