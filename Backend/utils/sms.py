import os
from twilio.rest import Client
import logging

logger = logging.getLogger(__name__)

class SmsService:
    def __init__(self):
        sid = os.getenv("TWILIO_ACCOUNT_SID")
        token = os.getenv("TWILIO_AUTH_TOKEN")
        self.from_ = os.getenv("TWILIO_FROM")  # e.g. whatsapp:+14155238886 or +1XXXXXXXXXX
        self.enabled = bool(sid and token and self.from_)
        self.client = Client(sid, token) if self.enabled else None

    def send(self, to_number: str, text: str):
        if not self.enabled:
            logger.warning("SMS not configured")
            return False
        try:
            msg = self.client.messages.create(
                body=text,
                from_=self.from_,
                to=to_number,  # 'whatsapp:+919995947709' or '+919995947709'
            )
            return True
        except Exception as e:
            logger.error(f"SMS send error: {e}")
            return False
