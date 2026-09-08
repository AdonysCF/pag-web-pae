from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.core.database import Base


class Valoracion(Base):
    __tablename__ = "valoracion"

    id_valoracion: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    id_usuario: Mapped[int] = mapped_column(
        ForeignKey("usuario.id_usuario"),
        nullable=False,
    )

    id_paciente: Mapped[int] = mapped_column(
        ForeignKey("paciente.id_paciente"),
        nullable=False,
    )

    fecha: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    datos_clinicos: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    signos_vitales: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    patrones_gordon: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    usuario = relationship(
        "Usuario",
        back_populates="valoraciones",
    )

    paciente = relationship(
        "Paciente",
        back_populates="valoraciones",
    )

    pae = relationship(
        "Pae",
        back_populates="valoracion",
        uselist=False,
    )

    reportes = relationship(
        "Reporte",
        back_populates="valoracion",
    )