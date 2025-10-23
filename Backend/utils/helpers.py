import jwt
from flask import current_app, request, jsonify
from bson import ObjectId
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps

def make_jwt(payload, expires_days=7):
    p = payload.copy()
    p['exp'] = datetime.utcnow() + timedelta(days=expires_days)
    token = jwt.encode(p, current_app.config['SECRET_KEY'], algorithm="HS256")
    if isinstance(token, bytes):
        token = token.decode('utf-8')
    return token

def decode_jwt(token):
    return jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token is missing!'}), 401
        try:
            token = token.replace('Bearer ', '')
            data = decode_jwt(token)
            from app import mongo
            current_user = mongo.db.users.find_one({"_id": ObjectId(data['user_id'])})
            if not current_user:
                return jsonify({'error': 'User not found'}), 401
        except Exception as e:
            return jsonify({'error': 'Token is invalid!', 'details': str(e)}), 401
        return f(current_user, *args, **kwargs)
    return decorated

# Export security functions
__all__ = ['make_jwt', 'decode_jwt', 'token_required', 'generate_password_hash', 'check_password_hash']