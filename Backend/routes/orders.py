from flask import Blueprint, request, jsonify, g
from bson import ObjectId
from datetime import datetime
import os
import logging

from utils.helpers import token_required
from app import mongo, razorpay_client, mail  # <-- ensure app.py exposes mail & razorpay_client
from utils.payment import PaymentService
from utils.email import EmailService
from flask_mail import Message

orders_bp = Blueprint('orders', __name__)
logger = logging.getLogger(__name__)

# ===== Admin contact =====
ADMIN_EMAIL = "nazmiboutique1@gmail.com"
ADMIN_PHONE = "9995947709"  # for future SMS/WhatsApp if you wire it

# ===== Services =====
payment_service = PaymentService(razorpay_client) if razorpay_client else None
email_service = EmailService(mail)

# --------------------------------------
# Helpers
# --------------------------------------
def _get_current_user_or_guest():
    """
    Return current user if present (middleware may set g.current_user).
    If not present and guests are allowed, return None.
    Otherwise return 'REQUIRE_AUTH' sentinel to force 401.
    """
    user = getattr(g, "current_user", None)
    if user:
        return user

    allow_guest = os.getenv("ALLOW_GUEST_CHECKOUT", "true").lower() == "true"
    if allow_guest:
        return None
    return "REQUIRE_AUTH"


def _send_admin_plain_email(subject: str, body_text: str):
    """Send a plain/text email to admin without touching EmailService templates."""
    try:
        msg = Message(subject=subject, recipients=[ADMIN_EMAIL])
        msg.body = body_text
        mail.send(msg)
        return True
    except Exception as e:
        logger.error(f"Admin email send error: {e}")
        return False


# --------------------------------------
# Create Order (guest-friendly)
# POST /orders
# --------------------------------------
@orders_bp.route('/orders', methods=['POST'])
def create_order():
    # --- auth gate ---
    user = _get_current_user_or_guest()
    if user == "REQUIRE_AUTH":
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json(silent=True) or {}
    items = data.get("items", [])

    if not items:
        return jsonify({'error': 'Order items required'}), 400

    # compute total
    try:
        total = sum(float(i['price']) * int(i['quantity']) for i in items)
    except Exception:
        return jsonify({'error': 'Invalid items format'}), 400

    # Build order document
    order = {
        "user_id": ObjectId(user['_id']) if user and user.get('_id') else None,
        "order_number": f"ORD{int(datetime.utcnow().timestamp())}",
        "customer_name": data.get('customer_name') or (user.get('username') if user else "Guest"),
        "customer_email": data.get('customer_email') or (user.get('email') if user else None),
        "customer_phone": data.get('customer_phone'),
        "shipping_address": data.get('shipping_address'),
        "status": "pending",
        "tracking_number": None,
        "total_amount": total,
        "payment_status": "pending",
        "created_at": datetime.utcnow()
    }
    order_id = mongo.db.orders.insert_one(order).inserted_id

    # Items collection
    for item in items:
        mongo.db.order_items.insert_one({
            "order_id": order_id,
            "product_id": ObjectId(item['product_id']),
            "variant_id": ObjectId(item.get('variant_id')) if item.get('variant_id') else None,
            "quantity": int(item['quantity']),
            "size": item.get('size'),
            "color": item.get('color'),
            "price": float(item['price']),
            "product_code": item.get('product_code')
        })

    # Decrement stock (product-level; adjust if you track per-variant stock separately)
    for item in items:
        try:
            mongo.db.products.update_one(
                {"_id": ObjectId(item['product_id'])},
                {"$inc": {"stock": -int(item['quantity'])}}
            )
        except Exception as e:
            logger.error(f"Stock update failed for product {item['product_id']}: {str(e)}")

    # Email notifications: admin + customer
    try:
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
        _send_admin_plain_email(admin_subject, admin_text)

        if order.get('customer_email'):
            email_service.send_order_confirmation({
                'order_number': order['order_number'],
                'customer_name': order['customer_name'],
                'total_amount': order['total_amount'],
                'status': order['status'],
                'created_at': order['created_at'].isoformat()
            }, order['customer_email'])
    except Exception as e:
        logger.error(f"Order email error: {str(e)}")

    return jsonify({
        'message': 'Order created',
        'order_number': order['order_number'],
        'order_id': str(order_id),
        'total_amount': total
    }), 201


