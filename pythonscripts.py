from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["theft_db"]
thefts_collection = db["thefts"]
 
def clean_coord(coord):
    if coord is None:
        return None
     
    coord_str = str(coord)
     
    cleaned = ''.join(c for c in coord_str if c.isdigit() or c in ['.', '-'])
    try:
        return float(cleaned)
    except ValueError:
        return None

all_records = thefts_collection.find()
for record in all_records:
    lat_str = record.get("LATITUDE")
    lon_str = record.get("LONGITUDE")

    lat = clean_coord(lat_str)
    lon = clean_coord(lon_str)

    if lat is not None and lon is not None:
        thefts_collection.update_one(
            {"_id": record["_id"]},
            {"$set": {"LATITUDE": lat, "LONGITUDE": lon}}
        )
        print(f"Updated: {record['_id']} -> {lat}, {lon}")
    else:
        print(f"Skipping: {record} Error: could not convert LAT/LON")
