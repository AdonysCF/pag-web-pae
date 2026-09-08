const archivoPDF = document.getElementById("archivoPDF");
const btnSeleccionarPDF = document.getElementById("btnSeleccionarPDF");
const btnSubirPDF = document.getElementById("btnSubirPDF");

const uploadArea = document.getElementById("uploadArea");
const archivoSeleccionado = document.getElementById("archivoSeleccionado");

const nombreArchivo = document.getElementById("nombreArchivo");
const tamanoArchivo = document.getElementById("tamanoArchivo");

const casosContainer = document.getElementById("casosContainer");

const visorCaso = document.getElementById("visorCaso");
const textoExtraido = document.getElementById("textoExtraido");
const visorNombreArchivo = document.getElementById("visorNombreArchivo");
const btnCerrarVisor = document.getElementById("btnCerrarVisor");


let archivoActual = null;


/* ================================
   SELECCIONAR ARCHIVO
================================ */

btnSeleccionarPDF.addEventListener("click", () => {
    archivoPDF.click();
});


archivoPDF.addEventListener("change", () => {

    if (!archivoPDF.files.length) {
        return;
    }

    seleccionarArchivo(
        archivoPDF.files[0]
    );
});


/* ================================
   DRAG & DROP
================================ */

uploadArea.addEventListener("dragover", (event) => {

    event.preventDefault();

    uploadArea.classList.add("dragover");
});


uploadArea.addEventListener("dragleave", () => {

    uploadArea.classList.remove("dragover");
});


uploadArea.addEventListener("drop", (event) => {

    event.preventDefault();

    uploadArea.classList.remove("dragover");

    const archivos = event.dataTransfer.files;

    if (!archivos.length) {
        return;
    }

    seleccionarArchivo(archivos[0]);
});


function seleccionarArchivo(archivo) {

    const extension = archivo.name
        .split(".")
        .pop()
        .toLowerCase();

    if (extension !== "pdf") {

        alert("Solo se permiten archivos PDF.");

        return;
    }

    archivoActual = archivo;

    nombreArchivo.textContent =
        archivo.name;

    tamanoArchivo.textContent =
        formatearTamano(archivo.size);

    archivoSeleccionado.classList.remove("hidden");
}


/* ================================
   SUBIR PDF
================================ */

btnSubirPDF.addEventListener("click", async () => {

    if (!archivoActual) {

        alert("Selecciona un archivo PDF.");

        return;
    }

    const formData = new FormData();

    formData.append(
        "archivo",
        archivoActual
    );

    try {

        btnSubirPDF.disabled = true;

        btnSubirPDF.textContent =
            "Procesando...";

        const response = await fetch(
            `${API_BASE_URL}/casos-clinicos/subir`,
            {
                method: "POST",
                headers: obtenerHeaders(),
                body: formData
            }
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.detail ||
                "No se pudo procesar el PDF."
            );
        }

        alert(
            "Caso clínico procesado correctamente."
        );

        limpiarArchivo();

        cargarCasos();

        mostrarCaso(data);

    } catch (error) {

        console.error(error);

        alert(error.message);

    } finally {

        btnSubirPDF.disabled = false;

        btnSubirPDF.textContent =
            "Procesar PDF";
    }
});


/* ================================
   CARGAR CASOS
================================ */

async function cargarCasos() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/casos-clinicos/`,
            {
                method: "GET",
                headers: obtenerHeaders()
            }
        );

        if (!response.ok) {
            throw new Error(
                "No se pudieron cargar los casos."
            );
        }

        const casos = await response.json();

        renderizarCasos(casos);

    } catch (error) {

        console.error(error);

        casosContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">⚠️</div>
                <h3>Error</h3>
                <p>
                    No se pudieron cargar los casos clínicos.
                </p>
            </div>
        `;
    }
}


/* ================================
   RENDERIZAR CASOS
================================ */

function renderizarCasos(casos) {

    if (!casos.length) {

        casosContainer.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">
                    📄
                </div>

                <h3>
                    No hay casos clínicos
                </h3>

                <p>
                    Sube tu primer caso clínico
                    para comenzar.
                </p>

            </div>
        `;

        return;
    }


    const lista = document.createElement("div");

    lista.className = "case-list";


    casos.forEach(caso => {

        const item = document.createElement("div");

        item.className = "case-item";


        const fecha = new Date(
            caso.fecha_creacion
        ).toLocaleString("es-PE");


        item.innerHTML = `
            <div class="case-info">

                <div class="case-icon">
                    📄
                </div>

                <div class="case-details">

                    <strong>
                        ${escapeHtml(
                            caso.nombre_archivo
                        )}
                    </strong>

                    <span>
                        ${fecha}
                    </span>

                </div>

            </div>


            <div class="case-actions">

                <button
                    class="btn btn-secondary"
                    onclick="verCaso(${caso.id_caso_clinico})">

                    Ver contenido

                </button>

                <button
                    class="btn btn-secondary"
                    onclick="eliminarCaso(${caso.id_caso_clinico})">

                    Eliminar

                </button>

            </div>
        `;


        lista.appendChild(item);

    });


    casosContainer.innerHTML = "";

    casosContainer.appendChild(lista);
}


/* ================================
   VER CASO
================================ */

async function verCaso(idCaso) {

    try {

        const response = await fetch(
            `${API_BASE_URL}/casos-clinicos/${idCaso}`,
            {
                method: "GET",
                headers: obtenerHeaders()
            }
        );

        const caso = await response.json();

        if (!response.ok) {

            throw new Error(
                caso.detail ||
                "No se pudo cargar el caso."
            );
        }

        mostrarCaso(caso);

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}


function mostrarCaso(caso) {

    visorNombreArchivo.textContent =
        caso.nombre_archivo;

    textoExtraido.textContent =
        caso.texto_extraido || "Sin contenido.";

    visorCaso.classList.remove("hidden");

    visorCaso.scrollIntoView({
        behavior: "smooth"
    });
}


/* ================================
   CERRAR VISOR
================================ */

btnCerrarVisor.addEventListener(
    "click",
    () => {

        visorCaso.classList.add(
            "hidden"
        );
    }
);


/* ================================
   ELIMINAR
================================ */

async function eliminarCaso(idCaso) {

    const confirmar = confirm(
        "¿Deseas eliminar este caso clínico?"
    );

    if (!confirmar) {
        return;
    }


    try {

        const response = await fetch(
            `${API_BASE_URL}/casos-clinicos/${idCaso}`,
            {
                method: "DELETE",
                headers: obtenerHeaders()
            }
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.detail ||
                "No se pudo eliminar el caso."
            );
        }

        cargarCasos();

        visorCaso.classList.add(
            "hidden"
        );

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}


/* ================================
   LIMPIAR
================================ */

function limpiarArchivo() {

    archivoActual = null;

    archivoPDF.value = "";

    archivoSeleccionado.classList.add(
        "hidden"
    );

    nombreArchivo.textContent =
        "archivo.pdf";

    tamanoArchivo.textContent =
        "0 KB";
}


/* ================================
   UTILIDADES
================================ */

function formatearTamano(bytes) {

    if (bytes === 0) {
        return "0 KB";
    }

    const unidades = [
        "Bytes",
        "KB",
        "MB",
        "GB"
    ];

    const indice = Math.floor(
        Math.log(bytes) /
        Math.log(1024)
    );

    return (
        bytes /
        Math.pow(1024, indice)
    ).toFixed(2) +
        " " +
        unidades[indice];
}


function escapeHtml(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


/* ================================
   INICIO
================================ */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        cargarCasos();

    }
);