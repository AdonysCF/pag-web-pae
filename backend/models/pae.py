from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.core.database import Base


class Pae(Base):
    __tablename__ = "pae"

    id_pae: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    id_valoracion: Mapped[int] = mapped_column(
        ForeignKey("valoracion.id_valoracion"),
        unique=True,
        nullable=False,
    )

    fecha_creacion: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    plan_cuidado: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    resultado_ia: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    valoracion = relationship(
        "Valoracion",
        back_populates="pae",
    )