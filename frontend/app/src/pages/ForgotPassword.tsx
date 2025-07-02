import React, { useState } from "react";
import api from "../api";

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState<string>('');

    const handleSendEmail = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await api.post("/users/reset-password", {"email": email});
            alert(response.data.data);
        } catch (error) {
            console.error(error);
        }
    }

    return(
        <div id="forgot-password-container" className="min-h-screen w-full flex justify-center items-start py-20">
            <form onSubmit={handleSendEmail} className="w-150 border-1 py-10 px-10 flex flex-col gap-2 rounded-md shadow-lg">
                <span>Forgot password?</span>
                <span>Enter your email adress and wait for an email to reset password! </span>
                <div className="flex gap-1" >
                    {/* <label htmlFor="">Email</label> */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>

                    <input
                        className="w-full rounded-t-lg border-b-1 pl-2 outline-0"
                        type="email"
                        placeholder="Enter email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    
                </div>
                <button className="w-100 py-2 my-5 self-center rounded-md bg-blue-200 duration-130 cursor-pointer hover:bg-blue-300/80" type="submit">
                    Send
                </button>
            </form>
        </div>
    )
}

export default ForgotPassword;