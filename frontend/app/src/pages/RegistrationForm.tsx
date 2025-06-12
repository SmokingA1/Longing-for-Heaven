import React from "react";
import longingForHeavenTitle from "../assets/LongingForHeaven24.png"
import RegistrationForm from "../components/RegistrationForm";

const RegistrationPage: React.FC = () => {

    return(
        <>
        <div className="bg-purple-50 w-full h-full flex flex-col gap-5 items-center py-8">
            <img src={longingForHeavenTitle} alt="" />
            <RegistrationForm />
        </div>
        </>
    )
}

export default RegistrationPage;