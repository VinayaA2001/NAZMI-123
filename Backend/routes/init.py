from flask import jsonify, request
from models import db, Product, Order, OrderItem
import json
from datetime import datetime
import random
import string

def init_routes(app):
    
    @app.route('/')
    def home():
        return jsonify({
            "message": "Welcome to NAZMI Boutique API",
            "status": "running",
            "version": "1.0.0",
            "endpoints": {
                "health": "/api/health",
                "products": "/api/products",
                "product_detail": "/api/products/<id>",
                "categories": "/api/categories",
                "create_order": "/api/orders",
                "order_tracking": "/api/orders/<order_number>",
                "create_payment": "/api/payments"
            }
        })

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'message': 'NAZMI Boutique API is running smoothly',
            'timestamp': datetime.now().isoformat(),
            'database': 'connected' if Product.query.first() else 'empty'
        })

    @app.route('/api/products', methods=['GET'])
    def get_products():
        try:
            category = request.args.get('category')
            featured = request.args.get('featured')
            
            query = Product.query
            
            if category and category != 'all':
                query = query.filter(Product.category == category)
            
            if featured:
                query = query.filter(Product.featured == (featured.lower() == 'true'))
            
            products = query.all()
            return jsonify([product.to_dict() for product in products])
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/api/products/<int:product_id>', methods=['GET'])
    def get_product(product_id):
        try:
            product = Product.query.get_or_404(product_id)
            return jsonify(product.to_dict())
        except Exception as e:
            return jsonify({'error': str(e)}), 404

    @app.route('/api/categories', methods=['GET'])
    def get_categories():
        try:
            categories = db.session.query(Product.category).distinct().all()
            category_list = [category[0] for category in categories if category[0]]
            
            return jsonify({
                'categories': category_list,
                'count': len(category_list)
            })
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/api/orders', methods=['POST'])
    def create_order():
        try:
            data = request.json
            
            # Generate unique order number
            order_number = 'NAZMI' + ''.join(random.choices(string.digits, k=8))
            
            # Calculate total
            total_amount = sum(item['quantity'] * item['price'] for item in data['items'])
            
            order = Order(
                order_number=order_number,
                customer_name=data['customer']['name'],
                customer_email=data['customer']['email'],
                customer_phone=data['customer'].get('phone'),
                customer_address=data['customer'].get('address'),
                total_amount=total_amount,
                status='confirmed'
            )
            
            db.session.add(order)
            db.session.flush()  # Get order ID
            
            # Add order items
            for item_data in data['items']:
                item = OrderItem(
                    order_id=order.id,
                    product_id=item_data['product_id'],
                    product_name=item_data['name'],
                    quantity=item_data['quantity'],
                    price=item_data['price'],
                    selected_size=item_data.get('selected_size')
                )
                db.session.add(item)
            
            db.session.commit()
            
            return jsonify({
                'order_number': order_number,
                'status': 'created',
                'message': 'Order created successfully',
                'total_amount': total_amount
            })
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

    @app.route('/api/orders/<order_number>', methods=['GET'])
    def get_order(order_number):
        try:
            order = Order.query.filter_by(order_number=order_number).first_or_404()
            
            order_data = {
                'order_number': order.order_number,
                'customer_name': order.customer_name,
                'customer_email': order.customer_email,
                'status': order.status,
                'total_amount': order.total_amount,
                'tracking_number': order.tracking_number,
                'payment_status': order.payment_status,
                'created_at': order.created_at.isoformat(),
                'items': [{
                    'product_name': item.product_name,
                    'quantity': item.quantity,
                    'price': item.price,
                    'selected_size': item.selected_size
                } for item in order.items]
            }
            
            return jsonify(order_data)
            
        except Exception as e:
            return jsonify({'error': 'Order not found'}), 404

    @app.route('/api/payments', methods=['POST'])
    def create_payment():
        try:
            data = request.json
            
            # Simulate payment processing
            payment_id = 'pay_' + ''.join(random.choices(string.digits + string.ascii_lowercase, k=16))
            
            return jsonify({
                'payment_id': payment_id,
                'status': 'success',
                'message': 'Payment processed successfully',
                'amount': data.get('amount'),
                'order_id': data.get('order_id')
            })
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500