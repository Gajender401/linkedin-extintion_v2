
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

        function addLogoToElement() {
          // Find the element with class name "logo-img"
          const logoElement = document.querySelector('.logo-img');

          if (logoElement) {
            // Set the src attribute of the found element
            logoElement.src = chrome.runtime.getURL('logo.png');
          } else {
            console.warn('Element with class name "logo-img" not found. Retrying in 500ms.');

            // Retry after a delay
            setTimeout(addLogoToElement, 50);
          }
        }

        // Call the function initially
        addLogoToElement();

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

