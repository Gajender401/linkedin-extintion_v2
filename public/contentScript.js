
if (window.location.hostname === 'www.linkedin.com') {
  const bodyElement = document.body;

  if (bodyElement) {

    fetch(chrome.runtime.getURL('index.html'))
      .then(response => response.text())
      .then(html => {

        var metaTag = document.createElement('meta');

        metaTag.setAttribute('name', 'kaliper');
        metaTag.setAttribute('content', "connect-src 'self' blob: wss: .licdn.com *.linkedin.com *.lynda.com linkedin.sc.omtrdc.net/b/ss/ cdn.linkedin.oribi.io *.data.digitalassistant.oci.oraclecloud.com/chat/ *.tealiumiq.com *.microsoft.com *.office.com *.skype.com *.skype.net *.agora.io: .sd-rtn.com: *.qualtrics.com *.trouter.io dpm.demdex.net/id lnkd.demdex.net https://bot.kaliper.in/;");
        
        document.head.appendChild(metaTag);

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
  chrome.runtime.sendMessage({action: "makeAPICall"}, function(response) {
    console.log(response); 
  });
} catch (error) {
  console.error('Error registering listener:', error);
  
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