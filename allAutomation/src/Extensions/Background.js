chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

// Example function to handle incoming audio file
function handleAudioFile(audioFile) {
  console.log('Received audio file:', audioFile);
  // Implement your logic to process the audio file here
}

// Example listener for external messages
chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  if (message.action === 'send_audio_file') {
    handleAudioFile(message.audioFile);
  }
});