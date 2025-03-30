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
        const response = await fetch('https://api.intention-lab.ch/api/v1/audiomessage', {
            method: 'POST',
            body: formData,
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Origin": "https://www.intention-lab.ch",
                "Access-Control-Request-Method": "POST",
            }
        });

        if (response.ok) {
            const data = await response.json();
            resultDiv.textContent = `API Response: ${JSON.stringify(data)}`;
        } else {
            resultDiv.textContent = 'Error uploading file.';
        }
    } catch (error) {
        resultDiv.textContent = `Error: ${error.message}`;
    }
}
