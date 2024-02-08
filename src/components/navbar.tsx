import { RxCross2 } from "react-icons/rx";
import { IoArrowBack } from "react-icons/io5";
import { useUserAuth } from "../context/context";

const Navbar = () => {
  const { hash, setState } = useUserAuth()

  return (
    <div className="flex bg-white z-50 relative items-center text-3xl p-2 border border-t-0 border-r-0 border-l-0 justify-between" >
      <div>
        {hash === '#template' &&
          <a href="#templates" >
            <IoArrowBack color='#A1A1A1' />
          </a>
        }
      </div>
      <div className="font-extrabold" >
        blue
        <span className='text-[#0A66C2]' >
          parrot
        </span>
      </div>
      <button onClick={() => setState(false)} >
        <RxCross2 color='#A1A1A1' />
      </button>
    </div>
  )
}

export default Navbar