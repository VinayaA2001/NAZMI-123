from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
import json
from datetime import datetime
from werkzeug.security import generate_password_hash

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///boutique.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'nazmi-boutique-secret-key-2024'

db = SQLAlchemy(app)

# Define models with proper table names
class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    image = db.Column(db.String(500))
    sizes = db.Column(db.String(500))
    category = db.Column(db.String(50))
    featured = db.Column(db.Boolean, default=False)
    stock = db.Column(db.Integer, default=0)

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_admin = db.Column(db.Boolean, default=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'is_admin': self.is_admin
        }

class Order(db.Model):
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(20), unique=True, nullable=False)
    customer_name = db.Column(db.String(100), nullable=False)
    customer_email = db.Column(db.String(100), nullable=False)
    customer_phone = db.Column(db.String(20))
    shipping_address = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(50), default='pending')
    tracking_number = db.Column(db.String(50))
    total_amount = db.Column(db.Float, nullable=False)
    payment_status = db.Column(db.String(50), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class OrderItem(db.Model):
    __tablename__ = 'order_items'
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    size = db.Column(db.String(10), nullable=False)
    price = db.Column(db.Float, nullable=False)

def init_database():
    with app.app_context():
        # Drop all tables and recreate them to ensure clean schema
        db.drop_all()
        db.create_all()
        
        # Add sample products
        sample_products = [
            Product(
                name="Floral Print Anarkali", 
                description="Beautiful floral print anarkali with intricate embroidery", 
                price=2299, 
                image="/images/poster1.png", 
                sizes=json.dumps(["S", "M", "L", "XL"]), 
                category="traditional", 
                featured=True,
                stock=50
            ),
            Product(
                name="Designer Silk Saree", 
                description="Pure silk saree with zari border and elegant pallu", 
                price=3599, 
                image="/images/poster2.png", 
                sizes=json.dumps(["Free Size"]), 
                category="traditional", 
                featured=True,
                stock=25
            ),
            Product(
                name="Embroidered Kurti", 
                description="Elegant embroidered kurti with mirror work", 
                price=1299, 
                image="/images/poster3.png", 
                sizes=json.dumps(["S", "M", "L"]), 
                category="traditional", 
                featured=False,
                stock=75
            ),
            Product(
                name="A-Line Western Dress", 
                description="Elegant A-line dress perfect for parties and events", 
                price=1899, 
                image="/images/poster1.png", 
                sizes=json.dumps(["XS", "S", "M", "L"]), 
                category="western", 
                featured=True,
                stock=40
            ),
            Product(
                name="Designer Crop Top", 
                description="Trendy crop top with contemporary design", 
                price=799, 
                image="/images/poster2.png", 
                sizes=json.dumps(["S", "M", "L"]), 
                category="western", 
                featured=False,
                stock=60
            ),
            Product(
                name="Office Formal Wear", 
                description="Professional formal wear for corporate settings", 
                price=1599, 
                image="/images/poster3.png", 
                sizes=json.dumps(["S", "M", "L", "XL"]), 
                category="western", 
                featured=True,
                stock=35
            )
        ]
        
        for product in sample_products:
            db.session.add(product)
        
        # Add a sample admin user
        admin_user = User(
            username="admin",
            email="admin@nazmi.com",
            password_hash=generate_password_hash("admin123"),
            is_admin=True
        )
        db.session.add(admin_user)
        
        db.session.commit()
        print("✅ Database initialized with sample data!")

@app.route('/')
def home():
    return jsonify({
        "message": "Welcome to NAZMI Boutique API", 
        "status": "running",
        "version": "1.0.0"
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy', 
        'message': 'NAZMI Boutique API is running',
        'timestamp': datetime.utcnow().isoformat()
    })

@app.route('/api/products', methods=['GET'])
def get_products():
    try:
        category = request.args.get('category')
        featured = request.args.get('featured')
        
        query = Product.query
        
        if category:
            query = query.filter(Product.category == category)
        if featured:
            query = query.filter(Product.featured == True)
            
        products = query.all()
        products_list = []
        for p in products:
            products_list.append({
                'id': p.id,
                'name': p.name,
                'description': p.description,
                'price': p.price,
                'image': p.image,
                'sizes': json.loads(p.sizes) if p.sizes else [],
                'category': p.category,
                'featured': p.featured,
                'stock': p.stock
            })
        return jsonify(products_list)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    try:
        product = Product.query.get_or_404(product_id)
        return jsonify({
            'id': product.id,
            'name': product.name,
            'description': product.description,
            'price': product.price,
            'image': product.image,
            'sizes': json.loads(product.sizes) if product.sizes else [],
            'category': product.category,
            'featured': product.featured,
            'stock': product.stock
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/products/categories', methods=['GET'])
def get_categories():
    try:
        categories = db.session.query(Product.category).distinct().all()
        category_list = [category[0] for category in categories if category[0]]
        return jsonify(category_list)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# NEW ENDPOINT: User Profile
@app.route('/api/user/profile', methods=['GET'])
def get_user_profile():
    try:
        # Get token from header
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'Authorization header required'}), 401
        
        # Simple token verification (in real app, use JWT)
        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            # Extract user ID from token (simple implementation)
            if token.startswith('user_'):
                user_id = token.split('_')[1]
            else:
                user_id = token
        else:
            user_id = auth_header
        
        # Get user data
        user = User.query.get(int(user_id))
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify(user.to_dict())
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# UPDATED: Register endpoint with token
@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Check if user already exists
        if User.query.filter_by(email=data.get('email')).first():
            return jsonify({'error': 'User already exists with this email'}), 400
        
        # Create new user
        user = User(
            username=data.get('username', data.get('email').split('@')[0]),
            email=data.get('email'),
            password_hash=generate_password_hash(data.get('password'))
        )
        
        db.session.add(user)
        db.session.commit()
        
        # Create simple token
        token = f"user_{user.id}"
        
        return jsonify({
            'message': 'User registered successfully',
            'token': token,
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# UPDATED: Login endpoint with token
@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        user = User.query.filter_by(email=data.get('email')).first()
        
        if user and check_password_hash(user.password_hash, data.get('password')):
            # Create simple token
            token = f"user_{user.id}"
            
            return jsonify({
                'message': 'Login successful',
                'token': token,
                'user': user.to_dict()
            })
        else:
            return jsonify({'error': 'Invalid email or password'}), 401
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/order/<order_number>', methods=['GET'])
def track_order(order_number):
    order = Order.query.filter_by(order_number=order_number).first()
    if order:
        return jsonify({
            'order_number': order.order_number,
            'status': order.status,
            'tracking_number': order.tracking_number,
            'customer_name': order.customer_name,
            'created_at': order.created_at.isoformat()
        })
    else:
        return jsonify({'error': 'Order not found'}), 404

@app.route('/api/create-payment', methods=['POST'])
def create_payment():
    return jsonify({'payment_id': 'pay_123', 'status': 'created'})

def check_password_hash(password_hash, password):
    from werkzeug.security import check_password_hash as check_pw
    return check_pw(password_hash, password)

if __name__ == '__main__':
    print("🚀 Starting NAZMI Boutique Backend...")
    print("📦 Initializing database...")
    init_database()
    print("✅ Database initialized successfully!")
    print("📍 Server running on: http://localhost:5000")
    print("📚 Available endpoints:")
    print("   - GET  /")
    print("   - GET  /api/health")
    print("   - GET  /api/products")
    print("   - GET  /api/products/<id>")
    print("   - GET  /api/products/categories")
    print("   - POST /api/register")
    print("   - POST /api/login")
    print("   - GET  /api/user/profile")  # NEW
    print("   - GET  /api/order/<order_number>")
    print("   - POST /api/create-payment")
    
    app.run(debug=True, port=5000, host='0.0.0.0')