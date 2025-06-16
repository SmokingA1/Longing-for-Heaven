import React from "react";

const AdminOrders: React.FC = () => {

    
    return(
        <div id="container-admin-orders" className="w-full px-1 max-h-full sm:px-5 sm:pb-5 flex flex-col gap-5 relative font-medium">
            <div className="w-full h-10 bg-teal-200 flex justify-center items-center rounded-b-lg relative animate-out-top font-medium">
                Orders administrator panel
            </div>

            <div id="table-orders" className="w-full h-1/2 sm:w-full md:w-100 md:h-full lg:w-125 xl:w-150 2xl:w-200 bg-blue-200 rounded-lg p-2.5">
                <span>mewo</span>                       {/*sm- 640, md- 768, lg- 1024, xl-1280, 2xl - 1536 */}
            </div>

        </div>
    )
}

export default AdminOrders;