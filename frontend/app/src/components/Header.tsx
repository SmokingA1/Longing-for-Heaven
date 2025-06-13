import React, { useEffect } from "react";
import longingForHeavenTitle from "../assets/LongingForHeaven24.png"
import { useSelector } from "react-redux";
import { type RootState } from "../store";
import { Link } from "react-router";


const Header: React.FC = () => {
    const user = useSelector((state: RootState) => state.user)

    useEffect(() => {
        console.log(user);
    }, [])

    return(
        <header className=" w-full flex justify-center py-2">
            <div id="header-in" className="flex  xl:w-300">
                <div id='l-nav' className=" xl:w-100">
                    <nav id="l-nav-options" className="h-full w-full flex items-center xl:gap-5 xl:text-MD">
                        <a href="#" className="inline">SHOP</a>
                        <a href="#">SHIPPING AND PAYMENT</a>
                        <a href="#">CONTACS</a>
                    </nav>

                </div>
                <div id='title-logo' className="flex justify-center xl:w-100">
                    <img src={longingForHeavenTitle} alt="logo" className="xl:w-80"/>

                </div>
                <div id='r-nav' className=" xl:w-100">
                    <nav id="l-nav-options" className="h-full w-full flex justify-end items-center xl:gap-5 xl:text-md">
                                {user.name ? (
                                    <div className="flex items-center gap-1">
                                        <span>{user.name} </span> 
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
                                        </svg>
                                    </div> 
                                    ) : ( 
                                    <Link to="/login" className="flex items-center gap-1">
                                        <span>Sign in</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                                        </svg>
                                    </Link>
                                    )
                                }
                        <a href="#" className="flex">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                            </svg>

                            SHOPPING CART
                        </a>
                    </nav>

                </div>
            </div>
        </header>
    )
}

export default Header;