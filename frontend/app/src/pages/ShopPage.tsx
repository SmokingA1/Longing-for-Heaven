import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Products from "../components/Products";

const ShopPage: React.FC = () => {
    
    useEffect(() => {
        document.title = "Home - Shop - Longing for Heaven"

    },[])

    return(
        <div id="shop-layout" className="w-full min-h-screen flex flex-col items-center relative">
            <Header />
            <Products />
            <Footer />
        </div>
    )
}

export default ShopPage;
