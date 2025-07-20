import React, { useEffect, useRef } from "react";
import * as L from "leaflet"
import "leaflet/dist/leaflet.css"; // обязательно импортируй стили


interface WarehouseMapProps {
    lat: number;
    long: number;
    zoom: number;
}

const WarehouseMap: React.FC<WarehouseMapProps> = ({lat, long, zoom}) => {
    const mapRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!mapRef.current) return;
        const map = L.map(mapRef.current).setView([lat, long], zoom);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.marker([lat, long])
            .addTo(map)
            .bindPopup('A pretty CSS popup.<br> Easily customizable.')
            .openPopup();


        return () => {
            map.remove();
        }
    }, [lat, long, zoom])
    return(
        <div ref={mapRef} id="warehouse-map" className="w-full h-50">
            
        </div>
    )
}

export default WarehouseMap;