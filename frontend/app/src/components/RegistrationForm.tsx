import React, { useState } from "react";
import { Link } from "react-router";
import { PatternFormat } from "react-number-format";

interface UserRegisterInterface {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    phoneNumber: string | null;
}

const RegistrationForm: React.FC = () => {
    const [isVisiblePassword, setIsVisiblePassword] = useState<boolean>(false);
    const [isVisibleConfirmPassword, setIsVisibleConfirmPassword] = useState<boolean>(false);
    
    const [userRegister, setUserRegister] = useState<UserRegisterInterface>({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: null,
    })

    return(
        <form className="w-120 h-160 bg-white border-0 border-black rounded-xl shadow-md shadow-gray-300 flex flex-col items-center gap-7 px-10 py-12 " onSubmit={() => console.log("Hello")}>
            <h2 className="font-normal text-3xl pb-5" >Sign up</h2>
            <div className="w-full flex flex-row gap-0 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-6 ">
                    <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z" clipRule="evenodd" />
                </svg>

                <input 
                    className="px-2 border-b-1 border-dotted border-black w-full text-lg outline-0 rounded-t-md"
                    type="text" 
                    placeholder="Name"
                    name="username"
                    autoComplete="username"
                    maxLength={50}
                    required
                    value={userRegister.username}
                    onChange={(e) => setUserRegister({...userRegister, username: e.target.value})}
                />

            </div>
            <div className="w-full flex flex-row gap-0 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>

                <input 
                    className="px-2 border-b-1 border-dotted border-black w-full text-lg outline-0 rounded-t-md"
                    type="email" 
                    placeholder="Email"
                    name="email"
                    autoComplete="email"
                    maxLength={255}
                    required
                    value={userRegister.email}
                    onChange={(e) => {
                        setUserRegister({...userRegister, email: e.target.value})
                    }}
                />
            </div>
            <div className="w-full flex flex-row gap-0 items-center relative mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>

                <input 
                    className="px-2 border-b-1 border-dotted border-black w-full text-lg outline-0"
                    type={isVisibleConfirmPassword ? "text" : "password"}
                    placeholder="Password"
                    name="new-password"
                    autoComplete="new-passoword"
                    required
                    value={userRegister.password}
                    maxLength={50}
                    onChange={(e) => {
                        setUserRegister({...userRegister, password: e.target.value})
                    }}
                />
                <button 
                    type="button"
                    className="absolute right-0" 
                    onClick={() => setIsVisibleConfirmPassword(!isVisibleConfirmPassword)}
                >    
                    {isVisibleConfirmPassword ? (
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

            <div className="w-full flex flex-row gap-0 items-center relative mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-6">
                    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
                </svg>
                <input 
                    className="px-2 border-b-1 border-dotted border-black w-full text-lg outline-0"
                    type={isVisiblePassword ? "text" : "password"}
                    placeholder="Confirm password"
                    name="confirm-password"
                    autoComplete="new-passoword"
                    required
                    value={userRegister.confirmPassword}
                    maxLength={50}
                    onChange={(e) => {
                        setUserRegister({...userRegister, confirmPassword: e.target.value})
                    }}
                
                />
                <button 
                    type="button"
                    className="absolute right-0" 
                    onClick={() => setIsVisiblePassword(!isVisiblePassword)}
                >    
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

            <div className="w-full flex flex-row gap-0 items-center relative mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>

                <PatternFormat 
                    className="px-2 border-b-1 border-dotted border-black w-full text-lg outline-0 rounded-t-md"
                    type="text"
                    placeholder="Phone number"
                    value={userRegister.phoneNumber || ""}
                    onValueChange={(e) => {
                        setUserRegister({ ...userRegister, phoneNumber: e.value });
                    }}
                    format="+38 (###) ###-##-##"
                    mask="_"
                />
                
            </div>


            <div className="flex flex-row w-full">
                <input type="checkbox"
                    className="mr-1.5"
                    id="remember-me"
                />
                <label htmlFor="remember-me">I agree all statements in <Link to={"#"} className="underline text-blue-400 hover:text-blue-700" >Terms of service</Link></label>

            </div>
            <button type="submit" className="w-full px-8 py-2 my-1 bg-indigo-300 rounded-xl ease-in duration-120 cursor-pointer text-white hover:bg-indigo-400">
                SIGN UP
            </button>

            <span className="mt-3">Already have an account??
                <Link to="/login" className="text-blue-400 ml-1 hover:text-blue-700">
                    Sign in
                </Link>
            </span>
        </form>
    )
}

export default RegistrationForm;