import React, { useEffect } from "react";
import Header from "../components/Header";
import SideBar from "../components/SideBar";

const HomePage: React.FC = () => {


    useEffect(() => {

        document.title = "Home - Longin for Heaven"
    }, [])

    return(
        <div id="page-layout" className="flex flex-col items-center w-full h-full">
            <Header />
            <SideBar />
        </div>
    )
}

export default HomePage;