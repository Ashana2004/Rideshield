from fastapi import APIRouter
from collections import Counter
from mongodb import thefts_collection 
import folium
from folium.plugins import HeatMap
from fastapi.responses import HTMLResponse  
router = APIRouter()

 
@router.get("/total-thefts")
def get_total_thefts():
    total = thefts_collection.count_documents({})
    return {"total_thefts": total}

 
@router.get("/highest-area")
def get_highest_area():
    result = thefts_collection.aggregate([
        {"$group": {"_id": "$locality", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 1}
    ])
    area = list(result)[0] if result else {"_id": None, "count": 0}
    return {"highest_area": area["_id"], "thefts": area["count"]}

 
@router.get("/most-model")
def get_most_model():
    result = thefts_collection.aggregate([
        {"$group": {"_id": "$model", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 1}
    ])
    model = list(result)[0] if result else {"_id": None, "count": 0}
    return {"most_model": model["_id"], "count": model["count"]}

 
@router.get("/peak-time")
def get_peak_time():
    all_records = thefts_collection.find({}, {"_id": 0, "time_of_theft": 1})
    hours = []
    for t in all_records:
        if "time_of_theft" in t and t["time_of_theft"]:
            try:
                hours.append(int(t["time_of_theft"].split(":")[0]))
            except:
                continue
    if not hours:
        return {"peak_hour": None, "count": 0}
    hour_counts = Counter(hours)
    peak_hour, count = hour_counts.most_common(1)[0]
    return {"peak_hour": f"{peak_hour}:00-{peak_hour}:59", "count": count}


@router.get("/thefts-by-locality")
def get_thefts_by_locality():
    result = thefts_collection.aggregate([
        {"$group": {"_id": "$locality", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ])
    
    data = [{"locality": r["_id"], "count": r["count"]} for r in result]
    return {"data": data}

@router.get("/theft-trends")
def get_theft_trends():
    result = thefts_collection.aggregate([
        
        {"$group": {
            "_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$datetime"}},
            "count": {"$sum": 1}
        }},
        {"$sort": {"_id": 1}}  
    ])
    trends = [{"date": r["_id"], "count": r["count"]} for r in result]
    return {"data": trends}


@router.get("/day-night-by-company")
def day_night_by_company():
    
    result = thefts_collection.aggregate([
        {"$group": {
            "_id": {"company": "$company", "day_or_night": "$day_or_night"},
            "count": {"$sum": 1}
        }},
        {"$sort": {"_id.company": 1}}
    ])
    
 
    data = {}
    for r in result:
        company = r["_id"]["company"]
        period = r["_id"]["day_or_night"]
        count = r["count"]
        if company not in data:
            data[company] = {"Day": 0, "Night": 0}
        data[company][period] = count

   
    output = [{"company": k, "Day": v["Day"], "Night": v["Night"]} for k, v in data.items()]
    return {"data": output}

@router.get("/thefts-heatmap", response_class=HTMLResponse)
def thefts_heatmap():
   
    thefts = list(thefts_collection.find({}, {"_id": 0, "latitude": 1, "longitude": 1}))
    
    heat_data = [[t["latitude"], t["longitude"]] for t in thefts if t.get("latitude") and t.get("longitude")]

   
    m = folium.Map(location=[16.704, 74.243], zoom_start=13)
    HeatMap(heat_data).add_to(m)

    # Render map as HTML
    return m._repr_html_()   