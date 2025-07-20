import React, { useEffect } from "react";
import "../styles/pages/LoginPage.css"
import LoginForm from "../components/LoginForm";
import longingForHeavenTitle from "../assets/LongingForHeaven24.png"

const LoginPage: React.FC = () => {


    useEffect(() => {
        document.title = "Login - Longing for Heaven"
    }, [])

    return(
        <>
        <div id="container-login" className="bg-purple-50 w-full h-full flex flex-col gap-5 items-center py-8">
            <img src={longingForHeavenTitle} alt="store logo" className="max-w-9/10" />
            <LoginForm />
        </div>
        </>
        
    )
}

export default LoginPage;