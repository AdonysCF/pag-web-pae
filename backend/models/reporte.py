from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.core.database import Base


class Reporte(Base):
    __tablename__ = "reporte"

    id_reporte: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    id_valoracion: Mapped[int] = mapped_column(
        ForeignKey("valoracion.id_valoracion"),
        nullable=False,
    )

    nombre_archivo: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    ruta_archivo: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )

    formato: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    fecha_creacion: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    valoracion = relationship(
        "Valoracion",
        back_populates="reportes",
    )