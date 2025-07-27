import React, {useEffect, useMemo, useRef, useState } from "react";
import api from "../api";
// import { useNavigate } from "react-router";
import {addToCart} from "../features/cart/cartSlice"
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../store";
import ProductCard from "./ProductCard";
import Slider from "@mui/material/Slider"
import useProducts from "../hooks/useProducts";


interface ProductProps {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    images: ProductImageProps[];
    sizes: ProductSizesProps[];
}

interface ProductImageProps {
    id: string;
    photo_url: string;
    product_id: string;
}

interface ProductSizesProps {
    product_id: string;
    size_id: string;
    quantity: number;
    size: {
        id: string;
        name: string;
    }
}




const Products: React.FC = () => {
    const products = useProducts();
    const [filteredProducts, setFilteredProducts] = useState<ProductProps[]>([]);
    const [quantityPage, setQuantityPage] = useState<number>(1);
    const [selectedPage, setSelectedPage] = useState(1);
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.user);
    const cart = useSelector((state: RootState) => state.cart);
    const [filter, setFilter] = useState<number[]>([0, 100])
    const minValue = useRef(0);
    const maxValue = useRef(0);
    const firstRender = useRef(true);
    const productIdsInCart = useMemo(
        () => new Set(cart.cart_items.map(item => `${item.product_id}-${item.size_id}`)),
        [cart.cart_items]
    );

    const PRODCUTS_PER_PAGE = 12;

    const paginatedProducts = useMemo(() => {
        const startIndex = (selectedPage - 1) * PRODCUTS_PER_PAGE;
        const lastIndex = startIndex + PRODCUTS_PER_PAGE
        return filteredProducts.slice(startIndex, lastIndex)
    }, [filteredProducts, selectedPage])

    const handleAddToCart = async ( id: string, size_id: string, maxQuantity: number) => {
        if (!products) return;

        const product = products.find(p => p.id === id);
        if (!product) return;
        const size = product.sizes.find(s => s.size_id == size_id)
        if (!size) return; // ✅ проверка

        if (!product) return;
        if (user.name) {
            try {
                const response = await api.post("/cart-items/create/user", {
                    product_id: product.id,
                    size_id: size_id,
                    quantity: 1,
                    thumbnail: product.images[0].photo_url,
                });
                if (response) {
                    dispatch(addToCart({
                        id: response.data.id,
                        cart_id: response.data.cart_id,
                        size_id: response.data.size_id,
                        product_id: response.data.product.id,
                        thumbnail: response.data.thumbnail,
                        quantity: response.data.quantity,
                        product: {
                            id: response.data.product.id,
                            description: response.data.product.description,
                            price: response.data.product.price,
                            name: response.data.product.name,
                            stock: response.data.product.stock,
                        },
                        size: {
                            id: response.data.size.id,
                            name: response.data.size.name,
                        },
                        max_quantity: maxQuantity
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
                    thumbnail: product.images[0].photo_url,
                    quantity: 1,
                    product_id: product.id,
                    size_id: size_id,
                    product: {
                        id: product.id,
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        stock: product.stock,
                    },
                    size: {
                        id: size_id,
                        name: size.size.name
                    },
                    max_quantity: maxQuantity
                }
            )) 
            console.log("added successfully!")
        }

    }

    const handleChangePrice = (_: Event, newValue: number | number[]) => {
        
        setFilter(newValue as number[]);
    }

    const handleFilterProducts = () => {
        const filteredProducts = products.filter((product) => filter[0] <= product.price && product.price <= filter[1])
        setFilteredProducts(filteredProducts);
    }

    useEffect(() => {
        if (products.length && firstRender.current == true) {
            minValue.current = Math.min(...products.map(product => product.price))
            maxValue.current = Math.max(...products.map(product => product.price))
            setFilter([0, maxValue.current])
            setFilteredProducts(products);
            firstRender.current = false;
        }
    }, [products])

    useEffect(() => {
        setQuantityPage(Math.ceil(filteredProducts.length / PRODCUTS_PER_PAGE))
    })

    
    return(
        <div id="prdoucts-container" className="flex-grow flex w-full justify-center py-20">
            <div id="products-in-container" className="flex w-[340px] sm:w-160 md:w-180 lg:w-250 xl:w-300">
                <aside className="hidden lg:flex lg:w-80  p-2.5 ">
                    <div className="flex bg-white h-50 w-full rounded-md border-[0.5px] border-gray-300 px-5 py-5 flex-col gap-2.5 ">
                        <span className=" font-normal">Filters</span>
                        <div className="w-full h-[1px] bg-gray-200"></div>
                        <span className="w-full flex justify-between items-center">
                            Price 
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                        </span>
                        <span>
                            {maxValue.current > 0 &&
                            <>
                                <Slider 
                                    value={filter}
                                    onChange={handleChangePrice}
                                    onChangeCommitted={handleFilterProducts}
                                    valueLabelDisplay="auto"
                                    min={minValue.current}
                                    max={maxValue.current}
                                />
                                <div className="flex justify-between">
                                    <span>{minValue.current}</span>
                                    <span>{maxValue.current}</span>
                                </div>
                            </>
                            }
                        </span>
                    </div>

                </aside>
                <main className="w-full flex flex-col justify-center sm:w-160 md:w-180 lg:w-170 xl:w-240 ">
                    <h2 className="font-normal text-2xl h-20">Shop</h2>
                    <article className="h-full w-85 sm:w-160 md:w-160 lg:w-160 xl:w-[960px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 auto-rows-[550px] md:auto-rows-[450px] text-sm">
                        {paginatedProducts && paginatedProducts.map((product) => (
                            <ProductCard 
                                key={product.id}
                                product={product}
                                onAddToCart={handleAddToCart}
                                productIdsInCart={productIdsInCart}
                            />
                                
                            
                        ))}
                    </article>
                    <section className="flex mt-30 gap-2.5">
                        { Array.from({length: quantityPage}, (_, index) => (
                            <button 
                                key={index}
                                onClick={() => {setSelectedPage(index+1)}}
                                className={`py-2.5 px-3.5 rounded-sm cursor-pointer duration-120 border border-slate-800 ${selectedPage == index + 1 ? "bg-slate-800 text-white" : "hover:bg-slate-800 hover:text-white "}`}
                            >
                                {index + 1}
                            </button>
                        ))
                        }
                    </section>
                </main>
            </div>
            
        </div>
        
    )
}

export default Products;
