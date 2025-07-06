import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import UserProfile from "../components/UserProfile";
import SideBar from "../components/SideBar";
import SideCart from "../components/SideCart";

const UserProfilePage: React.FC = () => {



    return(
        <div id="user-profile-layout" className="w-full min-h-screen flex flex-col items-center relative" >
            <Header />
            <UserProfile />
            <Footer />
            <SideBar />
            <SideCart />
        </div>
    )
}

export default UserProfilePage;