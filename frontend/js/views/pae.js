/* =========================================================
   PAE - NURSIFY
========================================================= */

const API_URL = "http://127.0.0.1:8000";

let pacienteActual = null;
let valoracionActual = null;
let paeActual = null;


/* =========================================================
   INICIO
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    verificarAutenticacion();
    mostrarUsuario();

    configurarEventos();

    cargarPacientes();

});


/* =========================================================
   EVENTOS
========================================================= */

function configurarEventos() {

    const selectPaciente =
        document.getElementById("selectPaciente");

    const selectValoracion =
        document.getElementById("selectValoracion");

    const btnGuardar =
        document.getElementById("btnGuardar");

    const btnLimpiar =
        document.getElementById("btnLimpiar");

    const btnCerrarSesion =
        document.getElementById("btnCerrarSesion");


    if (selectPaciente) {

        selectPaciente.addEventListener(
            "change",
            cambiarPaciente
        );

    }


    if (selectValoracion) {

        selectValoracion.addEventListener(
            "change",
            cambiarValoracion
        );

    }


    if (btnGuardar) {

        btnGuardar.addEventListener(
            "click",
            guardarPae
        );

    }


    if (btnLimpiar) {

        btnLimpiar.addEventListener(
            "click",
            limpiarFormulario
        );

    }


    if (btnCerrarSesion) {

        btnCerrarSesion.addEventListener(
            "click",
            cerrarSesion
        );

    }

}


/* =========================================================
   CARGAR PACIENTES
========================================================= */

async function cargarPacientes() {

    try {

        const token =
            localStorage.getItem("token");

        const response = await fetch(
            `${API_URL}/pacientes/`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );


        if (!response.ok) {

            throw new Error(
                "No se pudieron cargar los pacientes"
            );

        }


        const pacientes = await response.json();

        const select =
            document.getElementById("selectPaciente");


        select.innerHTML =
            `<option value="">
                Seleccionar paciente...
            </option>`;


        pacientes.forEach(paciente => {

            const option =
                document.createElement("option");

            option.value =
                paciente.id_paciente;

            option.textContent =
                `${paciente.apellidos}, ${paciente.nombres} - DNI: ${paciente.dni}`;

            option.dataset.paciente =
                JSON.stringify(paciente);

            select.appendChild(option);

        });


    } catch (error) {

        console.error(
            "Error cargando pacientes:",
            error
        );

        mostrarMensaje(
            "No se pudieron cargar los pacientes.",
            "error"
        );

    }

}


/* =========================================================
   CAMBIAR PACIENTE
========================================================= */

async function cambiarPaciente(event) {

    const idPaciente =
        event.target.value;


    const selectValoracion =
        document.getElementById("selectValoracion");


    ocultarContenidoPAE();


    if (!idPaciente) {

        pacienteActual = null;
        valoracionActual = null;

        selectValoracion.innerHTML =
            `<option value="">
                Seleccionar valoración...
            </option>`;

        selectValoracion.disabled = true;

        limpiarInformacionPaciente();

        return;

    }


    const option =
        event.target.selectedOptions[0];


    try {

        pacienteActual =
            JSON.parse(
                option.dataset.paciente
            );

    } catch {

        pacienteActual = null;

    }


    mostrarInformacionPaciente();

    await cargarValoraciones(idPaciente);

}


/* =========================================================
   INFORMACIÓN PACIENTE
========================================================= */

function mostrarInformacionPaciente() {

    if (!pacienteActual) {
        return;
    }


    document.getElementById(
        "infoPaciente"
    ).textContent =
        `${pacienteActual.nombres} ${pacienteActual.apellidos}`;


    document.getElementById(
        "infoDni"
    ).textContent =
        pacienteActual.dni || "-";


    document.getElementById(
        "patientInfo"
    ).classList.remove("hidden");

}


function limpiarInformacionPaciente() {

    document.getElementById(
        "infoPaciente"
    ).textContent = "-";


    document.getElementById(
        "infoDni"
    ).textContent = "-";


    document.getElementById(
        "infoFecha"
    ).textContent = "-";


    document.getElementById(
        "patientInfo"
    ).classList.add("hidden");

}


/* =========================================================
   CARGAR VALORACIONES
========================================================= */

async function cargarValoraciones(idPaciente) {

    const select =
        document.getElementById(
            "selectValoracion"
        );


    try {

        const token =
            localStorage.getItem("token");


        const response = await fetch(
            `${API_URL}/valoraciones/paciente/${idPaciente}`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );


        if (!response.ok) {

            throw new Error(
                "No se pudieron cargar las valoraciones"
            );

        }


        const valoraciones =
            await response.json();


        select.innerHTML =
            `<option value="">
                Seleccionar valoración...
            </option>`;


        valoraciones.forEach(valoracion => {

            const option =
                document.createElement("option");

            option.value =
                valoracion.id_valoracion;

            const fecha =
                formatearFecha(
                    valoracion.fecha
                );


            option.textContent =
                `Valoración #${valoracion.id_valoracion} - ${fecha}`;


            option.dataset.valoracion =
                JSON.stringify(valoracion);


            select.appendChild(option);

        });


        select.disabled =
            false;


    } catch (error) {

        console.error(
            "Error cargando valoraciones:",
            error
        );


        select.innerHTML =
            `<option value="">
                No hay valoraciones disponibles
            </option>`;


        select.disabled = true;


        mostrarMensaje(
            "No se pudieron cargar las valoraciones del paciente.",
            "error"
        );

    }

}


