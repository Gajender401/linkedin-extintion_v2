/*global chrome*/
import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

interface Email {
  id: number;
  name: string;
  content: string;
  user: string;
}

const Popup = () => {
  const [userName, setUserName] = useState('');
  const [user, setUser] = useState('')
  const [template, setTemplate] = useState<Email[]>([])
  const [messages, setMessages] = useState('')
  const [tempName, setTempName] = useState('')
  const [access, setAccess] = useState('')

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

  useEffect(() => {
    /*@ts-ignore */
    chrome.cookies.get({ url: 'https://extintion-web.vercel.app/', name: 'access' }, function (cookie) {
      getUser(cookie.value)
      getTemplate(cookie.value)
      setAccess(cookie.value)
    })


  }, [])

  async function getUser(tokken: string) {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://bot.kaliper.in/api/auth/me/',
      headers: {
        'Authorization': `Bearer ${tokken}`
      }
    };

    axios.request(config)
      .then((response) => {
        setUser(response.data.email)
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function getTemplate(tokken: string) {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://bot.kaliper.in/api/api/templates/',
      headers: {
        'Authorization': `Bearer ${tokken}`
      }
    };

    axios.request(config)
      .then((response: any) => {
        setTemplate(response.data)
      })
  }


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

    var words = userName.split(" ");
    words.pop();
    var modifiedString = words.join(" ");
    const messageButton = document.querySelector(`button[aria-label="Message ${modifiedString}"]`);
    if (messageButton) {
      (messageButton as HTMLButtonElement).click();
    }

  };

  const handleClickMessageButton2 = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      chrome.scripting.executeScript(
        {
          target: { tabId: currentTab.id },
          function: setMessage,
        }
      );
    });
  };

  function setMessage() {
    const messageBox = document.querySelector('.msg-form__contenteditable');

    if (messageBox instanceof HTMLElement) {
      messageBox.setAttribute('data-artdeco-is-focused', 'true');
      messageBox.focus();
      var pTag = document.querySelector('.msg-form__contenteditable p') as HTMLElement;

      if (pTag) {
        pTag.innerText = 'Hey wassup';
        const event = new Event('input', { bubbles: true });
        pTag.dispatchEvent(event);
      }
    }

    // Remove msg-form__placeholder from the div
    const placeholderDiv = document.querySelector('.msg-form__placeholder');

    if (placeholderDiv instanceof HTMLElement) {
      placeholderDiv.classList.remove('msg-form__placeholder');
    } else {
      console.error('The .msg-form__placeholder div was not found.');
    }

    // Enable the send button
    const sendButton = document.querySelector('.msg-form__send-button');

    if (sendButton instanceof HTMLElement) {
      sendButton.removeAttribute('disabled');
    } else {
      console.error('The .msg-form__send-button button was not found.');
    }

    // Add msg-form__msg-content-container--is-active to the text editor div
    const textEditorDiv = document.querySelector('.msg-form__message-texteditor');

    if (textEditorDiv instanceof HTMLElement) {
      textEditorDiv.classList.add('msg-form__msg-content-container--is-active');
    } else {
      console.error('The .msg-form__message-texteditor div was not found.');
    }
  }

  async function sendTemplate() {
    let data = JSON.stringify({
      "message": `create message template ${messages}`,
      "tone": "Polite",
      "recipient_name": userName,
      "template_name": tempName
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://bot.kaliper.in/api/kaliper-linked-lists/',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access}`,
        'Cookie': 'sonu_session=osi35ll46ie4ow2jtttewanamin8s5k6'
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
  }


  return (
    <div className='card'>
      <h1>LinkedIn Extension</h1>
      <h2>User: {userName}</h2>
      <button onClick={handleClickMessageButton}>Click Message Button</button>
      <button style={{ marginTop: '10px' }} onClick={() => handleClickMessageButton2()}>Set message</button>
      <p>{user}</p>

      <div className='jest' >
        {template.map(temp =>
          <p key={temp.id} >{temp.content}</p>
        )}
      </div>
      <form >
        <input type="text" placeholder='message' value={messages} onChange={(e) => setMessages(e.target.value)} />
        <input type="text" placeholder='template name' value={tempName} onChange={(e) => setTempName(e.target.value)} />

        <button onClick={() => sendTemplate()} >
          Submit
        </button>
      </form>

    </div>
  );
};

export default Popup;