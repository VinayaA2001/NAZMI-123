from flask import Blueprint, request, jsonify
from app import db
from models.order import Order, OrderItem
from models.product import Product
import json
import random
import string

orders_bp = Blueprint('orders', __name__)

def generate_order_number():
    return 'NAZMI' + ''.join(random.choices(string.digits, k=8))

@orders_bp.route('/', methods=['POST'])
def create_order():
    try:
        data = request.get_json()
        
        # Generate unique order number
        order_number = generate_order_number()
        while Order.query.filter_by(order_number=order_number).first():
            order_number = generate_order_number()
        
        # Calculate total amount
        total_amount = 0
        for item in data.get('items', []):
            product = Product.query.get(item['product_id'])
            if product:
                total_amount += product.price * item['quantity']
        
        # Create order
        order = Order(
            order_number=order_number,
            customer_name=data.get('customer_name'),
            customer_email=data.get('customer_email'),
            customer_phone=data.get('customer_phone'),
            shipping_address=data.get('shipping_address'),
            total_amount=total_amount,
            user_id=data.get('user_id')
        )
        
        db.session.add(order)
        db.session.flush()  # Get the order ID
        
        # Create order items
        for item_data in data.get('items', []):
            product = Product.query.get(item_data['product_id'])
            if product:
                order_item = OrderItem(
                    order_id=order.id,
                    product_id=item_data['product_id'],
                    quantity=item_data['quantity'],
                    size=item_data['size'],
                    price=product.price
                )
                db.session.add(order_item)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Order created successfully',
            'order': order.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/<order_number>', methods=['GET'])
def get_order(order_number):
    try:
        order = Order.query.filter_by(order_number=order_number).first()
        if not order:
            return jsonify({'error': 'Order not found'}), 404
            
        return jsonify(order.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/track/<order_number>', methods=['GET'])
def track_order(order_number):
    try:
        order = Order.query.filter_by(order_number=order_number).first()
        if not order:
            return jsonify({'error': 'Order not found'}), 404
            
        return jsonify({
            'order_number': order.order_number,
            'status': order.status,
            'tracking_number': order.tracking_number,
            'customer_name': order.customer_name,
            'created_at': order.created_at.isoformat()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500