/* =========================================================
   CAMBIAR VALORACIÓN
========================================================= */

async function cambiarValoracion(event) {

    const idValoracion =
        event.target.value;


    ocultarContenidoPAE();


    if (!idValoracion) {

        valoracionActual = null;

        return;

    }


    const option =
        event.target.selectedOptions[0];


    try {

        valoracionActual =
            JSON.parse(
                option.dataset.valoracion
            );

    } catch {

        valoracionActual = null;

    }


    if (valoracionActual) {

        document.getElementById(
            "infoFecha"
        ).textContent =
            formatearFecha(
                valoracionActual.fecha
            );

    }


    await prepararPAE(
        Number(idValoracion)
    );

}


/* =========================================================
   PREPARAR PAE
========================================================= */

async function prepararPAE(idValoracion) {

    document.getElementById(
        "mensajeInicial"
    ).classList.add("hidden");


    document.getElementById(
        "paeContainer"
    ).classList.remove("hidden");


    await cargarDiagnosticos();


    await cargarPAEExistente(
        idValoracion
    );

}


/* =========================================================
   CARGAR DIAGNÓSTICOS
========================================================= */

async function cargarDiagnosticos() {

    if (!pacienteActual) {
        return;
    }


    const container =
        document.getElementById(
            "diagnosticosContainer"
        );


    try {

        const token =
            localStorage.getItem("token");


        const response = await fetch(
            `${API_URL}/diagnosticos/paciente/${pacienteActual.id_paciente}`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );


        if (!response.ok) {

            throw new Error(
                "No se pudieron cargar los diagnósticos"
            );

        }


        const diagnosticos =
            await response.json();


        document.getElementById(
            "contadorDiagnosticos"
        ).textContent =
            `${diagnosticos.length} diagnóstico${diagnosticos.length === 1 ? "" : "s"}`;


        if (diagnosticos.length === 0) {

            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">✚</div>

                    <h3>
                        No hay diagnósticos registrados
                    </h3>

                    <p>
                        Debes registrar al menos un diagnóstico
                        antes de elaborar el PAE.
                    </p>
                </div>
            `;

            return;

        }


        container.innerHTML = "";


        diagnosticos.forEach(item => {

            const diagnostico =
                item.diagnostico || item;


            const div =
                document.createElement("div");


            div.className =
                "diagnostico-item";


            div.innerHTML = `

                <div class="diagnostico-code">
                    ${escapeHTML(
                        diagnostico.codigo || "-"
                    )}
                </div>

                <div class="diagnostico-info">

                    <strong>
                        ${escapeHTML(
                            diagnostico.nombre || "Diagnóstico"
                        )}
                    </strong>

                    ${
                        diagnostico.definicion
                        ?
                        `<p>
                            ${escapeHTML(
                                diagnostico.definicion
                            )}
                        </p>`
                        :
                        ""
                    }

                </div>

            `;


            container.appendChild(div);

        });


    } catch (error) {

        console.error(
            "Error cargando diagnósticos:",
            error
        );


        container.innerHTML = `

            <div class="message error">

                No se pudieron cargar los diagnósticos
                del paciente.

            </div>

        `;

    }

}


/* =========================================================
   CARGAR PAE EXISTENTE
========================================================= */

async function cargarPAEExistente(
    idValoracion
) {

    try {

        const token =
            localStorage.getItem("token");


        const response = await fetch(
            `${API_URL}/pae/valoracion/${idValoracion}`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );


        if (response.status === 404) {

            paeActual = null;

            limpiarCampos();

            actualizarBotonGuardar();

            return;

        }


        if (!response.ok) {

            throw new Error(
                "No se pudo consultar el PAE"
            );

        }


        paeActual =
            await response.json();


        cargarDatosPAE(
            paeActual
        );


        actualizarBotonGuardar();


    } catch (error) {

        console.error(
            "Error consultando PAE:",
            error
        );

    }

}


/* =========================================================
   CARGAR DATOS EN FORMULARIO
========================================================= */

function cargarDatosPAE(pae) {

    document.getElementById(
        "planificacion"
    ).value =
        pae.planificacion || "";


    document.getElementById(
        "resultadosEsperados"
    ).value =
        pae.resultados_esperados || "";


    document.getElementById(
        "intervenciones"
    ).value =
        pae.intervenciones || "";


    document.getElementById(
        "actividades"
    ).value =
        pae.actividades || "";


    document.getElementById(
        "evaluacion"
    ).value =
        pae.evaluacion || "";

}


/* =========================================================
   GUARDAR PAE
========================================================= */

async function guardarPae() {

    if (!valoracionActual) {

        mostrarMensaje(
            "Debes seleccionar una valoración.",
            "error"
        );

        return;

    }


    const datos = {

        id_valoracion:
            Number(
                valoracionActual.id_valoracion
            ),

        planificacion:
            document.getElementById(
                "planificacion"
            ).value.trim(),

        resultados_esperados:
            document.getElementById(
                "resultadosEsperados"
            ).value.trim(),

        intervenciones:
            document.getElementById(
                "intervenciones"
            ).value.trim(),

        actividades:
            document.getElementById(
                "actividades"
            ).value.trim(),

        evaluacion:
            document.getElementById(
                "evaluacion"
            ).value.trim()

    };


    const btn =
        document.getElementById(
            "btnGuardar"
        );


    btn.disabled = true;


    try {

        const token =
            localStorage.getItem("token");


        let response;


        /* ================================================
           ACTUALIZAR
        ================================================ */

        if (paeActual) {

            response = await fetch(
                `${API_URL}/pae/${paeActual.id_pae}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    },

                    body:
                        JSON.stringify({
                            planificacion:
                                datos.planificacion,

                            resultados_esperados:
                                datos.resultados_esperados,

                            intervenciones:
                                datos.intervenciones,

                            actividades:
                                datos.actividades,

                            evaluacion:
                                datos.evaluacion
                        })
                }
            );

        }


        /* ================================================
           CREAR
        ================================================ */

        else {

            response = await fetch(
                `${API_URL}/pae/`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    },

                    body:
                        JSON.stringify(datos)
                }
            );

        }


        if (!response.ok) {

            let errorText =
                "No se pudo guardar el PAE.";


            try {

                const error =
                    await response.json();

                errorText =
                    error.detail ||
                    errorText;

            } catch {}


            throw new Error(
                errorText
            );

        }


        paeActual =
            await response.json();


        mostrarMensaje(
            paeActual.id_pae
                ?
                "PAE guardado correctamente."
                :
                "PAE actualizado correctamente.",
            "success"
        );


        actualizarBotonGuardar();


    } catch (error) {

        console.error(
            "Error guardando PAE:",
            error
        );


        mostrarMensaje(
            error.message ||
            "No se pudo guardar el PAE.",
            "error"
        );

    } finally {

        btn.disabled = false;

    }

}


