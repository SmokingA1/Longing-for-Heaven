from app.api.routers.np.nova_poshta import get_cities, get_warehouses_by_name
import asyncio

async def get_cities_test():
    print("somme happend")
    response = await get_cities()
    print(response)

async def get_settlements_test():
    print("Start up")
    response = await get_settlements()
    print(response)

async def get_warehouses_with_name_cityname():
    print("Start up")
    response = await get_warehouses_by_name(name="", delivery_city="db5c88c4-391c-11dd-90d9-001a92567626")
    print(response)

if __name__ == "__main__":
    asyncio.run(get_warehouses_with_name_cityname())