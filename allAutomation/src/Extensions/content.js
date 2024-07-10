// Example content script to interact with the page
console.log('Content script loaded');

// Example function to simulate microphone input
function simulateMicrophone(audioFile) {
  // Implement your logic to simulate microphone input here
  console.log('Simulating microphone with audio file:', audioFile);
}

// Example function to send message to background script
function sendMessageToBackground(action, data) {
  chrome.runtime.sendMessage({ action: action, data: data });
}

// Example usage: Simulate microphone input with an audio file
simulateMicrophone('src/main/java/Pages/output_audio.wav');

// Example usage: Send audio file to background script
sendMessageToBackground('send_audio_file', 'src/main/java/Pages/output_audio.wav');
