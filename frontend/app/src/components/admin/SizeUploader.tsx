import React, { useEffect, useState } from "react";
import api from "../../api";

interface SizeUploaderProps {
    stock: number;
    sizes: SizeCreateIntreface[]; // ← добавляем сюда
    setSizes: React.Dispatch<React.SetStateAction<SizeCreateIntreface[]>>;
}

interface SizesInterface {
    id: string;
    name: string;
}

interface SizeCreateIntreface {
    id: string;
    name: string;
    quantity: number;
}


const SizeUploader: React.FC<SizeUploaderProps> = ({stock, sizes, setSizes}) => {
    const [allowSizes, setAllowSizes] = useState<SizesInterface[]>([]);
    const [isMore, setIsMore] = useState<boolean>(false);
    const getSizes = async () => {
        try {
            const response = await api.get("/sizes");
            setAllowSizes(response.data);
        } catch (error) {
            console.error("Some error", error);
        }
    }

    useEffect(() => {
        
        const ismore = sizes.reduce((sum, ns) => sum + ns.quantity, 0)
        if( ismore > stock) {
            setIsMore(true);
        } else {
            setIsMore(false);
        }
    }, [sizes])

    useEffect(() => {
        getSizes();
    }, [])
    return(
        <div id="handler-sizes" className="w-110 py-5 flex flex-col border-t-1 border-gray-300">
            
            <span className="">Current stock: {stock}</span>
            <span className="self-center">Add size</span>
            <div className="flex gap-1 w-full">
                {allowSizes.length > 0 && allowSizes.map((size) => (
                    <div key={size.id} onClick={() => {
                        setSizes(prev => [...prev, {id: size.id, name: size.name, quantity: 0}]);
                        setAllowSizes(prev => prev.filter(temp_size => temp_size !== size))
                        }}
                        className="border-1 text-xl w-10 text-center rounded-sm border-gray-400 hover:bg-gray-400 duration-120 ease-in cursor-pointer"    
                    >
                        {size.name} 
                    </div>
                ))}
            </div>
            <div id="selected-sizes" className="flex flex-col gap-2.5 mt-5">
                {sizes.length > 0 && sizes.map((size) => (
                    <div key={size.id} className="flex" >
                        <div className="w-30">
                            <span>Size: {size.name}</span>
                        </div>
                        <input
                            className="border-b-1 border-dotted outline-none"
                            type="text"
                            placeholder="Enter quantity"
                            value={sizes.find(temp_size => temp_size.id == size.id)?.quantity}
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                setSizes(prev =>
                                    prev.map(s => 
                                    s.id === size.id ? {...s, quantity: value} : s
                                )
                            )
                            }}
                        />
                    </div>
                    
                ))}          
            </div>
            {isMore === true && <span>Quantity cannot bigger than quantity on stock, please check your records or it can be being the error in future</span>}
        </div>
    )
}


export default SizeUploader;