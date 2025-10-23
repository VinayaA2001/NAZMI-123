import os, json, jwt
from flask import Flask, request, jsonify, current_app, url_for
from flask_cors import CORS
from flask_pymongo import PyMongo
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
import razorpay
from flask_mail import Mail, Message
from dotenv import load_dotenv
from bson import ObjectId
import logging
from functools import wraps

# Load .env
load_dotenv()

app = Flask(__name__)
CORS(app)

# ------------------- CONFIG -------------------
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY') or "nazmi-boutique-secret-key"
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'True') in ['True', 'true', '1']
app.config['MAIL_USE_SSL'] = os.getenv('MAIL_USE_SSL', 'False') in ['True', 'true', '1']
app.config['MAIL_DEFAULT_SENDER'] = app.config['MAIL_USERNAME']

# Optional: JWT expiration days
JWT_EXPIRES_DAYS = int(os.getenv('JWT_EXPIRES_DAYS', 7))

# ------------------- INITIALIZE EXTENSIONS -------------------
mongo = PyMongo(app)
db = mongo.db
mail = Mail(app)

razorpay_client = None
if os.getenv('RAZORPAY_KEY_ID') and os.getenv('RAZORPAY_KEY_SECRET'):
    razorpay_client = razorpay.Client(
        auth=(os.getenv('RAZORPAY_KEY_ID'), os.getenv('RAZORPAY_KEY_SECRET'))
    )

# ------------------- HELPERS -------------------
def make_jwt(payload, expires_days=JWT_EXPIRES_DAYS):
    p = payload.copy()
    p['exp'] = datetime.utcnow() + timedelta(days=expires_days)
    token = jwt.encode(p, app.config['SECRET_KEY'], algorithm="HS256")
    if isinstance(token, bytes):
        token = token.decode('utf-8')
    return token

def decode_jwt(token):
    return jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token is missing!'}), 401
        try:
            token = token.replace('Bearer ', '')
            data = decode_jwt(token)
            current_user = db.users.find_one({"_id": ObjectId(data['user_id'])})
            if not current_user:
                return jsonify({'error': 'User not found'}), 401
        except Exception as e:
            return jsonify({'error': 'Token is invalid!', 'details': str(e)}), 401
        return f(current_user, *args, **kwargs)
    return decorated

def send_simple_email(subject, recipients, body_text, body_html=None):
    try:
        msg = Message(subject=subject, recipients=recipients)
        msg.body = body_text
        if body_html:
            msg.html = body_html
        mail.send(msg)
        return True, None
    except Exception as e:
        return False, str(e)

# ------------------- ROUTES -------------------

@app.route('/')
def home():
    return jsonify({"message": "Welcome to NAZMI Boutique API", "status": "running"})

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'timestamp': datetime.utcnow().isoformat()})

# ------------------- PRODUCTS -------------------

@app.route('/api/products', methods=['GET'])
def get_products():
    """Fetch all products (optionally filter by category or product_code)"""
    category = request.args.get('category')
    product_code = request.args.get('product_code')
    query = {}
    if category:
        query['category'] = category
    if product_code:
        query['product_code'] = product_code

    products = db.products.find(query)
    output = []
    for p in products:
        output.append({
            'id': str(p.get('_id')),
            'product_code': p.get('product_code', ''),
            'material': p.get('material', ''),
            'category': p.get('category', ''),
            'size': p.get('size', ''),
            'colour': p.get('colour', ''),
            'price': p.get('price', 0),
            'images': p.get('images', []),
            'stock': p.get('stock', None)
        })
    return jsonify(output)

@app.route('/api/products/<product_id>', methods=['GET'])
def get_product(product_id):
    try:
        product = db.products.find_one({"_id": ObjectId(product_id)})
    except Exception:
        return jsonify({'error': 'Invalid product id'}), 400
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    return jsonify({
        'id': str(product['_id']),
        'product_code': product.get('product_code', ''),
        'material': product.get('material', ''),
        'category': product.get('category', ''),
        'size': product.get('size', ''),
        'colour': product.get('colour', ''),
        'price': product.get('price', 0),
        'images': product.get('images', []),
        'stock': product.get('stock', None)
    })

@app.route('/api/products/categories', methods=['GET'])
def get_categories():
    categories = db.products.distinct("category")
    return jsonify(categories)

