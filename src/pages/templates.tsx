import { useEffect, useState } from "react"
import { FaPlus } from "react-icons/fa6"
import { useUserAuth } from "../context/context"
import axios from "axios"
import { VscSend } from "react-icons/vsc";

interface Email {
  id: number;
  name: string;
  content: string;
  user: string;
}
const Templates = () => {
  const [selected, setSelected] = useState('')
  const [templates, setTemplates] = useState<Email[]>([])

  const {access} = useUserAuth()

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

  return (
    <main>
      <button className="bg-white m-auto hover:bg-customBlueDisable border border-customBlue text-customBlue py-2 rounded-md items-center flex flex-row gap-1 px-14 " >
        <FaPlus />
        <a href="#" >Create template</a>
      </button>

      <div className="mt-5" >
        <h2 className="text-[#081230]" >Tap on the prompt to generate message</h2>

        <div className="space-y-2 mt-3" >
        {templates.map(t =>
          <div
            onClick={() => setSelected(t.id.toString())}
            style={
              selected == t.id.toString()
                ? { boxShadow: '0px 0px 12px 0px #CDE6FF',border: '1 px solid #0A66C2',background:'#CDE6FF',color:'#0A66C2' }
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
    </main>
  )
}

export default Templates