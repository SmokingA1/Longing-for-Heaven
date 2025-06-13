import React, { useEffect } from "react";
import Header from "../components/Header";

const HomePage: React.FC = () => {


    useEffect(() => {

        document.title = "Home - Longin for Heaven"
    }, [])

    return(
        <div id="page-layout" className="flex flex-col items-center w-full">
            <Header />
        </div>
    )
}

export default HomePage;