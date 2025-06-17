import React from "react";

interface PIProps {
    isVisible: boolean;
    setIsVisible: () => void;
}

const ProductImageForm: React.FC<PIProps> = ({isVisible, setIsVisible}) => {

    if (!isVisible) return null;

    return(
        <>
        <div id="blur" className="fixed left-0 top-0 h-full w-full z-40 backdrop-blur-xs" onClick={() => setIsVisible()}></div>

        <div className="w-125 h-125 bg-black top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fixed z-50">
            sdg
        </div>
        </>
    )
}


export default ProductImageForm;