# --------------------------------------
# Create Razorpay Payment (guest-friendly)
# POST /create-payment
# --------------------------------------
@orders_bp.route('/create-payment', methods=['POST'])
def create_payment():
    if not razorpay_client or not payment_service:
        return jsonify({'error': 'Payment service not configured'}), 500

    user = _get_current_user_or_guest()
    if user == "REQUIRE_AUTH":
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json(silent=True) or {}
    amount = data.get('amount')  # INR in rupees
    order_number = data.get('order_number')
    purpose = data.get('purpose', 'Product Purchase')

    if amount is None:
        return jsonify({'error': 'Amount required (INR)'}), 400

    try:
        # Razorpay takes paise; multiply by 100
        rzp_order = razorpay_client.order.create({
            "amount": int(float(amount) * 100),
            "currency": "INR",
            "payment_capture": 1,
            "notes": {
                "order_number": order_number or "",
                "purpose": purpose,
                "user_id": str(user['_id']) if user and user.get('_id') else "",
                "user_email": user.get('email') if user else "",
            }
        })

        # Save a copy in your payment store for traceability (optional)
        payment_service.save_payment_details({
            'razorpay_order_id': rzp_order['id'],
            'amount': float(amount),
            'currency': 'INR',
            'user_id': str(user['_id']) if user and user.get('_id') else None,
            'user_email': user.get('email') if user else None,
            'order_number': order_number,
            'created_at': datetime.utcnow().isoformat(),
            'status': 'created'
        })

        return jsonify({
            'success': True,
            'order_id': rzp_order['id'],
            'amount': rzp_order['amount'],
            'currency': rzp_order['currency'],
            'key': os.getenv('RAZORPAY_KEY_ID')
        })
    except Exception as e:
        logger.error(f"Razorpay order creation error: {str(e)}")
        return jsonify({'error': 'Payment creation failed', 'details': str(e)}), 500


# --------------------------------------
# Verify Razorpay Payment & Mark Order Paid (guest-friendly)
# POST /payment-success
# --------------------------------------
@orders_bp.route('/payment-success', methods=['POST'])
def payment_success():
    if not razorpay_client or not payment_service:
        return jsonify({'error': 'Payment service not configured'}), 500

    user = _get_current_user_or_guest()
    if user == "REQUIRE_AUTH":
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json(silent=True) or {}
    payment_id = data.get('razorpay_payment_id')
    order_id = data.get('razorpay_order_id')
    signature = data.get('razorpay_signature')
    order_number = data.get('order_number')  # helpful to update your own order

    if not all([payment_id, order_id, signature]):
        return jsonify({'error': 'Missing payment details'}), 400

    try:
        # Verify signature
        if not payment_service.verify_payment(payment_id, order_id, signature):
            return jsonify({'error': 'Payment verification failed'}), 400

        # Fetch details from Razorpay (amount in paise)
        details = payment_service.get_payment_details(payment_id)
        amount_paid = details['amount'] / 100.0 if details and details.get('amount') else float(data.get('amount', 0))
        currency = details.get('currency', 'INR') if details else 'INR'
        method = details.get('method', 'card') if details else 'unknown'

        # Persist payment
        payment_service.save_payment_details({
            'razorpay_payment_id': payment_id,
            'razorpay_order_id': order_id,
            'amount': amount_paid,
            'currency': currency,
            'user_id': str(user['_id']) if user and user.get('_id') else None,
            'user_email': user.get('email') if user else None,
            'payment_date': datetime.utcnow().isoformat(),
            'status': 'captured',
            'payment_method': method
        })

        # Mark your order paid if we know which one
        if order_number:
            mongo.db.orders.update_one(
                {"order_number": order_number},
                {"$set": {"payment_status": "paid", "status": "confirmed", "paid_at": datetime.utcnow()}}
            )

            # Email: send payment receipt to customer and a copy to admin
            try:
                # customer receipt
                cust_email = (user.get('email') if user else None) or data.get('customer_email')
                if cust_email:
                    email_service.send_payment_receipt({
                        'razorpay_payment_id': payment_id,
                        'razorpay_order_id': order_id,
                        'amount': amount_paid,
                        'payment_date': datetime.utcnow().isoformat()
                    }, cust_email)

                # admin notice
                _send_admin_plain_email(
                    f"Payment Captured: {order_number}",
                    f"Order: {order_number}\nPayment ID: {payment_id}\nAmount: ₹{amount_paid}\nMethod: {method}"
                )
            except Exception as e:
                logger.error(f"Payment email error: {e}")

        return jsonify({'success': True, 'message': 'Payment verified', 'payment_id': payment_id, 'order_id': order_id})
    except Exception as e:
        logger.error(f"Payment success processing error: {str(e)}")
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500


# --------------------------------------
# Track Order (public)
# GET /orders/<order_number>
# --------------------------------------
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
                'image': (product.get('images') or [None])[0]
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


# --------------------------------------
# User Orders (requires login)
# GET /user/orders
# --------------------------------------
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
