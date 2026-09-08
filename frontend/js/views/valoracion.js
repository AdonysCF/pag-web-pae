let pacientes = [];
let valoraciones = [];

let valoracionEditando = null;


/* =========================================
   INICIO
========================================= */

document.addEventListener("DOMContentLoaded", async () => {

    if (!estaAutenticado()) {
        window.location.href = "login.html";
        return;
    }

    mostrarUsuario();

    await cargarPacientes();

    configurarEventos();

});


/* =========================================
   MOSTRAR USUARIO
========================================= */

function mostrarUsuario() {

    const elemento = document.getElementById("usuarioNombre");

    if (!elemento) {
        return;
    }

    try {

        const token = obtenerToken();

        if (!token) {
            return;
        }

        const payload = JSON.parse(
            atob(token.split(".")[1])
        );

        elemento.textContent =
            payload.nombre || payload.sub || "Usuario";

    } catch (error) {

        elemento.textContent = "Usuario";

    }

}


/* =========================================
   CARGAR PACIENTES
========================================= */

async function cargarPacientes() {

    try {

        pacientes = await apiFetch(
            "/pacientes/",
            {
                method: "GET",
                headers: {
                    ...obtenerAuthorization()
                }
            }
        );

        const select =
            document.getElementById("selectPaciente");

        select.innerHTML = `
            <option value="">
                Seleccione un paciente
            </option>
        `;

        pacientes.forEach(paciente => {

            const option =
                document.createElement("option");

            option.value = paciente.id_paciente;

            option.textContent =
                `${paciente.dni} - ${paciente.nombres} ${paciente.apellidos}`;

            select.appendChild(option);

        });

    } catch (error) {

        console.error(
            "Error al cargar pacientes:",
            error
        );

        alert(
            "No se pudieron cargar los pacientes."
        );

    }

}


/* =========================================
   EVENTOS
========================================= */

function configurarEventos() {

    const selectPaciente =
        document.getElementById("selectPaciente");

    const form =
        document.getElementById("formValoracion");

    const btnCancelar =
        document.getElementById("btnCancelar");

    const btnCerrarSesion =
        document.getElementById("btnCerrarSesion");


    selectPaciente.addEventListener(
        "change",
        seleccionarPaciente
    );


    form.addEventListener(
        "submit",
        guardarValoracion
    );


    btnCancelar.addEventListener(
        "click",
        cancelarEdicion
    );


    btnCerrarSesion.addEventListener(
        "click",
        cerrarSesion
    );

}


/* =========================================
   SELECCIONAR PACIENTE
========================================= */

async function seleccionarPaciente() {

    const select =
        document.getElementById("selectPaciente");

    const idPaciente =
        select.value;


    if (!idPaciente) {

        ocultarPaciente();

        limpiarHistorial();

        return;

    }


    const paciente =
        pacientes.find(
            p => p.id_paciente == idPaciente
        );


    if (!paciente) {
        return;
    }


    mostrarPaciente(paciente);

    await cargarValoraciones(idPaciente);

}


/* =========================================
   MOSTRAR PACIENTE
========================================= */

function mostrarPaciente(paciente) {

    document
        .getElementById("pacienteSeleccionado")
        .classList.remove("hidden");


    document.getElementById("pacienteDni")
        .textContent = paciente.dni || "-";


    document.getElementById("pacienteNombres")
        .textContent = paciente.nombres || "-";


    document.getElementById("pacienteApellidos")
        .textContent = paciente.apellidos || "-";


    document.getElementById("pacienteEdad")
        .textContent =
            paciente.edad != null
                ? `${paciente.edad} años`
                : "-";

}


function ocultarPaciente() {

    document
        .getElementById("pacienteSeleccionado")
        .classList.add("hidden");

}


/* =========================================
   CARGAR VALORACIONES
========================================= */

async function cargarValoraciones(idPaciente) {

    try {

        valoraciones = await apiFetch(
            `/valoraciones/paciente/${idPaciente}`,
            {
                method: "GET",
                headers: {
                    ...obtenerAuthorization()
                }
            }
        );

        renderizarValoraciones();

    } catch (error) {

        console.error(
            "Error al cargar valoraciones:",
            error
        );

        alert(
            "No se pudieron cargar las valoraciones."
        );

    }

}


/* =========================================
   RENDERIZAR HISTORIAL
========================================= */

