from flask import Blueprint, request, jsonify
import stripe
from app import db
from models.order import Order

payments_bp = Blueprint('payments', __name__)

@payments_bp.route('/create-payment', methods=['POST'])
def create_payment():
    try:
        data = request.get_json()
        order_number = data.get('order_number')
        
        order = Order.query.filter_by(order_number=order_number).first()
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        
        # In a real implementation, you would use Stripe here
        # For now, we'll simulate payment creation
        payment_id = f"pay_{order_number}_{len(order_number)}"
        
        # Update order payment status
        order.payment_status = 'paid'
        db.session.commit()
        
        return jsonify({
            'payment_id': payment_id,
            'status': 'created',
            'amount': order.total_amount,
            'order_number': order_number
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@payments_bp.route('/confirm-payment', methods=['POST'])
def confirm_payment():
    try:
        data = request.get_json()
        payment_id = data.get('payment_id')
        order_number = data.get('order_number')
        
        # Simulate payment confirmation
        # In real implementation, verify with Stripe
        
        order = Order.query.filter_by(order_number=order_number).first()
        if order:
            order.payment_status = 'confirmed'
            order.status = 'confirmed'
            db.session.commit()
        
        return jsonify({
            'message': 'Payment confirmed successfully',
            'payment_id': payment_id,
            'status': 'confirmed'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500