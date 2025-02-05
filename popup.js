const aiUrls = {
    copilot: "https://copilot.microsoft.com/?q=",
    chatgpt: "https://chat.openai.com/",
    claude: "https://claude.ai/",
    gemini: "https://gemini.google.com/app",
    deepseek: "https://chat.deepseek.com/",
    grok: "https://x.com/i/grok"
};

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("sendPrompt").addEventListener("click", () => {
        const ai = document.getElementById("aiSelector").value;
        const prompt = document.getElementById("promptInput").value.trim();

        if (!prompt) {
            alert("Por favor, escribe un prompt antes de enviar.");
            return;
        }

        if (ai === "copilot") {
            // Redirige directamente a Copilot con el prompt en la URL
            window.open(aiUrls[ai] + encodeURIComponent(prompt), "_blank");
        } else {
            // Copia el prompt al portapapeles y redirige a la IA seleccionada
            navigator.clipboard.writeText(prompt).then(() => {
                alert("El prompt se ha copiado al portapapeles. Pégalo manualmente en la página.");
                window.open(aiUrls[ai], "_blank");
            }).catch(err => {
                console.error("Error al copiar:", err);
                alert("No se pudo copiar el prompt. Cópialo manualmente.");
                window.open(aiUrls[ai], "_blank");
            });
        }
    });
});

