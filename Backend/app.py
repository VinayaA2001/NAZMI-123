# C:\Users\Admin\OneDrive\Desktop\NAZMI-123\Backend\app.py
import os, json, jwt
from flask import Flask, request, jsonify, current_app
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

# CORS (allow Next.js dev host)
CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": ["http://localhost:3000"]}})

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


# Behaviour
JWT_EXPIRES_DAYS = int(os.getenv('JWT_EXPIRES_DAYS', 7))
ALLOW_GUEST_CHECKOUT = os.getenv('ALLOW_GUEST_CHECKOUT', 'true').lower() == 'true'
ADMIN_EMAIL = "nazmiboutique1@gmail.com"

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

def get_current_user_optional():
    """Return user if Authorization present & valid, else None."""
    token = request.headers.get('Authorization')
    if not token:
        return None
    try:
        token = token.replace('Bearer ', '')
        data = decode_jwt(token)
        user = db.users.find_one({"_id": ObjectId(data['user_id'])})
        return user or None
    except Exception:
        return None

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

def send_admin_plain(subject: str, text: str):
    """Send a simple plain text email copy to admin."""
    try:
        msg = Message(subject=subject, recipients=[ADMIN_EMAIL])
        msg.body = text
        mail.send(msg)
        return True
    except Exception as e:
        current_app.logger.error(f"Admin email send error: {e}")
        return False

# ------------------- ROUTES -------------------

@app.route('/')
def home():
    return jsonify({"message": "Welcome to NAZMI Boutique API", "status": "running"})

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'timestamp': datetime.utcnow().isoformat()})

# ---------- PRODUCTS ----------
@app.route('/api/products', methods=['GET'])
def get_products():
    """Fetch all products with support for multi-color or multi-size variants."""
    try:
        category = request.args.get('category')
        product_code_query = request.args.get('product_code')
        query = {}
        if category:
            query['category'] = category
        if product_code_query:
            query['product_code'] = product_code_query

        products_cursor = db.products.find(query)
        products_list = list(products_cursor)

        if not products_list:
            return jsonify([])

        product_map = {}

        for product in products_list:
            code = product.get('product_code')
            if not code:
                continue

            if code not in product_map:
                product_map[code] = {
                    '_id': str(product['_id']),
                    'product_code': code,
                    'product_name': product.get('product_name', ''),
                    'material': product.get('material', ''),
                    'category': product.get('category', ''),
                    'description': f"{product.get('material', '')} {product.get('category', '')}".strip(),
                    'variants': [],
                    'availableSizes': set(),
                    'availableColors': set(),
                    'totalStock': 0,
                    'minPrice': float('inf'),
                    'maxPrice': 0,
                    'images': []
                }

            base_product = product_map[code]

            variants = []
            if isinstance(product.get('variants'), list):
                variants = product['variants']
            elif not variants:
                variants = [{
                    'size': product.get('size', 'One Size'),
                    'colour': product.get('colour', 'Standard'),
                    'stock': product.get('stock') or product.get('quantity') or 0,
                    'price': product.get('price', 0),
                    'images': product.get('images', [])
                }]

            for var in variants:
                size = var.get('size', product.get('size', 'One Size'))
                color = var.get('colour', var.get('color', product.get('colour', 'Standard')))
                stock = var.get('stock', var.get('quantity', product.get('quantity', 0)))
                price = var.get('price', product.get('price', 0))
                images = var.get('images', product.get('images', []))

                try:
                    stock = int(stock)
                except:
                    stock = 0
                try:
                    price = float(price)
                except:
                    price = 0

                variant_obj = {
                    'size': str(size),
                    'colour': str(color),
                    'stock': stock,
                    'price': price,
                    'images': images
                }

                base_product['variants'].append(variant_obj)
                base_product['availableSizes'].add(str(size))
                base_product['availableColors'].add(str(color))
                base_product['totalStock'] += stock
                if price > 0:
                    base_product['minPrice'] = min(base_product['minPrice'], price)
                    base_product['maxPrice'] = max(base_product['maxPrice'], price)

                if images:
                    base_product['images'].extend(images)

        output = []
        for prod in product_map.values():
            prod['availableSizes'] = sorted(list(prod['availableSizes']))
            prod['availableColors'] = sorted(list(prod['availableColors']))
            prod['images'] = list(dict.fromkeys(prod['images']))  # dedupe

            if prod['minPrice'] == float('inf'):
                prod['minPrice'] = 0
            if prod['maxPrice'] == 0:
                prod['maxPrice'] = prod['minPrice']

            if prod['variants']:
                first_variant = prod['variants'][0]
                prod['colour'] = first_variant.get('colour', '')
                prod['images'] = first_variant.get('images', prod.get('images', []))

            output.append(prod)

        return jsonify(output)

    except Exception as e:
        current_app.logger.error(f"Error in get_products: {str(e)}")
        return jsonify({'error': f'Failed to fetch products: {str(e)}'}), 500

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

