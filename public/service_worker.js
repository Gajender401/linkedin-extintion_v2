chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});


chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

  if (changeInfo.status === 'complete') {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTabId = tabs[0].id;

      chrome.cookies.get({ url: 'https://blueparrotai.com/', name: 'access' }, function (cookie) {
        if (cookie) {
          const cookieValue = cookie.value;

          chrome.tabs.sendMessage(activeTabId, { msg: cookieValue }, function (response) {
            console.log(response);
          });
        }
      });
    });
  }
});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "makeAPICall") {
    fetch('https://dummyjson.com/users')
      .then(response => response.json())
      .then(data => {
        console.log('API response:', data);
        sendResponse({success: true, data: data}); // Send response back to content script
      })
      .catch(error => {
        console.error('Error fetching API:', error);
        sendResponse({success: false, error: error}); // Send response back to content script
      });
    
    // Return true to indicate that sendResponse will be called asynchronously
    return true;
  }
});