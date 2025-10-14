from flask import Blueprint, request, jsonify
from app import db
from models.subscription import Subscription
from utils.email import send_newsletter

subscriptions_bp = Blueprint('subscriptions', __name__)

@subscriptions_bp.route('/subscribe', methods=['POST'])
def subscribe():
    email = request.json.get('email')
    
    if not email:
        return jsonify({'success': False, 'message': 'Email is required'}), 400
    
    # Check if already subscribed
    existing = Subscription.query.filter_by(email=email).first()
    if existing:
        if existing.is_active:
            return jsonify({'success': False, 'message': 'Already subscribed'}), 400
        else:
            existing.is_active = True
            db.session.commit()
    else:
        new_subscription = Subscription(email=email)
        db.session.add(new_subscription)
        db.session.commit()
    
    # Send welcome newsletter
    send_newsletter(
        email,
        'Welcome to Our Newsletter!',
        'Thank you for subscribing to our boutique newsletter!'
    )
    
    return jsonify({'success': True, 'message': 'Subscribed successfully'})

@subscriptions_bp.route('/unsubscribe', methods=['POST'])
def unsubscribe():
    email = request.json.get('email')
    
    subscription = Subscription.query.filter_by(email=email).first()
    if subscription:
        subscription.is_active = False
        db.session.commit()
        return jsonify({'success': True, 'message': 'Unsubscribed successfully'})
    
    return jsonify({'success': False, 'message': 'Subscription not found'}), 404

@subscriptions_bp.route('/send-newsletter', methods=['POST'])
def send_bulk_newsletter():
    # Admin function to send newsletter to all subscribers
    subject = request.json.get('subject')
    content = request.json.get('content')
    
    subscribers = Subscription.query.filter_by(is_active=True).all()
    
    for subscriber in subscribers:
        send_newsletter(subscriber.email, subject, content)
    
    return jsonify({'success': True, 'message': f'Newsletter sent to {len(subscribers)} subscribers'})