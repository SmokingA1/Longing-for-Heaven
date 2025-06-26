import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Contacts from "../components/Contacts";

const ContactsPage: React.FC = () => {

    useEffect(() => {
        document.title = "Home - Contacts - Longing for Heaven"
    }, [])

    return(
        <div id="home-layout" className="flex flex-col items-center w-full min-h-screen relative overflow-x-hidden">
            <Header />
            <Contacts />
            <Footer />
        </div>
        
    )
}

export default ContactsPage;