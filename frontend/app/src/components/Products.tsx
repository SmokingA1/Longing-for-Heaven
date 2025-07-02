import React, {useEffect, useMemo, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router";
import {addToCart} from "../features/cart/cartSlice"
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../store";

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

const Products: React.FC = () => {
    const [hoverElId, setHoverElId] = useState<string | null>(null);
    const [products, setProducts] = useState<ProductProps[] | null>();
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.user);
    const cart = useSelector((state: RootState) => state.cart);
    const navigate = useNavigate();

    const productIdsInCart = useMemo(
        () => new Set(cart.cart_items.map(item => item.product_id)),
        [cart.cart_items]
    );

    
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

    const handleAddToCart = async ( id: string ) => {
        if (!products) return;

        const product = products.find(p => p.id === id);
        if (!product) return;
        if (user.name) {
            try {
                const response = await api.post("/cart-items/create/user", {
                    product_id: product.id,
                    quantity: 1,
                    price: product.price,
                });
                if (response) {
                    dispatch(addToCart({
                        id: response.data.id,
                        cart_id: response.data.cart_id,
                        product_id: response.data.product.id,
                        price: response.data.price,
                        quantity: response.data.quantity,
                        product: {
                            id: response.data.product.id,
                            description: response.data.product.description,
                            price: response.data.product.price,
                            name: response.data.product.name,
                            stock: response.data.product.stock,
                            images: response.data.product.images,
                        }
                    }))
                }
            } catch (error) {
                console.error('Some error: ', error);
            }
        } else {
            dispatch(addToCart(
                {
                    id: crypto.randomUUID(),
                    cart_id: 'guest',
                    price: product.price,
                    quantity: 1,
                    product_id: product.id,
                    product: {
                        id: product.id,
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        stock: product.stock,
                        images: product.images
                    }
                }
            )) 
            console.log("added successfully!")
        }

    }

    useEffect(() => {
        getProducts();
    }, [])

    return(
        <div id="prdoucts-container" className="flex-grow flex md:w-185 lg:w-250 xl:w-300 py-20">
            <aside className="hidden md:flex min-w-70 p-2.5 ">
                <div className="flex bg-white h-30 w-full rounded-md border-[0.5px] border-gray-300 px-5 py-5 flex-col gap-2.5 ">
                    <span className=" font-normal">Filters</span>
                    <div className="w-full h-[1px] bg-gray-200"></div>
                    <span className="w-full flex justify-between items-center">
                        Price 
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                    </span>
                </div>

            </aside>
            <main className="w-full">
                <article className="h-full w-85 md:w-115 lg:w-[700px] xl:w-[900px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 grid-rows-[500px] md:grid-rows-[450px] text-sm">
                    {products && products.map((product) => (
                        <div key={product.id} className={`flex flex-col h-[500px] bg-white py-10 px-4 items-center relative rounded-md hover:z-20 overflow-visible ${product.id === hoverElId && "md:hover:shadow-[0_2px_10px_rgba(0,0,0,0.25)]"}`}   onMouseLeave={() => setHoverElId(null)} >
                            <div className="flex flex-col gap-3 group" onMouseEnter={() => setHoverElId(product.id)}>
                                <img src={`http://localhost:8000/${product.images[0].photo_url}`} alt="" className="cursor-pointer h-[300px] min-w-[268px]" onClick={() => navigate(`/shop/${product.id}`)}/>
                                <span className="font-normal">{product.name}</span>
                                <span className="flex items-center gap-1">{product.price}
                                    <svg fill="#000000" className="size-3" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="64px" height="64px" viewBox="0 0 423.761 423.761" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M342.012,237.535H213.264c12.956-9.977,26.38-19.162,37.94-28.02c2.867-2.19,5.657-4.442,8.411-6.712h82.396 c11.703,0,21.185-9.483,21.185-21.184s-9.481-21.184-21.185-21.184H298.78c5.894-9.026,10.923-18.708,14.623-29.392 c9.528-27.547,4.776-59.267-11.159-83.374C262.057-13.134,179.492-8.639,121.998,21.565c-24.192,12.711-2.778,49.281,21.385,36.587 c28.538-14.992,60.222-21.76,91.431-11.499c21.35,7.019,39.082,26.4,40.932,49.184c2.087,25.827-13.554,47.487-31.599,64.61H81.749 c-11.7,0-21.185,9.484-21.185,21.184c0,11.701,9.484,21.184,21.185,21.184h107.966c-9.859,7.282-19.544,14.78-28.611,23.1 c-3.969,3.652-7.693,7.548-11.195,11.632h-68.16c-11.7,0-21.185,9.481-21.185,21.185c0,11.697,9.484,21.185,21.185,21.185h43.447 c-13.767,38.236-9.431,81.645,21.55,113.604c42.853,44.213,116.362,33.372,166.114,9.132c24.564-11.969,3.073-48.498-21.386-36.588 c-38.515,18.773-109.106,28.839-127.392-22.721c-8.79-24.789-4.176-45.482,7.19-63.422h170.738 c11.703,0,21.185-9.487,21.185-21.185C363.196,247.034,353.715,237.535,342.012,237.535z"></path> </g> </g></svg>
                                </span>

                                <button disabled={productIdsInCart.has(product.id)} className={`mb-5 relative w-full p-2.5 rounded-xs duration-150 bg-slate-400 ${productIdsInCart.has(product.id) ? "" : "hover:bg-slate-400/70 cursor-pointer" }  mt-5 ${product.id === hoverElId ? "block" : "md:hidden"} transition-all`} onClick={() => handleAddToCart(product.id)}>
                                    { productIdsInCart.has(product.id) ? "Already in cart" : "Add to cart"}
                                </button>
                            </div>
                            
                        </div>
                            
                        
                    ))}
                </article>
            </main>
        </div>
        
    )
}

export default Products;