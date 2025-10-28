# routes/email_routes.py
from flask import Blueprint, request, jsonify
from utils.email import EmailService
from app import mail

email_bp = Blueprint("email", __name__)
email_service = EmailService(mail)

@email_bp.route("/api/send-email", methods=["POST"])
def send_email():
    data = request.get_json()
    to = data.get("to")
    subject = data.get("subject", "Message from NAZMI Boutique")
    message = data.get("message", "")

    try:
        from flask_mail import Message
        msg = Message(subject=subject, recipients=[to], html=message)
        mail.send(msg)
        return jsonify({"success": True, "message": "Email sent successfully"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
