function simulateMicrophoneInput(audioFilePath) {
  const context = new AudioContext();
  fetch(audioFilePath)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
    .then(audioBuffer => {
      const source = context.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(context.destination);
      source.start();
    })
    .catch(console.error);
}

// Function to check if the microphone button is clicked
function waitForMicButtonClick(selector) {
  document.querySelector(selector).addEventListener('click', function() {
    console.log("Microphone button clicked");
    const audioFilePath = chrome.runtime.getURL("output_audio.wav");
    simulateMicrophoneInput(audioFilePath);
  });
}

// Start checking for the microphone button click
waitForMicButtonClick('.MuiBox-root.css-1l4w6pd'); // Adjust the selector to match your microphone button
