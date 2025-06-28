import React from "react";
import { useParams } from "react-router";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Product from "../components/Product";
import SideBar from "../components/SideBar";
import SideCart from "../components/SideCart";

const ProductPage: React.FC = () => {
    const { id } = useParams()

    return(
        <div id="product-layout" className="w-full min-h-screen flex flex-col items-center relative">
            <Header />
            { typeof id == "string" && <Product id={id}/> }
            <Footer />
            <SideBar />
            <SideCart />
        </div>
        
    )
}

export default ProductPage;