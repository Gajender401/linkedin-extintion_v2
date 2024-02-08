
if (window.location.hostname === 'www.linkedin.com') {
  const bodyElement = document.body;

  if (bodyElement) {

    fetch(chrome.runtime.getURL('index.html'))
      .then(response => response.text())
      .then(html => {

        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = html;

        const scriptElement = document.createElement('script');
        scriptElement.type = 'module';
        scriptElement.src = chrome.runtime.getURL('index.js');
        document.head.appendChild(scriptElement);


        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = chrome.runtime.getURL('index.css');

        document.head.appendChild(linkElement);

        bodyElement.appendChild(tempContainer);
      })
      .catch(error => {
        console.error('Error fetching overlay HTML:', error);
      });

  } else {
    console.error('Body element not found.');
  }
}

try {
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    const tokkenElement = document.createElement('div');
    if (tokkenElement) {
      tokkenElement.innerText = request.msg;
      tokkenElement.id = 'tokken';
      tokkenElement.style.visibility = 'hidden';
      document.body.appendChild(tokkenElement);
    }
    
  });
} catch (error) {
  console.error('Error registering listener:', error);
}

