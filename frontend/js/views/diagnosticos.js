const API_URL = "http://127.0.0.1:8000";

let pacientes = [];
let diagnosticos = [];
let diagnosticosFiltrados = [];

let pacienteActual = null;
let diagnosticoSeleccionado = null;


// =========================================
// INICIO
// =========================================

document.addEventListener("DOMContentLoaded", async () => {

    verificarAutenticacion();

    mostrarUsuario();

    configurarEventos();

    await cargarPacientes();

    await cargarDiagnosticos();

});


// =========================================
// AUTENTICACIÓN
// =========================================

function verificarAutenticacion() {

    const token = localStorage.getItem("token");

    if (!token) {

        window.location.href = "login.html";

    }

}


// =========================================
// MOSTRAR USUARIO
// =========================================

function mostrarUsuario() {

    const elemento =
        document.getElementById("usuarioNombre");

    const usuario =
        localStorage.getItem("usuario");


    if (!elemento) {
        return;
    }


    if (usuario) {

        try {

            const datos =
                JSON.parse(usuario);

            elemento.textContent =
                datos.nombre ||
                datos.username ||
                "Usuario";

        } catch {

            elemento.textContent =
                usuario;

        }

    }

}


// =========================================
// EVENTOS
// =========================================

function configurarEventos() {

    document
        .getElementById("selectPaciente")
        .addEventListener(
            "change",
            cambiarPaciente
        );


    document
        .getElementById("buscarDiagnostico")
        .addEventListener(
            "input",
            filtrarDiagnosticos
        );


    document
        .getElementById("btnCerrarSesion")
        .addEventListener(
            "click",
            cerrarSesion
        );


    document
        .getElementById("btnCerrarModal")
        .addEventListener(
            "click",
            cerrarModal
        );


    document
        .getElementById("btnCancelarAsignacion")
        .addEventListener(
            "click",
            cerrarModal
        );


    document
        .getElementById("btnConfirmarAsignacion")
        .addEventListener(
            "click",
            confirmarAsignacion
        );

}


// =========================================
// CARGAR PACIENTES
// =========================================

async function cargarPacientes() {

    try {

        const response = await fetch(
            `${API_URL}/pacientes/`,
            {
                method: "GET",
                headers: obtenerHeaders()
            }
        );


        if (response.status === 401) {

            cerrarSesion();

            return;

        }


        if (!response.ok) {

            throw new Error(
                "No se pudieron cargar los pacientes."
            );

        }


        pacientes =
            await response.json();


        llenarSelectPacientes();


    } catch (error) {

        console.error(error);

        mostrarMensaje(
            "mensajeDiagnosticos",
            error.message,
            "error"
        );

    }

}


// =========================================
// SELECT PACIENTES
// =========================================

function llenarSelectPacientes() {

    const select =
        document.getElementById(
            "selectPaciente"
        );


    select.innerHTML = `
        <option value="">
            Seleccione un paciente
        </option>
    `;


    pacientes.forEach(paciente => {

        const option =
            document.createElement("option");


        option.value =
            paciente.id_paciente;


        option.textContent =
            `${paciente.dni} - ${paciente.nombres} ${paciente.apellidos}`;


        select.appendChild(option);

    });

}


// =========================================
// CAMBIAR PACIENTE
// =========================================

async function cambiarPaciente(event) {

    const idPaciente =
        event.target.value;


    if (!idPaciente) {

        pacienteActual = null;

        ocultarPaciente();

        limpiarDiagnosticosPaciente();

        return;

    }


    pacienteActual =
        pacientes.find(
            paciente =>
                paciente.id_paciente ==
                idPaciente
        );


    if (!pacienteActual) {
        return;
    }


    mostrarDatosPaciente();

    await cargarDiagnosticosPaciente();

}


// =========================================
// MOSTRAR PACIENTE
// =========================================

