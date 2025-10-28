from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime
import logging

from app import mongo, mail, razorpay_client
from utils.email import EmailService
from utils.payment import PaymentService
from flask_mail import Message

orders_bp = Blueprint('orders', __name__)
logger = logging.getLogger(__name__)

# ===== Admin Contact =====
ADMIN_EMAIL = "nazmiboutique1@gmail.com"

# ===== Services =====
email_service = EmailService(mail)
payment_service = PaymentService(razorpay_client) if razorpay_client else None


# --------------------------------------
# Helper: Send Admin Notification
# --------------------------------------
def send_admin_email(subject: str, body: str):
    try:
        msg = Message(subject=subject, recipients=[ADMIN_EMAIL])
        msg.body = body
        mail.send(msg)
        return True
    except Exception as e:
        logger.error(f"Admin email send error: {e}")
        return False


# --------------------------------------
# Create Order
# --------------------------------------
@orders_bp.route('/orders', methods=['POST'])
def create_order():
    data = request.get_json() or {}
    items = data.get("items", [])

    if not items:
        return jsonify({'error': 'Order items required'}), 400

    total = sum(float(i['price']) * int(i['quantity']) for i in items)
    order = {
        "order_number": f"ORD{int(datetime.utcnow().timestamp())}",
        "customer_name": data.get('customer_name', 'Guest'),
        "customer_email": data.get('customer_email'),
        "customer_phone": data.get('customer_phone'),
        "shipping_address": data.get('shipping_address'),
        "status": "pending",
        "payment_status": "pending",
        "total_amount": total,
        "created_at": datetime.utcnow()
    }

    order_id = mongo.db.orders.insert_one(order).inserted_id

    # Insert items
    for item in items:
        mongo.db.order_items.insert_one({
            "order_id": order_id,
            "product_id": ObjectId(item['product_id']),
            "quantity": int(item['quantity']),
            "price": float(item['price']),
            "size": item.get('size'),
            "color": item.get('color')
        })

    # Send emails
    try:
        send_admin_email(
            f"New Order: {order['order_number']}",
            f"Customer: {order['customer_name']}\nTotal: ₹{total}"
        )

        if order.get('customer_email'):
            email_service.send_order_confirmation({
                'order_number': order['order_number'],
                'customer_name': order['customer_name'],
                'total_amount': total,
                'status': order['status'],
                'created_at': order['created_at'].isoformat()
            }, order['customer_email'])
    except Exception as e:
        logger.error(f"Email send error: {e}")

    return jsonify({
        'message': 'Order created',
        'order_number': order['order_number'],
        'total_amount': total
    }), 201


# --------------------------------------
# Payment Success
# --------------------------------------
@orders_bp.route('/payment-success', methods=['POST'])
def payment_success():
    data = request.get_json() or {}
    payment_id = data.get('razorpay_payment_id')
    order_number = data.get('order_number')
    customer_email = data.get('customer_email')
    amount = data.get('amount')

    if not all([payment_id, order_number, amount]):
        return jsonify({'error': 'Missing payment details'}), 400

    try:
        mongo.db.orders.update_one(
            {"order_number": order_number},
            {"$set": {"payment_status": "paid", "status": "confirmed"}}
        )

        if customer_email:
            email_service.send_payment_receipt({
                'razorpay_payment_id': payment_id,
                'amount': amount,
                'payment_date': datetime.utcnow().isoformat()
            }, customer_email)

        send_admin_email(
            f"Payment Received: {order_number}",
            f"Payment ID: {payment_id}\nAmount: ₹{amount}"
        )

        return jsonify({'success': True, 'message': 'Payment processed successfully'})
    except Exception as e:
        logger.error(f"Payment success error: {e}")
        return jsonify({'error': 'Internal error', 'details': str(e)}), 500


# --------------------------------------
# Track Order
# --------------------------------------
@orders_bp.route('/orders/<order_number>', methods=['GET'])
def track_order(order_number):
    order = mongo.db.orders.find_one({"order_number": order_number})
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    order_items = list(mongo.db.order_items.find({"order_id": order['_id']}))
    return jsonify({
        'order_number': order['order_number'],
        'status': order['status'],
        'total_amount': order['total_amount'],
        'payment_status': order['payment_status'],
        'shipping_address': order.get('shipping_address'),
        'customer_name': order.get('customer_name'),
        'items': [
            {
                'product_id': str(i['product_id']),
                'quantity': i['quantity'],
                'price': i['price']
            }
            for i in order_items
        ]
    })
