from fastapi import APIRouter
from collections import Counter
from mongodb import thefts_collection   
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
        # Group by date (YYYY-MM-DD)
        {"$group": {
            "_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$datetime"}},
            "count": {"$sum": 1}
        }},
        {"$sort": {"_id": 1}}  # Sort by date ascending
    ])
    trends = [{"date": r["_id"], "count": r["count"]} for r in result]
    return {"data": trends}