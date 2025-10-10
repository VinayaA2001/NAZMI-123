from app import db

class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    image = db.Column(db.String(500))
    sizes = db.Column(db.String(500))  # JSON string of available sizes
    category = db.Column(db.String(50))
    featured = db.Column(db.Boolean, default=False)
    stock = db.Column(db.Integer, default=0)
    
    # Relationships
    order_items = db.relationship('OrderItem', backref='product', lazy=True)
    
    def to_dict(self):
        import json
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'image': self.image,
            'sizes': json.loads(self.sizes) if self.sizes else [],
            'category': self.category,
            'featured': self.featured,
            'stock': self.stock
        }