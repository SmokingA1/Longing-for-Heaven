import React, { useState } from "react";
import ProductImageForm from "./ProductImageForm";


interface ProductFormProps {
    isVisible: boolean;
    setIsVisible: (value: boolean) => void;
}

interface ProductCreateProps {
    name: string;
    description: string;
    price: number | null;
    stock: number | null;
}


const ProductForm: React.FC<ProductFormProps> = ({isVisible, setIsVisible}) => {
    const [productCreate, setProductCreate] = useState<ProductCreateProps>({
        name: "",
        description: "",
        price: null,
        stock: null,
    })
    const [isPIFormVisible, setIsPIFormVisible] = useState<boolean>(false);
    if (!isVisible) return null;

    return(
        <>
            <div id="blur" className="fixed left-0 top-0 h-full w-full z-20 backdrop-blur-xs" onClick={() => setIsVisible(false)}></div>

            <div className="w-250 h-230 rounded-xl fixed top-1/2 left-1/2 bg-white z-30 -translate-x-1/2 -translate-y-1/2 p-5 shadow-md text-center"> 
                <h2>ADD NEW PRODUCT</h2>
                <form 
                    className="w-full flex flex-col     items-center gap-5 text-left"
                    onSubmit={() => console.log("Hello")
                }>

                    <div className="w-1/2 flex flex-col gap-2">
                        <label htmlFor="name-product-field">Name</label>
                        <input 
                            id="name-product-field"
                            className="px-2 border-b-1 border-dotted border-black w-3/4 text-md sm:text-lg outline-0 rounded-t-md"
                            type="text" 
                            placeholder="Enter the product name"
                            name="name-product"
                            autoComplete="name-product"
                            required
                            maxLength={255}
                            value={productCreate.name}
                            onChange={(e) => setProductCreate({ ...productCreate, name: e.target.value})}

                        />

                        <label htmlFor="description-product-field">Description</label>
                        <textarea 
                            id="description-product-field"
                            className="px-2 border-1 border-dotted resize-none border-black w-full h-50 text-md sm:text-lg outline-0 rounded-md"
                            placeholder="Enter the product description"
                            name="description-product"
                            autoComplete="description-product"
                            required
                            maxLength={255}
                            value={productCreate.description}
                            onChange={(e) => setProductCreate({ ...productCreate, description: e.target.value})}

                        />

                    </div>


                    <div className="w-1/2 flex flex-col gap-2">
                        <label htmlFor="price-product-field">Enter the price of product.</label>

                        <input 
                            id="price-product-field"
                            className="px-2 border-b-1 border-dotted border-black w-1/2 text-md sm:text-lg outline-0 rounded-t-md"
                            type="number" 
                            placeholder="Enter price"
                            name="price-product"
                            autoComplete="price-product"
                            required
                            value={productCreate.price ?? ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                setProductCreate({ 
                                    ...productCreate, 
                                    price: value === "" ? null : Number(value)
                                });
                            }}

                            
                        />
                        <label htmlFor="stock-product-field">Enter the  of products on stockpile.</label>
                        <input 
                            id="stock-product-field"
                            className="px-2 border-b-1 border-dotted border-black w-1/2 text-md sm:text-lg outline-0 rounded-t-md"
                            type="number" 
                            placeholder="Enter quantity"
                            name="stock-product"
                            autoComplete="stock-product"
                            required
                            maxLength={255}
                            value={productCreate.stock ?? ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                setProductCreate({ 
                                    ...productCreate, 
                                    stock: value === "" ? null : Number(value)
                                });
                            }}
                        />

                    </div>

                    <div onClick={() => setIsPIFormVisible(true)} className="w-70 h-70 border-1 bg-slate-300 hover:opacity-80 duration-120 shadow-sm  cursor-pointer text-5xl flex rounded-xl items-center justify-center" >

                        +


                    </div>

                    <button className="w-80 py-2 mt-5 bg-indigo-300 rounded-xl ease-in duration-120 cursor-pointer text-white hover:bg-indigo-400">ADD PRODUCT</button>
                </form>

            </div>
            <ProductImageForm isVisible={isPIFormVisible} setIsVisible={() => setIsPIFormVisible(false)}/>
        </>
    )
}

export default ProductForm;