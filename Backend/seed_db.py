from pymongo import MongoClient
from datetime import datetime

# -----------------------------
# 1️⃣ Connect to MongoDB Atlas
# -----------------------------
client = MongoClient("mongodb+srv://admin:yourpassword@cluster0.xxxxx.mongodb.net")
db = client["nazmi_boutique"]

# Collections
users = db["users"]
products = db["products"]
orders = db["orders"]
payments = db["payments"]

print("MongoDB connected successfully!")

# -----------------------------
# 2️⃣ Insert Sample Users
# -----------------------------
users.insert_many([
    {
        "name": "Vinaya",
        "email": "vinayaammu2001@gmail.com",
        "password": "hashed_password_here",
        "address": "Kerala, India",
        "created_at": datetime.utcnow()
    },
    {
        "name": "Customer 2",
        "email": "customer2@example.com",
        "password": "hashed_password_here",
        "address": "Bangalore, India",
        "created_at": datetime.utcnow()
    }
])
print("Sample users added!")

# -----------------------------
# 3️⃣ Insert Sample Products
# -----------------------------
products.insert_many([
    {
        "name": "Floral Anarkali Dress",
        "category": "Women - Ethnic",
        "price": 1999,
        "sizes": ["S", "M", "L"],
        "stock": 10,
        "images": [
            "https://res.cloudinary.com/yourname/image/upload/v1/dress1.jpg",
            "https://res.cloudinary.com/yourname/image/upload/v1/dress2.jpg"
        ],
        "description": "Soft cotton floral print Anarkali.",
        "featured": True,
        "created_at": datetime.utcnow()
    },
    {
        "name": "Silk Kurti",
        "category": "Women - Ethnic",
        "price": 2499,
        "sizes": ["M", "L", "XL"],
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/yourname/image/upload/v1/kurti1.jpg"
        ],
        "description": "Elegant silk kurti with mirror work.",
        "featured": False,
        "created_at": datetime.utcnow()
    }
])
print("Sample products added!")

# -----------------------------
# 4️⃣ Insert Sample Orders
# -----------------------------
orders.insert_many([
    {
        "user_email": "vinayaammu2001@gmail.com",
        "items": [
            {"product_name": "Floral Anarkali Dress", "quantity": 1, "price": 1999}
        ],
        "total": 1999,
        "status": "pending",
        "payment_status": "unpaid",
        "created_at": datetime.utcnow()
    }
])
print("Sample orders added!")

# -----------------------------
# 5️⃣ Insert Sample Payments
# -----------------------------
payments.insert_many([
    {
        "order_id": "sample_order_id_1",
        "amount": 1999,
        "method": "card",
        "status": "success",
        "created_at": datetime.utcnow()
    }
])
print("Sample payments added!")

print("All sample data inserted successfully!")
