from fastapi import APIRouter, Query
from collections import Counter
from mongodb import thefts_collection 
import folium
from folium.plugins import HeatMap
from fastapi.responses import HTMLResponse  
from typing import Optional, List
from datetime import datetime
import math
from fastapi.responses import JSONResponse

router = APIRouter()

def build_filter_query(
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    time_from: Optional[str] = None,
    time_to: Optional[str] = None,
    localities: Optional[List[str]] = None,
    places: Optional[List[str]] = None,
    company: Optional[str] = None,
    categories: Optional[List[str]] = None,
    time_of_day: Optional[str] = None,
    days: Optional[List[str]] = None,
    spot_types: Optional[List[str]] = None
):
    """Build MongoDB query from filters"""
    query = {}
    
    # Police Station filter
    if localities and len(localities) > 0:
        query["POLICE_STATION"] = {"$in": localities}
    
    # Places filter
    if places and len(places) > 0:
        query["PLACE"] = {"$in": places}
    
    # Company/Make filter
    if company:
        query["Make"] = company
    
    # Category filter
    if categories and len(categories) > 0:
        query["Category"] = {"$in": categories}
    
    # Time of day filter
    if time_of_day and time_of_day != "All":
        query["Time_of_day"] = time_of_day
    
    # Days filter
    if days and len(days) > 0:
        query["DAY"] = {"$in": days}
    
    # Spot types filter
    if spot_types and len(spot_types) > 0:
        query["SPOT"] = {"$in": spot_types}
    
    return query

from datetime import datetime
from fastapi import Query
import traceback
from datetime import datetime, timedelta
import pandas as pd
from fastapi import HTTPException

@router.get("/total-thefts")
def get_total_thefts(
    localities: Optional[str] = Query(None),
    places: Optional[str] = Query(None),
    company: Optional[str] = Query(None),
    categories: Optional[str] = Query(None),
    time_of_day: Optional[str] = Query(None),
    days: Optional[str] = Query(None),
    spot_types: Optional[str] = Query(None)
):
    query = build_filter_query(
        localities=localities.split(",") if localities else None,
        places=places.split(",") if places else None,
        company=company,
        categories=categories.split(",") if categories else None,
        time_of_day=time_of_day,
        days=days.split(",") if days else None,
        spot_types=spot_types.split(",") if spot_types else None
    )
    total = thefts_collection.count_documents(query)
    return {"total_thefts": total}


