from flask import Blueprint, request, jsonify
from app import db
from models.product import Product
import json

products_bp = Blueprint('products', __name__)

@products_bp.route('/', methods=['GET'])
def get_products():
    try:
        category = request.args.get('category')
        featured = request.args.get('featured')
        
        query = Product.query
        
        if category:
            query = query.filter_by(category=category)
        if featured:
            query = query.filter_by(featured=True)
            
        products = query.all()
        
        return jsonify([product.to_dict() for product in products])
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    try:
        product = Product.query.get_or_404(product_id)
        return jsonify(product.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('/categories', methods=['GET'])
def get_categories():
    try:
        categories = db.session.query(Product.category).distinct().all()
        category_list = [category[0] for category in categories if category[0]]
        return jsonify(category_list)
    except Exception as e:
        return jsonify({'error': str(e)}), 500