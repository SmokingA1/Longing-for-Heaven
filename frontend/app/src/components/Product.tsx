import React, { useState, useEffect } from "react";
import api from "../api";
// import { useNavigate } from "react-router";



interface ProductProps {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    images: ProductImageProps[];
}

interface ProductImageProps {
    id: string;
    photo_url: string;
    product_id: string;
}




const Product: React.FC<{id: string}> = ({ id }) => {
    const [product, setProduct] = useState<ProductProps | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    // const navigate = useNavigate()

    useEffect(() => {
        const getProduct = async () => {
            try {
                const response = await api.get(`/products/${id}`);
                setProduct(response.data);
            } catch (error: any) {
                if (error.response) {
                    console.error("Server error: ", error.response);
                } else {
                    console.error("Network or other error: ", error);
                }
            }
        }
        
        getProduct();
    }, [id])

    useEffect(() => {
        if (product) {
            document.title = `Home - Shop - ${product.name} - Longing for Heaven`
        }
    }, [product]);

    if (!product) return <div className="flex-grow w-300 justify-center items-center">Loading...</div>;

    
    return(
        <div id="product-container" className="flex-grow h-200 flex w-300 pt-20 pb-10   " >
            <div id="product-in-container" className="w-full flex gap-2.5 bg-white">

                <div id="product-picture-content" className="flex">
                    <div id="selector-pictures" className="flex flex-col mx-5 gap-2.5">
                        <div className="size-20 bg-black"></div>
                        <div className="size-20 bg-black"></div>
                        <div className="size-20 bg-black"></div>
                        <div className="size-20 bg-black"></div>
                    </div>
                    <div id="selected-picture" className="w-130 flex justify-center">
                        <img src={`http://localhost:8000/${product.images[0].photo_url}`} alt="selected picture" className="size-110"/>
                    </div>
                </div>

                <div id="product-info-options" className="flex flex-col gap-7.5 w-full">
                    <div className="text-xl font-medium">{product.name}</div>


                    <div className="text-xl flex items-center gap-1 ">
                        <span>{product.price}</span>
                        <svg fill="#000000" className="size-3.5" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="64px" height="64px" viewBox="0 0 423.761 423.761" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M342.012,237.535H213.264c12.956-9.977,26.38-19.162,37.94-28.02c2.867-2.19,5.657-4.442,8.411-6.712h82.396 c11.703,0,21.185-9.483,21.185-21.184s-9.481-21.184-21.185-21.184H298.78c5.894-9.026,10.923-18.708,14.623-29.392 c9.528-27.547,4.776-59.267-11.159-83.374C262.057-13.134,179.492-8.639,121.998,21.565c-24.192,12.711-2.778,49.281,21.385,36.587 c28.538-14.992,60.222-21.76,91.431-11.499c21.35,7.019,39.082,26.4,40.932,49.184c2.087,25.827-13.554,47.487-31.599,64.61H81.749 c-11.7,0-21.185,9.484-21.185,21.184c0,11.701,9.484,21.184,21.185,21.184h107.966c-9.859,7.282-19.544,14.78-28.611,23.1 c-3.969,3.652-7.693,7.548-11.195,11.632h-68.16c-11.7,0-21.185,9.481-21.185,21.185c0,11.697,9.484,21.185,21.185,21.185h43.447 c-13.767,38.236-9.431,81.645,21.55,113.604c42.853,44.213,116.362,33.372,166.114,9.132c24.564-11.969,3.073-48.498-21.386-36.588 c-38.515,18.773-109.106,28.839-127.392-22.721c-8.79-24.789-4.176-45.482,7.19-63.422h170.738 c11.703,0,21.185-9.487,21.185-21.185C363.196,247.034,353.715,237.535,342.012,237.535z"></path> </g> </g></svg>

                    </div>
                    <form className="w-full flex gap-5" onSubmit={() => console.log("Hello world")}>
                        <div className="flex border-1 border-gray-200 gap-2.5 px-2.5">
                            <button type="button" className="text-3xl cursor-pointer" onClick={() => setQuantity((prev) => prev > 1 ? prev-=1 : prev)}>
                                -
                            </button>
                            <input
                                className="py-2 w-12.5 text-center text-xl" 
                                type="text"
                                value={quantity}
                                maxLength={2}
                                readOnly 
                            />
                            <button type="button" className="text-2xl cursor-pointer" onClick={() => setQuantity((prev) => prev < product.stock ? prev+=1 : prev)}>
                                +
                            </button>
                        </div>
                        <button className="py-2 bg-slate-300 w-full">
                            Add to cart
                        </button>
                    </form>
                    

                    <div>
                        <span>{product.description}</span>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Product;