function renderizarValoraciones() {

    const tbody =
        document.getElementById(
            "tablaValoracionesBody"
        );

    const mensaje =
        document.getElementById(
            "mensajeHistorial"
        );


    tbody.innerHTML = "";


    if (!valoraciones.length) {

        mensaje.textContent =
            "Este paciente todavía no tiene valoraciones registradas.";

        mensaje.classList.remove("hidden");

        return;

    }


    mensaje.classList.add("hidden");


    valoraciones.forEach(valoracion => {

        const fila =
            document.createElement("tr");


        const fecha =
            formatearFecha(valoracion.fecha);


        const datosClinicos =
            valoracion.datos_clinicos || "-";


        const signosVitales =
            valoracion.signos_vitales || "-";


        fila.innerHTML = `

            <td>
                ${fecha}
            </td>

            <td>
                ${escapeHtml(datosClinicos)}
            </td>

            <td>
                ${escapeHtml(signosVitales)}
            </td>

            <td>

                <div class="acciones">

                    <button
                        class="btn-edit"
                        onclick="editarValoracion(${valoracion.id_valoracion})"
                    >
                        Editar
                    </button>

                    <button
                        class="btn-danger"
                        onclick="eliminarValoracion(${valoracion.id_valoracion})"
                    >
                        Eliminar
                    </button>

                </div>

            </td>

        `;

        tbody.appendChild(fila);

    });

}


/* =========================================
   GUARDAR
========================================= */

async function guardarValoracion(event) {

    event.preventDefault();


    const selectPaciente =
        document.getElementById("selectPaciente");


    const idPaciente =
        selectPaciente.value;


    if (!idPaciente) {

        alert(
            "Primero debes seleccionar un paciente."
        );

        return;

    }


    const datosClinicos =
        document.getElementById(
            "datosClinicos"
        ).value.trim();


    const patronesGordon =
        document.getElementById(
            "patronesGordon"
        ).value.trim();


    const fechaInput =
        document.getElementById("fecha").value;


    const signosVitales =
        construirSignosVitales();


    const datos = {

        datos_clinicos:
            datosClinicos || null,

        signos_vitales:
            signosVitales || null,

        patrones_gordon:
            patronesGordon || null

    };


    if (fechaInput) {

        datos.fecha =
            convertirFechaISO(fechaInput);

    }


    try {

        if (valoracionEditando) {

            await apiFetch(
                `/valoraciones/${valoracionEditando}`,
                {
                    method: "PUT",
                    headers: {
                        ...obtenerAuthorization()
                    },
                    body: JSON.stringify(datos)
                }
            );

            alert(
                "Valoración actualizada correctamente."
            );

        } else {

            datos.id_paciente =
                Number(idPaciente);


            await apiFetch(
                "/valoraciones/",
                {
                    method: "POST",
                    headers: {
                        ...obtenerAuthorization()
                    },
                    body: JSON.stringify(datos)
                }
            );

            alert(
                "Valoración registrada correctamente."
            );

        }


        limpiarFormulario();

        await cargarValoraciones(idPaciente);

    } catch (error) {

        console.error(
            "Error al guardar valoración:",
            error
        );

        alert(
            error.message ||
            "No se pudo guardar la valoración."
        );

    }

}


/* =========================================
   CONSTRUIR SIGNOS VITALES
========================================= */

function construirSignosVitales() {

    const pa =
        document.getElementById(
            "presionArterial"
        ).value.trim();


    const fc =
        document.getElementById(
            "frecuenciaCardiaca"
        ).value.trim();


    const fr =
        document.getElementById(
            "frecuenciaRespiratoria"
        ).value.trim();


    const temperatura =
        document.getElementById(
            "temperatura"
        ).value.trim();


    const spo2 =
        document.getElementById(
            "saturacion"
        ).value.trim();


    const signos = [];


    if (pa) {
        signos.push(`PA: ${pa}`);
    }

    if (fc) {
        signos.push(`FC: ${fc}`);
    }

    if (fr) {
        signos.push(`FR: ${fr}`);
    }

    if (temperatura) {
        signos.push(`T: ${temperatura}`);
    }

    if (spo2) {
        signos.push(`SpO₂: ${spo2}`);
    }


    return signos.join(", ");

}


/* =========================================
   EDITAR
========================================= */

