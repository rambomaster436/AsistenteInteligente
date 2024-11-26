const form = document.getElementById("slideForm");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const inputText = document.getElementById("inputText").value;

    try {
        const response = await fetch("http://127.0.0.1:5001/generate-slides", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: inputText }),
        });
        
        if (!response.ok) {
            throw new Error("Error en la generación de diapositivas");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "diapositivas.pptx";
        a.click();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un problema al generar las diapositivas.");
    }
});
