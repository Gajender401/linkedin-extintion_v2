import { FaPlus } from "react-icons/fa6";
const Main = () => {
    return (
        <div className="h-full p-5 w-full flex items-center justify-center" >
            <div className="flex items-center justify-center flex-col gap-2" >

            <h2 className='text-black text-center text-lg' >
                Create template to generate AI personalized message
            </h2>

            <button className="bg-customBlue hover:bg-customBlueHover py-2 rounded-md text-white items-center flex flex-row gap-1 px-14 " >
                <FaPlus />
                <a href="#template" >Create template</a>
            </button>
            </div>
        </div>
    )
}

export default Main