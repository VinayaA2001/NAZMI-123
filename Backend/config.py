import os

class Config:
    # General App Settings
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'nazmi-boutique-secret-key-2024'

    # SQLAlchemy (if you still need it)
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///boutique.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Stripe (optional)
    STRIPE_SECRET_KEY = os.environ.get('STRIPE_SECRET_KEY') or 'your-stripe-secret-key'
    STRIPE_PUBLISHABLE_KEY = os.environ.get('STRIPE_PUBLISHABLE_KEY') or 'your-stripe-publishable-key'

    # Mail Configuration
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME') or 'your-email@gmail.com'
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD') or 'your-email-app-password'
    MAIL_DEFAULT_SENDER = MAIL_USERNAME

    # MongoDB Configuration
    MONGO_USER = os.environ.get("MONGO_USER") or "vinayaammu2001"
    MONGO_PASS = os.environ.get("MONGO_PASS") or "kgroup@123"
    MONGO_DB = os.environ.get("MONGO_DB") or "nazmi_boutique"
    MONGO_CLUSTER = os.environ.get("MONGO_CLUSTER") or "cluster0.xxxxx.mongodb.net"

    MONGO_URI = f"mongodb+srv://{MONGO_USER}:{MONGO_PASS}@{MONGO_CLUSTER}/{MONGO_DB}?retryWrites=true&w=majority"
