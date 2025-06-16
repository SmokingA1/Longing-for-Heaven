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
        <div id="container-admin-users" className="w-full px-1 max-h-full sm:px-5 sm:pb-5 flex flex-col gap-5 relative font-medium">
            <div className="w-full h-10 bg-teal-200 flex justify-center items-center rounded-b-lg relative animate-out-top font-medium">
                Users administrator panel
            </div>
            <div id="table-users" className="max-w-240 h-full bg-blue-100 rounded-lg p-2.5">
                <table className="max-w-240 divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            <th scope="col" className="border border-gray-300 w-28 px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">id</th>
                            <th scope="col" className="border border-gray-300 w-22 px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">name</th>
                            <th scope="col" className="border border-gray-300 w-60 px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">email</th>
                            <th scope="col" className="border border-gray-300 w-25 px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">phone_number</th>
                            <th scope="col" className="border border-gray-300 w-30 px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">avatar</th>
                            <th scope="col" className="border border-gray-300 w-25 px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">country</th>
                            <th scope="col" className="border border-gray-300 w-20 px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">city</th>
                            <th scope="col" className="border border-gray-300 w-20 px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">street</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td scope="col" className="border border-gray-300 w-28 px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-white">{user.id}</td>
                                <td scope="col" className="border border-gray-300 w-22 px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-white">{user.name}</td>
                                <td scope="col" className="border border-gray-300 w-60 px-1 py-3 break-all text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-white">{user.email}</td>
                                <td scope="col" className="border border-gray-300 w-25 px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-white">{user.phone_number}</td>
                                <td scope="col" className="border border-gray-300 w-30 px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-white">{user.avatar_url}</td>
                                <td scope="col" className="border border-gray-300 w-25 px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-white">{user.country}</td>
                                <td scope="col" className="border border-gray-300 w-20 px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-white">{user.city}</td>
                                <td scope="col" className="border border-gray-300 w-20 px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-white">{user.street}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>


            </div>

        </div>
    )
}

export default AdminUsers;