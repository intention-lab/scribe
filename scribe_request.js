async function uploadAudio() {
    const fileInput = document.getElementById('audioFile');
    const file = fileInput.files[0];
    const resultDiv = document.getElementById('result');

    if (!file) {
        resultDiv.textContent = 'Please select an audio file.';
        return;
    }

    const formData = new FormData();
    formData.append('audio', file);
    
    const fiefClient = new fief.Fief({
        baseURL: "https://auth.intention-lab.ch",
        clientId: "jayyxhjl5tq3uvqhuw5z0n2jg7dvfbmx",
      });
      const fiefAuth = new fief.browser.FiefAuth(fiefClient);

    const tokenInfo = fiefAuth.getTokenInfo();
    const accessToken = tokenInfo.access_token;

    try {
        const response = await fetch('https://api.intention-lab.ch/api/v1/audiomessage/', {
            method: 'POST',
            body: formData,
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Origin": "https://www.intention-lab.ch",
                "Access-Control-Request-Method": "POST",
            }
        });

        // Call /summary endpoint to get the transcription result
        const summaryResponse = await fetch(`https://api.intention-lab.ch/api/v1/audiomessage/summary?transcription=${response}`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Origin": "https://www.intention-lab.ch",
                "Access-Control-Request-Method": "GET",
                "Content-Type": "application/json"
                }
            });
        resultDiv.textContent = summaryResponse || 'Transcription complete, but no result.';
    }
    catch (err) {
        resultDiv.textContent = `Error: ${err.message}`;
    }
}
