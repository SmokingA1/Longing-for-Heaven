import { useEffect, useState } from "react";
import api from "../api";

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

const useProducts = () => {
    const [products, setProducts] = useState<ProductProps[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {  
                const response = await api.get("/products");
                setProducts(response.data);
            } catch (error: any) {
                if (error.response) {
                    console.error("Fetch error, can not fetch product from server: ", error.response);
                } else {
                    console.error("Network or other error: ", error)
                }
            }
        }

        fetchProducts();
    }, [])
    
    return products
}

export default useProducts;