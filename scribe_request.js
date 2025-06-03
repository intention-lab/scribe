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

        if (response.ok) {
            const data = await response.json();
            if (data.body.batch_id) {
                resultDiv.textContent = 'File uploaded. Waiting for transcription...';
                // Start polling for transcription status
                const pollTranscriptionStatus = async (batchId, token, resultDiv) => {
                    let polling = true;
                    while (polling) {
                        try {
                            const statusResponse = await fetch(`https://api.intention-lab.ch/api/v1/audiomessage/transcription/?batch_id=${batchId}`, {
                                method: 'GET',
                                headers: {
                                    "Authorization": `Bearer ${token}`,
                                    "Origin": "https://www.intention-lab.ch",
                                    "Access-Control-Request-Method": "GET",
                                    "Content-Type": "application/json"
                                }
                            });
                            if (statusResponse.ok) {
                                const statusData = await statusResponse.json();
                                if (statusData.status === "success") {
                                    // Call /summary endpoint to get the transcription result
                                    const summaryResponse = await fetch(`https://api.intention-lab.ch/api/v1/audiomessage/summary?transcription=${statusData.string}`, {
                                        method: 'GET',
                                        headers: {
                                            "Authorization": `Bearer ${token}`,
                                            "Origin": "https://www.intention-lab.ch",
                                            "Access-Control-Request-Method": "GET",
                                            "Content-Type": "application/json"
                                          }
                                        });
                                    resultDiv.textContent = summaryResponse || 'Transcription complete, but no result.';

                                    polling = false;
                                } else if (statusData.status === "failed" || statusData.status === "canceled") {
                                    resultDiv.textContent = 'Transcription failed.';
                                    polling = false;
                                } else {
                                    // Still processing
                                    await new Promise(res => setTimeout(res, 2000));
                                }
                            } else {
                                resultDiv.textContent = 'Error checking transcription status.';
                                polling = false;
                            }
                        } catch (err) {
                            resultDiv.textContent = `Error: ${err.message}`;
                            polling = false;
                        }
                    }
                };
                pollTranscriptionStatus(data.body.batch_id, accessToken, resultDiv);

            } else {
                resultDiv.textContent = `Unexpected API response: ${JSON.stringify(data)}`;
            }
        } else {
            resultDiv.textContent = 'Error uploading file.';
        }
    } catch (error) {
        resultDiv.textContent = `Error: ${error.message}`;
    }
}
