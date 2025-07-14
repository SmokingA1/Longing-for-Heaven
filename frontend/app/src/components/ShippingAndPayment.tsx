import React from "react";

const ShippingAndPayment: React.FC = () => {


    return(

        <article className="w-300 flex-grow bg-blue py-10 flex flex-col"  >
            <h1 className="h-20 text-2xl font-normal flex items-center">Shipping & Payment — Longing for Heaven</h1>
            <div id="card-payment" className="flex flex-col">
                <h2 className="text-xl font-semibold">Card Payment on the Website</h2>
                <p className="leading-8">You can pay for your order online using Visa or MasterCard.</p>
                <p className="text-xl leading-10">How it works:</p>
                <p className="leading-8">1. When placing an order, select "Visa/MasterCard" in the Payment section.</p>
                <p className="leading-8">2. You will be redirected to the secure payment gateway of our partner bank.</p>
                <p className="leading-8">3. Confirm the transaction on that page — and that’s it!</p>
            </div>
            <div id="card-payment" className="flex flex-col">
                <h2 className="text-xl font-semibold mt-5">Delivery Across Ukraine (Nova Poshta)</h2>
                <p className="leading-8">We deliver to Nova Poshta branches throughout Ukraine — even to the most remote regions.</p>
                <p className="leading-8 indent-5">— Processing time: 10–25 days</p>
                <p className="leading-8 indent-5">— Delivery time: 2–5 business days</p>
                <p className="leading-8 indent-5">— Delivery cost: from UAH 70 (paid during checkout)</p>
            </div>
            <div className="flex flex-col mt-10 border-t border-gray-300 pt-5">
                <p className="text-base italic text-gray-600">
                    Have questions? Reach out to our support team via email or social media — we're here to help.
                </p>
            </div>







            
        </article>
    )
}

export default ShippingAndPayment;