from app import create_app, mongo  # mongo is the PyMongo instance

app = create_app()

with app.app_context():
    # Example: Ensure collections exist by inserting a dummy document if needed
    collections = ["users", "products", "orders", "payments", "subscriptions"]
    for collection in collections:
        if collection not in mongo.db.list_collection_names():
            mongo.db[collection].insert_one({"init": f"{collection} collection created"})
            print(f"{collection} collection created successfully!")

    print("MongoDB is connected and all collections are ready!")
