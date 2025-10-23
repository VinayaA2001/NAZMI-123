import logging
from flask_mail import Message
from flask import current_app

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self, mail):
        self.mail = mail
    
    def send_order_confirmation(self, order_data, customer_email):
        """Send order confirmation email"""
        try:
            subject = f"Order Confirmation - {order_data.get('order_number', '')}"
            
            # Create HTML email content
            html_content = self._create_order_confirmation_template(order_data)
            
            msg = Message(
                subject=subject,
                recipients=[customer_email],
                html=html_content
            )
            
            self.mail.send(msg)
            logger.info(f"Order confirmation email sent to {customer_email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send order confirmation email: {str(e)}")
            return False
    
    def send_payment_receipt(self, payment_data, customer_email):
        """Send payment receipt email"""
        try:
            subject = f"Payment Receipt - {payment_data.get('razorpay_payment_id', '')}"
            
            html_content = self._create_payment_receipt_template(payment_data)
            
            msg = Message(
                subject=subject,
                recipients=[customer_email],
                html=html_content
            )
            
            self.mail.send(msg)
            logger.info(f"Payment receipt email sent to {customer_email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send payment receipt email: {str(e)}")
            return False
    
    def _create_order_confirmation_template(self, order_data):
        """Create HTML template for order confirmation"""
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: #f8f9fa; padding: 20px; text-align: center; border-radius: 5px; }}
                .order-details {{ background: #fff; padding: 20px; margin: 20px 0; border: 1px solid #ddd; border-radius: 5px; }}
                .footer {{ margin-top: 20px; font-size: 12px; color: #666; text-align: center; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>NAZMI Boutique</h1>
                    <h2>Order Confirmation</h2>
                </div>
                
                <p>Dear {order_data.get('customer_name', 'Customer')},</p>
                <p>Thank you for your order! We're excited to let you know that we've received your order and it is being processed.</p>
                
                <div class="order-details">
                    <h3>Order Details</h3>
                    <p><strong>Order Number:</strong> {order_data.get('order_number', 'N/A')}</p>
                    <p><strong>Order Date:</strong> {order_data.get('created_at', 'N/A')}</p>
                    <p><strong>Total Amount:</strong> ₹{order_data.get('total_amount', 0):.2f}</p>
                    <p><strong>Status:</strong> {order_data.get('status', 'Pending')}</p>
                </div>
                
                <p>We will notify you once your order has been shipped.</p>
                <p>If you have any questions, please don't hesitate to contact us.</p>
                
                <div class="footer">
                    <p>Thank you for choosing NAZMI Boutique!</p>
                    <p>Email: nazmiboutique1@gmail.com</p>
                </div>
            </div>
        </body>
        </html>
        """
    
    def _create_payment_receipt_template(self, payment_data):
        """Create HTML template for payment receipt"""
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: #f8f9fa; padding: 20px; text-align: center; border-radius: 5px; }}
                .payment-details {{ background: #fff; padding: 20px; margin: 20px 0; border: 1px solid #ddd; border-radius: 5px; }}
                .footer {{ margin-top: 20px; font-size: 12px; color: #666; text-align: center; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>NAZMI Boutique</h1>
                    <h2>Payment Receipt</h2>
                </div>
                
                <p>Dear Customer,</p>
                <p>Thank you for your payment! Here are your payment details:</p>
                
                <div class="payment-details">
                    <h3>Payment Details</h3>
                    <p><strong>Payment ID:</strong> {payment_data.get('razorpay_payment_id', 'N/A')}</p>
                    <p><strong>Order ID:</strong> {payment_data.get('razorpay_order_id', 'N/A')}</p>
                    <p><strong>Amount Paid:</strong> ₹{payment_data.get('amount', 0):.2f}</p>
                    <p><strong>Payment Date:</strong> {payment_data.get('payment_date', 'N/A')}</p>
                    <p><strong>Status:</strong> Successful</p>
                </div>
                
                <p>Your order is now being processed.</p>
                
                <div class="footer">
                    <p>Thank you for choosing NAZMI Boutique!</p>
                    <p>Email: nazmiboutique1@gmail.com</p>
                </div>
            </div>
        </body>
        </html>
        """