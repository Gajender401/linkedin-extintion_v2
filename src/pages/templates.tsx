import { useEffect, useState } from "react"
import { FaPlus } from "react-icons/fa6"
import { useUserAuth } from "../context/context"
import axios from "axios"
import { VscSend } from "react-icons/vsc";
import { cn } from "../@/lib/utils";
import { Progress } from "../@/components/ui/progress"
import { Input } from "../@/components/ui/input";
import { RxCross2 } from "react-icons/rx";
import toast from "react-hot-toast";

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
  const [feedback, setFeedback] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState(true)
  const [input, setInput] = useState('')
  const [userImage, setUserImage] = useState('');
  const [userBio, setUserBio] = useState('');
  const [credits, setCredits] = useState({
    remain: 0,
    percentage: 0,
    total: 0,
    option:'$9'
  })
  const [trigger, setTrigger] = useState(true)

  const { access, setHash } = useUserAuth()

  useEffect(() => {
    setHash(window.location.hash)
  }, [window.location])


  useEffect(() => {
    if (access) {
      getTemplates(access)
    }
  }, [access])

  async function getCredits() {
    // let config = {
    //   method: 'get',
    //   maxBodyLength: Infinity,
    //   url: 'https://bot.kaliper.in/api/receipent-profile/',
    //   headers: {
    //     'Authorization': `Bearer ${access}`
    //   },
    // };

    // await axios.request(config)
    //   .then((response: any) => {
    //     if (response.data.count_conversation_history) {
    //       setCredits(response.data.count_conversation_history)
    //     }else{
    //       setCredits(false)
    //     }
    //   })

    let config2 = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://bot.kaliper.in/api/auth/user/details/',
      headers: {
        'Authorization': `Bearer ${access}`
      },
    };

    try {
      await axios.request(config2)
        .then((response: any) => {
          console.log(response.data);

          if (response.data) {
            setCredits({
              remain: response.data.plan - response.data.credits,
              percentage: (((response.data.plan-response.data.credits) * 100) / response.data.plan),
              total: response.data.plan,
              option: response.data.options
            })
          } else {
            setCredits({
              remain: 0,
              percentage: 0,
              total: 0,
              option:'$9'
            })
          }
        })
    } catch (error) {
      console.log('ddddd', error);

    }

  }

  useEffect(() => {
    getCredits()
  }, [trigger])


  async function getTemplates(tokken: string) {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://bot.kaliper.in/api/api/templates/',
      headers: {
        'Authorization': `Bearer ${tokken}`
      }
    };

    let config2 = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://bot.kaliper.in/api/feedback/feedback/',
      headers: {
        'Authorization': `Bearer ${tokken}`
      }
    };


    await axios.request(config)
      .then((response: any) => {
        setTemplates(response.data)
      })

    await axios.request(config2)
      .then((response: any) => {
        setFeedback(!response.data.feedback_status)
      })
  }

  async function setFeedbackData(choice: string) {

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://bot.kaliper.in/api/feedback/feedback/',
      headers: {
        'Authorization': `Bearer ${access}`
      },
      data: {
        "product_review": choice,
        "feedback_message": "",
        "feedback_status": true
      }
    };

    await axios.request(config)
    setFeedbackMessage(false)

  }

  async function patchFeedbackData() {

    let config = {
      method: 'patch',
      maxBodyLength: Infinity,
      url: 'https://bot.kaliper.in/api/feedback/feedback/',
      headers: {
        'Authorization': `Bearer ${access}`
      },
      data: {
        "feedback_message": input
      }
    };

    await axios.request(config)

    toast.success('Thanks for your feedback.')
    setFeedback(false)

  }

  async function setUserData() {

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://bot.kaliper.in/api/receipent-profile/',
      headers: {
        'Authorization': `Bearer ${access}`
      },
      data: {
        "bio": userBio,
        "profile_user_name": userName,
        "template": selected,
        "image": userImage
      }
    };

    await axios.request(config)
    setFeedbackMessage(false)

  }

  // Content script to be injected into the LinkedIn page
  const extractUsername = () => {
    const h1Tag = document.querySelector('h1');
    return h1Tag ? h1Tag.innerText : '';
  };


  const extractImageURL = () => {
    const imageElement = document.querySelector('img.pv-top-card-profile-picture__image');
    return imageElement && imageElement instanceof HTMLImageElement ? imageElement.src : '';
  };

  const extractData = () => {
    const element = document.querySelector('.text-body-medium.break-words');
    return element ? element.textContent?.trim() ?? '' : '';
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

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      chrome.scripting.executeScript(
        {
          target: { tabId: currentTab.id },
          function: extractImageURL,
        },
        (result) => {
          const extractedImageURL = result[0].result;
          setUserImage(extractedImageURL);
        }
      );
    });

  }, []);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      chrome.scripting.executeScript(
        {
          target: { tabId: currentTab.id },
          function: extractData,
        },
        (result) => {
          const extractedImageURL = result[0].result;
          setUserBio(extractedImageURL);
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
    console.log('xxxxx', modifiedString);
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

  function setMessage(content: string) {

    const messageBox = document.querySelector('.msg-form__contenteditable');

    if (messageBox instanceof HTMLElement) {
      messageBox.setAttribute('data-artdeco-is-focused', 'true');
      messageBox.focus();
      var pTag = document.querySelector('.msg-form__contenteditable p') as HTMLElement;

      if (pTag && content) {
        pTag.innerHTML = content;
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
    setTrigger((prev) => !prev)
    setTimeout(() => {
      handleClickSetMessage()
    }, 1000);
  }

  function nameReplace(content: string) {
    let extractedText = content.split(',');

    extractedText.shift()

    let newString = `Dear ${userName}, ` + extractedText.join(',');

    return newString
  }

  if (userImage.length < 1) {
    return (
      <main className="p-4 h-[90%] flex items-center justify-center" >
        <div
          style={{
            boxShadow: '0px 8px 36.9px 0px rgba(0, 0, 0, 0.12)'
          }}
          className="font-semibold flex flex-col items-center gap-3 bg-white p-3 rounded-xl" >
          <img className="h-14" src="/user.svg" alt="user" />
          <p className="text-[#00000066] text-xl" >To send AI-generated personalized messages, <span className="text-black" >please open  their profile</span></p>
        </div>
      </main>
    )
  }

  return (
    <main className=" overflow-y-scroll bg-[#EAF4FF] px-6 -mt-[53px] h-full" >
      {credits.total - credits.remain > 0 ?
        <button className="bg-white m-auto mt-20 hover:bg-customBlueDisable border border-customBlue text-customBlue py-2 rounded-md items-center flex flex-row gap-1 px-14 " >
          <FaPlus />
          <a className="font-semibold" href="#template" >Create template</a>
        </button>
        :
        <div className="mt-20 h-10" />
      }

      {feedback &&
        <>
          {feedbackMessage
            ? <div className="flex rounded-lg text-xs mt-3 bg-white gap-2 px-10 py-4 border border-[#DCDCDC]  flex-col items-center" >
              <h2 className=" font-medium text-center text-xl" >Did the extension fulfill your needs?</h2>
              <div className="flex flex-row w-full items-center gap-3 justify-center" >
                <span
                  onClick={() => setFeedbackData('yes')}
                  className="rounded-lg border flex flex-col px-10 py-3 cursor-pointer transition-all hover:scale-95 duration-300 items-center justify-center gap-2" >
                  <img src="/yes.svg" alt="yes" />
                  <h2>Yes</h2>
                </span>
                <span
                  onClick={() => setFeedbackData('no')}
                  className="rounded-lg border flex flex-col px-10 py-3 cursor-pointer transition-all hover:scale-95 duration-300 items-center justify-center gap-2" >
                  <img src="/no.svg" alt="no" />
                  <h2>No</h2>
                </span>
              </div>
            </div>
            : <div className="flex relative rounded-lg text-xs mt-3 bg-white gap-2.5 px-4 py-4 border border-[#DCDCDC]  flex-col items-center" >
              <h2 className=" font-medium text-center text-xl" >Let us know how we can improve the extension.</h2>
              <Input onChange={(e) => setInput(e.target.value)} className="w-full" placeholder="Share your thoughts" />
              <button
                disabled={input.length === 0}
                onClick={() => patchFeedbackData()}
                className={cn(
                  " m-auto py-2 rounded-md text-white items-center flex flex-row gap-1 px-14 ",
                  input.length === 0 ? "bg-customBlueDisable" : "bg-customBlue hover:bg-customBlueHover"
                )} >
                Submit
              </button>
              <button className="absolute top-1 right-1" onClick={() => setFeedback(false)}>
                <RxCross2 />
              </button>
            </div>
          }
        </>
      }

      <div className="flex rounded-lg text-xs mt-3 bg-white gap-2 p-4 border border-[#DCDCDC]  flex-col items-center" >
        <div className="flex flex-row w-full items-center justify-between" >
          <div className="flex flex-row items-center gap-2" >
            <img src="/premium.svg" alt="user" />
            {credits.remain}/{credits.total}
          </div>
          {credits.option !=='$49' ?
          <a href='https://blueparrotai.com/dashboard/plans' target='_blank' className="bg-[#CDE6FF] rounded-full px-2 py-1 text-xs text-[#0A66C2]" >
            Upgrade to premium
          </a>
          :
          <div></div>
          }
        </div>
        <Progress className="rounded-none h-1" color="#29C4FF" value={credits.percentage} />
      </div>

      {credits.total - credits.remain > 0
        ?
        <div className=" bg-white h-96 mb-32 rounded-md mt-3" >
          <div className="flex gap-2 text-xs p-4 border border-b-1 border-t-0 border-r-0 border-l-0  flex-row items-center" >
            <img className="h-10 rounded-full" src={userImage} alt="user" />
            <div  >
              <h3 className="text-[#081230]" >{userName}</h3>
              <h4 className="text-black/50" >{userBio}</h4>
            </div>
          </div>

          <h2 className="text-[#081230] mt-2 px-4" >Tap on the prompt to generate message</h2>

          <div className="space-y-2 h-[220px] overflow-y-scroll px-4 mt-3" >
            {templates.map(t =>
              <div
                onClick={() => { setSelected(t.id); setContent(nameReplace(t.content)) }}
                style={
                  selected == t.id
                    ? { boxShadow: '0px 0px 12px 0px #CDE6FF', border: '1 px solid #0A66C2', background: '#CDE6FF', color: '#0A66C2' }
                    : {}
                }

                className="flex bg-white cursor-pointer hover:scale-95 hover:bg-[#CDE6FF] hover:text-customBlueHover hover:border-0 hover:shadow-none transition-all duration-300 rounded-lg border flex-row items-center gap-1 px-5 py-2"
              >
                <VscSend />
                <p>{t.name}</p>
              </div>
            )}
          </div>

        </div>
        :
        <div
          style={{
            boxShadow: '0px 8px 36.9px 0px rgba(0, 0, 0, 0.12)'
          }}
          className="font-semibold mt-5 flex flex-col items-center gap-3 bg-white p-3 rounded-xl" >
          <p className="text-[#00000066] text-center text-xl" >You've run out of messaging credits <span className="text-black" >Please purchase more to continue accessing the service.</span></p>
          <a href='https://blueparrotai.com/dashboard/plans' target='_blank' className="bg-[#0A66C2] text-white font-semibold px-14 py-1.5 rounded-sm" >
            Get Premium
          </a>
        </div>
      }

      <div
        style={{
          boxShadow: "0px -4px 34.1px 0px rgba(0, 0, 0, 0.12)"
        }}
        className="absolute flex bg-white justify-between items-center left-0 w-full m-auto bottom-0 h-20" >
        <button
          onClick={() => { sendMessage(); setUserData() }}
          disabled={selected.length === 0}
          className={cn(
            " m-auto py-2 rounded-md text-white items-center flex flex-row gap-1 px-14 ",
            selected.length === 0 ? "bg-customBlueDisable" : "bg-customBlue hover:bg-customBlueHover"
          )} >
          <FaPlus />
          <p >Send Message</p>
        </button>
      </div>

    </main>
  )
}

export default Templates