# ---------- DEBUG ----------
@app.route('/api/debug/products', methods=['GET'])
def debug_products():
    try:
        products = list(db.products.find().limit(10))
        for product in products:
            product['_id'] = str(product['_id'])
        return jsonify({'count': len(products), 'products': products})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/debug/stock', methods=['GET'])
def debug_stock():
    try:
        products = list(db.products.find().limit(10))
        stock_info = []
        for product in products:
            all_fields = {k: v for k, v in product.items() if k != '_id'}
            variants_type = 'None'
            if 'variants' in product and product.get('variants') is not None:
                variants_type = type(product.get('variants')).__name__
            stock_info.append({
                'product_id': str(product['_id']),
                'product_code': product.get('product_code'),
                'product_name': product.get('product_name'),
                'main_stock': product.get('stock'),
                'quantity': product.get('quantity'),
                'size': product.get('size'),
                'colour': product.get('colour'),
                'price': product.get('price'),
                'variants_raw': product.get('variants'),
                'variants_type': variants_type,
                'all_fields': all_fields
            })
        return jsonify({'count': len(stock_info), 'stock_data': stock_info})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/debug/db', methods=['GET'])
def debug_db():
    try:
        collections = db.list_collection_names()
        products_count = db.products.count_documents({})
        users_count = db.users.count_documents({})
        return jsonify({'collections': collections, 'products_count': products_count, 'users_count': users_count, 'status': 'connected'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ---------- ADMIN CREATE PRODUCT ----------
@app.route('/api/admin/products', methods=['POST'])
def create_product():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'JSON body required'}), 400
    required = ['product_code', 'price', 'material', 'category']
    for r in required:
        if r not in data:
            return jsonify({'error': f'{r} is required'}), 400
    try:
        doc = {
            'product_code': str(data.get('product_code')),
            'product_name': data.get('product_name', ''),
            'material': data.get('material'),
            'category': data.get('category'),
            'size': data.get('size', 'One Size'),
            'colour': data.get('colour', 'Standard'),
            'price': float(data.get('price', 0)),
            'images': data.get('images', ['/images/placeholder.jpg']),
            'stock': int(data.get('stock', 10)),
            'created_at': datetime.utcnow()
        }
        res = db.products.insert_one(doc)
        return jsonify({'message': 'Product created', 'id': str(res.inserted_id), 'product_code': doc['product_code']}), 201
    except Exception as e:
        return jsonify({'error': f'Failed to create product: {str(e)}'}), 500

# ---------- USERS ----------
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

