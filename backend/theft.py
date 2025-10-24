from fastapi import APIRouter
from collections import Counter
from mongodb import thefts_collection 
import folium
from folium.plugins import HeatMap
from fastapi.responses import HTMLResponse  
router = APIRouter()
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

 
# @router.get("/peak-time")
# def get_peak_time():
#     all_records = thefts_collection.find({}, {"_id": 0, "Time_of_day": 1})
#     hours = []
#     for t in all_records:
#         if "Time_of_day" in t and t["Time_of_day"]:
#             try:
#                 hours.append(int(t["time_of_theft"].split(":")[0]))
#             except:
#                 continue
#     if not hours:
#         return {"peak_hour": None, "count": 0}
#     hour_counts = Counter(hours)
#     peak_hour, count = hour_counts.most_common(1)[0]
#     return {"peak_hour": f"{peak_hour}:00-{peak_hour}:59", "count": count}

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


# @router.get("/day-night-by-company")
# def day_night_by_company():
    
#     result = thefts_collection.aggregate([
#         {"$group": {
#             "_id": {"company": "$MAKE", "day_or_night": "$day_or_night"},
#             "count": {"$sum": 1}
#         }},
#         {"$sort": {"_id.company": 1}}
#     ])
    
 
    # data = {}
    # for r in result:
    #     company = r["_id"]["company"]
    #     period = r["_id"]["day_or_night"]
    #     count = r["count"]
    #     if company not in data:
    #         data[company] = {"Day": 0, "Night": 0}
    #     data[company][period] = count

   
    # output = [{"company": k, "Day": v["Day"], "Night": v["Night"]} for k, v in data.items()]
    # return {"data": output}

@router.get("/theft-data")
def theft_data():
     thefts= list(thefts_collection.find({},{"id":0,"Make":1,"Place":1,"POLICE STATION":1,"Latitude":1,"Longitude":1}))
    
     return{"data":thefts}
 
@router.get("/thefts-heatmap", response_class=HTMLResponse)
def thefts_heatmap():
    # Fetch data from MongoDB
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

    # Calculate center point
    
        avg_lat, avg_lon = 16.5777,  74.3155  
 
    # Create Folium map
    m = folium.Map(location=[avg_lat, avg_lon], zoom_start=9.3, tiles="OpenStreetMap")

    # Add heatmap layer
    HeatMap(heat_data, radius=8, blur=6, min_opacity=0.7).add_to(m)
 
   
    # Return as HTML
    return HTMLResponse(content=m.get_root().render())