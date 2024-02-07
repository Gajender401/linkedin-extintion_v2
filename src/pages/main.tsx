import { useEffect, useState } from "react"
import { FaPlus } from "react-icons/fa6"
import { useUserAuth } from "../context/context"
import axios from "axios"
import Templates from "./templates";

interface Template {
  id: string;
  name: string;
  content: string;
  user: string;
}


const Main = () => {
  const [templates, setTemplates] = useState<Template[]>([])
  const { access } = useUserAuth()
  const [userImage, setUserImage] = useState('');
  const [credits, setCredits] = useState(0)


  useEffect(() => {

    const imageElement = document.querySelector('img.pv-top-card-profile-picture__image');
    if (imageElement && imageElement instanceof HTMLImageElement) {
      setUserImage(imageElement.src)
    } 

  }, []);

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

    let config2 = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://bot.kaliper.in/api/auth/user/details/',
      headers: {
        'Authorization': `Bearer ${tokken}`
      }
    };

    axios.request(config)
      .then((response: any) => {
        setTemplates(response.data)
      })

    axios.request(config2)
      .then((response: any) => {
        console.log('xxxx', response.data.credits);

        setCredits(response.data.credits)
      })
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
    <div className="h-full bg-[#EAF4FF]  " >
      {templates.length === 0 && credits !== 0
        ? <div className="h-full p-5 -mt-[53px] w-full flex items-center justify-center" >
          <div
            style={{
              boxShadow: '0px 8px 36.9px 0px rgba(0, 0, 0, 0.12)'
            }}
            className="flex bg-white p-2 px-6 rounded-lg items-center justify-center flex-col gap-2" >
            <h2 className='text-black text-center text-lg' >
              Create template to generate AI personalized message
            </h2>

            <h3 className="text-xs font-light" >Use the same templates for messaging different people</h3>

            <button className="bg-customBlue hover:bg-customBlueHover py-2 rounded-md text-white items-center flex flex-row gap-1 px-14 " >
              <FaPlus />
              <a href="#template" >Create template</a>
            </button>
          </div>
        </div>
        : <Templates />
      }

    </div>
  )
}

export default Main