# ---------- ORDERS (GUEST CHECKOUT ENABLED) ----------
@app.route('/api/orders', methods=['POST'])
def create_order():
    # If guest checkout disabled, require token
    if not ALLOW_GUEST_CHECKOUT and not request.headers.get('Authorization'):
        return jsonify({'error': 'Unauthorized'}), 401

    current_user = get_current_user_optional()  # may be None (guest)
    data = request.get_json()
    if not data or not data.get('items'):
        return jsonify({'error': 'Order items required'}), 400

    try:
        total = sum([float(item['price']) * int(item['quantity']) for item in data['items']])
    except Exception:
        return jsonify({'error': 'Invalid items format'}), 400

    order = {
        "user_id": ObjectId(current_user['_id']) if current_user else None,
        "order_number": f"ORD{int(datetime.utcnow().timestamp())}",
        "customer_name": data.get('customer_name', (current_user.get('username') if current_user else 'Guest')),
        "customer_email": data.get('customer_email', (current_user.get('email') if current_user else None)),
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
            "colour": item.get('color'),
            "price": float(item['price']),
            "variant_id": ObjectId(item.get('variant_id')) if item.get('variant_id') else None,
            "product_code": item.get('product_code')
        })

    # Reduce stock (variant-aware if present)
    for item in data['items']:
        try:
            product = db.products.find_one({"_id": ObjectId(item['product_id'])})
            if product and 'variants' in product and product['variants']:
                db.products.update_one(
                    {
                        "_id": ObjectId(item['product_id']),
                        "variants.size": item.get('size'),
                        "variants.colour": item.get('color')
                    },
                    {"$inc": {"variants.$.stock": -int(item['quantity'])}}
                )
            else:
                db.products.update_one(
                    {"_id": ObjectId(item['product_id'])},
                    {"$inc": {"stock": -int(item['quantity'])}}
                )
        except Exception as e:
            current_app.logger.error(f"Stock update failed for product {item['product_id']}: {str(e)}")

    # Email: customer + admin copy
    try:
        if order.get('customer_email'):
            subject = f"Order Confirmation - {order['order_number']}"
            body = (
                f"Dear {order['customer_name']},\n\n"
                f"Your order {order['order_number']} has been placed.\n"
                f"Total: ₹{order['total_amount']}\n\nThanks for shopping."
            )
            send_simple_email(subject, [order['customer_email']], body)

        admin_subject = f"New Order: {order['order_number']}"
        admin_text = (
            f"Order Number: {order['order_number']}\n"
            f"Customer: {order['customer_name']}\n"
            f"Phone: {order.get('customer_phone')}\n"
            f"Email: {order.get('customer_email')}\n"
            f"Address: {order.get('shipping_address')}\n"
            f"Total: ₹{order['total_amount']}\n"
            f"Status: {order['status']}\n"
        )
        send_admin_plain(admin_subject, admin_text)
    except Exception as e:
        current_app.logger.error(f"Order email error: {e}")

    return jsonify({
        'message': 'Order created',
        'order_number': order['order_number'],
        'order_id': str(order_id),
        'total_amount': total
    }), 201

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

# ---------- PAYMENTS (GUEST CHECKOUT ENABLED) ----------
@app.route('/api/create-payment', methods=['POST'])
def create_payment():
    if not razorpay_client:
        return jsonify({'error': 'Razorpay not configured on server'}), 500

    if not ALLOW_GUEST_CHECKOUT and not request.headers.get('Authorization'):
        return jsonify({'error': 'Unauthorized'}), 401

    current_user = get_current_user_optional()
    data = request.get_json()
    if not data or 'amount' not in data:
        return jsonify({'error': 'Amount required (INR)'}), 400

    try:
        payment = razorpay_client.order.create({
            "amount": int(float(data['amount']) * 100),  # paise
            "currency": "INR",
            "payment_capture": 1,
            "notes": {
                "order_number": data.get('order_number'),
                "purpose": data.get('purpose', 'Product Purchase'),
                "user_id": str(current_user['_id']) if current_user else "",
                "user_email": current_user.get('email') if current_user else ""
            }
        })

        # Optional: persist stub
        try:
            payments_dir = os.path.join('instance', 'payments')
            os.makedirs(payments_dir, exist_ok=True)
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"payment_{payment['id']}_{timestamp}.json"
            with open(os.path.join(payments_dir, filename), 'w') as f:
                json.dump({
                    'razorpay_order_id': payment['id'],
                    'amount': float(data['amount']),
                    'currency': 'INR',
                    'user_id': str(current_user['_id']) if current_user else None,
                    'user_email': current_user.get('email') if current_user else None,
                    'order_number': data.get('order_number'),
                    'created_at': datetime.utcnow().isoformat(),
                    'status': 'created'
                }, f, indent=2, default=str)
        except Exception as e:
            current_app.logger.warning(f"Saving payment stub failed: {e}")

        return jsonify({
            'success': True,
            'order_id': payment['id'],
            'amount': payment['amount'],
            'currency': payment['currency'],
            'key': os.getenv('RAZORPAY_KEY_ID')
        })
    except Exception as e:
        current_app.logger.error(f"Razorpay order creation error: {e}")
        return jsonify({'error': 'Payment creation failed', 'details': str(e)}), 500

