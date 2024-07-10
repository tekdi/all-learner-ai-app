document.addEventListener('DOMContentLoaded', function() {
  var simulateButton = document.getElementById('simulateButton');
  simulateButton.addEventListener('click', function() {
    // Implement logic to trigger microphone simulation
    console.log('Button clicked: Simulate Microphone');
    // Example: Send message to content script or background script to start simulation
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'start_microphone_simulation'});
    });
  });
});