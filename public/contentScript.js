// contentScript.js
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.from === "webpage") {
    console.log("Content script received message from webpage:", message.data);
    
    // Perform actions based on the received data from the webpage

    // Send a response back to the webpage if needed
    sendResponse({ success: true });
  }
});