# Admin-only product creation endpoint (simple)
@app.route('/api/products', methods=['POST'])
def create_product():
    """Create product (expects JSON). For quick uploads/scripts."""
    data = request.get_json()
    if not data:
        return jsonify({'error': 'JSON body required'}), 400

    # Minimal validation
    required = ['product_code', 'price']
    for r in required:
        if r not in data:
            return jsonify({'error': f'{r} is required'}), 400

    doc = {
        'product_code': str(data.get('product_code')),
        'material': data.get('material'),
        'category': data.get('category'),
        'size': data.get('size'),
        'colour': data.get('colour'),
        'price': float(data.get('price', 0)),
        'images': data.get('images', []),
        'stock': int(data.get('stock', 0)) if data.get('stock') is not None else None,
        'created_at': datetime.utcnow()
    }
    res = db.products.insert_one(doc)
    return jsonify({'message': 'Product created', 'id': str(res.inserted_id)}), 201

# ------------------- USERS -------------------

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password required'}), 400

    if db.users.find_one({"email": data['email']}):
        return jsonify({'error': 'Email already registered'}), 400

    user = {
        "username": data.get('username', data['email'].split('@')[0]),
        "email": data['email'],
        "password": generate_password_hash(data['password']),
        "created_at": datetime.utcnow(),
        "is_admin": False,
        "is_verified": False
    }
    result = db.users.insert_one(user)
    
    token = make_jwt({"user_id": str(result.inserted_id)})

    # Send welcome + verification email
    try:
        verify_token = make_jwt({"user_id": str(result.inserted_id)}, expires_days=1)
        verify_url = f"{request.host_url.rstrip('/')}/api/verify-email?token={verify_token}"
        subject = "Verify your NAZMI Boutique account"
        body = f"Hi {user['username']},\n\nPlease verify your email by visiting: {verify_url}\n\nThanks!"
        send_simple_email(subject, [user['email']], body)
    except Exception as e:
        app.logger.error("Failed to send verification email: %s", e)

    return jsonify({'message': 'User registered', 'token': token}), 201

