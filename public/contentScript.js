
if (window.location.hostname === 'www.linkedin.com') {
  // Query the body element
  const bodyElement = document.body;

  // Check if the body element exists before adding the overlay
  if (bodyElement) {

    fetch(chrome.runtime.getURL('overlay.html'))
    .then(response => response.text())
    .then(html => {
      // Create a temporary container element
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = html;

      console.log(html);

      tempContainer.style.position = 'absolute';
      tempContainer.style.top = '0';
      tempContainer.style.left = '0';
      tempContainer.style.width = '500px';
      tempContainer.style.height = '500px';
      tempContainer.style.zIndex = '999';
      tempContainer.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';

      // Append the tempContainer to the body
      bodyElement.appendChild(tempContainer);
    })
    .catch(error => {
      console.error('Error fetching overlay HTML:', error);
    });

  } else {
    console.error('Body element not found.');
  }
}

