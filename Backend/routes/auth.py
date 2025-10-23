from flask import Blueprint

auth_bp = Blueprint('auth', __name__)

# Routes moved to app.py to avoid circular imports