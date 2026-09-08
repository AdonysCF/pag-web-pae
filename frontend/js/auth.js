function guardarSesion(data) {
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("token_type", data.token_type);
}

function obtenerToken() {
    return localStorage.getItem("access_token");
}

function obtenerTipoToken() {
    return localStorage.getItem("token_type") || "bearer";
}

function estaAutenticado() {
    return !!obtenerToken();
}

function obtenerAuthorization() {
    const token = obtenerToken();

    if (!token) {
        return {};
    }

    return {
        "Authorization": `${obtenerTipoToken()} ${token}`
    };
}

function cerrarSesion() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");

    window.location.href = "login.html";
}