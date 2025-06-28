import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../store";
import { closeSideCart } from "../features/sideBar/sideBarSlice";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";

const SideCart: React.FC = () => {
    const sideCart = useSelector((state: RootState) => state.ui);
    const [isShow, setIsShow] = useState<boolean>(true);
    const dispatch = useDispatch<AppDispatch>();

    useLockBodyScroll(sideCart.sideCartOpen);
    if (!sideCart.sideCartOpen) return null;

    return(
        <>
        <div id="blur" className="fixed left-0 top-0 h-full w-full z-40 backdrop-blur-xs" onClick={() => dispatch(closeSideCart())}>
        </div>
        <div id='side-bar' className={`fixed right-0 top-0 h-full w-100 bg-white z-50 shadow-lg px-4 py-2.5 ${isShow == true ? "animate-out-here" : "animation-out-away"}`}>
            <div id="cross-x"
                onClick={() => {
                    setIsShow(false);
                    setTimeout(
                        () => {dispatch(closeSideCart()); setIsShow(true)}, 300)
                }}
                className="  top-0 left-0 h-0 w-full relative cursor-pointer"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 w-10 absolute top- right-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </div>

        </div>
        
        </>
        
    )
}

export default SideCart;
