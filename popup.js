const aiUrls = {
    chatgpt: "https://chat.openai.com/",
    claude: "https://claude.ai/",
    gemini: "https://gemini.google.com/app",
    deepseek: "https://chat.deepseek.com/",
    grok: "https://x.com/i/grok"
};

document.getElementById("sendPrompt").addEventListener("click", () => {
    const ai = document.getElementById("aiSelector").value;
    const prompt = document.getElementById("promptInput").value;

    if (!prompt.trim()) {
        alert("Por favor, escribe un prompt antes de enviar.");
        return;
    }

    chrome.runtime.sendMessage({
        action: "openAIPage",
        url: aiUrls[ai],
        prompt: prompt
    });
});
