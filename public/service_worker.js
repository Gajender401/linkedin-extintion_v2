chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
  });

// background.js

// Add an event listener to handle connections from content scripts
chrome.runtime.onConnect.addListener(function (port) {
    console.assert(port.name === "content-script");
  
    // Add an event listener to handle messages from the content script
    port.onMessage.addListener(function (msg) {
      if (msg.type === "FROM_CONTENT_SCRIPT") {
        const receivedData = msg.data;
        console.log("Background script received message from content script:", receivedData);
  
        // Perform any background script logic based on the received data
      }
    });
  
    // Optionally, you can perform other actions in your background script
    // ...
  });
  
  