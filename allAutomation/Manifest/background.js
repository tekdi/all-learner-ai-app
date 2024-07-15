chrome.runtime.onInstalled.addListener(() => {
  console.log("My Microphone Simulator Extension Installed");

  // Add other background tasks or listeners here if needed
});

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js']
  });
});
