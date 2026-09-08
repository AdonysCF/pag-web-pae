import fitz


def extraer_texto_pdf(ruta_archivo: str) -> str:
    """
    Extrae texto de un archivo PDF.

    Retorna todo el texto disponible en el documento.
    """

    texto = []

    documento = fitz.open(ruta_archivo)

    try:
        for pagina in documento:
            contenido = pagina.get_text("text")

            if contenido:
                texto.append(contenido.strip())
    finally:
        documento.close()

    return "\n\n".join(texto).strip()