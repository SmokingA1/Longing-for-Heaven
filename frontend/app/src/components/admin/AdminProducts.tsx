import React, {useState, useEffect} from "react";
import api from "../../api";
import ProductForm from "./ProductForm";
import ProductInfo from "./ProductInfo";

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

const AdminProducts: React.FC = () => {
    const [products, setProducts] = useState<ProductProps[]>([])
    const [isProductFormVisible, setIsProductFormVisible] = useState<boolean>(false);
    const [productInfoID, setProductInfoID] = useState<string>('');

    const getProducts = async () => {
        try{
            const response = await api.get("/products");

            setProducts(response.data);
            console.log(response.data);
        } catch (error: any) {
            if (error.response) {
                console.error("Server error", error);
            } else {
                console.error("Network or other error: ", error);
            }
        }
    } 

    const handleRemoveProduct = async (productID: string) => {
        try {
            const response = await api.delete(`/products/delete/${productID}`)
            if (response) {
                getProducts();
            }
        } catch (error: any) {
            if (error.response) {
                console.error("Server error: ", error.response);
            } else {
                console.error("Netowork or other error: ", error);
            }
        }
    }

    useEffect(() => {
        getProducts();
    }, [])
    
    return(
        <>
        <div id="container-admin-products" className="w-full px-1 max-h-full sm:px-5 sm:pb-5 flex flex-col gap-5 relative font-medium">
            <div className="w-full h-10 bg-teal-200 flex justify-center items-center rounded-b-lg relative animate-out-top font-medium">
                Products administrator panel
            </div>
            <div id="content" className="w-full h-full flex gap-5">
                <div id="all-products-container" className="w-full h-full bg-blue-100 rounded-lg p-2.5 flex flex-col gap-5">
                    <table id="all-products" className="max-w-200 divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th scope="col" className="border border-gray-300 w-50 px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th scope="col" className="border border-gray-300 w-15 px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th scope="col" className="border border-gray-300 w-15 px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                <th scope="col" className="border border-gray-300 w-20 px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                <th scope="col" className="border border-gray-300 w-20 px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                            <tr key={product.id} className="cursor-pointer" onClick={() => setProductInfoID(product.id)}>
                                <td scope="col" className="border border-gray-300 w-50 px-1 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider bg-white">{product.name}</td>
                                <td scope="col" className="border border-gray-300 w-15 px-1 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider bg-white">{product.price}</td>
                                <td scope="col" className="border border-gray-300 w-15 px-1 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider bg-white">{product.stock}</td>
                                <td scope="col" className="border border-gray-300 w-20 px-2.5 py-3 text-gray-500 uppercase tracking-wider bg-white">
                                    {product.images.length > 0 && <img className="size-15" src={`http://localhost:8000/${product.images[0].photo_url}`} alt="img-first-picture" />}
                                </td>
                                <td scope="col" className="border border-gray-300 w-30 px-1 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider bg-white" onClick={() => handleRemoveProduct(product.id)}>delete</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="py-2 w-50 text-base text-white bg-gray-400/70 hover:bg-gray-400 duration-120 rounded-lg flex self-center items-center justify-center cursor-pointer" onClick={() => setIsProductFormVisible(true)}>
                        ADD PRODUCT
                    </div>
                </div>

                
            </div>

        </div>
        <ProductForm isVisible={isProductFormVisible} setIsVisible={setIsProductFormVisible}/>
        {productInfoID && <ProductInfo id={productInfoID} setProductInfoID={setProductInfoID}/> }
        
        </>
    )
}

export default AdminProducts;