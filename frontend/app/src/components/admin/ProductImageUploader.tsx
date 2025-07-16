import React, { useState, useEffect } from "react";

interface Props {
    onSetFiles: (files: File[]) => void;
}

const ProductImageUploader: React.FC<Props> = ({onSetFiles}) => {
    const [files, setFiles] = useState<File[]>([])
    const [previews, setPreviews] = useState<string[]>([]);
    const [selectedID, setSelectedID] = useState<number>(0);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(e.target.files || []);
        if (selected.length + files.length > 5) return;
        setFiles(prev => [...prev, ...selected]);


        const newPreviews = selected.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews])
        
    }


    useEffect(() => {
        onSetFiles(files);
    }, [files]);

    return(
        <div className="flex flex-col w-100 items-center">
            <span className="self-center">Choose Photo</span>
            <div className="w-full h-100 flex flex-col items-center">
                <input
                    className="flex h-10"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                />
                <div id="wrapper" className="w-full my-5 h-75 flex justify-center">
                    {previews.length > 0 && (
                    <div id="spinner" className="h-75 w-[270px] flex overflow-auto      snap-x snap-mandatory  relative ">
                        {previews.map((preview, i) => 
                            selectedID === i && (
                            <div className="snap-center">
                                <img className="h-[300px] min-w-[270px]" src={preview} alt="" />
                            </div>
                            )
                            

                        )}
                        <div onClick={() => setSelectedID(prev => prev > 0 ? prev -= 1 : previews.length -1 )} className="h-full hover:bg-gray-800/15 duration-140 cursor-pointer ease-linear absolute left-0 top-0 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
                            </svg>
                        </div>
                        <div onClick={() => setSelectedID(prev => prev < previews.length -1 ? prev+=1 : 0 )} className="h-full hover:bg-gray-800/15 duration-140 cursor-pointer ease-linear absolute right-0 top-0 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                            </svg>
                        </div>
                    </div>
                    )}
                </div>  
            </div>
            
        </div>
    )
}

export default ProductImageUploader;