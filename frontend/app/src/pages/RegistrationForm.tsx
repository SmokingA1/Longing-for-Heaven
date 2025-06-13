import React from "react";
import longingForHeavenTitle from "../assets/LongingForHeaven24.png"
import RegistrationForm from "../components/RegistrationForm";

const RegistrationPage: React.FC = () => {

    return(
        <>
        <div id="container-register" className="bg-purple-50 w-full h-full flex flex-col gap-5 items-center py-8">
            <img src={longingForHeavenTitle} alt="store logo" className="max-w-9/10"/>
            <RegistrationForm />
        </div>
        </>
    )
}

export default RegistrationPage;