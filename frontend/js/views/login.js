document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");
    const correoInput = document.getElementById("correo");
    const passwordInput = document.getElementById("password");
    const mensaje = document.getElementById("mensaje");
    const botonLogin = document.getElementById("btn-login");

    // Si ya existe una sesión, enviamos directamente al dashboard.
    if (estaAutenticado()) {
        window.location.href = "dashboard.html";
        return;
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const correo = correoInput.value.trim();
        const password = passwordInput.value;

        ocultarMensaje();

        if (!correo || !password) {
            mostrarMensaje("Ingresa tu correo y contraseña.", "error");
            return;
        }

        botonLogin.disabled = true;
        botonLogin.textContent = "Iniciando sesión...";

        try {
            const data = await apiFetch("/auth/login", {
                method: "POST",
                body: JSON.stringify({
                    correo: correo,
                    password: password
                })
            });

            guardarSesion(data);

            mostrarMensaje("Inicio de sesión correcto.", "success");

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 500);

        } catch (error) {
            mostrarMensaje(error.message, "error");

        } finally {
            botonLogin.disabled = false;
            botonLogin.textContent = "Iniciar sesión";
        }
    });

    function mostrarMensaje(texto, tipo) {
        mensaje.textContent = texto;
        mensaje.className = `mensaje ${tipo}`;
        mensaje.hidden = false;
    }

    function ocultarMensaje() {
        mensaje.hidden = true;
        mensaje.textContent = "";
        mensaje.className = "mensaje";
    }
});