import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router";



interface ProductProps {
    id: string;
    name: string;
    description: string;
    price: number;
    images: ProductImageProps[];
}

interface ProductImageProps {
    id: string;
    photo_url: string;
    product_id: string;
}


const Main: React.FC = () => {
    const [hoverEl, setHoverEl] = useState<string | null>(null);
    const [products, setProducts] = useState<ProductProps[]>();
    const navigate = useNavigate();

    const getProducts = async () => {
        try {
            const response = await api.get("/products/");
            setProducts(response.data);
            console.log(response.data);
        } catch (error: any) {
            if (error.response) {
                console.error("Server error: ", error.response);
            } else {
                console.error("Network or other error: ", error);
            }
        }
    }

    useEffect(() => {
        getProducts();
    }, [])


    return(
        <main className="w-[340px] sm:w-150 lg:w-250 xl:w-300 flex-grow py-20 flex justify-center">
            <article className="h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-rows-[500px] md:grid-rows-[450px] text-sm">
                {products && products.map((product) => (
                    <div key={product.id} className={`flex flex-col h-[500px] w-[300px] bg-white py-10 px-4 items-center  p-2.5 relative rounded-md hover:z-20 overflow-visible ${product.id === hoverEl && "hover:shadow-[0_2px_10px_rgba(0,0,0,0.25)]"}`}   onMouseLeave={() => setHoverEl(null)} >
                        <div className="flex flex-col gap-5 group" onMouseEnter={() => setHoverEl(product.id)}>
                            <img src={`http://localhost:8000/${product.images[0].photo_url}`} alt={product.name} className="cursor-pointer size-[268px] " onClick={() => navigate(`/shop/${product.id}`)}/>
                            <span className="font-normal">{product.name}</span>
                            <span className="flex items-center gap-1">{product.price}
                                <svg fill="#000000" className="size-3" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="64px" height="64px" viewBox="0 0 423.761 423.761" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M342.012,237.535H213.264c12.956-9.977,26.38-19.162,37.94-28.02c2.867-2.19,5.657-4.442,8.411-6.712h82.396 c11.703,0,21.185-9.483,21.185-21.184s-9.481-21.184-21.185-21.184H298.78c5.894-9.026,10.923-18.708,14.623-29.392 c9.528-27.547,4.776-59.267-11.159-83.374C262.057-13.134,179.492-8.639,121.998,21.565c-24.192,12.711-2.778,49.281,21.385,36.587 c28.538-14.992,60.222-21.76,91.431-11.499c21.35,7.019,39.082,26.4,40.932,49.184c2.087,25.827-13.554,47.487-31.599,64.61H81.749 c-11.7,0-21.185,9.484-21.185,21.184c0,11.701,9.484,21.184,21.185,21.184h107.966c-9.859,7.282-19.544,14.78-28.611,23.1 c-3.969,3.652-7.693,7.548-11.195,11.632h-68.16c-11.7,0-21.185,9.481-21.185,21.185c0,11.697,9.484,21.185,21.185,21.185h43.447 c-13.767,38.236-9.431,81.645,21.55,113.604c42.853,44.213,116.362,33.372,166.114,9.132c24.564-11.969,3.073-48.498-21.386-36.588 c-38.515,18.773-109.106,28.839-127.392-22.721c-8.79-24.789-4.176-45.482,7.19-63.422h170.738 c11.703,0,21.185-9.487,21.185-21.185C363.196,247.034,353.715,237.535,342.012,237.535z"></path> </g> </g></svg>
                            </span>

                            <button className={`relative w-full p-2 py-2.5 rounded-sm duration-150 bg-slate-400 hover:bg-slate-400/70 mt-5 ${product.id === hoverEl ? "block" : "block md:hidden"} transition-all cursor-pointer`} onClick={()=>console.log("added to cart")}>
                                Add to cart
                            </button>
                        </div>
                        
                    </div>
                        
                    
                ))}
            </article>

        </main>
    )
}
export default Main;