@app.route('/api/verify-email', methods=['GET'])
def verify_email():
    token = request.args.get('token')
    if not token:
        return jsonify({'error': 'Token required'}), 400
    try:
        data = decode_jwt(token)
        user_id = data.get('user_id')
        db.users.update_one({'_id': ObjectId(user_id)}, {'$set': {'is_verified': True}})
        return jsonify({'message': 'Email verified successfully'})
    except Exception as e:
        return jsonify({'error': 'Invalid or expired token', 'details': str(e)}), 400

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password required'}), 400

    user = db.users.find_one({"email": data['email']})
    if not user or not check_password_hash(user['password'], data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401

    token = make_jwt({"user_id": str(user['_id'])})
    return jsonify({'message': 'Login successful', 'token': token})

@app.route('/api/user/profile', methods=['GET'])
@token_required
def profile(current_user):
    return jsonify({
        'id': str(current_user['_id']),
        'username': current_user.get('username'),
        'email': current_user.get('email'),
        'is_admin': current_user.get('is_admin', False),
        'is_verified': current_user.get('is_verified', False),
        'created_at': current_user.get('created_at')
    })

# ------------------- ORDERS -------------------

@app.route('/api/orders', methods=['POST'])
@token_required
def create_order(current_user):
    data = request.get_json()
    if not data or not data.get('items'):
        return jsonify({'error': 'Order items required'}), 400

    try:
        total = sum([float(item['price']) * int(item['quantity']) for item in data['items']])
    except Exception:
        return jsonify({'error': 'Invalid items format'}), 400

    order = {
        "user_id": ObjectId(current_user['_id']),
        "order_number": f"ORD{int(datetime.utcnow().timestamp())}",
        "customer_name": data.get('customer_name', current_user.get('username')),
        "customer_email": data.get('customer_email', current_user.get('email')),
        "customer_phone": data.get('customer_phone'),
        "shipping_address": data.get('shipping_address'),
        "status": "pending",
        "tracking_number": None,
        "total_amount": total,
        "payment_status": "pending",
        "created_at": datetime.utcnow()
    }
    order_id = db.orders.insert_one(order).inserted_id

    for item in data['items']:
        db.order_items.insert_one({
            "order_id": order_id,
            "product_id": ObjectId(item['product_id']),
            "quantity": int(item['quantity']),
            "size": item.get('size'),
            "price": float(item['price'])
        })

    # Reduce stock
    for item in data['items']:
        try:
            db.products.update_one(
                {"_id": ObjectId(item['product_id'])},
                {"$inc": {"stock": -int(item['quantity'])}}
            )
        except Exception as e:
            print(f"Stock update failed for product {item['product_id']}: {str(e)}")

    # Send order confirmation email
    try:
        subject = f"Order Confirmation - {order['order_number']}"
        body = f"Dear {order['customer_name']},\n\nYour order {order['order_number']} has been placed.\nTotal: ₹{order['total_amount']}\n\nThanks for shopping."
        send_simple_email(subject, [order['customer_email']], body)
    except Exception as e:
        print(f"Email Error: {e}")

    return jsonify({'message': 'Order created', 'order_number': order['order_number']}), 201

@app.route('/api/orders/<order_number>', methods=['GET'])
def track_order(order_number):
    order = db.orders.find_one({"order_number": order_number})
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    return jsonify({
        'order_number': order['order_number'],
        'status': order['status'],
        'tracking_number': order.get('tracking_number'),
        'customer_name': order.get('customer_name'),
        'total_amount': order.get('total_amount'),
        'created_at': order.get('created_at')
    })

@app.route('/api/user/orders', methods=['GET'])
@token_required
def get_user_orders(current_user):
    orders = list(db.orders.find({"user_id": ObjectId(current_user['_id'])}).sort("created_at", -1))
    
    output = []
    for order in orders:
        output.append({
            'order_number': order['order_number'],
            'status': order['status'],
            'total_amount': order['total_amount'],
            'payment_status': order['payment_status'],
            'created_at': order['created_at'],
            'tracking_number': order.get('tracking_number')
        })
    
    return jsonify(output)

# ------------------- PAYMENTS -------------------

@app.route('/api/create-payment', methods=['POST'])
@token_required
def create_payment(current_user):
    if not razorpay_client:
        return jsonify({'error': 'Razorpay not configured on server'}), 500

    data = request.get_json()
    if not data or 'amount' not in data:
        return jsonify({'error': 'Amount required (INR)'}), 400

    try:
        payment = razorpay_client.order.create({
            "amount": int(float(data['amount']) * 100),  # paise
            "currency": "INR",
            "payment_capture": 1,
            "notes": {
                "user_id": str(current_user['_id']),
                "user_email": current_user.get('email'),
                "purpose": data.get('purpose', 'Product Purchase'),
                "order_number": data.get('order_number')
            }
        })

        # Save payment details
        payment_data = {
            'razorpay_order_id': payment['id'],
            'amount': float(data['amount']),
            'currency': 'INR',
            'user_id': str(current_user['_id']),
            'user_email': current_user.get('email'),
            'order_number': data.get('order_number'),
            'created_at': datetime.utcnow().isoformat(),
            'status': 'created'
        }
        
        # Save to instance folder
        try:
            payments_dir = os.path.join('instance', 'payments')
            os.makedirs(payments_dir, exist_ok=True)
            
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"payment_{payment['id']}_{timestamp}.json"
            file_path = os.path.join(payments_dir, filename)
            
            with open(file_path, 'w') as f:
                json.dump(payment_data, f, indent=2, default=str)
            
            print(f"Payment details saved to {file_path}")
        except Exception as e:
            print(f"Failed to save payment details: {str(e)}")

        return jsonify({
            'success': True,
            'order_id': payment['id'],
            'amount': payment['amount'],
            'currency': payment['currency'],
            'key': os.getenv('RAZORPAY_KEY_ID')
        })

    except Exception as e:
        print(f"Razorpay order creation error: {str(e)}")
        return jsonify({'error': 'Payment creation failed', 'details': str(e)}), 500

@app.route('/api/payment-success', methods=['POST'])
@token_required
def payment_success(current_user):
    if not razorpay_client:
        return jsonify({'error': 'Payment service not configured'}), 500

    data = request.get_json()
    if not data:
        return jsonify({'error': 'JSON body required'}), 400

    try:
        payment_id = data.get('razorpay_payment_id')
        order_id = data.get('razorpay_order_id')
        signature = data.get('razorpay_signature')

        if not all([payment_id, order_id, signature]):
            return jsonify({'error': 'Missing payment details'}), 400

        # Verify payment signature
        try:
            params_dict = {
                'razorpay_payment_id': payment_id,
                'razorpay_order_id': order_id,
                'razorpay_signature': signature
            }
            razorpay_client.utility.verify_payment_signature(params_dict)
        except Exception as e:
            return jsonify({'error': 'Payment verification failed'}), 400

        # Get payment details from Razorpay
        try:
            payment_details = razorpay_client.payment.fetch(payment_id)
        except Exception:
            payment_details = None
        
        # Prepare payment data for saving and email
        payment_data = {
            'razorpay_payment_id': payment_id,
            'razorpay_order_id': order_id,
            'amount': payment_details['amount'] / 100 if payment_details else float(data.get('amount', 0)),
            'currency': payment_details.get('currency', 'INR'),
            'user_id': str(current_user['_id']),
            'user_email': current_user.get('email'),
            'payment_date': datetime.utcnow().isoformat(),
            'status': 'captured',
            'payment_method': payment_details.get('method', 'card') if payment_details else 'unknown'
        }

        # Save payment details
        try:
            payments_dir = os.path.join('instance', 'payments')
            os.makedirs(payments_dir, exist_ok=True)
            
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"payment_{payment_id}_{timestamp}.json"
            file_path = os.path.join(payments_dir, filename)
            
            with open(file_path, 'w') as f:
                json.dump(payment_data, f, indent=2, default=str)
            
            print(f"Payment success details saved to {file_path}")
        except Exception as e:
            print(f"Failed to save payment success details: {str(e)}")

        # Update order payment status if order_number is provided
        if data.get('order_number'):
            db.orders.update_one(
                {"order_number": data['order_number']},
                {
                    "$set": {
                        "payment_status": "paid", 
                        "status": "confirmed",
                        "paid_at": datetime.utcnow()
                    }
                }
            )

        # Send payment receipt email
        try:
            subject = f"Payment Receipt - {payment_id}"
            body = f"Dear {current_user.get('username', 'Customer')},\n\nYour payment of ₹{payment_data['amount']} was successful.\nPayment ID: {payment_id}\n\nThank you for your purchase!"
            send_simple_email(subject, [current_user.get('email')], body)
        except Exception as e:
            print(f"Payment receipt email error: {str(e)}")

        return jsonify({
            'success': True,
            'message': 'Payment verified successfully',
            'payment_id': payment_id,
            'order_id': order_id
        })

    except Exception as e:
        print(f"Payment success processing error: {str(e)}")
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@app.route('/api/payment-details/<payment_id>', methods=['GET'])
@token_required
def get_payment_details(current_user, payment_id):
    if not razorpay_client:
        return jsonify({'error': 'Payment service not configured'}), 500

    try:
        payment_details = razorpay_client.payment.fetch(payment_id)
        if not payment_details:
            return jsonify({'error': 'Payment not found'}), 404
        
        return jsonify({
            'payment_id': payment_details.get('id'),
            'amount': payment_details.get('amount', 0) / 100,
            'currency': payment_details.get('currency'),
            'status': payment_details.get('status'),
            'method': payment_details.get('method'),
            'created_at': payment_details.get('created_at'),
            'bank': payment_details.get('bank'),
            'wallet': payment_details.get('wallet')
        })
    except Exception as e:
        return jsonify({'error': 'Failed to fetch payment details', 'details': str(e)}), 500

# ------------------- SUBSCRIPTION / NEWSLETTER -------------------

@app.route('/api/subscribe', methods=['POST'])
def subscribe():
    data = request.get_json()
    email = data.get('email') if data else None
    if not email:
        return jsonify({'error': 'Email required'}), 400

    db.newsletter.update_one({'email': email}, {'$set': {'email': email, 'subscribed_at': datetime.utcnow()}}, upsert=True)
    # Optionally send welcome
    send_simple_email('Subscribed to NAZMI Newsletter', [email], 'Thanks for subscribing to our newsletter!')
    return jsonify({'message': 'Subscribed'})

# ------------------- RUN APP -------------------

if __name__ == '__main__':
    print("🚀 Starting NAZMI Boutique Backend...")
    print("📍 Listening on http://127.0.0.1:5000")
    app.run(debug=True, port=5000, host='0.0.0.0')