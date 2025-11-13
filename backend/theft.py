from fastapi import APIRouter, Query, HTTPException
from collections import Counter
from mongodb import thefts_collection 
import folium
from folium.plugins import HeatMap
from fastapi.responses import HTMLResponse  
from typing import Optional, List
from datetime import datetime
import math
from fastapi.responses import JSONResponse
import pandas as pd
import traceback

router = APIRouter()

def build_filter_query(
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
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
        {"$limit": 1}
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
        {"$limit": 5}
    ]
    
    result = list(thefts_collection.aggregate(pipeline))
    data = [{"model": r["_id"], "count": r["count"]} for r in result]
    return {"data": data}


def safe_number(value):
    """Convert None, NaN, inf, or invalid numbers to 0."""
    try:
        if value is None:
            return 0.0
        # handle floats safely with isnan/isinf
        if isinstance(value, float):
            if math.isnan(value) or math.isinf(value):
                return 0.0
            return float(value)
        # ints are safe to convert
        if isinstance(value, int):
            return float(value)
        # try to coerce other types
        return float(value)
    except Exception:
        return 0.0


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
    
    result = list(thefts_collection.aggregate(pipeline))
    if result:
        slot = result[0]
        return {"time_slot": slot.get("_id"), "time": slot.get("count", 0)}
    return {"time_slot": None, "time": 0}


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
        company_name = r["_id"].get("company", "Unknown")
        period = r["_id"].get("Time_slot", "Unknown")
        count = safe_number(r.get("count", 0))
        
        if company_name not in data:
            data[company_name] = {
                "Morning": 0,
                "Afternoon": 0,
                "Evening": 0,
                "Midnight": 0
            }
        
        if period in data[company_name]:
            data[company_name][period] = count
    
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

 
@router.post("/generate-report")
def generate_report(
    police_station: Optional[str] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None)
):
    try:
        query = {}
        if police_station:
            query["POLICE_STATION"] = police_station.upper()

        data = list(thefts_collection.find(query, {"_id": 0}))
        if not data:
            return JSONResponse(content={"message": "No data found in DB."}, status_code=404)

        df = pd.DataFrame(data)

        # Parse DATE column safely into a new column DATE_PARSED
        if "DATE" in df.columns:
            df["DATE_PARSED"] = pd.to_datetime(df["DATE"].astype(str), errors="coerce", infer_datetime_format=True)
        elif "Date" in df.columns:
            df["DATE_PARSED"] = pd.to_datetime(df["Date"].astype(str), errors="coerce", infer_datetime_format=True)
        else:
            df["DATE_PARSED"] = pd.to_datetime(pd.Series([pd.NaT] * len(df)))

        # Determine start/end timestamps
        start_dt = pd.to_datetime(start_date, errors="coerce") if start_date else df["DATE_PARSED"].min()
        end_dt = pd.to_datetime(end_date, errors="coerce") if end_date else df["DATE_PARSED"].max()

        if pd.isna(start_dt) or pd.isna(end_dt):
            return JSONResponse(
                content={"message": "Invalid or missing date range; provide valid start_date and end_date (YYYY-MM-DD) or ensure DATE column exists in DB."},
                status_code=400
            )

        if start_dt > end_dt:
            start_dt, end_dt = end_dt, start_dt

        # Filter by parsed dates
        df = df[(df["DATE_PARSED"] >= start_dt) & (df["DATE_PARSED"] <= end_dt)]

        if df.empty:
            return JSONResponse(content={"message": "No data found for the given date range."}, status_code=404)

        # Total thefts
        total_thefts = int(len(df))

        # Most targeted police station (safe)
        if "POLICE_STATION" in df.columns:
            station_series = df["POLICE_STATION"].fillna("Unknown").astype(str)
            most_targeted_station = station_series.value_counts().idxmax() if not station_series.value_counts().empty else "Unknown"
        else:
            most_targeted_station = "Unknown"

        # Most common time slot (safe)
        if "Time_of_day" in df.columns:
            time_series = df["Time_of_day"].dropna().astype(str)
        elif "Time_of_Day" in df.columns:
            time_series = df["Time_of_Day"].dropna().astype(str)
        else:
            time_series = pd.Series(dtype=object)
        most_common_time = time_series.value_counts().idxmax() if not time_series.empty else "Unknown"

        # Most stolen model (safe)
        if "MAKE" in df.columns:
            make_series = df["MAKE"].dropna().astype(str)
        elif "Make" in df.columns:
            make_series = df["Make"].dropna().astype(str)
        else:
            make_series = pd.Series(dtype=object)
        most_stolen_model = make_series.value_counts().idxmax() if not make_series.empty else "Unknown"

        # Busiest day
        date_notna = df["DATE_PARSED"].dropna()
        highest_theft_day = date_notna.dt.strftime("%Y-%m-%d").value_counts().idxmax() if not date_notna.empty else "Unknown"

        # Average per day
        num_days = int((end_dt.normalize() - start_dt.normalize()).days) + 1
        avg_per_day = round(total_thefts / num_days, 2) if num_days > 0 else 0

        report_title = "Bike Theft Analysis Report"
        date_range = f"{start_dt.strftime('%Y-%m-%d')} to {end_dt.strftime('%Y-%m-%d')}"
        generated_on = datetime.now().strftime("%Y-%m-%d")

        summary_text = (
            f"Between {start_dt.strftime('%Y-%m-%d')} and {end_dt.strftime('%Y-%m-%d')}, there were {total_thefts} bike thefts. "
            f"The most targeted police station was {most_targeted_station}, "
            f"with most thefts during {most_common_time} hours. "
            f"The most stolen model was {most_stolen_model}. "
            f"The busiest day was {highest_theft_day}."
        )

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




