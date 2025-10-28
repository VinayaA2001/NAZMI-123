from flask_mail import Message
from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

class EmailService:
    def __init__(self, mail):
        self.mail = mail

    def generate_invoice_pdf(self, order):
        """Generate a simple invoice PDF and return it as bytes"""
        buffer = BytesIO()
        p = canvas.Canvas(buffer, pagesize=A4)
        width, height = A4

        y = height - 50
        p.setFont("Helvetica-Bold", 18)
        p.drawString(50, y, "NAZMI Boutique - Order Invoice")

        y -= 30
        p.setFont("Helvetica", 12)
        p.drawString(50, y, f"Order Number: {order['order_number']}")
        y -= 20
        p.drawString(50, y, f"Customer Name: {order['customer_name']}")
        y -= 20
        p.drawString(50, y, f"Status: {order['status']}")
        y -= 20
        p.drawString(50, y, f"Total Amount: ₹{order['total_amount']}")
        y -= 40
        p.drawString(50, y, "Items:")
        y -= 20

        for item in order["items"]:
            p.drawString(70, y, f"- {item['name']} (₹{item['price']} x {item['qty']})")
            y -= 20

        y -= 30
        p.drawString(50, y, "Thank you for shopping with us!")
        p.showPage()
        p.save()

        buffer.seek(0)
        return buffer.getvalue()

    def send_order_confirmation(self, order, to_email):
        """Send confirmation email with attached invoice PDF"""
        msg = Message(
            subject=f"Order Confirmation - {order['order_number']}",
            recipients=[to_email],
            sender="nazmiboutique1@gmail.com"
        )

        msg.html = f"""
        <div style="font-family: Arial; padding: 16px; background-color:#fafafa;">
            <h2 style="color:#b36b00;">Thank you for your order, {order['customer_name']}!</h2>
            <p>Your order <b>#{order['order_number']}</b> has been confirmed.</p>
            <hr>
            <h3>Order Details</h3>
            <ul>
                {''.join(f"<li>{item['name']} - ₹{item['price']} x {item['qty']}</li>" for item in order['items'])}
            </ul>
            <p><b>Total:</b> ₹{order['total_amount']}</p>
            <p><b>Status:</b> {order['status']}</p>
            <hr>
            <p>📎 Your detailed invoice is attached as a PDF.</p>
            <p>We’ll notify you once your order is shipped. 💌</p>
            <p>— NAZMI Boutique</p>
        </div>
        """

        # Generate PDF and attach
        pdf_data = self.generate_invoice_pdf(order)
        msg.attach(
            filename=f"Invoice_{order['order_number']}.pdf",
            content_type="application/pdf",
            data=pdf_data
        )

        self.mail.send(msg)