function mostrarDatosPaciente() {

    document.getElementById(
        "pacienteDni"
    ).textContent =
        pacienteActual.dni || "-";


    document.getElementById(
        "pacienteNombres"
    ).textContent =
        pacienteActual.nombres || "-";


    document.getElementById(
        "pacienteApellidos"
    ).textContent =
        pacienteActual.apellidos || "-";


    document.getElementById(
        "pacienteEdad"
    ).textContent =
        pacienteActual.edad != null
            ? `${pacienteActual.edad} años`
            : "-";


    document
        .getElementById(
            "pacienteSeleccionado"
        )
        .classList.remove("hidden");

}


// =========================================
// OCULTAR PACIENTE
// =========================================

function ocultarPaciente() {

    document
        .getElementById(
            "pacienteSeleccionado"
        )
        .classList.add("hidden");

}


// =========================================
// CARGAR DIAGNÓSTICOS
// =========================================

async function cargarDiagnosticos() {

    try {

        const response = await fetch(
            `${API_URL}/diagnosticos/`,
            {
                method: "GET",
                headers: obtenerHeaders()
            }
        );


        if (response.status === 401) {

            cerrarSesion();

            return;

        }


        if (!response.ok) {

            throw new Error(
                "No se pudieron cargar los diagnósticos."
            );

        }


        diagnosticos =
            await response.json();


        diagnosticosFiltrados =
            [...diagnosticos];


        renderizarDiagnosticos();


    } catch (error) {

        console.error(error);

        mostrarMensaje(
            "mensajeDiagnosticos",
            error.message,
            "error"
        );

    }

}


// =========================================
// RENDERIZAR CATÁLOGO
// =========================================

function renderizarDiagnosticos() {

    const tbody =
        document.getElementById(
            "tablaDiagnosticosBody"
        );


    const contador =
        document.getElementById(
            "contadorDiagnosticos"
        );


    tbody.innerHTML = "";


    contador.textContent =
        diagnosticosFiltrados.length;


    if (
        diagnosticosFiltrados.length === 0
    ) {

        tbody.innerHTML = `
            <tr>
                <td colspan="4">
                    No se encontraron diagnósticos.
                </td>
            </tr>
        `;

        return;

    }


    diagnosticosFiltrados.forEach(
        diagnostico => {

            const fila =
                document.createElement("tr");


            fila.innerHTML = `

                <td>

                    <span class="codigo-diagnostico">
                        ${escapeHtml(
                            diagnostico.codigo
                        )}
                    </span>

                </td>


                <td>
                    ${escapeHtml(
                        diagnostico.nombre
                    )}
                </td>


                <td>

                    <span class="tipo-diagnostico">
                        ${escapeHtml(
                            diagnostico.tipo
                        )}
                    </span>

                </td>


                <td>

                    <button
                        class="btn-action"
                        type="button"
                    >
                        Asignar
                    </button>

                </td>

            `;


            fila
                .querySelector(".btn-action")
                .addEventListener(
                    "click",
                    () =>
                        abrirModalAsignacion(
                            diagnostico
                        )
                );


            tbody.appendChild(fila);

        }
    );

}


// =========================================
// BUSCAR
// =========================================

function filtrarDiagnosticos(event) {

    const texto =
        event.target.value
            .trim()
            .toLowerCase();


    diagnosticosFiltrados =
        diagnosticos.filter(
            diagnostico => {

                const codigo =
                    String(
                        diagnostico.codigo || ""
                    ).toLowerCase();


                const nombre =
                    String(
                        diagnostico.nombre || ""
                    ).toLowerCase();


                return (
                    codigo.includes(texto) ||
                    nombre.includes(texto)
                );

            }
        );


    renderizarDiagnosticos();

}


// =========================================
// CARGAR DIAGNÓSTICOS DEL PACIENTE
// =========================================

async function cargarDiagnosticosPaciente() {

    if (!pacienteActual) {
        return;
    }


    try {

        const response = await fetch(

            `${API_URL}/diagnosticos/paciente/${pacienteActual.id_paciente}`,

            {
                method: "GET",
                headers: obtenerHeaders()
            }

        );


        if (response.status === 401) {

            cerrarSesion();

            return;

        }


        if (!response.ok) {

            throw new Error(
                "No se pudieron cargar los diagnósticos del paciente."
            );

        }


        const asignaciones =
            await response.json();


        renderizarDiagnosticosPaciente(
            asignaciones
        );


    } catch (error) {

        console.error(error);

        mostrarMensaje(
            "mensajeDiagnosticos",
            error.message,
            "error"
        );

    }

}


