chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "openAIPage") {
        chrome.tabs.create({ url: message.url }, (tab) => {
            chrome.storage.local.set({ lastPrompt: message.prompt }); // Guarda el prompt temporalmente
        });
    }
});
