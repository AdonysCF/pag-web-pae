document.addEventListener("DOMContentLoaded", async () => {

    // =========================================
    // PROTEGER DASHBOARD
    // =========================================

    if (!estaAutenticado()) {
        window.location.href = "login.html";
        return;
    }


    // =========================================
    // ELEMENTOS
    // =========================================

    const userName = document.getElementById("user-name");
    const userRole = document.getElementById("user-role");
    const userAvatar = document.getElementById("user-avatar");

    const totalPacientes = document.getElementById("total-pacientes");

    const apiStatus = document.getElementById("api-status");
    const sessionStatus = document.getElementById("session-status");

    const btnLogout = document.getElementById("btn-logout");
    const btnMenu = document.getElementById("btn-menu");
    const sidebar = document.querySelector(".sidebar");


    // =========================================
    // CERRAR SESIÓN
    // =========================================

    btnLogout.addEventListener("click", () => {
        cerrarSesion();
    });


    // =========================================
    // MENÚ RESPONSIVE
    // =========================================

    btnMenu.addEventListener("click", () => {
        sidebar.classList.toggle("open");
    });


    // =========================================
    // MOSTRAR INFORMACIÓN DEL USUARIO
    // =========================================

    cargarInformacionUsuario();


    // =========================================
    // CARGAR ESTADÍSTICAS
    // =========================================

    await cargarEstadisticas();


    // =========================================
    // COMPROBAR API
    // =========================================

    await comprobarAPI();


    // =========================================
    // FUNCIONES
    // =========================================


    function cargarInformacionUsuario() {

        /*
         * El JWT contiene:
         *
         * sub     -> ID del usuario
         * correo  -> correo
         * id_rol  -> rol
         *
         * En esta etapa mostramos el correo.
         * Más adelante crearemos /usuarios/me
         * para obtener nombre y rol directamente
         * desde PostgreSQL.
         */

        const token = obtenerToken();

        if (!token) {
            return;
        }

        try {

            const payload = decodificarJWT(token);

            const correo = payload.correo || "Usuario";

            const idRol = payload.id_rol;

            userName.textContent = correo;

            userRole.textContent = obtenerNombreRol(idRol);

            userAvatar.textContent =
                correo.charAt(0).toUpperCase();

        } catch (error) {

            console.error(
                "No se pudo leer el token:",
                error
            );

        }

    }


    function decodificarJWT(token) {

        const partes = token.split(".");

        if (partes.length !== 3) {
            throw new Error("Token JWT inválido.");
        }

        const payload = partes[1];

        const base64 = payload
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map(
                    char =>
                        "%" +
                        ("00" + char.charCodeAt(0).toString(16))
                            .slice(-2)
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


    async function cargarEstadisticas() {

        try {

            const pacientes = await apiFetch(
                "/pacientes/",
                {
                    method: "GET",
                    headers: {
                        ...obtenerAuthorization()
                    }
                }
            );

            totalPacientes.textContent = pacientes.length;

        } catch (error) {

            console.error(
                "Error al obtener pacientes:",
                error
            );

            totalPacientes.textContent = "—";

            /*
             * Si el token dejó de ser válido,
             * regresamos al login.
             */

            if (
                error.message.toLowerCase().includes("token") ||
                error.message.toLowerCase().includes("401")
            ) {
                cerrarSesion();
            }

        }

    }


    async function comprobarAPI() {

        try {

            const response = await fetch(
                `${API_URL}/health`
            );

            if (!response.ok) {
                throw new Error(
                    "La API no respondió correctamente."
                );
            }

            const data = await response.json();

            if (data.status === "ok") {

                apiStatus.textContent =
                    "Conectada correctamente";

                sessionStatus.textContent =
                    "Sesión activa";

            } else {

                apiStatus.textContent =
                    "Respuesta inesperada";

            }

        } catch (error) {

            console.error(
                "Error conectando con API:",
                error
            );

            apiStatus.textContent =
                "No se pudo conectar con la API";

            sessionStatus.textContent =
                "Sesión activa, pero API no disponible";

        }

    }

});