// =========================================
// RENDERIZAR DIAGNÓSTICOS PACIENTE
// =========================================

function renderizarDiagnosticosPaciente(
    asignaciones
) {

    const tbody =
        document.getElementById(
            "tablaAsignadosBody"
        );


    const contador =
        document.getElementById(
            "contadorAsignados"
        );


    const mensaje =
        document.getElementById(
            "mensajeDiagnosticos"
        );


    tbody.innerHTML = "";


    contador.textContent =
        asignaciones.length;


    if (asignaciones.length === 0) {

        mensaje.textContent =
            "Este paciente todavía no tiene diagnósticos asignados.";

        mensaje.className =
            "mensaje";


        return;

    }


    mensaje.className =
        "mensaje hidden";


    asignaciones.forEach(
        asignacion => {

            const diagnostico =
                diagnosticos.find(
                    item =>
                        item.id_diagnostico ===
                        asignacion.id_diagnostico
                );


            const fila =
                document.createElement("tr");


            const codigo =
                diagnostico
                    ? diagnostico.codigo
                    : `ID ${asignacion.id_diagnostico}`;


            const nombre =
                diagnostico
                    ? diagnostico.nombre
                    : "Diagnóstico";


            fila.innerHTML = `

                <td>

                    <span class="codigo-diagnostico">
                        ${escapeHtml(codigo)}
                    </span>

                </td>


                <td>
                    ${escapeHtml(nombre)}
                </td>


                <td>
                    ${formatearFecha(
                        asignacion.fecha
                    )}
                </td>


                <td>

                    <button
                        class="btn-danger"
                        type="button"
                    >
                        Eliminar
                    </button>

                </td>

            `;


            fila
                .querySelector(".btn-danger")
                .addEventListener(
                    "click",
                    () =>
                        eliminarDiagnosticoPaciente(
                            asignacion.id_diagnostico_paciente
                        )
                );


            tbody.appendChild(fila);

        }
    );

}


// =========================================
// LIMPIAR
// =========================================

function limpiarDiagnosticosPaciente() {

    document.getElementById(
        "tablaAsignadosBody"
    ).innerHTML = "";


    document.getElementById(
        "contadorAsignados"
    ).textContent = "0";


    const mensaje =
        document.getElementById(
            "mensajeDiagnosticos"
        );


    mensaje.textContent =
        "Selecciona un paciente para ver sus diagnósticos.";


    mensaje.className =
        "mensaje";

}


// =========================================
// MODAL
// =========================================

function abrirModalAsignacion(
    diagnostico
) {

    if (!pacienteActual) {

        alert(
            "Primero selecciona un paciente."
        );

        return;

    }


    diagnosticoSeleccionado =
        diagnostico;


    document.getElementById(
        "diagnosticoNombreModal"
    ).textContent =
        diagnostico.nombre;


    document.getElementById(
        "diagnosticoCodigoModal"
    ).textContent =
        diagnostico.codigo;


    document.getElementById(
        "descripcionDiagnostico"
    ).value = "";


    document.getElementById(
        "mensajeModal"
    ).textContent = "";


    document.getElementById(
        "mensajeModal"
    ).className =
        "mensaje";


    document
        .getElementById("modalAsignar")
        .classList.remove("hidden");

}


// =========================================
// CERRAR MODAL
// =========================================

function cerrarModal() {

    diagnosticoSeleccionado = null;


    document
        .getElementById("modalAsignar")
        .classList.add("hidden");

}


// =========================================
// ASIGNAR
// =========================================

