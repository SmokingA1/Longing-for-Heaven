import React, { useEffect } from "react";
import longingForHeavenTitle from "../assets/LongingForHeaven24.png"
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../store";
import { Link } from "react-router";
import { openSideBar } from "../features/sideBar/sideBarSlice";


const Header: React.FC = () => {
    const user = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch<AppDispatch>();


    useEffect(() => {
        console.log(user);
    }, [])

    return(
        <header className=" w-full flex justify-center py-2">
            <div id="header-in" className="flex  xl:w-300">
                <div id='l-nav' className=" xl:w-100">
                    <nav id="l-nav-options" className="h-full w-full flex items-center xl:gap-5 xl:text-[15px]">
                        <Link to="/contacts" className="hover:opacity-80">SHOP</Link>
                        <Link to="/contacts" className="hover:opacity-80">SHIPPING AND PAYMENT</Link>
                        <Link to="/contacts" className="hover:opacity-80">CONTACS</Link>
                    </nav>

                </div>
                <div id='title-logo' className="flex justify-center xl:w-100">
                    <img src={longingForHeavenTitle} alt="logo" className="xl:w-80"/>

                </div>
                <div id='r-nav' className=" xl:w-100">
                    <nav id="l-nav-options" className="h-full w-full flex justify-end items-center xl:gap-5 xl:text-[15px]">
                                {user.name ? (
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700" onClick={() => dispatch(openSideBar())}>
                                        <span>{user.name} </span> 
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
                                        </svg>
                                    </div> 
                                    ) : ( 
                                    <Link to="/login" className="flex items-center gap-1 hover:text-gray-700">
                                        <span>Sign in</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                                        </svg>
                                    </Link>
                                    )
                                }
                        <a href="#" className="flex gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                            </svg>
                            <span className="hover:text-gray-700">SHOPPING CART</span>
                        </a>
                    </nav>

                </div>
            </div>
        </header>
    )
}

export default Header;