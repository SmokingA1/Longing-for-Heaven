import React from "react";

const Contacts: React.FC = () => {


    return(
        <article className="w-300 flex-grow bg-blue py-10 flex flex-col"  >
            <div className="h-20 text-2xl font-normal flex items-center">Contacts — Longing for Heaven</div>

            <div className="flex-grow flex">   
                <div className="w-80 flex flex-col gap-4 text-base font-normal">
                    <span className="font-semibold text-2xl">Instagram/Telegram</span>
                    <span >_smoking_._ (Instagram)</span>
                    <span>@smokinga1 (Telegram)</span>
                    <span className="font-semibold text-2xl mt-3">Email</span>
                    <span>smokinga1wm@gmail.com</span>
                </div>
            </div>
            <div className="w-full md:flex-grow flex flex-col gap-4 mt-3 text-base">
                    <h2 className="text-xl font-semibold">Have a question or collaboration idea?</h2>
                    <p >Feel free to message us directly on Telegram or Instagram — we're always happy to hear from you!</p>
                    <p >Alternatively, drop us an email and we’ll reply as soon as we can.</p>
                </div>
            
        </article>
    )
}

export default Contacts;