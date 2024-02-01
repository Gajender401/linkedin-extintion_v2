
if (window.location.hostname === 'www.linkedin.com') {
  const bodyElement = document.body;

  if (bodyElement) {

    fetch(chrome.runtime.getURL('index.html'))
    .then(response => response.text())
    .then(html => {

      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = html;

      tempContainer.style.position = 'fixed';
      tempContainer.style.bottom = '20px';
      tempContainer.style.right = '20px';
      tempContainer.style.width = '400px';
      tempContainer.style.height = '500px';
      tempContainer.style.backgroundColor = '#fff';
      tempContainer.style.zIndex = '999';

      const scriptElement = document.createElement('script');
      scriptElement.type = 'module';
      scriptElement.src = chrome.runtime.getURL('script.js');
      document.head.appendChild(scriptElement);


      const linkElement = document.createElement('link');
      linkElement.rel = 'stylesheet';
      linkElement.href = chrome.runtime.getURL('style.css');

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

