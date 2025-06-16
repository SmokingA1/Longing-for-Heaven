import React, {useState, useEffect} from "react";
import api from "../../api";
import ProductForm from "../ProductForm";

interface ProductProps {
    id: string;
    name: string;
    descripiton: string;
    price: number;
    stock: number;
    images: ProductImageProps[];
}

interface ProductImageProps {
    id: string;
    photo_url: string;
    product_id: string;
}

const AdminProducts: React.FC = () => {
    const [products, setProducts] = useState<ProductProps[]>([])
    const [isProductFormVisible, setIsProductFormVisible] = useState<boolean>(false);


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
                <div id="all-products-container" className="min-w-140 h-full bg-blue-100 rounded-lg p-2.5">
                    <table id="all-products" className="max-w-240 divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th scope="col" className="border border-gray-300 w-50 px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th scope="col" className="border border-gray-300 w-30 px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th scope="col" className="border border-gray-300 w-30 px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                <th scope="col" className="border border-gray-300 w-20 px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                            <tr key={product.id} className="hover:opacity-90 cursor-pointer" onClick={() => console.log("hello")}>
                                <td scope="col" className="border border-gray-300 w-50 px-1 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider bg-white">{product.name}</td>
                                <td scope="col" className="border border-gray-300 w-30 px-1 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider bg-white">{product.price}</td>
                                <td scope="col" className="border border-gray-300 w-30 px-1 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider bg-white">{product.stock}</td>
                                <td scope="col" className="border border-gray-300 w-20 px-2.5 py-3 text-gray-500 uppercase tracking-wider bg-white">
                                    <img className="size-15" src={`http://localhost:8000/${[product.images[0].photo_url]}`} alt="img-first-picture" />
                                </td>

                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="w-50 h-30 bg-blue-300 hover:bg-blue-200 rounded-lg flex items-center justify-center cursor-pointer" onClick={() => setIsProductFormVisible(true)}>
                        ADD PRODUCT
                </div>
            </div>

        </div>
        <ProductForm isVisible={isProductFormVisible} setIsVisible={setIsProductFormVisible}/>
        </>

    )
}

export default AdminProducts;