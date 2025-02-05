// Función para esperar hasta que un elemento sea visible
function waitForElement(selector, callback, timeout = 10000) {
    const startTime = Date.now();
    const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
            observer.disconnect(); // Detiene la observación
            callback(element);
        } else if (Date.now() - startTime >= timeout) {
            observer.disconnect();
            console.error(`Tiempo agotado: No se encontró el elemento ${selector}.`);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Si el elemento ya existe, ejecuta la callback inmediatamente
    const existingElement = document.querySelector(selector);
    if (existingElement) {
        observer.disconnect();
        callback(existingElement);
    }
}

// Simula la escritura de texto en un campo de entrada y envía el formulario
function simulateTyping(element, text) {
    if (!element) {
        console.error("No se encontró el campo de entrada.");
        return;
    }

    element.focus();

    // Simula la escritura letra por letra para mayor realismo
    const typeInterval = 10; // Intervalo entre cada letra (en milisegundos)
    let index = 0;

    function typeNextCharacter() {
        if (index < text.length) {
            element.value += text.charAt(index);
            element.dispatchEvent(new Event("input", { bubbles: true }));
            element.dispatchEvent(new Event("change", { bubbles: true })); // Asegura compatibilidad con algunos frameworks
            index++;
            setTimeout(typeNextCharacter, typeInterval);
        } else {
            // Una vez terminada la escritura, busca y hace clic en el botón de envío
            setTimeout(() => {
                const sendButton = findSendButton(element);
                if (sendButton) {
                    sendButton.click();
                } else {
                    console.warn("No se encontró el botón de enviar.");
                }
            }, 500); // Espera medio segundo antes de intentar enviar
        }
    }

    typeNextCharacter();
}

// Encuentra el botón de envío basado en patrones comunes
function findSendButton(inputField) {
    // Intenta buscar dentro del mismo formulario
    const form = inputField.closest("form");
    if (form) {
        const buttonInForm = form.querySelector(
            "button[type='submit'], button.send, button.submit, .send-button"
        );
        if (buttonInForm) return buttonInForm;
    }

    // Si no se encuentra en el formulario, busca globalmente
    return document.querySelector(
        "button[type='submit'], button.send, button.submit, .send-button"
    );
}

// Inserta y envía el prompt a la IA correspondiente
function insertAndSendPrompt(prompt) {
    // Mapea dominios a selectores de campos de entrada
    const siteSelectors = {
        "openai.com": "textarea",
        "claude.ai": "textarea",
        "gemini.google.com": "textarea",
        "deepseek.com": "textarea",
        "x.com": "textarea" // Para Grok
    };

    const hostname = window.location.hostname;
    const inputSelector = Object.entries(siteSelectors).find(([domain]) => hostname.includes(domain))?.[1];

    if (!inputSelector) {
        console.error("El sitio actual no es compatible.");
        return;
    }

    waitForElement(inputSelector, (inputField) => {
        simulateTyping(inputField, prompt);
    });
}

// Recupera el último prompt guardado y lo envía
chrome.storage.local.get("lastPrompt", (data) => {
    if (!data.lastPrompt) {
        console.log("No hay prompts pendientes para enviar.");
        return;
    }

    const prompt = data.lastPrompt;
    insertAndSendPrompt(prompt);

    // Borra el prompt después de enviarlo
    chrome.storage.local.remove("lastPrompt");
});