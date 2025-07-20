import React, {useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../store";
import api from "../api";
import { PatternFormat } from "react-number-format";
import { useNavigate } from "react-router";
import { decrementQTY, incrementQTY, removeFromCart } from "../features/cart/cartSlice";
import WarehouseMap from "./WarehouseMap";

interface AdressProps {
    Present: string;
    DeliveryCity: string;
}

interface OrderProps {
    user_id: string | null;
    total_price: number;
    first_name: string;
    second_name: string;
    receiver_phone: string;
    receiver_email: string;
    shipping_city: string;
    shipping_street: string;
    payment_method: 'cod' | 'card';
}


interface WareHouseProps {
    Description: string;
    Schedule: {
        "Monday": string;
        "Tuesday": string;
        "Wednesday": string;
        "Thursday": string;
        "Friday": string;
        "Saturday": string;
        "Sunday": string;
    }
    CategoryOfWarehouse: string;
    Latitude: string;
    Longitude: string;
}

const Checkout: React.FC = () => {
    const user = useSelector((state: RootState) => state.user);
    const cart = useSelector((state: RootState) => state.cart);
    const [cities, setCities] = useState<AdressProps[]>([]);
    const [citySelected, setCitySelected] = useState(false);

    const [wareHouses, setWareHouses] = useState<WareHouseProps[]>([]);
    const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
    const [warehouseInputFocused, setWarehouseInputFocused] = useState<boolean>(false);
    const [confirmedDeliveryCity, setConfirmedDeliveryCity] = useState<string>('');
    const [confirmedStreet, setConfirmedStreet] = useState<WareHouseProps | null>(null);
    const [isLoadingCity, setIsLoadingCity] = useState<boolean>(false);

    const [order, setOrder] = useState<OrderProps>({
        user_id: user.id ?? null,
        total_price: cart.cart_items.reduce((sum, ci) => sum + ci.quantity * ci.product.price, 0),
        first_name: '',
        second_name: '',
        receiver_phone: user.phone_number || '',
        receiver_email: user.email || '',
        shipping_city: '',
        shipping_street: '',
        payment_method: 'cod'
    });
    
    const inputRef = useRef<HTMLInputElement>(null);


    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();


    const uploadCities = async () => {
        try {
            const response = await api.get(`/np-api/get-cities?cityName=${order.shipping_city}`)
            console.log(response.data);

            if (!response.data?.data || response.data.data.length === 0) {
                setCities([]);
                return;
            }

            const [responsePayload] = response.data.data;
            console.log(responsePayload.Addresses.length < 0)
            console.log(responsePayload.Addresses); 
            setCities(responsePayload.Addresses)
        } catch ( error: any ) {
            if (error.response) {
                console.error("Server error: ", error.response);
            } else {
                console.error("Network or other error: ", error);
            }

        } finally {
            setIsLoadingCity(false);
        }
    }

    const uploadWareHouses = async () => {
        try {
            const response = await api.get(`/np-api/get-warehouses/${confirmedDeliveryCity}`)
            console.log(response.data.data);
            const branches = response.data.data;
            if (Array.isArray(branches)) {
                setWareHouses(response.data.data.filter((branch: WareHouseProps) => (branch.CategoryOfWarehouse == "Branch" || branch.CategoryOfWarehouse == "Store" )));
                console.log(response.data.data.filter((branch: WareHouseProps) => (branch.CategoryOfWarehouse == "Branch" )))
            }
        } catch ( error: any ) {
            if (error.response) {
                console.error("Server error: ", error.response);
            } else {
                console.error("Network or other error: ", error);
            }
        }
    }

    const uploadWareHousesFD = async () => {
        try {
            console.log(confirmedDeliveryCity);
            const response = await api.get(`/np-api/get-warehouses-fd/${order.shipping_street.trim()}/${confirmedDeliveryCity.trim()}`);
            console.log(response.data);
            const branches = response.data.data;
            if (Array.isArray(branches)) {
                setWareHouses(response.data.data.filter((branch: WareHouseProps) => (branch.CategoryOfWarehouse == "Branch" || branch.CategoryOfWarehouse == "Store" )));
                console.log(response.data.data.filter((branch: WareHouseProps) => (branch.CategoryOfWarehouse == "Branch" || branch.CategoryOfWarehouse == "Store"  )))
            }
        } catch ( error: any ) {
            if (error.response) {
                console.error("Server error: ", error.response);
            } else {
                console.error("Network or other error: ", error);
            }
        }
    }

    const handleIncrementQTY = async (cartItemID: string) => {
        if ( user.email ) {
            try {
                const response = await api.patch(`/cart-items/${cartItemID}/increment`)
                if (response) {
                    dispatch(incrementQTY(cartItemID));
                }
            } catch (error) {
                console.error("Some error while incrementing qty: ", error);
            }
        } else {
            dispatch(incrementQTY(cartItemID))
        }
    }

    const handleDecrementQTY = async (cartItemID: string) => {
        if ( user.email ) {
            try {
                const response = await api.patch(`/cart-items/${cartItemID}/decrement`)
                if (response) {
                    dispatch(decrementQTY(cartItemID));
                }
            } catch (error) {
                console.error("Some error while decrementing qty: ", error);
            }
        } else {
            dispatch(decrementQTY(cartItemID))
        }
    }

    const handleRemoveFromCart = async (cartItemID: string) => {
        if (user.email) {
            try {
                const response = await api.delete(`/cart-items/delete/${cartItemID}`)
                if (response) dispatch(removeFromCart(cartItemID));
            } catch (error) {
                console.error("Some error: ", error);
            }
        } else {
            dispatch(removeFromCart(cartItemID))
        }
    }

    const handleMakeOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (order.first_name.length < 1) {
            console.log("Error name")
            return
        }
        if (order.second_name.length < 1) {
            console.log("Error surname")
            return
        }
        if (order.receiver_email.length < 0) {
            console.log("Error email")
            return
        }
        if (order.receiver_phone.length < 1) {
            console.log("Error phone")
            return
        }
        if (order.shipping_city.length < 1) {
            console.log("Error city")
            return
        }
        if (order.shipping_street.length < 1) {
            console.log("Error streeet")
            return
        }
        if (order.payment_method.length < 1) {
            console.log("Error payment method")
            return;
        }
        if (cart.cart_items.length < 1) {
            console.log("Error cart items not found!")
            return
        } if (order.total_price === 0) {
            console.log("error total price cannot be equal to 0")
            return
        }


        const data = {
            user_id: order.user_id,
            receiver_name: order.first_name.trim() + order.second_name.trim(),
            receiver_email: order.receiver_email,
            receiver_phone: order.receiver_phone,
            shipping_city: order.shipping_city,
            shipping_street: order.shipping_street,
            payment_method: order.payment_method
        }
        try {
            const response = await api.post("/orders/create", data);
            console.log(response);
        } catch ( error: any ) {
            if (error.response) {
                console.error("Server error: ", error.response);
            } else {
                console.error("Network or other error: ", error);
            }
        }
    }

    useEffect(() => {
        if (order.shipping_city.length > 0) {
            const delayDebounce = setTimeout(() => uploadCities(), 1500)
            
            return () => clearTimeout(delayDebounce);
        } else{
            setCities([]);
            setIsLoadingCity(false);
        }
    }, [order.shipping_city])

    useEffect(() => {
        if (confirmedDeliveryCity.length > 0) {
            const delayDebounceWareHouses = setTimeout(
                () => uploadWareHouses(), 500
            );

            return () => clearTimeout(delayDebounceWareHouses);
        }

    }, [confirmedDeliveryCity])

    useEffect(() => {
        if (confirmedDeliveryCity.length > 0 && order.shipping_street.length > 0) { 
            const delayDebounceWareHousesFD = setTimeout(() => {
                uploadWareHousesFD()
            }, 800);

            return () => clearTimeout(delayDebounceWareHousesFD);
        }
        if (confirmedDeliveryCity.length > 0 && order.shipping_street.length === 0) { 
            const delayDebounceWareHousesWN = setTimeout(() => {
                uploadWareHouses()
            }, 800);

            return () => clearTimeout(delayDebounceWareHousesWN);
        }
    }, [order.shipping_street])


    useEffect(() => {
        console.log(order)
    }, [order])

    useEffect(() => {
        console.log(wareHouses);
    }, [wareHouses])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
        if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
            console.log("here cities: ", cities)
            console.log("Here status selected city: ", citySelected)
            if (!citySelected &&  cities.length > 0 && cities[0]?.Present){
                setOrder((prev) => ({...prev, shipping_city: cities[0].Present.split(",")[0]}))
                setConfirmedDeliveryCity(cities[0].DeliveryCity)
                setCitySelected(true);
            }

        }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    },
    [inputRef, cities, citySelected])

    return (
        <div id="checkout-container" className="w-300 h-full flex-grow flex flex-col py-10">
            <h1 className="text-2xl font-normal">Checkout</h1>
            <form id="checkout-in-container" className="w-300 h-full flex" onSubmit={handleMakeOrder}>
                <main className="w-200 h-full flex flex-col px-2.5" >
                    <h2 className="self-center text-xl font-normal">Fill form</h2>
                    <div  className="flex flex-col  gap-5 py-5" >
                        <input type="text" name="fake" autoComplete="off" style={{ display: 'none' }} />

                        <div className="flex gap-5 mb-5">
                            <div className="flex flex-col gap-1">
                                <label htmlFor="" className="text-sm text-gray-700">First name</label>
                                <input
                                    type="text"
                                    className="w-95 border-b-1 border-dotted pl-4 outline-none"
                                    name="first-name"
                                    autoComplete="off"
                                    value={order.first_name}
                                    onChange={(e) => setOrder({...order, first_name: e.target.value})}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="" className="text-sm text-gray-700">Second name</label>
                                <input
                                    type="text"
                                    className="w-95 border-b-1 border-dotted pl-4 outline-none"
                                    name="family-name"
                                    autoComplete="family-name"
                                    value={order.second_name}
                                    onChange={(e) => setOrder({...order, second_name: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="flex gap-5 mb-5">
                            <div className="flex flex-col gap-1">
                                <label htmlFor="" className="text-sm text-gray-700">Phone number</label>
                                
                                <PatternFormat 
                                    className="w-95 border-b-1 border-dotted pl-4 outline-none"
                                    type="text"
                                    format="+38 (###) ###-##-##"
                                    mask="_"
                                    name="tel-national"
                                    autoComplete="tel-national"
                                    value={order.receiver_phone}
                                    onChange={(e) => 
                                        setOrder({...order, receiver_phone: e.target.value})
                                    }
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="" className="text-sm text-gray-700">Email</label>
                                <input
                                    type="email"
                                    className="w-95 border-b-1 border-dotted pl-4 outline-none"
                                    name="email"
                                    autoComplete="email"
                                    value={order.receiver_email}
                                    onChange={(e) => setOrder({...order, receiver_email: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="flex gap-10 self-center">
                            <div className="flex flex-col relative gap-1">
                                <label htmlFor="city-input-field" className="text-sm text-gray-700">City</label>
                                <div ref={inputRef} className="relative">
                                    <input
                                        id="city-input-field"
                                        type="text"
                                        className="w-95 border-b-1 border-dotted pl-4 outline-none"
                                        name="address-poshta-fake"
                                        autoComplete="address-poshta-fake"
                                        value={order.shipping_city}
                                        onChange={(e) => {
                                            setOrder({...order, shipping_city: e.target.value, shipping_street: ''});
                                            setConfirmedDeliveryCity('');
                                            setConfirmedStreet(null);
                                            setIsLoadingCity(true);
                                            setCitySelected(false);
                                        }}
                                        onFocus={() => setIsInputFocused(true)}
                                        onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
                                    />
                                    {isLoadingCity && (
                                        <div id="loader" className="size-5 rounded-full border-2  absolute right-0 top-[-1px] border-l-white animate-spin"></div>
                                    )}
                                </div>
                                
                                {cities.length > 0 && isInputFocused && (
                                    <ul className="w-95 webkit-custom absolute left-0 top-full bg-white z-10 max-h-100 overflow-auto px-1 ">
                                        {cities.map((city) => (
                                            <li
                                                key={city.Present}
                                                className="py-1 border-b-1 cursor-pointer hover:bg-gray-100"
                                                onClick={() => {
                                                    setOrder({...order, shipping_city: city.Present.split(",")[0]}); 
                                                    setConfirmedDeliveryCity(city.DeliveryCity)
                                                    setCitySelected(true);
                                                    }
                                                }
                                                >
                                                    {city.Present.split(",")[0]} <br /> {city.Present.split(",").slice(1)}
                                                </li>
                                        ))}
                                    </ul>
                                )}
                                
                            </div>
                        </div>
                        <h2 className="text-xl font-normal self-start">Delivery</h2>

                        {!confirmedDeliveryCity && <span>Please enter your city to select method delivery!</span>}
                        {confirmedDeliveryCity.length > 0 && order.shipping_city.length > 0 && (
                            <div id="selector-branch" className="flex flex-col w-full border-[1.5px] rounded-lg border-gray-400 p-5 pb-20 relative">
                                <div className="flex flex-col relative w-full">
                                    <span>Pickup from «NovaPoshta» branch</span>
                                    <div className="flex flex-col relative w-full">
                                        <input
                                            id="ware-house-field"
                                            type="text"
                                            className="w-95 border-b-1 border-dotted pl-4 outline-none"
                                            name="address-poshta-fake"
                                            autoComplete="address-poshta-fake"
                                            value={order.shipping_street}
                                            onChange={(e) => {
                                                setOrder({...order, shipping_street: e.target.value });
                                                setConfirmedStreet(null);
                                            }}
                                            onFocus={() => setWarehouseInputFocused(true)}
                                            onBlur={() => setTimeout(() => setWarehouseInputFocused(false), 200)}
                                        />
                                        {wareHouses.length > 0 && warehouseInputFocused && (
                                            <ul className="w-95 webkit-custom absolute left-0 top-full bg-white z-10 max-h-100 overflow-auto">
                                                {wareHouses.map((branch: WareHouseProps) => (
                                                    <li onClick={() => {
                                                        setOrder({...order, shipping_street: branch.Description});
                                                        setConfirmedStreet({
                                                            Description: branch.Description,
                                                            Schedule: branch.Schedule,
                                                            CategoryOfWarehouse: branch.CategoryOfWarehouse,
                                                            Latitude: branch.Latitude,
                                                            Longitude: branch.Longitude
                                                        });
                                                    }} key={branch.Description} className="py-1 border-b-1 cursor-pointer hover:bg-gray-100" >{branch.Description.split(":")[0]} <br /> {branch.Description.split(":")[1]}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    
                                    {confirmedStreet && confirmedStreet.Latitude && confirmedStreet.Longitude && 
                                    <div className="flex justify-between w-full mt-5">
                                        <div className="flex flex-col">
                                            {
                                                Object.entries(confirmedStreet.Schedule || {} 
                                                ).map(([day, time]) => (
                                                    <div className="flex">
                                                        <span className="w-30">
                                                            {day}
                                                        </span> 
                                                        <span>
                                                            {time}
                                                        </span>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        <div className="w-100">
                                            <WarehouseMap lat={Number(confirmedStreet.Latitude)} long={Number(confirmedStreet.Longitude)} zoom={120}/>
                                        </div>
                                    </div>
                                    }

                                </div>
                                
                            </div>
                        )
                        }

                        
                        {confirmedStreet && (
                            <>
                            <h2>Select method delivery!</h2>
                            <div className="flex flex-col  gap-2.5 border-[1.5px] border-gray-400 rounded-md p-5 ">
                                <span 
                                    onClick={() => setOrder((prev) => ({...prev, payment_method: "card"}))} 
                                    className={`${order.payment_method == "card" ? "bg-gray-200" : "hover:bg-gray-50" } cursor-pointer group flex items-center gap-2.5 px-2 py-3 border-1 border-gray-400 rounded-xl `}>
                                    <div className={`${order.payment_method == "card" ? "bg-slate-400" : "group-hover:bg-slate-400/80"} p-2.5 border-1 border-gray-400 rounded-full`}></div>
                                    Card - pay immediately 
                                </span>
                                <span
                                    onClick={() => setOrder((prev) => ({...prev, payment_method: "cod"}))}
                                    className={`${order.payment_method == "cod" ? "bg-gray-200" : "hover:bg-gray-50" } cursor-pointer group flex items-center gap-2.5 px-2 py-3  border-1 border-gray-400 rounded-xl`}>
                                    <div className={`${order.payment_method == "cod" ? "bg-slate-400" : "group-hover:bg-slate-400/80" }  p-2.5 border-1 border-gray-400 rounded-full`}></div>
                                    Cod - cash on delivery, payment upon receipt of goods.
                                </span>
                                
                            </div>
                            </>
                        )}
                    </div>
                </main>
                
                <aside className="w-100 h-180 px-1 flex flex-col items-center justify-between relative border-t-1 border-b-1 border-gray-300 py-2">
                    <div id="cart-items-container" >
                        {cart.cart_items.length > 0 && cart.cart_items.map((cartItem) => (
                            <div key={cartItem.id} className="w-[350px] h-30 flex">
                                <img src={`http://localhost:8000/${cartItem.thumbnail}`} alt="cart-item" onClick={() => navigate(`/shop/${cartItem.product_id}`)} className="h-[99px] w-[89.1px]"/>
                                <div id="info" className="flex flex-col w-full gap-1.5 pb-2.5 pl-2">
                                    <span className="text-xl">{cartItem.product.name}</span>
                                    <div id="price-increment" className="flex justify-between">
                                        <span>{cartItem.product.price}</span>
                                        
                                        <div className="flex border-1 border-slate-100 w-20 items-center justify-evenly">
                                            <button className="w-8 hover:bg-gray-100 cursor-pointer" onClick={() => handleDecrementQTY(cartItem.id)}>-</button>
                                            <span className="w-4 text-center">{cartItem.quantity}</span>
                                            <button className="w-8 hover:bg-gray-100 cursor-pointer" onClick={() => handleIncrementQTY(cartItem.id)}>+</button>
                                        </div>
                                        
                                    </div>
                                    <div>
                                        {cartItem.size.name.toUpperCase()}
                                    </div>
                                    <button onClick={() => handleRemoveFromCart(cartItem.id)} className="hover:text-slate-700 mt-auto cursor-pointer">Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="w-full h-40 bg-gray-200 flex flex-col justify-evenly px-5 py-2.5    ">
                        <span className="text-xl self-end">Total: {cart.cart_items.reduce((sum, ci) => sum + ci.quantity * ci.product.price, 0)}</span>
                        <button className="py-2 w-full text-white bg-gray-400 text-center hover:bg-gray-500/90 duration-120 cursor-pointer ease-linear">
                            Checkout
                        </button>
                    </div>
                </aside>
            </form>
            
        </div>
    )
}

export default Checkout;