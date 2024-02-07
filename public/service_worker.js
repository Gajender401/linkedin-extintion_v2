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


