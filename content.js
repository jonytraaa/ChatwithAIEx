function waitForElement(selector, callback, timeout = 10000) {
    const startTime = Date.now();
    
    const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
            observer.disconnect(); // Detiene la observación una vez que encuentra el elemento
            callback(element);
        } else if (Date.now() - startTime >= timeout) {
            observer.disconnect();
            console.error(`No se encontró el elemento ${selector} en el tiempo límite.`);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Si el elemento ya está presente, lo usa de inmediato
    const existingElement = document.querySelector(selector);
    if (existingElement) {
        observer.disconnect();
        callback(existingElement);
    }
}

function simulateTyping(element, text) {
    element.focus();
    
    element.value = text;
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    element.dispatchEvent(new KeyboardEvent("keyup", { key: "Enter", bubbles: true }));
    
    setTimeout(() => {
        const sendButton = element.closest("form")?.querySelector("button") || document.querySelector("button");
        if (sendButton) {
            sendButton.click();
        } else {
            console.warn("No se encontró el botón de enviar.");
        }
    }, 1000);
}

function insertAndSendPrompt(prompt) {
    let inputSelector;

    if (window.location.hostname.includes("openai.com")) {
        inputSelector = "textarea";
    } else if (window.location.hostname.includes("claude.ai")) {
        inputSelector = "textarea";
    } else if (window.location.hostname.includes("gemini.google.com")) {
        inputSelector = "textarea";
    } else if (window.location.hostname.includes("deepseek.com")) {
        inputSelector = "textarea";
    } else if (window.location.hostname.includes("x.com")) { // Para Grok
        inputSelector = "textarea";
    }

    if (inputSelector) {
        waitForElement(inputSelector, (inputField) => {
            simulateTyping(inputField, prompt);
        });
    }
}

// Recupera el último prompt y lo inyecta en la IA
chrome.storage.local.get("lastPrompt", (data) => {
    if (data.lastPrompt) {
        insertAndSendPrompt(data.lastPrompt);
        chrome.storage.local.remove("lastPrompt"); // Borra el prompt tras enviarlo
    }
});
