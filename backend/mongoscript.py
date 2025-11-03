import pandas as pd
from pymongo import MongoClient

# 1. Load CSV file
file_path = r"C:\Users\chava\Downloads\cleaned_data (2).csv"
df = pd.read_csv(file_path)

# 2. Connect to MongoDB (make sure MongoDB service is running locally)
client = MongoClient("mongodb://localhost:27017/")

# 3. Choose database & collection
db = client["theft_db"]       # database name
collection = db["thefts"]     # collection name

# 4. Convert DataFrame to dictionary
data = df.to_dict(orient="records")

 
if data:   
    collection.insert_many(data)
    print(f"✅ Inserted {len(data)} records into MongoDB!")
else:
    print("⚠ No data found in CSV.")