@app.route('/api/payment-success', methods=['POST'])
def payment_success():
    if not razorpay_client:
        return jsonify({'error': 'Payment service not configured'}), 500

    if not ALLOW_GUEST_CHECKOUT and not request.headers.get('Authorization'):
        return jsonify({'error': 'Unauthorized'}), 401

    current_user = get_current_user_optional()
    data = request.get_json()
    if not data:
        return jsonify({'error': 'JSON body required'}), 400

    try:
        payment_id = data.get('razorpay_payment_id')
        order_id = data.get('razorpay_order_id')
        signature = data.get('razorpay_signature')
        order_number = data.get('order_number')

        if not all([payment_id, order_id, signature]):
            return jsonify({'error': 'Missing payment details'}), 400

        # Verify signature
        try:
            params_dict = {
                'razorpay_payment_id': payment_id,
                'razorpay_order_id': order_id,
                'razorpay_signature': signature
            }
            razorpay_client.utility.verify_payment_signature(params_dict)
        except Exception:
            return jsonify({'error': 'Payment verification failed'}), 400

        # Fetch payment details
        try:
            payment_details = razorpay_client.payment.fetch(payment_id)
        except Exception:
            payment_details = None

        amount_paid = payment_details['amount'] / 100 if payment_details else float(data.get('amount', 0))
        currency = payment_details.get('currency', 'INR') if payment_details else 'INR'
        method = payment_details.get('method', 'card') if payment_details else 'unknown'

        # Optional: persist success
        try:
            payments_dir = os.path.join('instance', 'payments')
            os.makedirs(payments_dir, exist_ok=True)
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"payment_{payment_id}_{timestamp}.json"
            with open(os.path.join(payments_dir, filename), 'w') as f:
                json.dump({
                    'razorpay_payment_id': payment_id,
                    'razorpay_order_id': order_id,
                    'amount': amount_paid,
                    'currency': currency,
                    'user_id': str(current_user['_id']) if current_user else None,
                    'user_email': current_user.get('email') if current_user else None,
                    'payment_date': datetime.utcnow().isoformat(),
                    'status': 'captured',
                    'payment_method': method
                }, f, indent=2, default=str)
        except Exception as e:
            current_app.logger.warning(f"Saving payment success failed: {e}")

        # Update order to paid
        if order_number:
            db.orders.update_one(
                {"order_number": order_number},
                {"$set": {"payment_status": "paid", "status": "confirmed", "paid_at": datetime.utcnow()}}
            )

        # Email receipt (customer) + admin copy
        try:
            customer_email = (current_user.get('email') if current_user else None) or data.get('customer_email')
            if customer_email:
                subject = f"Payment Receipt - {payment_id}"
                body = (
                    f"Dear Customer,\n\nYour payment of ₹{amount_paid} was successful.\n"
                    f"Payment ID: {payment_id}\n\nThank you for your purchase!"
                )
                send_simple_email(subject, [customer_email], body)

            send_admin_plain(
                f"Payment Captured: {order_number or order_id}",
                f"Order: {order_number}\nPayment ID: {payment_id}\nAmount: ₹{amount_paid}\nMethod: {method}"
            )
        except Exception as e:
            current_app.logger.error(f"Payment receipt email error: {e}")

        return jsonify({'success': True, 'message': 'Payment verified successfully',
                        'payment_id': payment_id, 'order_id': order_id})
    except Exception as e:
        current_app.logger.error(f"Payment success processing error: {e}")
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

# ---------- SUBSCRIPTION ----------
@app.route('/api/subscribe', methods=['POST'])
def subscribe():
    data = request.get_json()
    email = data.get('email') if data else None
    if not email:
        return jsonify({'error': 'Email required'}), 400

    db.newsletter.update_one({'email': email}, {'$set': {'email': email, 'subscribed_at': datetime.utcnow()}}, upsert=True)
    send_simple_email('Subscribed to NAZMI Newsletter', [email], 'Thanks for subscribing to our newsletter!')
    return jsonify({'message': 'Subscribed'})
# ------------------- RUN APP -------------------

# ✅ Add this test email route before the app.run section
@app.route('/api/send-test-email', methods=['GET'])
def send_test_email():
    """Simple route to test email configuration."""
    try:
        msg = Message(
            subject="Nazmi Boutique Email Test",
            recipients=["nazmiboutique1@gmail.com"],
            body="✅ Test email from Flask app — your Gmail SMTP settings work!"
        )
        mail.send(msg)
        return jsonify({"message": "Test email sent successfully!"}), 200
    except Exception as e:
        print("Email send error:", e)
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    print("🚀 Starting NAZMI Boutique Backend...")
    print("📍 Listening on http://127.0.0.1:5000")
    print("🔍 Debug endpoints available:")
    print("   - http://127.0.0.1:5000/api/debug/db")
    print("   - http://127.0.0.1:5000/api/debug/products")
    print("   - http://127.0.0.1:5000/api/debug/stock")
    print("   - http://127.0.0.1:5000/api/send-test-email  ✅ (new)")
    app.run(debug=True, port=5000, host='0.0.0.0')
