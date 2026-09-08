from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.core.database import Base


class Pae(Base):
    __tablename__ = "pae"

    id_pae: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    id_valoracion: Mapped[int] = mapped_column(
        ForeignKey("valoracion.id_valoracion"),
        unique=True,
        nullable=False
    )

    planificacion: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    resultados_esperados: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    intervenciones: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    actividades: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    evaluacion: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
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

    valoracion = relationship(
        "Valoracion",
        back_populates="pae"
    )