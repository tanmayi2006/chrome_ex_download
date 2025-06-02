// src/background.ts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'downloadImages') {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'downloadImages' }, response => {
          sendResponse(response);
        });
      } else {
        sendResponse({ message: 'No active tab found' });
      }
    });
    return true; // Keep message channel open for async response
  } else if (message.action === 'downloadTables') {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'downloadTables' }, response => {
          sendResponse(response);
        });
      } else {
        sendResponse({ message: 'No active tab found' });
      }
    });
    return true; // Keep message channel open for async response
  }
});
