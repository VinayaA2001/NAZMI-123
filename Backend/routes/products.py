from flask import Blueprint

products_bp = Blueprint('products', __name__)

# Routes moved to app.py to avoid circular imports