async function confirmarAsignacion() {

    if (!pacienteActual) {

        mostrarMensaje(
            "mensajeModal",
            "Primero selecciona un paciente.",
            "error"
        );

        return;

    }


    if (!diagnosticoSeleccionado) {

        mostrarMensaje(
            "mensajeModal",
            "No se ha seleccionado un diagnóstico.",
            "error"
        );

        return;

    }


    const descripcion =
        document
            .getElementById(
                "descripcionDiagnostico"
            )
            .value
            .trim();


    try {

        const url =
            `${API_URL}/diagnosticos/paciente/` +
            `${pacienteActual.id_paciente}/` +
            `${diagnosticoSeleccionado.id_diagnostico}`;


        const body =
            new URLSearchParams();


        if (descripcion) {

            body.append(
                "descripcion",
                descripcion
            );

        }


        const response =
            await fetch(
                url,
                {
                    method: "POST",

                    headers: {
                        "Authorization":
                            `Bearer ${localStorage.getItem("token")}`,

                        "Content-Type":
                            "application/x-www-form-urlencoded"
                    },

                    body:
                        body.toString()
                }
            );


        if (response.status === 401) {

            cerrarSesion();

            return;

        }


        const resultado =
            await response.json();


        if (!response.ok) {

            throw new Error(
                resultado.detail ||
                "No se pudo asignar el diagnóstico."
            );

        }


        cerrarModal();


        await cargarDiagnosticosPaciente();


        mostrarMensaje(
            "mensajeDiagnosticos",
            "Diagnóstico asignado correctamente.",
            "exito"
        );


    } catch (error) {

        console.error(error);

        mostrarMensaje(
            "mensajeModal",
            error.message,
            "error"
        );

    }

}


// =========================================
// ELIMINAR
// =========================================

async function eliminarDiagnosticoPaciente(
    idAsignacion
) {

    const confirmar =
        confirm(
            "¿Estás seguro de eliminar este diagnóstico del paciente?"
        );


    if (!confirmar) {
        return;
    }


    try {

        const response =
            await fetch(

                `${API_URL}/diagnosticos/paciente/asignacion/${idAsignacion}`,

                {
                    method: "DELETE",
                    headers: obtenerHeaders()
                }

            );


        if (response.status === 401) {

            cerrarSesion();

            return;

        }


        if (!response.ok) {

            let resultado = {};

            try {

                resultado =
                    await response.json();

            } catch {}

            throw new Error(
                resultado.detail ||
                "No se pudo eliminar el diagnóstico."
            );

        }


        await cargarDiagnosticosPaciente();


        mostrarMensaje(
            "mensajeDiagnosticos",
            "Diagnóstico eliminado correctamente.",
            "exito"
        );


    } catch (error) {

        console.error(error);

        mostrarMensaje(
            "mensajeDiagnosticos",
            error.message,
            "error"
        );

    }

}


// =========================================
// HEADERS
// =========================================

function obtenerHeaders() {

    const token =
        localStorage.getItem("token");


    return {

        "Authorization":
            `Bearer ${token}`,

        "Content-Type":
            "application/json"

    };

}


// =========================================
// CERRAR SESIÓN
// =========================================

function cerrarSesion() {

    localStorage.removeItem("token");

    localStorage.removeItem("usuario");

    window.location.href =
        "login.html";

}


// =========================================
// MENSAJES
// =========================================

function mostrarMensaje(
    id,
    texto,
    tipo = ""
) {

    const elemento =
        document.getElementById(id);


    if (!elemento) {
        return;
    }


    elemento.textContent =
        texto;


    elemento.className =
        `mensaje ${tipo}`;


    if (tipo === "exito") {

        setTimeout(() => {

            elemento.textContent = "";

            elemento.className =
                "mensaje hidden";

        }, 3000);

    }

}


// =========================================
// FECHA
// =========================================

function formatearFecha(fecha) {

    if (!fecha) {
        return "-";
    }


    const fechaObj =
        new Date(fecha);


    if (
        Number.isNaN(
            fechaObj.getTime()
        )
    ) {

        return "-";

    }


    return fechaObj.toLocaleDateString(
        "es-PE",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );

}


// =========================================
// SEGURIDAD HTML
// =========================================

function escapeHtml(valor) {

    if (
        valor === null ||
        valor === undefined
    ) {

        return "";

    }


    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}