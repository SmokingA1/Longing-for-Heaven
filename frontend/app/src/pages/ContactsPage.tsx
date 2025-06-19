import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Contacts from "../components/Contacts";

const ContactsPage: React.FC = () => {


    return(
        <div id="page-layout" className="flex flex-col items-center w-full min-h-screen relative overflow-x-hidden">
            <Header />
            <Contacts />
            <Footer />
        </div>
        
    )
}

export default ContactsPage;