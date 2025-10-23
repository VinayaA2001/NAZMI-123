from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime
import os
import logging
from utils.helpers import token_required
from app import mongo, razorpay_client
from utils.payment import PaymentService
from utils.email import EmailService
from flask_mail import Message

orders_bp = Blueprint('orders', __name__)
logger = logging.getLogger(__name__)

def send_simple_email(subject, recipients, body_text, body_html=None):
    from app import mail
    try:
        msg = Message(subject=subject, recipients=recipients)
        msg.body = body_text
        if body_html:
            msg.html = body_html
        mail.send(msg)
        return True, None
    except Exception as e:
        return False, str(e)

# Initialize services
mail_obj = None
def get_mail():
    from app import mail
    return mail

payment_service = PaymentService(razorpay_client) if razorpay_client else None
email_service = EmailService(get_mail())

@orders_bp.route('/orders', methods=['POST'])
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
    order_id = mongo.db.orders.insert_one(order).inserted_id

    for item in data['items']:
        mongo.db.order_items.insert_one({
            "order_id": order_id,
            "product_id": ObjectId(item['product_id']),
            "quantity": int(item['quantity']),
            "size": item.get('size'),
            "price": float(item['price'])
        })

    # Reduce stock
    for item in data['items']:
        try:
            mongo.db.products.update_one(
                {"_id": ObjectId(item['product_id'])},
                {"$inc": {"stock": -int(item['quantity'])}}
            )
        except Exception as e:
            logger.error(f"Stock update failed for product {item['product_id']}: {str(e)}")

    # Send order confirmation email
    try:
        order_data = {
            'order_number': order['order_number'],
            'customer_name': order['customer_name'],
            'total_amount': order['total_amount'],
            'status': order['status'],
            'created_at': order['created_at'].isoformat()
        }
        email_service.send_order_confirmation(order_data, order['customer_email'])
    except Exception as e:
        logger.error(f"Order confirmation email error: {str(e)}")

    return jsonify({
        'message': 'Order created', 
        'order_number': order['order_number'],
        'order_id': str(order_id),
        'total_amount': total
    }), 201

@orders_bp.route('/orders/<order_number>', methods=['GET'])
def track_order(order_number):
    order = mongo.db.orders.find_one({"order_number": order_number})
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    
    order_items = list(mongo.db.order_items.find({"order_id": order['_id']}))
    items_with_details = []
    
    for item in order_items:
        product = mongo.db.products.find_one({"_id": item['product_id']})
        if product:
            items_with_details.append({
                'product_name': product.get('product_code', 'Product'),
                'quantity': item['quantity'],
                'size': item.get('size'),
                'price': item['price'],
                'image': product.get('images', [])[0] if product.get('images') else None
            })

    return jsonify({
        'order_number': order['order_number'],
        'status': order['status'],
        'tracking_number': order.get('tracking_number'),
        'customer_name': order.get('customer_name'),
        'customer_email': order.get('customer_email'),
        'total_amount': order.get('total_amount'),
        'payment_status': order.get('payment_status'),
        'shipping_address': order.get('shipping_address'),
        'created_at': order.get('created_at'),
        'items': items_with_details
    })

@orders_bp.route('/user/orders', methods=['GET'])
@token_required
def get_user_orders(current_user):
    orders = list(mongo.db.orders.find({"user_id": ObjectId(current_user['_id'])}).sort("created_at", -1))
    
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

# ==================== PAYMENT ROUTES ====================

@orders_bp.route('/create-payment', methods=['POST'])
@token_required
def create_payment(current_user):
    if not razorpay_client or not payment_service:
        return jsonify({'error': 'Payment service not configured'}), 500

    data = request.get_json()
    if not data or 'amount' not in data:
        return jsonify({'error': 'Amount required (INR)'}), 400

    try:
        razorpay_order = razorpay_client.order.create({
            "amount": int(float(data['amount']) * 100),
            "currency": "INR",
            "payment_capture": 1,
            "notes": {
                "user_id": str(current_user['_id']),
                "user_email": current_user.get('email'),
                "purpose": data.get('purpose', 'Product Purchase'),
                "order_number": data.get('order_number')
            }
        })

        payment_data = {
            'razorpay_order_id': razorpay_order['id'],
            'amount': float(data['amount']),
            'currency': 'INR',
            'user_id': str(current_user['_id']),
            'user_email': current_user.get('email'),
            'order_number': data.get('order_number'),
            'created_at': datetime.utcnow().isoformat(),
            'status': 'created'
        }
        
        payment_service.save_payment_details(payment_data)

        return jsonify({
            'success': True,
            'order_id': razorpay_order['id'],
            'amount': razorpay_order['amount'],
            'currency': razorpay_order['currency'],
            'key': os.getenv('RAZORPAY_KEY_ID')
        })

    except Exception as e:
        logger.error(f"Razorpay order creation error: {str(e)}")
        return jsonify({'error': 'Payment creation failed', 'details': str(e)}), 500

@orders_bp.route('/payment-success', methods=['POST'])
@token_required
def payment_success(current_user):
    if not razorpay_client or not payment_service:
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

        if not payment_service.verify_payment(payment_id, order_id, signature):
            return jsonify({'error': 'Payment verification failed'}), 400

        payment_details = payment_service.get_payment_details(payment_id)
        
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

        payment_service.save_payment_details(payment_data)

        if data.get('order_number'):
            mongo.db.orders.update_one(
                {"order_number": data['order_number']},
                {
                    "$set": {
                        "payment_status": "paid", 
                        "status": "confirmed",
                        "paid_at": datetime.utcnow()
                    }
                }
            )

        email_service.send_payment_receipt(payment_data, current_user.get('email'))

        return jsonify({
            'success': True,
            'message': 'Payment verified successfully',
            'payment_id': payment_id,
            'order_id': order_id
        })

    except Exception as e:
        logger.error(f"Payment success processing error: {str(e)}")
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@orders_bp.route('/payment-details/<payment_id>', methods=['GET'])
@token_required
def get_payment_details(current_user, payment_id):
    if not payment_service:
        return jsonify({'error': 'Payment service not configured'}), 500

    try:
        payment_details = payment_service.get_payment_details(payment_id)
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