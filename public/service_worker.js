chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

chrome.cookies.get({ url: 'https://candvue.vercel.app/', name: 'access' }, function (cookie) {
  console.log('cookies', cookie);
});


chrome.runtime.onConnect.addListener(function (port) {

  console.log('connected');

  port.onMessage.addListener(function (msg) {
    if (msg.type === "FROM_CONTENT_SCRIPT") {
      const receivedData = msg.data;
      console.log("Background script received message from content script:", receivedData);

    }
  });

});

