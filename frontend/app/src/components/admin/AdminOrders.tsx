import React, { useEffect, useState } from "react";
import api from "../../api";

interface OrderInterface {
    id: string,
    created_at: string,
    total_price: number,
    status: string,
    payment_method: string;
    payment_status: string;
    number: number;
    receiver_name: string;
}

const AdminOrders: React.FC = () => {
    const [orders, setOrders] = useState<OrderInterface[]>([]);

     const handleGetOrders = async () => {
        try {
            const response = await api.get("/orders")
            setOrders(response.data)
            console.log(response.data);

        } catch (error: any) {
            if (error.response) {
                console.error("Server error: ", error.response);
            } else {
                console.error("Network or other error: ", error);
            }
        }
    }

    useEffect(() => {
        handleGetOrders();
    }, [])

    return(
        <div id="container-admin-orders" className="w-full px-1 max-h-full sm:px-5 sm:pb-5 flex flex-col gap-5 relative font-medium bg-slate-800">
            <div className="w-full h-10 bg-slate-600 flex justify-center items-center rounded-b-lg text-white relative animate-out-top font-medium py-2.5">
                ORDERS ADMINISTRATOR PANEL
            </div>

            <div id="" className="h-full w-full bg-slate-600 rounded-lg p-2.5">
                <div id="all-orders-container" className="w-full h-full p-2.5 flex flex-col gap-5">
                    <table id="table-orders" className="w-full divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-slate-500 text-xs uppercase font-medium text-white">
                            <tr>
                                <th scope="col" className="border border-slate-400 w-20 px-1 py-3 text-center tracking-wider">Number</th>
                                <th scope="col" className="border border-slate-400 w-15 px-1 py-3 text-center tracking-wider">Customer name</th>
                                <th scope="col" className="border border-slate-400 w-15 px-1 py-3 text-center tracking-wider">Date</th>
                                <th scope="col" className="border border-slate-400 w-20 px-1 py-3 text-center tracking-wider">Status</th>
                                <th scope="col" className="border border-slate-400 w-20 px-1 py-3 text-center tracking-wider">Total price</th>
                                <th scope="col" className="border border-slate-400 w-20 px-1 py-3 text-center tracking-wider">Payment status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-medium text-gray-500 uppercase bg-white">
                            {orders.map((order) => (
                            <tr key={order.id} className="cursor-pointer" >
                                <td scope="col" className="border border-gray-300 w-20 px-1 py-3 text-center tracking-wider">#{String(order.number).padStart(9, "0")}</td>
                                <td scope="col" className="border border-gray-300 w-15 px-1 py-3 text-center tracking-wider">{order.receiver_name}</td>
                                <td scope="col" className="border border-gray-300 w-15 px-1 py-3 text-center tracking-wider">{(new Date(order.created_at).toLocaleDateString()).replace(/\./g, "/")}</td>
                                <td scope="col" className="border border-gray-300 w-15 px-1 py-3 text-center tracking-wider">{order.status}</td>
                                <td scope="col" className="border border-gray-300 w-15 px-1 py-3 text-center tracking-wider">{order.total_price}</td>
                                <td scope="col" className="border border-gray-300 w-15 px-1 py-3 text-center tracking-wider">{order.payment_status}</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>                    {/*sm- 640, md- 768, lg- 1024, xl-1280, 2xl - 1536 */}

        </div>
    )
}

export default AdminOrders;