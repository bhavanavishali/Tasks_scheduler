from pymongo import MongoClient
import os 
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")


client = MongoClient(MONGO_URL)
DATABASE_NAME = os.getenv("DATABASE_NAME") 

db=client[DATABASE_NAME]  # create database

# collections

users_collection=db["users"]
tasks_collection=db["tasks"]