window.editarValoracion =
    function(idValoracion) {

        const valoracion =
            valoraciones.find(
                v =>
                    v.id_valoracion === idValoracion
            );


        if (!valoracion) {
            return;
        }


        valoracionEditando =
            idValoracion;


        document.getElementById(
            "tituloFormulario"
        ).textContent =
            "Editar valoración";


        document.getElementById(
            "btnGuardar"
        ).textContent =
            "Actualizar valoración";


        document.getElementById(
            "btnCancelar"
        ).classList.remove("hidden");


        document.getElementById(
            "datosClinicos"
        ).value =
            valoracion.datos_clinicos || "";


        document.getElementById(
            "patronesGordon"
        ).value =
            valoracion.patrones_gordon || "";


        cargarSignosVitales(
            valoracion.signos_vitales
        );


        if (valoracion.fecha) {

            document.getElementById(
                "fecha"
            ).value =
                convertirFechaLocal(
                    valoracion.fecha
                );

        }


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


/* =========================================
   CARGAR SIGNOS VITALES
========================================= */

function cargarSignosVitales(signos) {

    limpiarSignosVitales();


    if (!signos) {
        return;
    }


    const partes =
        signos.split(",");


    partes.forEach(parte => {

        const texto =
            parte.trim();


        if (texto.startsWith("PA:")) {

            document.getElementById(
                "presionArterial"
            ).value =
                texto.replace("PA:", "").trim();

        }


        if (texto.startsWith("FC:")) {

            document.getElementById(
                "frecuenciaCardiaca"
            ).value =
                texto.replace("FC:", "").trim();

        }


        if (texto.startsWith("FR:")) {

            document.getElementById(
                "frecuenciaRespiratoria"
            ).value =
                texto.replace("FR:", "").trim();

        }


        if (texto.startsWith("T:")) {

            document.getElementById(
                "temperatura"
            ).value =
                texto.replace("T:", "").trim();

        }


        if (
            texto.startsWith("SpO₂:") ||
            texto.startsWith("SpO2:")
        ) {

            document.getElementById(
                "saturacion"
            ).value =
                texto
                    .replace("SpO₂:", "")
                    .replace("SpO2:", "")
                    .trim();

        }

    });

}


/* =========================================
   ELIMINAR
========================================= */

window.eliminarValoracion =
    async function(idValoracion) {

        const confirmar =
            confirm(
                "¿Estás seguro de eliminar esta valoración?"
            );


        if (!confirmar) {
            return;
        }


        try {

            await apiFetch(
                `/valoraciones/${idValoracion}`,
                {
                    method: "DELETE",
                    headers: {
                        ...obtenerAuthorization()
                    }
                }
            );


            alert(
                "Valoración eliminada correctamente."
            );


            const idPaciente =
                document.getElementById(
                    "selectPaciente"
                ).value;


            if (idPaciente) {

                await cargarValoraciones(
                    idPaciente
                );

            }


        } catch (error) {

            console.error(
                "Error al eliminar valoración:",
                error
            );

            alert(
                error.message ||
                "No se pudo eliminar la valoración."
            );

        }

    };


/* =========================================
   CANCELAR EDICIÓN
========================================= */

function cancelarEdicion() {

    valoracionEditando = null;


    document.getElementById(
        "tituloFormulario"
    ).textContent =
        "Nueva valoración";


    document.getElementById(
        "btnGuardar"
    ).textContent =
        "Guardar valoración";


    document.getElementById(
        "btnCancelar"
    ).classList.add("hidden");


    limpiarFormulario();

}


/* =========================================
   LIMPIAR FORMULARIO
========================================= */

function limpiarFormulario() {

    document.getElementById(
        "formValoracion"
    ).reset();


    limpiarSignosVitales();


    valoracionEditando = null;


    document.getElementById(
        "tituloFormulario"
    ).textContent =
        "Nueva valoración";


    document.getElementById(
        "btnGuardar"
    ).textContent =
        "Guardar valoración";


    document.getElementById(
        "btnCancelar"
    ).classList.add("hidden");

}


/* =========================================
   LIMPIAR SIGNOS
========================================= */

function limpiarSignosVitales() {

    document.getElementById(
        "presionArterial"
    ).value = "";


    document.getElementById(
        "frecuenciaCardiaca"
    ).value = "";


    document.getElementById(
        "frecuenciaRespiratoria"
    ).value = "";


    document.getElementById(
        "temperatura"
    ).value = "";


    document.getElementById(
        "saturacion"
    ).value = "";

}


/* =========================================
   LIMPIAR HISTORIAL
========================================= */

function limpiarHistorial() {

    valoraciones = [];


    document.getElementById(
        "tablaValoracionesBody"
    ).innerHTML = "";


    const mensaje =
        document.getElementById(
            "mensajeHistorial"
        );


    mensaje.textContent =
        "Selecciona un paciente para visualizar sus valoraciones.";


    mensaje.classList.remove("hidden");

}


/* =========================================
   FORMATO DE FECHA
========================================= */

function formatearFecha(fecha) {

    if (!fecha) {
        return "-";
    }


    const fechaObjeto =
        new Date(fecha);


    return fechaObjeto.toLocaleString(
        "es-PE",
        {
            dateStyle: "short",
            timeStyle: "short"
        }
    );

}


/* =========================================
   FECHA LOCAL PARA INPUT
========================================= */

function convertirFechaLocal(fecha) {

    const date =
        new Date(fecha);


    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    const hours =
        String(
            date.getHours()
        ).padStart(2, "0");


    const minutes =
        String(
            date.getMinutes()
        ).padStart(2, "0");


    return `${year}-${month}-${day}T${hours}:${minutes}`;

}


/* =========================================
   CONVERTIR FECHA A ISO
========================================= */

function convertirFechaISO(fecha) {

    return new Date(fecha).toISOString();

}


/* =========================================
   ESCAPAR HTML
========================================= */

function escapeHtml(texto) {

    const div =
        document.createElement("div");

    div.textContent =
        texto;

    return div.innerHTML;

}


/* =========================================
   CERRAR SESIÓN
========================================= */

function cerrarSesion() {

    localStorage.removeItem("token");

    window.location.href =
        "login.html";

}