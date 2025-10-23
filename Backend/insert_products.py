from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load your MONGO_URI from .env
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)
db = client.get_default_database()
collection = db.products

# List of all 30 products
products = [
    {
        "code": 2920,
        "name": "Premium 3 piece salwar set",
        "material": "silk",
        "size": "XXL",
        "colours": ["orange", "green"],
        "price": 3150,
        "stock": 2,
        "category": "Traditional",
        "image_url": "https://res.cloudinary.com/dq5xhg9uo/image/upload/v1760016970/white1_fqnmu8.jpg"
    },
    {
        "code": 2870,
        "name": "Premium 3 piece salwar set",
        "material": "",
        "size": ["M","L","XXL"],
        "colours": ["Purple"],
        "price": 2350,
        "stock": 3,
        "category": "Traditional",
        "image_url": "https://res.cloudinary.com/dq5xhg9uo/image/upload/v1760016970/white2_ofcwl1.jpg"
    },
    {
        "code": 2215,
        "name": "Premium 3 piece churidar set",
        "material": "Georget",
        "size": "XL",
        "colours": ["off white"],
        "price": 2700,
        "stock": 1,
        "category": "Traditional",
        "image_url": "https://res.cloudinary.com/dq5xhg9uo/image/upload/v1760016970/white3_bsq2zk.jpg"
    }
    # ... add all remaining products up to 30
]

# Insert all products at once
collection.insert_many(products)
print("30 products added successfully!")