@router.get("/higest-police-station")
def highest_police_station(
    localities: Optional[str] = Query(None),
    places: Optional[str] = Query(None),
    company: Optional[str] = Query(None),
    categories: Optional[str] = Query(None),
    time_of_day: Optional[str] = Query(None),
    days: Optional[str] = Query(None),
    spot_types: Optional[str] = Query(None)
):
    query = build_filter_query(
        localities=localities.split(",") if localities else None,
        places=places.split(",") if places else None,
        company=company,
        categories=categories.split(",") if categories else None,
        time_of_day=time_of_day,
        days=days.split(",") if days else None,
        spot_types=spot_types.split(",") if spot_types else None
    )
    
    pipeline = [
        {"$match": query},
        {"$group": {"_id": "$POLICE_STATION", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        
    ]
    
    result = thefts_collection.aggregate(pipeline)
    stations = list(result)
    
    if stations:
        station = stations[0]
        return {"station": station["_id"], "thefts": station["count"]}
    else:
        return {"station": "N/A", "thefts": 0}


@router.get("/most-model")
def get_most_model(
    localities: Optional[str] = Query(None),
    places: Optional[str] = Query(None),
    company: Optional[str] = Query(None),
    categories: Optional[str] = Query(None),
    time_of_day: Optional[str] = Query(None),
    days: Optional[str] = Query(None),
    spot_types: Optional[str] = Query(None)
):
    query = build_filter_query(
        localities=localities.split(",") if localities else None,
        places=places.split(",") if places else None,
        company=company,
        categories=categories.split(",") if categories else None,
        time_of_day=time_of_day,
        days=days.split(",") if days else None,
        spot_types=spot_types.split(",") if spot_types else None
    )
    
    pipeline = [
        {"$match": query},
        {"$group": {"_id": "$MAKE", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 1}
    ]
    
    result = thefts_collection.aggregate(pipeline)
    model = list(result)[0] if result else {"_id": None, "count": 0}
    return {"most_model": model["_id"], "count": model["count"]}


@router.get("/peak-time")
def get_time(
    localities: Optional[str] = Query(None),
    places: Optional[str] = Query(None),
    company: Optional[str] = Query(None),
    categories: Optional[str] = Query(None),
    time_of_day: Optional[str] = Query(None),
    days: Optional[str] = Query(None),
    spot_types: Optional[str] = Query(None)
):
    query = build_filter_query(
        localities=localities.split(",") if localities else None,
        places=places.split(",") if places else None,
        company=company,
        categories=categories.split(",") if categories else None,
        time_of_day=time_of_day,
        days=days.split(",") if days else None,
        spot_types=spot_types.split(",") if spot_types else None
    )
    
    pipeline = [
        {"$match": query},
        {"$group": {"_id": "$Time_of_day", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 1}
    ]
    
    result = thefts_collection.aggregate(pipeline)
    slot = list(result)[0] if result else {"_id": None, "count": 0}
    
    return {"time_slot": slot["_id"], "time": slot["count"]}


@router.get("/thefts-by-ps")
def get_thefts_by_locality(
    localities: Optional[str] = Query(None),
    places: Optional[str] = Query(None),
    company: Optional[str] = Query(None),
    categories: Optional[str] = Query(None),
    time_of_day: Optional[str] = Query(None),
    days: Optional[str] = Query(None),
    spot_types: Optional[str] = Query(None)
):
    query = build_filter_query(
        localities=localities.split(",") if localities else None,
        places=places.split(",") if places else None,
        company=company,
        categories=categories.split(",") if categories else None,
        time_of_day=time_of_day,
        days=days.split(",") if days else None,
        spot_types=spot_types.split(",") if spot_types else None
    )
    
    pipeline = [
        {"$match": query},
        {"$group": {
            "_id": {"$ifNull": ["$POLICE_STATION", "Unknown"]},
            "count": {"$sum": 1}
        }},
        {"$sort": {"count": -1}}
    ]
    
    result = thefts_collection.aggregate(pipeline)
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
def time_slot_by_company(
    localities: Optional[str] = Query(None),
    places: Optional[str] = Query(None),
    company: Optional[str] = Query(None),
    categories: Optional[str] = Query(None),
    time_of_day: Optional[str] = Query(None),
    days: Optional[str] = Query(None),
    spot_types: Optional[str] = Query(None)
):
    query = build_filter_query(
        localities=localities.split(",") if localities else None,
        places=places.split(",") if places else None,
        company=company,
        categories=categories.split(",") if categories else None,
        time_of_day=time_of_day,
        days=days.split(",") if days else None,
        spot_types=spot_types.split(",") if spot_types else None
    )
    
    pipeline = [
        {"$match": query},
        {"$group": {
            "_id": {"company": "$MAKE", "Time_slot": "$Time_of_day"},
            "count": {"$sum": 1}
        }},
        {"$sort": {"_id.company": 1}}
    ]
    
    result = thefts_collection.aggregate(pipeline)
    
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
def get_company(
    localities: Optional[str] = Query(None),
    places: Optional[str] = Query(None),
    company: Optional[str] = Query(None),
    categories: Optional[str] = Query(None),
    time_of_day: Optional[str] = Query(None),
    days: Optional[str] = Query(None),
    spot_types: Optional[str] = Query(None)
):
    query = build_filter_query(
        localities=localities.split(",") if localities else None,
        places=places.split(",") if places else None,
        company=company,
        categories=categories.split(",") if categories else None,
        time_of_day=time_of_day,
        days=days.split(",") if days else None,
        spot_types=spot_types.split(",") if spot_types else None
    )
    
    pipeline = [
        {"$match": query},
        {"$group": {"_id": "$Make", "count": {"$sum": 1}}},
        {"$sort": {"_id": 1}}
    ]
    
    result = thefts_collection.aggregate(pipeline)
    data = [{"company": r["_id"], "count": r["count"]} for r in result]
    
    return {"data": data}


@router.get("/theft-data")
def theft_data(
    localities: Optional[str] = Query(None),
    places: Optional[str] = Query(None),
    company: Optional[str] = Query(None),
    categories: Optional[str] = Query(None),
    time_of_day: Optional[str] = Query(None),
    days: Optional[str] = Query(None),
    spot_types: Optional[str] = Query(None)
):
    query = build_filter_query(
        localities=localities.split(",") if localities else None,
        places=places.split(",") if places else None,
        company=company,
        categories=categories.split(",") if categories else None,
        time_of_day=time_of_day,
        days=days.split(",") if days else None,
        spot_types=spot_types.split(",") if spot_types else None
    )
    
    thefts = list(thefts_collection.find(
        query,
        {
            "_id": 0,
            "Make": 1,
            "MAKE": 1,
            "Category": 1,
            "PLACE": 1,
            "POLICE_STATION": 1,
            "Time_of_day": 1,
            "DAY": 1,
            "LATITUDE": 1,
            "LONGITUDE": 1,
            "DATE": 1
        }
 ))
    
    return {"data": thefts}


@router.get("/thefts-heatmap", response_class=HTMLResponse)
def thefts_heatmap(
    localities: Optional[str] = Query(None),
    places: Optional[str] = Query(None),
    company: Optional[str] = Query(None),
    categories: Optional[str] = Query(None),
    time_of_day: Optional[str] = Query(None),
    days: Optional[str] = Query(None),
    spot_types: Optional[str] = Query(None)
):
    query = build_filter_query(
        localities=localities.split(",") if localities else None,
        places=places.split(",") if places else None,
        company=company,
        categories=categories.split(",") if categories else None,
        time_of_day=time_of_day,
        days=days.split(",") if days else None,
        spot_types=spot_types.split(",") if spot_types else None
    )
    thefts = list(thefts_collection.find(query, {"_id": 0, "LATITUDE": 1, "LONGITUDE": 1}))
    heat_data = []
    
    for t in thefts:
        try:
            lat = float(t.get("LATITUDE", "nan"))
            lon = float(t.get("LONGITUDE", "nan"))
            if math.isnan(lat) or math.isnan(lon):
                continue
            if -90 <= lat <= 90 and -180 <= lon <= 180:
                heat_data.append([lat, lon])
        except (TypeError, ValueError):
            continue
    
    avg_lat, avg_lon = 16.5777, 74.3155
    m = folium.Map(location=[avg_lat, avg_lon], zoom_start=9.3, tiles="OpenStreetMap")
    
    if heat_data:
        HeatMap(heat_data, radius=8, blur=6, min_opacity=0.7).add_to(m)
    
    return HTMLResponse(content=m.get_root().render())

# ✅ FIXED & UPDATED ENDPOINT BELOW
@router.post("/generate-report")
def generate_report(
    police_station: str = Query(None),
    start_date: str = Query(None),
    end_date: str = Query(None)
):
    try:
        query = {}
        if police_station:
            query["POLICE_STATION"] = police_station.upper()

        data = list(thefts_collection.find(query, {"_id": 0}))
        if not data:
            return {"message": "No data found in DB."}

        df = pd.DataFrame(data)

        # Convert your date format safely (e.g. '27.7.25')
        def parse_custom_date(date_str):
            for fmt in ("%d.%m.%y", "%d.%m.%Y"):
                try:
                    return datetime.strptime(date_str, fmt)
                except Exception:
                    continue
            return pd.NaT

        df["DATE"] = df["DATE"].astype(str).apply(parse_custom_date)

        if start_date and end_date:
            start_dt = pd.to_datetime(start_date)
            end_dt = pd.to_datetime(end_date)
            df = df[(df["DATE"] >= start_dt) & (df["DATE"] <= end_dt)]

        if df.empty:
            return {"message": "No data found for the given date range."}

        # ----------------- REPORT METRICS -----------------
        total_thefts = len(df)
        most_targeted_station = df["POLICE_STATION"].value_counts().idxmax()
        most_common_time = df["Time_of_day"].value_counts().idxmax()
        most_stolen_model = df["MAKE"].value_counts().idxmax()
        highest_theft_day = df["DATE"].value_counts().idxmax().strftime("%Y-%m-%d")

        # ----------------- ADDITIONAL METRICS -----------------
        # Calculate Average per Day
        num_days = (end_dt - start_dt).days + 1
        avg_per_day = round(total_thefts / num_days, 2) if num_days > 0 else 0

        # ----------------- REPORT HEADER DATA -----------------
        report_title = "Bike Theft Analysis Report"
        date_range = f"{start_date} to {end_date}"
        generated_on = datetime.now().strftime("%Y-%m-%d")

        # ----------------- SUMMARY TEXT -----------------
        summary_text = (
            f"Between {start_date} and {end_date}, there were {total_thefts} bike thefts. "
            f"The most targeted police station was {most_targeted_station}, "
            f"with most thefts during {most_common_time.lower()} hours. "
            f"The most stolen model was {most_stolen_model}. "
            f"The busiest day was {highest_theft_day}."
        )

        # ----------------- FINAL RESPONSE -----------------
        return JSONResponse(content={
            "Report_Title": report_title,
            "Date_Range": date_range,
            "Generated_On": generated_on,
            "Total_Thefts": total_thefts,
            "Average_Per_Day": avg_per_day,
            "Most_Targeted_Station": most_targeted_station,
            "Most_Common_Time": most_common_time,
            "Most_Stolen_Model": most_stolen_model,
            "Highest_Theft_Day": highest_theft_day,
            "Summary": summary_text
        })

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))




