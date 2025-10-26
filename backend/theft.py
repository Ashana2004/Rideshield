from fastapi import APIRouter
from collections import Counter
from mongodb import thefts_collection 
import folium
from folium.plugins import HeatMap
from fastapi.responses import HTMLResponse  
router = APIRouter()
import math
from fastapi.responses import JSONResponse
import math

@router.get("/total-thefts")
def get_total_thefts():
    total = thefts_collection.count_documents({})
    return {"total_thefts": total}


@router.get("/higest-police-station")
def highest_police_station():
    result = thefts_collection.aggregate([
        {"$group": {"_id": "$POLICE_STATION", "count": {"$sum": 1}}},  # check exact field name
        {"$sort": {"count": -1}},
        {"$limit": 1}
    ])
    
    stations = list(result)
    if stations:
        station = stations[0]
        return {"station": station["_id"], "thefts": station["count"]}
    else:
        return {"station": "N/A", "thefts": 0}   


@router.get("/most-model")
def get_most_model():
    result = thefts_collection.aggregate([
        {"$group": {"_id": "$MAKE", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 1}
    ])
    model = list(result)[0] if result else {"_id": None, "count": 0}
    return {"most_model": model["_id"], "count": model["count"]}

@router.get("/peak-time")
def get_time():
    result= thefts_collection.aggregate([
        {"$group":{"_id":"$Time_of_day", "count":{"$sum":1}} },
        {"$sort":{"count":-1}},
        {"$limit":1}
    ])
    
    slot=list(result)[0]if result else {"_id":None, "count":0}
    
    return {"time_slot":slot["_id"], "time":slot["count"]}
        
 
@router.get("/thefts-by-ps")
def get_thefts_by_locality():
    
    result = thefts_collection.aggregate([
    {"$group": {
        "_id": {"$ifNull": ["$POLICE_STATION", "Unknown"]},
        "count": {"$sum": 1}
    }},
    {"$sort": {"count": -1}}
])

    
    data = [{"locality": r["_id"], "count": r["count"]} for r in result]
    return {"data": data}

# @router.get("/theft-trends")
# def get_theft_trends():
#     result = thefts_collection.aggregate([
        
#         {"$group": {
#             "_id": {"$DATE": {"format": "%Y-%m-%d", "date": "$datetime"}},
#             "count": {"$sum": 1}
#         }},
#         {"$sort": {"_id": 1}}  
#     ])
#     trends = [{"date": r["_id"], "count": r["count"]} for r in result]
#     return {"data": trends}
 
 
def safe_number(value):
    """Convert None, NaN, inf, or invalid numbers to 0."""
    try:
        if value is None:
            return 0
        if isinstance(value, (float, int)):
            if math.isnan(value) or math.isinf(value):
                return 0
            return float(value)
        return float(value)
    except Exception:
        return 0


@router.get("/Time_slot-by-company")
def time_slot_by_company():
    result = thefts_collection.aggregate([
        {"$group": {
            "_id": {"company": "$MAKE", "Time_slot": "$Time_of_day"},
            "count": {"$sum": 1}
        }},
        {"$sort": {"_id.company": 1}}
    ])
    
    data = {}
    for r in result:
        company = r["_id"].get("company", "Unknown")
        period = r["_id"].get("Time_slot", "Unknown")
        count = safe_number(r.get("count", 0))

        
        if company not in data:
            data[company] = {
                "Morning": 0,
                "Afternoon": 0,
                "Evening": 0,
                "Midnight": 0
            }

        
        if period in data[company]:
            data[company][period] = count
 
 
    output = []
    for k, v in data.items():
        clean_v = {slot: safe_number(vv) for slot, vv in v.items()}
        output.append({"company": k, **clean_v})

    
    for o in output:
        for key in o:
            if isinstance(o[key], float) and math.isnan(o[key]):
                o[key] = 0.0

    return JSONResponse(content={"data": output})
  
  
@router.get("/thefts-company")
def get_company():
    result=thefts_collection.aggregate([
        {"$group":{"_id":"$Make", "count":{"$sum":1}}},
        {"$sort": {"_id": 1}}   
    ])
    
    data=[{"company":r["_id"], "count":r["count"]} for r in result]
    
    return{"data":data}
    

@router.get("/theft-data")
def theft_data():
    
    thefts= list(thefts_collection.find({},{"_id":0,"Make":1,"MAKE":1,"Category":1,"PLACE":1,"POLICE_STATION":1,"Time_of_day":1,"DAY":1,"LATITUDE":1,"LONGITUDE":1}))
    print(thefts   )
    return{"data":thefts}
     
@router.get("/thefts-heatmap", response_class=HTMLResponse)
def thefts_heatmap(): 
    
    thefts = list(thefts_collection.find({}, {"_id": 0, "LATITUDE": 1, "LONGITUDE": 1}))
    heat_data = []
    for t in thefts:
        try:
            lat = float(t.get("LATITUDE", "nan"))
            lon = float(t.get("LONGITUDE", "nan"))
            if math.isnan(lat) or math.isnan(lon):
                continue
            # ✅ Ensure lat/lon are in valid range
            if -90 <= lat <= 90 and -180 <= lon <= 180:
                heat_data.append([lat, lon])
        except (TypeError, ValueError):
            continue

        avg_lat, avg_lon = 16.5777,  74.3155  
 
    m = folium.Map(location=[avg_lat, avg_lon], zoom_start=9.3, tiles="OpenStreetMap")
    
    HeatMap(heat_data, radius=8, blur=6, min_opacity=0.7).add_to(m)
    
    return HTMLResponse(content=m.get_root().render())
