import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import UserOrders from "../components/UserOrders";
import SideBar from "../components/SideBar";
import SideCart from "../components/SideCart";

const UserOrdersPage: React.FC = () => {



    return(
        <div id="user-profile-layout" className="w-full min-h-screen flex flex-col items-center relative" >
            <Header />
            <UserOrders />
            <Footer />
            <SideBar />
            <SideCart />
        </div>
    )
}

export default UserOrdersPage;