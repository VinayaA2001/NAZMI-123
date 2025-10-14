from app import create_app, db
from models.user import User
from models.product import Product
from models.order import Order, OrderItem
from models.payment import Payment, Subscription

app = create_app()

with app.app_context():
    db.create_all()
    print("Database tables created successfully!")