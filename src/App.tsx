/*global chrome*/
import { useEffect, useState } from 'react';
import './App.css';

const Popup = () => {
  const [userName, setUserName] = useState('');
  const [access, setAccess] = useState('jbjh')

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      chrome.scripting.executeScript(
        {
          target: { tabId: currentTab.id },
          function: extractUsername,
        },
        (result) => {
          const extractedUserName = result[0].result;
          setUserName(extractedUserName);
        }
      );
    });


  }, []);

  // Content script to be injected into the LinkedIn page
  const extractUsername = () => {
    const h1Tag = document.querySelector('h1');
    return h1Tag ? h1Tag.innerText : '';
  };

  const handleClickMessageButton = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      chrome.scripting.executeScript(
        {
          target: { tabId: currentTab.id },
          function: clickMessageButton,
        }
      );
    });
  };

  // Content script to be injected into the LinkedIn page to click the message button
  const clickMessageButton = () => {
    const userNameElement = document.querySelector('h1');
    if (!userNameElement) {
      return;
    }

    const userName = userNameElement.innerText.trim();
    const firstNameUppercase = userName.split(' ')[0];

    const messageButton = document.querySelector(`button[aria-label="Message ${firstNameUppercase}"]`);
    if (messageButton) {
      (messageButton as HTMLButtonElement).click();
    } else {
      var words = userName.split(" ");
      words.pop();
      var modifiedString = words.join(" ");
      const messageButton = document.querySelector(`button[aria-label="Message ${modifiedString}"]`);
      if (messageButton) {
        (messageButton as HTMLButtonElement).click();
      }
    }

  };

  function setMessage() {
    const messageBox = document.querySelector('.msg-form__contenteditable[aria-label="Write a message…"]');
    if (messageBox instanceof HTMLElement) {
      messageBox.setAttribute('data-artdeco-is-focused', 'true');
      messageBox.focus(); // Use focus() to ensure the element is focused
      setMessageInMessageBox(messageBox, `Hello ${userName}!`);
    }
  }

  function setMessageInMessageBox(messageBox: HTMLElement, message: string) {
    messageBox.innerHTML = '';

    const paragraph = document.createElement('p');
    paragraph.textContent = message;

    messageBox.appendChild(paragraph);

    const inputEvent = new Event('input', { bubbles: true });
    messageBox.dispatchEvent(inputEvent);
  }

  function getCookies() {
    
    /*@ts-ignore */
    chrome.cookies.get({ url: 'https://bot.kaliper.in/', name: 'access' }, function (cookie) {
      console.log('cookies', cookie);
      setAccess(cookie.value)
    })


  }

  return (
    <div className='card'>
      <h1>LinkedIn Extension</h1>
      <h2>User: {userName}</h2>
      <button onClick={handleClickMessageButton}>Click Message Button</button>
      <button onClick={() => setMessage()}>Set message</button>

      <button onClick={() => getCookies()} >
        getCoocies
      </button>

      <p>{access}</p>

    </div>
  );
};

export default Popup;
