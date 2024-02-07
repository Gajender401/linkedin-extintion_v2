
const Login = () => {
    return (
        <div className="h-screen b-login bg-[#EAF4FF] flex items-center justify-center flex-col" >
            <h2 className='text-2xl font-semibold mb-8' >Login to blueparrot</h2>
            <a href="https://blueparrotai.com/sign-in" target="_blank">
                <button className='bg-[#0A66C2] hover:scale-105 transition-all duration-200 rounded-sm text-white font-semibold text-base py-1.5 px-16 mb-5' >
                    Login
                </button>
            </a>
            <p>
                Don’t have an account {' '}
                <a className='text-[#0A66C2]' href='https://blueparrotai.com/' target='_blank' >
                    Sign Up
                </a>
            </p>
        </div>
    )
} 

export default Login