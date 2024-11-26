const form = document.getElementById("slideForm");
const slidesPreview = document.getElementById("slidesPreview");
const downloadButton = document.getElementById("downloadSlides");
const clearPreviewButton = document.getElementById("clearPreviewButton");

// Función para mostrar mensajes dinámicos en la vista previa
const actualizarVista = (mensaje, color = "black") => {
    slidesPreview.innerHTML = `<p style="color: ${color};">${mensaje}</p>`;
};

// Función para manejar errores
const manejarError = (error) => {
    console.error("Error:", error);
    actualizarVista(`Hubo un problema: ${error.message || error}`, "red");
};

// Función para habilitar/deshabilitar el botón de descarga
const configurarBotonDescarga = (habilitar) => {
    downloadButton.style.display = habilitar ? "inline-block" : "none";
    downloadButton.disabled = !habilitar;
};

// Función para generar una vista previa en estilo de diapositiva
const generarVistaPreviaEnEstiloPPT = (slides) => {
    slidesPreview.innerHTML = ""; // Limpia la vista previa

    slides.forEach((slide, index) => {
        const slideContainer = document.createElement("div");
        slideContainer.className = "slide-container";

        const slideTitle = document.createElement("h3");
        slideTitle.className = "slide-title";
        slideTitle.innerText = `Diapositiva ${index + 1}`;

        const slideContent = document.createElement("p");
        slideContent.className = "slide-content";
        slideContent.innerText = slide.content;

        slideContainer.appendChild(slideTitle);
        slideContainer.appendChild(slideContent);
        slidesPreview.appendChild(slideContainer);
    });
};

// Función para procesar la vista previa
const generarVistaPrevia = async (texto) => {
    try {
        const response = await fetch("http://127.0.0.1:5001/generate-preview", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: texto }),
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.slides || data.slides.length === 0) {
            actualizarVista("No se generaron diapositivas. Verifica el texto ingresado.", "orange");
            return;
        }

        generarVistaPreviaEnEstiloPPT(data.slides); // Renderiza con el nuevo estilo
        configurarBotonDescarga(true); // Habilitar botón de descarga
    } catch (error) {
        manejarError(error);
    }
};

// Función para manejar la descarga del archivo
const descargarArchivo = async (texto) => {
    try {
        const response = await fetch("http://127.0.0.1:5001/generate-slides", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: texto }),
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "diapositivas.pptx";
        a.click();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        alert(`Hubo un problema al descargar el archivo: ${error.message}`);
        manejarError(error);
    }
};

// Evento para el envío del formulario (vista previa)
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const inputText = document.getElementById("inputText").value.trim();

    if (!inputText) {
        alert("Por favor, ingresa texto antes de enviar.");
        return;
    }

    actualizarVista("Cargando vista previa...", "blue");
    configurarBotonDescarga(false); // Deshabilitar botón de descarga
    generarVistaPrevia(inputText);
});

// Evento para descargar las diapositivas
downloadButton.addEventListener("click", () => {
    const inputText = document.getElementById("inputText").value.trim();

    if (!inputText) {
        alert("Por favor, ingresa texto antes de descargar las diapositivas.");
        return;
    }

    descargarArchivo(inputText);
});

// Evento para borrar la vista previa
clearPreviewButton.addEventListener("click", () => {
    slidesPreview.innerHTML = ""; // Limpia el contenido de la vista previa
    configurarBotonDescarga(false); // Oculta y deshabilita el botón de descarga
    alert("Vista previa borrada correctamente.");
});
