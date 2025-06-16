import React, { useState } from "react";
import AdminSideBar from "../components/admin/AdminSideBar";
import AdminProducts from "../components/admin/AdminProducts";
import AdminUsers from "../components/admin/AdminUsers";
import AdminOptions from "../components/admin/AdminOptions";
import AdminOrders from "../components/admin/AdminOrders";

const AdminPage: React.FC = () => {
    const [choosenRow, setChoosenRow] = useState<"users" | "products" | "orders" | "options" | null>(null);


    return(
        <div id="" className="h-full bg-white flex">
            <AdminSideBar choosenRow={choosenRow} setChoosenRow={setChoosenRow} />

            {choosenRow === "users" && <AdminUsers />}
            {choosenRow === "products" && <AdminProducts />}
            {choosenRow === "orders" && <AdminOrders />}
            {choosenRow === "options" && <AdminOptions />}
        </div>
    )
}

export default AdminPage;
