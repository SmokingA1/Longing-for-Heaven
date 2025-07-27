import React, { useEffect, useState } from "react";
import api from "../../api";


interface UserProps {
    id: string;
    name: string;
    email: string;
    phone_number: string | null;
    avatar_url: string;
    country: string | null;
    city: string | null;
    street: string | null;

}


const AdminUsers: React.FC = () => {
    const [users, setUsers] = useState<UserProps[]>([])
    
    const getUser = async () => {
        try{
            const response = await api.get("/users");

            setUsers(response.data);
            console.log(response.data);
        } catch (error: any) {
            if (error.response) {
                console.error("Server error", error);
            } else {
                console.error("Network or other error: ", error);
            }
        }
    } 

    useEffect(() => {
        getUser();
    }, [])

    return(
        <div id="container-admin-users" className="w-full px-1 max-h-full sm:px-5 sm:pb-5 flex flex-col gap-5 relative font-medium bg-slate-800">
            <div className="w-full h-10 bg-slate-600 text-white flex justify-center items-center rounded-b-lg relative animate-out-top font-medium">
                USERS ADMINISTRATOR PANEL
            </div>
            <div id="table-users" className="max-w-240 h-full bg-slate-600 rounded-lg p-2.5">
                <table className="max-w-240 shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-slate-500 text-white uppercase font-medium text-xs">
                        <tr>
                            <th scope="col" className="text-center border border-slate-400 w-28 px-1 py-3 tracking-wider">id</th>
                            <th scope="col" className="text-center border border-slate-400 w-22 px-1 py-3 tracking-wider">name</th>
                            <th scope="col" className="text-center border border-slate-400 w-60 px-1 py-3 tracking-wider">email</th>
                            <th scope="col" className="text-center border border-slate-400 w-25 px-1 py-3 tracking-wider">phone_number</th>
                            <th scope="col" className="text-center border border-slate-400 w-30 px-1 py-3 tracking-wider">avatar</th>
                            <th scope="col" className="text-center border border-slate-400 w-25 px-1 py-3 tracking-wider">country</th>
                            <th scope="col" className="text-center border border-slate-400 w-20 px-1 py-3 tracking-wider">city</th>
                            <th scope="col" className="text-center border border-slate-400 w-20 px-1 py-3 tracking-wider">street</th>
                        </tr>
                    </thead>
                    <tbody className="text-xs font-medium text-gray-500 uppercase bg-white">
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td scope="col" className="border border-slate-400 w-28 px-1 py-3 text-left tracking-wider">{user.id}</td>
                                <td scope="col" className="border border-slate-400 w-22 px-1 py-3 text-left tracking-wider">{user.name}</td>
                                <td scope="col" className="border border-slate-400 w-60 px-1 py-3 break-all text-left tracking-wider">{user.email}</td>
                                <td scope="col" className="border border-slate-400 w-25 px-1 py-3 text-left tracking-wider">{user.phone_number}</td>
                                <td scope="col" className="border border-slate-400 w-30 px-1 py-3 text-left tracking-wider">{user.avatar_url}</td>
                                <td scope="col" className="border border-slate-400 w-25 px-1 py-3 text-left tracking-wider">{user.country}</td>
                                <td scope="col" className="border border-slate-400 w-20 px-1 py-3 text-left tracking-wider">{user.city}</td>
                                <td scope="col" className="border border-slate-400 w-20 px-1 py-3 text-left tracking-wider">{user.street}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>


            </div>

        </div>
    )
}

export default AdminUsers;