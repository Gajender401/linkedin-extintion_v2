// contentScript.js

// Connect to the background script
const port = chrome.runtime.connect({ name: "content-script" });

// Add an event listener to listen for messages from the webpage
window.addEventListener("message", function (event) {
  // Ensure the message is from the webpage (security measure)
  if (event.source !== window) return;

  // Check the message type and handle accordingly
  if (event.data.type && event.data.type === "FROM_PAGE") {
    const receivedData = event.data.data;
    console.log("Content script received message:", receivedData);

    // Send the data to the background script
    port.postMessage({ type: "FROM_CONTENT_SCRIPT", data: receivedData });
  }
});

// Optionally, you can perform other actions in your content script
// based on the interactions on the webpage.
// ...
