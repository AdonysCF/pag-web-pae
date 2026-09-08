document.addEventListener("DOMContentLoaded", async () => {

    // =========================================
    // PROTECCIÓN
    // =========================================

    if (!estaAutenticado()) {
        window.location.href = "login.html";
        return;
    }


    // =========================================
    // ELEMENTOS
    // =========================================

    const tablaPacientes =
        document.getElementById("tabla-pacientes");

    const contadorPacientes =
        document.getElementById("contador-pacientes");

    const estadoVacio =
        document.getElementById("estado-vacio");

    const buscarPaciente =
        document.getElementById("buscar-paciente");

    const mensaje =
        document.getElementById("mensaje");

    // Modal crear/editar
    const modalPaciente =
        document.getElementById("modal-paciente");

    const formPaciente =
        document.getElementById("form-paciente");

    const modalTitulo =
        document.getElementById("modal-titulo");

    // Modal eliminar
    const modalEliminar =
        document.getElementById("modal-eliminar");

    const mensajeEliminar =
        document.getElementById("mensaje-eliminar");

    // Campos
    const dniInput =
        document.getElementById("dni");

    const nombresInput =
        document.getElementById("nombres");

    const apellidosInput =
        document.getElementById("apellidos");

    const sexoInput =
        document.getElementById("sexo");

    const edadInput =
        document.getElementById("edad");

    // Botones
    const btnNuevoPaciente =
        document.getElementById("btn-nuevo-paciente");

    const btnNuevoPacienteVacio =
        document.getElementById("btn-nuevo-paciente-vacio");

    const btnCerrarModal =
        document.getElementById("btn-cerrar-modal");

    const btnCancelar =
        document.getElementById("btn-cancelar");

    const btnGuardar =
        document.getElementById("btn-guardar");

    const btnCancelarEliminar =
        document.getElementById("btn-cancelar-eliminar");

    const btnConfirmarEliminar =
        document.getElementById("btn-confirmar-eliminar");

    const btnLogout =
        document.getElementById("btn-logout");

    const btnMenu =
        document.getElementById("btn-menu");

    const sidebar =
        document.querySelector(".sidebar");

    const userAvatar =
        document.getElementById("user-avatar");

    const userName =
        document.getElementById("user-name");

    const userRole =
        document.getElementById("user-role");


    // =========================================
    // VARIABLES
    // =========================================

    let pacientes = [];

    let pacienteEditando = null;

    let pacienteEliminar = null;


    // =========================================
    // INICIO
    // =========================================

    cargarInformacionUsuario();

    await cargarPacientes();


    // =========================================
    // EVENTOS
    // =========================================

    btnNuevoPaciente.addEventListener(
        "click",
        abrirModalCrear
    );

    btnNuevoPacienteVacio.addEventListener(
        "click",
        abrirModalCrear
    );

    btnCerrarModal.addEventListener(
        "click",
        cerrarModalPaciente
    );

    btnCancelar.addEventListener(
        "click",
        cerrarModalPaciente
    );

    formPaciente.addEventListener(
        "submit",
        guardarPaciente
    );

    btnCancelarEliminar.addEventListener(
        "click",
        cerrarModalEliminar
    );

    btnConfirmarEliminar.addEventListener(
        "click",
        eliminarPaciente
    );

    btnLogout.addEventListener(
        "click",
        cerrarSesion
    );

    btnMenu.addEventListener(
        "click",
        () => {
            sidebar.classList.toggle("open");
        }
    );

    buscarPaciente.addEventListener(
        "input",
        filtrarPacientes
    );


    // =========================================
    // CARGAR PACIENTES
    // =========================================

    async function cargarPacientes() {

        mostrarCarga();

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

            renderizarPacientes(pacientes);

        } catch (error) {

            console.error(
                "Error cargando pacientes:",
                error
            );

            tablaPacientes.innerHTML = `
                <tr>
                    <td colspan="5" class="loading-cell">
                        No se pudieron cargar los pacientes.
                    </td>
                </tr>
            `;

            mostrarMensaje(
                error.message,
                "error"
            );

            if (
                error.message
                    .toLowerCase()
                    .includes("token")
            ) {
                cerrarSesion();
            }

        }

    }


    // =========================================
    // MOSTRAR TABLA
    // =========================================

    function renderizarPacientes(lista) {

        contadorPacientes.textContent =
            `${lista.length} ${
                lista.length === 1
                    ? "paciente"
                    : "pacientes"
            }`;


        if (lista.length === 0) {

            tablaPacientes.innerHTML = "";

            estadoVacio.hidden = false;

            return;
        }


        estadoVacio.hidden = true;


        tablaPacientes.innerHTML =
            lista.map(paciente => {

                const sexo =
                    paciente.sexo || "—";

                const edad =
                    paciente.edad !== null &&
                    paciente.edad !== undefined
                        ? paciente.edad
                        : "—";

                return `
                    <tr>

                        <td>
                            <span class="patient-dni">
                                ${escaparHTML(paciente.dni)}
                            </span>
                        </td>

                        <td>
                            <span class="patient-name">
                                ${escaparHTML(
                                    paciente.nombres
                                )}
                                ${escaparHTML(
                                    paciente.apellidos
                                )}
                            </span>
                        </td>

                        <td>
                            ${escaparHTML(sexo)}
                        </td>

                        <td>
                            ${edad}
                        </td>

                        <td>

                            <div class="actions">

                                <button
                                    type="button"
                                    class="action-button"
                                    title="Editar"
                                    data-action="editar"
                                    data-id="${paciente.id_paciente}"
                                >
                                    ✎
                                </button>

                                <button
                                    type="button"
                                    class="action-button delete"
                                    title="Eliminar"
                                    data-action="eliminar"
                                    data-id="${paciente.id_paciente}"
                                >
                                    🗑
                                </button>

                            </div>

                        </td>

                    </tr>
                `;

            }).join("");


        // Eventos de botones

        tablaPacientes
            .querySelectorAll(
                "[data-action='editar']"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {
                        const id =
                            Number(button.dataset.id);

                        abrirModalEditar(id);
                    }
                );

            });


        tablaPacientes
            .querySelectorAll(
                "[data-action='eliminar']"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            Number(button.dataset.id);

                        abrirModalEliminar(id);

                    }
                );

            });

    }


    // =========================================
    // FILTRAR
    // =========================================

    function filtrarPacientes() {

        const termino =
            buscarPaciente.value
                .trim()
                .toLowerCase();


        if (!termino) {

            renderizarPacientes(pacientes);

            return;
        }


        const resultados =
            pacientes.filter(paciente => {

                const dni =
                    paciente.dni
                        ?.toLowerCase() || "";

                const nombres =
                    paciente.nombres
                        ?.toLowerCase() || "";

                const apellidos =
                    paciente.apellidos
                        ?.toLowerCase() || "";


                return (
                    dni.includes(termino) ||
                    nombres.includes(termino) ||
                    apellidos.includes(termino)
                );

            });


        renderizarPacientes(resultados);

    }


    // =========================================
    // CREAR PACIENTE
    // =========================================

    function abrirModalCrear() {

        pacienteEditando = null;

        modalTitulo.textContent =
            "Nuevo paciente";

        btnGuardar.textContent =
            "Guardar paciente";

        formPaciente.reset();

        modalPaciente.hidden = false;

        dniInput.focus();

    }


    // =========================================
    // EDITAR PACIENTE
    // =========================================

    function abrirModalEditar(id) {

        const paciente =
            pacientes.find(
                p => p.id_paciente === id
            );


        if (!paciente) {

            mostrarMensaje(
                "Paciente no encontrado.",
                "error"
            );

            return;
        }


        pacienteEditando = paciente;


        modalTitulo.textContent =
            "Editar paciente";

        btnGuardar.textContent =
            "Guardar cambios";


        dniInput.value =
            paciente.dni || "";

        nombresInput.value =
            paciente.nombres || "";

        apellidosInput.value =
            paciente.apellidos || "";

        sexoInput.value =
            paciente.sexo || "";

        edadInput.value =
            paciente.edad ?? "";


        modalPaciente.hidden = false;

        nombresInput.focus();

    }


    // =========================================
    // GUARDAR
    // =========================================

    async function guardarPaciente(event) {

        event.preventDefault();


        const datos = {

            dni: dniInput.value.trim(),

            nombres:
                nombresInput.value.trim(),

            apellidos:
                apellidosInput.value.trim(),

            sexo:
                sexoInput.value || null,

            edad:
                edadInput.value
                    ? Number(edadInput.value)
                    : null

        };


        btnGuardar.disabled = true;

        btnGuardar.textContent =
            pacienteEditando
                ? "Guardando..."
                : "Registrando...";


        try {

            if (pacienteEditando) {

                // =========================
                // ACTUALIZAR
                // =========================

                await apiFetch(
                    `/pacientes/${pacienteEditando.id_paciente}`,
                    {
                        method: "PUT",
                        headers: {
                            ...obtenerAuthorization()
                        },
                        body: JSON.stringify(datos)
                    }
                );


                mostrarMensaje(
                    "Paciente actualizado correctamente.",
                    "success"
                );


            } else {

                // =========================
                // CREAR
                // =========================

                await apiFetch(
                    "/pacientes/",
                    {
                        method: "POST",
                        headers: {
                            ...obtenerAuthorization()
                        },
                        body: JSON.stringify(datos)
                    }
                );


                mostrarMensaje(
                    "Paciente registrado correctamente.",
                    "success"
                );

            }


            cerrarModalPaciente();

            await cargarPacientes();


        } catch (error) {

            console.error(
                "Error guardando paciente:",
                error
            );

            mostrarMensaje(
                error.message,
                "error"
            );

        } finally {

            btnGuardar.disabled = false;

            btnGuardar.textContent =
                pacienteEditando
                    ? "Guardar cambios"
                    : "Guardar paciente";

        }

    }


    // =========================================
    // ELIMINAR
    // =========================================

    function abrirModalEliminar(id) {

        const paciente =
            pacientes.find(
                p => p.id_paciente === id
            );


        if (!paciente) {
            return;
        }


        pacienteEliminar = paciente;


        mensajeEliminar.textContent =
            `¿Estás seguro de que deseas eliminar `
            + `a ${paciente.nombres} `
            + `${paciente.apellidos}?`;


        modalEliminar.hidden = false;

    }


    async function eliminarPaciente() {

        if (!pacienteEliminar) {
            return;
        }


        btnConfirmarEliminar.disabled = true;

        btnConfirmarEliminar.textContent =
            "Eliminando...";


        try {

            await apiFetch(
                `/pacientes/${pacienteEliminar.id_paciente}`,
                {
                    method: "DELETE",
                    headers: {
                        ...obtenerAuthorization()
                    }
                }
            );


            cerrarModalEliminar();


            mostrarMensaje(
                "Paciente eliminado correctamente.",
                "success"
            );


            pacienteEliminar = null;


            await cargarPacientes();


        } catch (error) {

            console.error(
                "Error eliminando paciente:",
                error
            );

            mostrarMensaje(
                error.message,
                "error"
            );

        } finally {

            btnConfirmarEliminar.disabled = false;

            btnConfirmarEliminar.textContent =
                "Eliminar";

        }

    }


    // =========================================
    // MODALES
    // =========================================

    function cerrarModalPaciente() {

        modalPaciente.hidden = true;

        pacienteEditando = null;

        formPaciente.reset();

    }


    function cerrarModalEliminar() {

        modalEliminar.hidden = true;

        pacienteEliminar = null;

    }


    // =========================================
    // INFORMACIÓN DEL USUARIO
    // =========================================

    function cargarInformacionUsuario() {

        const token =
            obtenerToken();


        if (!token) {
            return;
        }


        try {

            const payload =
                decodificarJWT(token);


            const correo =
                payload.correo || "Usuario";


            userName.textContent =
                correo;


            userRole.textContent =
                obtenerNombreRol(
                    payload.id_rol
                );


            userAvatar.textContent =
                correo
                    .charAt(0)
                    .toUpperCase();


        } catch (error) {

            console.error(
                "Error leyendo JWT:",
                error
            );

        }

    }


    function decodificarJWT(token) {

        const partes =
            token.split(".");


        if (partes.length !== 3) {

            throw new Error(
                "Token JWT inválido."
            );

        }


        const payload =
            partes[1];


        const base64 =
            payload
                .replace(/-/g, "+")
                .replace(/_/g, "/");


        const jsonPayload =
            decodeURIComponent(
                atob(base64)
                    .split("")
                    .map(
                        char =>
                            "%" +
                            (
                                "00" +
                                char.charCodeAt(0)
                                    .toString(16)
                            ).slice(-2)
                    )
                    .join("")
            );


        return JSON.parse(jsonPayload);

    }


    function obtenerNombreRol(idRol) {

        const roles = {

            1: "Administrador",

            2: "Enfermera",

            3: "Estudiante"

        };


        return roles[idRol] || "Usuario";

    }


    // =========================================
    // UTILIDADES
    // =========================================

    function mostrarCarga() {

        tablaPacientes.innerHTML = `
            <tr>
                <td
                    colspan="5"
                    class="loading-cell"
                >
                    Cargando pacientes...
                </td>
            </tr>
        `;

        estadoVacio.hidden = true;

    }


    function mostrarMensaje(texto, tipo) {

        mensaje.textContent =
            texto;

        mensaje.className =
            `mensaje ${tipo}`;

        mensaje.hidden = false;


        setTimeout(() => {

            mensaje.hidden = true;

        }, 4000);

    }


    function escaparHTML(valor) {

        const div =
            document.createElement("div");

        div.textContent =
            valor ?? "";

        return div.innerHTML;

    }

});