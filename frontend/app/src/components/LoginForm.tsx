import React, { useState } from "react";
import googleIcon from "../assets/google.svg"
import facebookIcon from "../assets/facebook.svg"

const LoginForm: React.FC = () => {
    const [isVisiblePassword, setIsVisiblePassword] = useState<boolean>(false);

    return(
        <form className="w-120 h-140 bg-white border-0 border-black rounded-xl shadow-md shadow-gray-300 flex flex-col items-center gap-6 px-10 py-15 " onSubmit={() => console.log("Hello")}>
            <h2 className="font-normal text-3xl pb-5" >Login</h2>
            <div className="w-full flex flex-row gap-0 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-6">
                    <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z" clipRule="evenodd" />
                </svg>

                <input 
                    className="px-2 border-b-1 border-dotted border-black w-full text-lg outline-0"
                    type="text" 
                    placeholder="Username"
                
                
                />
            </div>
            <div className="w-full flex flex-row gap-0 items-center relative mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-6">
                    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
                </svg>
                <input 
                    className="px-2 border-b-1 border-dotted border-black w-full text-lg outline-0"
                    type={isVisiblePassword ? "text" : "password"}
                    placeholder="Password"
                
                
                />
                <button className="absolute right-0" onClick={() => setIsVisiblePassword(!isVisiblePassword)}>    
                    {isVisiblePassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                        <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l14.5 14.5a.75.75 0 1 0 1.06-1.06l-1.745-1.745a10.029 10.029 0 0 0 3.3-4.38 1.651 1.651 0 0 0 0-1.185A10.004 10.004 0 0 0 9.999 3a9.956 9.956 0 0 0-4.744 1.194L3.28 2.22ZM7.752 6.69l1.092 1.092a2.5 2.5 0 0 1 3.374 3.373l1.091 1.092a4 4 0 0 0-5.557-5.557Z" clipRule="evenodd" />
                        <path d="m10.748 13.93 2.523 2.523a9.987 9.987 0 0 1-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 0 1 0-1.186A10.007 10.007 0 0 1 2.839 6.02L6.07 9.252a4 4 0 0 0 4.678 4.678Z" />
                    </svg>
                    ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                        <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                        <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" clipRule="evenodd" />
                    </svg>
                    )
                    

                    }


                </button>
            </div>
            
            <div className="flex flex-row w-full">
                <input type="checkbox"
                    className="mr-1.5"
                    id="remember-me"
                />
                <label htmlFor="remember-me">Remember me </label>

                <a href="#" className="ml-auto text-blue-400 hover:text-blue-700">
                    Forgot password?
                </a>

            </div>
            <button className="w-full px-8 py-2 my-2 bg-indigo-300 rounded-xl ease-in duration-120 cursor-pointer text-white hover:bg-indigo-400">
                Login

            </button>
            <span>Don't have an account yet?
                <a href="#" className="text-blue-400 ml-1 hover:text-blue-700">
                    Sign up
                </a>
            </span>

            <div className="flex w-full justify-center gap-3 my-auto">
                <img src={googleIcon} alt="Google" className="size-10"/>
                <img src={facebookIcon} alt="Facebook" className="size-10"/>

            </div>
            
        </form>
    )
}

export default LoginForm;