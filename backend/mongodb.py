from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["theft_db"]
thefts_collection = db["thefts"]