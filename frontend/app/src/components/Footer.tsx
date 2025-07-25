import React from "react";
import { Link } from "react-router";
import inst_logo from "../assets/inst.svg"
const Footer: React.FC = () => {


    return(
        <footer id='container-footer' className="w-full h-100 xl:h-90 relative bottom-0 flex justify-center border-t-[1px] border-gray-100 shadow-[0px_-2px_-4px_rgba(0,0,0,0.25)]">
            <div className="w-85 md:w-125 xl:w-300 flex flex-col md:flex-row md:justify-center items-center md:items-start  gap-20 px-2.5 pt-10 md:pt-20">
                <div className="flex flex-col gap-2.5 items-center xl:justify-start text-sm">
                    <span className="font-medium text-base">NAVIGATE</span>
                    <Link to={'/'}>Home</Link>
                    <Link to={'/shop/'}>Shop</Link>
                    <Link to={'/shipping-and-payment/'}>Shipping and payment</Link>
                    <span>Private policy</span>
                    <Link to={'/contacts'}>Contacts</Link>
                </div>
                
                <div className="flex flex-col gap-2.5 items-center text-sm">
                    <h2 className="font-medium text-base">CONTACTS</h2>
                    <span>smokinga1wm@gmail.com</span>
                    <h2 className="font-medium text-base">SOCIAL NETWORKS</h2>
                    <div className="flex gap-2.5 items-center">
                        <a href="https://t.me/smokingA1">
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48" className="size-10 duration-100 hover:opacity-80">
                                <linearGradient id="BiF7D16UlC0RZ_VqXJHnXa_oWiuH0jFiU0R_gr1" x1="9.858" x2="38.142" y1="9.858" y2="38.142" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#33bef0"></stop><stop offset="1" stopColor="#0a85d9"></stop></linearGradient><path fill="url(#BiF7D16UlC0RZ_VqXJHnXa_oWiuH0jFiU0R_gr1)" d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path><path d="M10.119,23.466c8.155-3.695,17.733-7.704,19.208-8.284c3.252-1.279,4.67,0.028,4.448,2.113	c-0.273,2.555-1.567,9.99-2.363,15.317c-0.466,3.117-2.154,4.072-4.059,2.863c-1.445-0.917-6.413-4.17-7.72-5.282	c-0.891-0.758-1.512-1.608-0.88-2.474c0.185-0.253,0.658-0.763,0.921-1.017c1.319-1.278,1.141-1.553-0.454-0.412	c-0.19,0.136-1.292,0.935-1.745,1.237c-1.11,0.74-2.131,0.78-3.862,0.192c-1.416-0.481-2.776-0.852-3.634-1.223	C8.794,25.983,8.34,24.272,10.119,23.466z" opacity=".05"></path><path d="M10.836,23.591c7.572-3.385,16.884-7.264,18.246-7.813c3.264-1.318,4.465-0.536,4.114,2.011	c-0.326,2.358-1.483,9.654-2.294,14.545c-0.478,2.879-1.874,3.513-3.692,2.337c-1.139-0.734-5.723-3.754-6.835-4.633	c-0.86-0.679-1.751-1.463-0.71-2.598c0.348-0.379,2.27-2.234,3.707-3.614c0.833-0.801,0.536-1.196-0.469-0.508	c-1.843,1.263-4.858,3.262-5.396,3.625c-1.025,0.69-1.988,0.856-3.664,0.329c-1.321-0.416-2.597-0.819-3.262-1.078	C9.095,25.618,9.075,24.378,10.836,23.591z" opacity=".07"></path><path fill="#fff" d="M11.553,23.717c6.99-3.075,16.035-6.824,17.284-7.343c3.275-1.358,4.28-1.098,3.779,1.91	c-0.36,2.162-1.398,9.319-2.226,13.774c-0.491,2.642-1.593,2.955-3.325,1.812c-0.833-0.55-5.038-3.331-5.951-3.984	c-0.833-0.595-1.982-1.311-0.541-2.721c0.513-0.502,3.874-3.712,6.493-6.21c0.343-0.328-0.088-0.867-0.484-0.604	c-3.53,2.341-8.424,5.59-9.047,6.013c-0.941,0.639-1.845,0.932-3.467,0.466c-1.226-0.352-2.423-0.772-2.889-0.932	C9.384,25.282,9.81,24.484,11.553,23.717z"></path>
                            </svg>
                        </a>
                        
                        <a href="https://instagram.com/_smoking_._">
                            <img src={inst_logo} alt="instagram-logo" className="size-9 duration-100 hover:opacity-80" />
                        </a>

                    </div>
                    
                </div>
            </div>

        </footer>
    )
}

export default Footer;
