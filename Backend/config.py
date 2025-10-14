import os

class Config:
    # General App Settings
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'nazmi-boutique-secret-key-2024'

    # Database
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

    # Razorpay
    RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID') or 'your-razorpay-key-id'
    RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET') or 'your-razorpay-key-secret'
