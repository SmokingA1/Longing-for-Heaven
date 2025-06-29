import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../store";
import { closeSideCart } from "../features/sideBar/sideBarSlice";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { useNavigate } from "react-router";
import { removeFromCart, incrementQTY, decrementQTY } from "../features/cart/cartSlice";

const SideCart: React.FC = () => {
    const sideCart = useSelector((state: RootState) => state.ui);
    const cart = useSelector((state: RootState) => state.cart);
    const [isShow, setIsShow] = useState<boolean>(true);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
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
            <div id="cart-items-container" className="flex flex-col mt-10 gap-2.5 overflow-auto max-h-[800px]">
                { cart.items.length > 0 && cart.items.map((cartItem) => (
                    <div key={cartItem.id} className="w-[350px] h-30 flex">
                        <img src={`http://localhost:8000/${cartItem.product.images[0].photo_url}`} alt="cart-item" onClick={() => navigate(`/shop/${cartItem.product_id}`)} className="size-30"/>
                        <div id="info" className="flex flex-col w-full gap-1.5 pb-2.5">
                            <span className="text-xl">{cartItem.product.name}</span>
                            <div id="price-increment" className="flex justify-between">
                                <span>{cartItem.price}</span>
                                
                                <div className="flex border-1 border-slate-100 w-20 items-center justify-evenly">
                                    <button className="w-8 hover:bg-gray-100 cursor-pointer" onClick={() => dispatch(decrementQTY(cartItem.id))}>-</button>
                                    <span className="w-4 text-center">{cartItem.quantity}</span>
                                    <button className="w-8 hover:bg-gray-100 cursor-pointer" onClick={() => dispatch(incrementQTY(cartItem.id))}>+</button>
                                </div>
                                

                            </div>
                            <button onClick={() => dispatch(removeFromCart(cartItem.id))} className="hover:text-slate-700 mt-auto cursor-pointer">Remove</button>
                        </div>
                    </div>
                ))}
            </div>

        </div>
        
        </>
        
    )
}

export default SideCart;
