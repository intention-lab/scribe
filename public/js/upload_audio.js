async function uploadAudio() {
  const fileInput = document.getElementById("audioFile");
  const file = fileInput.files[0];
  const resultDiv = document.getElementById("result");

  if (!file) {
    resultDiv.textContent = "Please select an audio file.";
    return;
  }

  const formData = new FormData();
  formData.append("audio", file);

  const accessToken = await Alpine.store("auth").get_token(); // Get the access token from the Auth0 client

  try {
    const response = await fetch(
      "https://api.intention-lab.ch/scribe/api/v1/audiomessage",
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Origin: "https://intention-lab.github.io",
          "Access-Control-Request-Method": "POST",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      resultDiv.textContent = `API Response: ${JSON.stringify(data)}`;
    } else {
      resultDiv.textContent = "Error uploading file.";
    }
  } catch (error) {
    resultDiv.textContent = `Error: ${error.message}`;
  }
}
