from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.core.database import Base


class CasoClinico(Base):
    __tablename__ = "caso_clinico"

    id_caso_clinico: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    id_paciente: Mapped[int | None] = mapped_column(
        ForeignKey("paciente.id_paciente"),
        nullable=True
    )

    nombre_archivo: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    ruta_archivo: Mapped[str] = mapped_column(
        String(500),
        nullable=False
    )

    texto_extraido: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    estado: Mapped[str] = mapped_column(
        String(30),
        default="extraido",
        nullable=False
    )

    fecha_creacion: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    fecha_actualizacion: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    paciente = relationship(
        "Paciente",
        back_populates="casos_clinicos"
    )