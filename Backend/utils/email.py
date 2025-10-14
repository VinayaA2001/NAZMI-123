from flask_mail import Message
from flask import render_template, current_app
from app import mail
import jwt
from time import time

def send_email(subject, sender, recipients, text_body, html_body):
    msg = Message(subject, sender=sender, recipients=recipients)
    msg.body = text_body
    msg.html = html_body
    mail.send(msg)

def send_verification_email(user):
    token = user.get_verification_token()
    verification_url = f"http://yourdomain.com/verify-email?token={token}"
    
    send_email(
        'Verify Your Email - Boutique Store',
        sender=current_app.config['MAIL_USERNAME'],
        recipients=[user.email],
        text_body=f'Please verify your email by clicking: {verification_url}',
        html_body=render_template('verification_email.html', 
                                user=user, 
                                verification_url=verification_url)
    )

def send_order_confirmation_email(order):
    send_email(
        f'Order Confirmation - #{order.order_number}',
        sender=current_app.config['MAIL_USERNAME'],
        recipients=[order.user.email],
        text_body=f'Your order #{order.order_number} has been confirmed.',
        html_body=render_template('order_confirmation.html', order=order)
    )

def send_newsletter(email, subject, content):
    send_email(
        subject,
        sender=current_app.config['MAIL_USERNAME'],
        recipients=[email],
        text_body=content,
        html_body=render_template('newsletter.html', content=content)
    )

def send_welcome_email(user):
    send_email(
        'Welcome to Our Boutique Store!',
        sender=current_app.config['MAIL_USERNAME'],
        recipients=[user.email],
        text_body='Thank you for registering with us!',
        html_body=render_template('welcome_email.html', user=user)
    )