import httpx

from fastapi import APIRouter, Query, Path

from app.core.config import settings


router = APIRouter(prefix="/np-api", tags=['Nova Poshta'])

@router.get("/get-cities")
async def get_cities(
    limit: int = Query(15, title="Quantity of out np cities"),
    cityName: str = Query("", title="Name of city for searching all allow cities with similar name.")
):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            url="https://api.novaposhta.ua/v2.0/json/",
            json={
                "apiKey": settings.NOVA_POSHTA_API,
                "modelName": "AddressGeneral",
                "calledMethod": "searchSettlements",
                "methodProperties": {
                    "CityName": f"{cityName}",
                    "Limit": f"{limit}",
                    
                }
        })
        return response.json()
    


@router.get("/get-warehouses/{delivery_ref}")
async def get_warehouses(
    delivery_ref: str = Path(..., title="Delivery city ref is required to request a list of warehouses!")
):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            url="https://api.novaposhta.ua/v2.0/json/",
            json={
                "apiKey": settings.NOVA_POSHTA_API,
                "modelName": "AddressGeneral",
                "calledMethod": "getWarehouses",
                "methodProperties": {
                    "FindByString" : "",
                    "CityRef": delivery_ref,
                    "Page" : "1",
                    "Limit" : "10",
                    "Language" : "UA",
                    }
            }
        )
        return response.json()
    

@router.get("/get-warehouses-fd/{name}/{delivery_ref}") #fd find delivery ref
async def get_warehouses_find_delivery_ref(name: str = '', delivery_ref: str = ''):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            url="https://api.novaposhta.ua/v2.0/json/",
            json={
                "apiKey": settings.NOVA_POSHTA_API,
                "modelName": "AddressGeneral",
                "calledMethod": "getWarehouses",
                "methodProperties": {
                    "FindByString" : name,
                    "CityRef": delivery_ref,
                    "Page" : "1",
                    "Limit" : "10",
                    "Language" : "UA",
                    }
            }
        )
        return response.json()
    
async def get_warehouses_by_name(name: str = '', delivery_city: str = ''):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            url="https://api.novaposhta.ua/v2.0/json/",
            json={
                "apiKey": settings.NOVA_POSHTA_API,
                "modelName": "AddressGeneral",
                "calledMethod": "getWarehouses",
                "methodProperties": {
                    # "FindByString" : name,
                    "CityRef": delivery_city,
                    "Page" : "1",
                    "Limit" : "10",
                    "Language" : "UA",
                    }
            }
        )
        
        return response.json()