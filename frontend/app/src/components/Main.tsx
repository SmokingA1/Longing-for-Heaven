import React, { useMemo } from "react";
import api from "../api";
import ProductCard from "./ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../store";
import { addToCart } from "../features/cart/cartSlice";
import useProducts from "../hooks/useProducts";

const Main: React.FC = () => {
    const user = useSelector((state: RootState) => state.user)
    const cart = useSelector((state: RootState) => state.cart)
    const products = useProducts();
    const dispatch = useDispatch<AppDispatch>()

    const productIdsInCart = useMemo(
        () => new Set(cart.cart_items.map(item => `${item.product_id}-${item.size_id}`)),
        [cart.cart_items]
    );

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

    return(
        <main className="w-[340px] sm:w-150 lg:w-250 xl:w-300 flex-grow py-20 flex justify-center">
            <article className="h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-rows-[500px] md:grid-rows-[450px] text-sm">
                {products && products.map((product) => (
                    <ProductCard 
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                        productIdsInCart={productIdsInCart}
                    />
                ))}
            </article>

        </main>
    )
}
export default Main;