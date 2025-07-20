import React from "react";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import SideCart from "../components/SideCart";
import Footer from "../components/Footer";
import Checkout from "../components/Checkout";

const CheckoutPage: React.FC = () => {


    return(
        <div id="chekcout-layout" className="flex flex-col items-center w-full h-350 min-h-screen relative overflow-x-hidden">
            <Header />
            <Checkout />
            <Footer />
            <SideBar />
            <SideCart />
        </div>
    )
}

export default CheckoutPage;