/* =========================================================
   ACTUALIZAR BOTÓN
========================================================= */

function actualizarBotonGuardar() {

    const btn =
        document.getElementById(
            "btnGuardar"
        );


    if (!btn) {
        return;
    }


    btn.textContent =
        paeActual
            ? "Actualizar PAE"
            : "Guardar PAE";

}


/* =========================================================
   LIMPIAR
========================================================= */

function limpiarFormulario() {

    limpiarCampos();

    paeActual = null;

    actualizarBotonGuardar();

    mostrarMensaje(
        "Formulario limpiado.",
        "success"
    );

}


function limpiarCampos() {

    const campos = [
        "planificacion",
        "resultadosEsperados",
        "intervenciones",
        "actividades",
        "evaluacion"
    ];


    campos.forEach(id => {

        const campo =
            document.getElementById(id);


        if (campo) {
            campo.value = "";
        }

    });

}


/* =========================================================
   OCULTAR CONTENIDO
========================================================= */

function ocultarContenidoPAE() {

    document.getElementById(
        "mensajeInicial"
    ).classList.remove("hidden");


    document.getElementById(
        "paeContainer"
    ).classList.add("hidden");

}


/* =========================================================
   MENSAJES
========================================================= */

function mostrarMensaje(
    texto,
    tipo
) {

    const mensaje =
        document.getElementById(
            "mensaje"
        );


    if (!mensaje) {
        return;
    }


    mensaje.textContent =
        texto;


    mensaje.className =
        `message ${tipo}`;


    mensaje.classList.remove(
        "hidden"
    );


    setTimeout(() => {

        mensaje.classList.add(
            "hidden"
        );

    }, 4000);

}


/* =========================================================
   FORMATEAR FECHA
========================================================= */

function formatearFecha(
    fecha
) {

    if (!fecha) {
        return "-";
    }


    try {

        return new Date(
            fecha
        ).toLocaleDateString(
            "es-PE",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );

    } catch {

        return fecha;

    }

}


/* =========================================================
   ESCAPAR HTML
========================================================= */

function escapeHTML(
    texto
) {

    if (texto === null ||
        texto === undefined) {

        return "";

    }


    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(texto);


    return div.innerHTML;

}


/* =========================================================
   CERRAR SESIÓN
========================================================= */

function cerrarSesion() {

    localStorage.removeItem(
        "token"
    );

    localStorage.removeItem(
        "usuario"
    );

    window.location.href =
        "login.html";

}