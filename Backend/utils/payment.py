import razorpay
import json
import logging
from datetime import datetime
import os
from bson import ObjectId

logger = logging.getLogger(__name__)

class PaymentService:
    def __init__(self, razorpay_client):
        self.client = razorpay_client
    
    def create_razorpay_order(self, amount, currency='INR', receipt=None, notes=None):
        """Create Razorpay order"""
        try:
            data = {
                'amount': int(amount * 100),  # Convert to paise
                'currency': currency,
                'payment_capture': 1
            }
            
            if receipt:
                data['receipt'] = receipt
            
            if notes:
                data['notes'] = notes
            
            order = self.client.order.create(data=data)
            logger.info(f"Razorpay order created: {order['id']}")
            return order
            
        except Exception as e:
            logger.error(f"Failed to create Razorpay order: {str(e)}")
            return None
    
    def verify_payment(self, payment_id, order_id, signature):
        """Verify payment signature"""
        try:
            params_dict = {
                'razorpay_payment_id': payment_id,
                'razorpay_order_id': order_id,
                'razorpay_signature': signature
            }
            
            return self.client.utility.verify_payment_signature(params_dict)
            
        except Exception as e:
            logger.error(f"Payment verification failed: {str(e)}")
            return False
    
    def save_payment_details(self, payment_data):
        """Save payment details to instance folder"""
        try:
            # Create payments directory if it doesn't exist
            payments_dir = os.path.join('instance', 'payments')
            os.makedirs(payments_dir, exist_ok=True)
            
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"payment_{payment_data.get('razorpay_payment_id', 'unknown')}_{timestamp}.json"
            file_path = os.path.join(payments_dir, filename)
            
            with open(file_path, 'w') as f:
                json.dump(payment_data, f, indent=2, default=str)
            
            logger.info(f"Payment details saved to {file_path}")
            return file_path
            
        except Exception as e:
            logger.error(f"Failed to save payment details: {str(e)}")
            return None
    
    def get_payment_details(self, payment_id):
        """Fetch payment details from Razorpay"""
        try:
            payment = self.client.payment.fetch(payment_id)
            return payment
        except Exception as e:
            logger.error(f"Failed to fetch payment details: {str(e)}")
            return None