from sqlalchemy.orm import Session

from backend.models.paciente import Paciente
from backend.repositories.paciente_repository import PacienteRepository
from backend.schemas.paciente import PacienteCreate, PacienteUpdate


class PacienteService:

    @staticmethod
    def crear(db: Session, datos: PacienteCreate) -> Paciente:

        paciente_existente = PacienteRepository.obtener_por_dni(
            db,
            datos.dni
        )

        if paciente_existente:
            raise ValueError("Ya existe un paciente con ese DNI.")

        paciente = Paciente(
            dni=datos.dni,
            nombres=datos.nombres,
            apellidos=datos.apellidos,
            sexo=datos.sexo,
            edad=datos.edad,
        )

        return PacienteRepository.crear(db, paciente)

    @staticmethod
    def obtener_por_id(
        db: Session,
        id_paciente: int
    ) -> Paciente | None:

        return PacienteRepository.obtener_por_id(
            db,
            id_paciente
        )

    @staticmethod
    def obtener_todos(db: Session) -> list[Paciente]:

        return PacienteRepository.obtener_todos(db)

    @staticmethod
    def actualizar(
        db: Session,
        paciente: Paciente,
        datos: PacienteUpdate
    ) -> Paciente:

        datos_actualizados = datos.model_dump(
            exclude_unset=True
        )

        if "dni" in datos_actualizados:

            paciente_existente = (
                PacienteRepository.obtener_por_dni(
                    db,
                    datos_actualizados["dni"]
                )
            )

            if (
                paciente_existente
                and paciente_existente.id_paciente
                != paciente.id_paciente
            ):
                raise ValueError(
                    "Ya existe otro paciente con ese DNI."
                )

        for campo, valor in datos_actualizados.items():
            setattr(paciente, campo, valor)

        db.commit()
        db.refresh(paciente)

        return paciente

    @staticmethod
    def eliminar(
        db: Session,
        paciente: Paciente
    ) -> None:

        PacienteRepository.eliminar(db, paciente)