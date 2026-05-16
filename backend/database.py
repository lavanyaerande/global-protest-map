from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

client = MongoClient(os.getenv("MONGODB_URI"))
db = client[os.getenv("DB_NAME")]

protest_collection = db["protests"]


# MONGODB_URI=your_connection_string
# DB_NAME=global_protest_watch