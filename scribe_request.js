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
        baseURL: "https://server-production-4386.up.railway.app",
        clientId: "jayyxhjl5tq3uvqhuw5z0n2jg7dvfbmx",
      });
      const fiefAuth = new fief.browser.FiefAuth(fiefClient);

    const tokenInfo = fiefAuth.getTokenInfo();
    const accessToken = tokenInfo.access_token;

    try {
        const response = await fetch('https://yvuzpc7gj8.execute-api.eu-central-1.amazonaws.com/scribe/api/v1/audiomessage', {
            method: 'POST',
            body: formData,
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Origin": "https://intention-lab.github.io",
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
