import { useEffect, useState } from "react"
import { FaPlus } from "react-icons/fa6"
import { useUserAuth } from "../context/context"
import axios from "axios"
import { VscSend } from "react-icons/vsc";
import { cn } from "../@/lib/utils";

interface Template {
  id: string;
  name: string;
  content: string;
  user: string;
}

const Templates = () => {
  const [selected, setSelected] = useState('')
  const [templates, setTemplates] = useState<Template[]>([])
  const [userName, setUserName] = useState('');
  const [content, setContent] = useState('')

  const { access } = useUserAuth()

  useEffect(() => {
    if (access) {
      getTemplates(access)
    }
  }, [access])


  async function getTemplates(tokken: string) {
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
        setTemplates(response.data)
      })
  }


    // Content script to be injected into the LinkedIn page
    const extractUsername = () => {
      const h1Tag = document.querySelector('h1');
      return h1Tag ? h1Tag.innerText : '';
    };

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

  const handleClickSetMessage = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      chrome.scripting.executeScript(
        {
          target: { tabId: currentTab.id },
          function: setMessage,
          args: [content]
        }
      );
    });
  };

  function setMessage(content:string) {

    const messageBox = document.querySelector('.msg-form__contenteditable');

    if (messageBox instanceof HTMLElement) {
      messageBox.setAttribute('data-artdeco-is-focused', 'true');
      messageBox.focus();
      var pTag = document.querySelector('.msg-form__contenteditable p') as HTMLElement;

      if (pTag && content) {
        pTag.innerText = content;
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

  async function sendMessage() {
    handleClickMessageButton()
    console.log(userName);

    setTimeout(() => {
      handleClickSetMessage()
    }, 1000);
  }

  return (
    <main>
      <button className="bg-white m-auto mt-5 hover:bg-customBlueDisable border border-customBlue text-customBlue py-2 rounded-md items-center flex flex-row gap-1 px-14 " >
        <FaPlus />
        <a href="#template" >Create template</a>
      </button>

      <div className=" p-5 mt-5" >
        <h2 className="text-[#081230]" >Tap on the prompt to generate message</h2>

        <div className="space-y-2 mt-3" >
          {templates.map(t =>
            <div
              onClick={() => {setSelected(t.id); setContent(t.content)}}
              style={
                selected == t.id
                  ? { boxShadow: '0px 0px 12px 0px #CDE6FF', border: '1 px solid #0A66C2', background: '#CDE6FF', color: '#0A66C2' }
                  : {}
              }

              className="flex cursor-pointer hover:scale-95 hover:bg-[#CDE6FF] hover:text-customBlueHover hover:border-0 hover:shadow-none transition-all duration-300 rounded-lg border flex-row items-center gap-1 px-5 py-2"
            >
              <VscSend />
              <p>{t.name}</p>
            </div>
          )}
        </div>


      </div>
        <div
        style={{
          boxShadow: "0px -4px 34.1px 0px rgba(0, 0, 0, 0.12)"
        }}
         className="absolute flex justify-between items-center w-full m-auto bottom-0 h-20" >
          <button
          onClick={()=>sendMessage()}
          className={cn(
            " m-auto py-2 rounded-md text-white items-center flex flex-row gap-1 px-14 ",
            selected.length===0?"bg-customBlueDisable":"bg-customBlue hover:bg-customBlueHover"
          )} >
            <FaPlus />
            <p >Send Message</p>
          </button>
        </div>
    </main>
  )
}

export default Templates