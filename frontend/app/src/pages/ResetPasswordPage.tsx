import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import api from "../api";

interface PasswordInterface {
    newPassword: string;
    confirmPassword: string;
}

const ResetPasswordPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [password, setPassword] = useState<PasswordInterface>({newPassword: '', confirmPassword: ''});

    const navigate = useNavigate()
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.newPassword !== password.confirmPassword) return alert("Passwords do not match!")
        try {
            const response = await api.post("/users/recover-password", {
                "token": token,
                "new_password": password.newPassword
            })
            console.log(response.data);
            if (response) navigate("/login")

        } catch (error) {
            console.error("Error while reseting password", error)
        }
    }

    useEffect(() => {
        if (!token) navigate("/login");
    }, [token, navigate])

    return(
        <div id="recover-password-container" className="min-h-screen flex justify-center items-start py-20">
            <form id="recover-password-form" onSubmit={handleResetPassword} className="w-150 flex flex-col p-10 border border-gray-500 gap-2 rounded-md shadow-lg">
                <h2>Reset password</h2>
                <p className="pb-1">To reset your password, please enter your new password below twice.</p>
                <div id="input-password-wrapper" className="flex py-2 gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                    <input
                        className="w-full rounded-t-lg border-b-1 pl-2 outline-0"
                        type="password"
                        name="new-password"
                        placeholder="Enter new password" 
                        value={password.newPassword}
                        onChange={(e) => setPassword({...password, newPassword: e.target.value})}
                        required
                    />
                </div>
                <div id="input-confirm-password-wrapper" className="flex py-2 gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
                    </svg>

                    <input
                        className="w-full rounded-t-lg border-b-1 pl-2 outline-0"
                        type="password"
                        name="confirm-password"
                        placeholder="Confirm password" 
                        value={password.confirmPassword}
                        onChange={(e) => setPassword({...password, confirmPassword: e.target.value})}
                        required
                    />
                </div>
                <button className="w-100 py-2 mt-5 self-center rounded-md bg-blue-200 duration-130 cursor-pointer hover:bg-blue-300/80" type="submit">
                    Reset password
                </button>
            </form>
        </div>
    )
}

export default ResetPasswordPage;