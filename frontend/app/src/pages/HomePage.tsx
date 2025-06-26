import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SideBar from "../components/SideBar";
import Main from "../components/Main";

const HomePage: React.FC = () => {


    useEffect(() => {

        document.title = "Home - Longin for Heaven"
    }, [])

    return(
        <div id="home-layout" className="flex flex-col items-center w-full min-h-screen relative overflow-x-hidden">
            <Header />
            <SideBar />
            <Main />
            <Footer  />
        </div>
    )
}

export default HomePage;