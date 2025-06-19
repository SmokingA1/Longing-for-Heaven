import React from "react";

const Contacts: React.FC = () => {


    return(

        <article className="w-300 flex-grow bg-blue py-10 flex flex-col"  >
            <div className="h-20 text-3xl font-bold flex items-center">Contacts</div>

            <div className="flex-grow flex">   
                <div className="w-80 flex flex-col gap-4 text-sm font-normal">
                    <span className="font-medium text-2xl">Instagram/Telegram</span>
                    <span >_smoking_._ (Instagram)</span>
                    <span>@smokinga1 (Telegram)</span>
                    <span className="font-medium text-2xl mt-3">Email</span>
                    <span>smokinga1wm@gmail.com</span>
                </div>
                <div className="flex w-full items-center flex-col">
                    <span className="font-medium text-2xl">Feedback</span>
                    <form className="h-full w-full flex flex-col items-center py-10">
                        <span>Name</span>
                        <span>Email</span>
                        <span>Instagram/Telegram</span>
                        <span>Message</span>
                        <button>BUTTON</button>

                    </form>
                </div>
            </div>
            
        </article>
    )
}

export default Contacts;