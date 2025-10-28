from flask import Blueprint, jsonify, request, current_app
from bson import ObjectId

products_bp = Blueprint('products', __name__)

# ✅ Get All Products or Filter by Category
@products_bp.route('/api/products', methods=['GET'])
def get_products():
    try:
        db = current_app.mongo.db
        category = request.args.get('category')
        query = {}

        if category:
            query['category'] = {'$regex': f'^{category}$', '$options': 'i'}

        products = list(db.products.find(query))

        # 👇 Define your Cloudinary base URL
        base_url = "https://res.cloudinary.com/dq5xhg9uo/image/upload/"

        for product in products:
            product['_id'] = str(product['_id'])

            # ✅ Ensure each image has a valid full URL
            if "images" in product and product["images"]:
                product["images"] = [
                    img if img.startswith("http") else base_url + img.lstrip("/")
                    for img in product["images"]
                ]

        return jsonify(products)

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ✅ Get Single Product by ID
@products_bp.route('/api/products/<product_id>', methods=['GET'])
def get_product(product_id):
    try:
        db = current_app.mongo.db
        product = db.products.find_one({'_id': ObjectId(product_id)})
        if not product:
            return jsonify({'error': 'Product not found'}), 404

        product['_id'] = str(product['_id'])

        # 👇 Apply the same image URL fix here too
        base_url = "https://res.cloudinary.com/dq5xhg9uo/image/upload/"
        if "images" in product and product["images"]:
            product["images"] = [
                img if img.startswith("http") else base_url + img.lstrip("/")
                for img in product["images"]
            ]

        return jsonify(product)

    except Exception as e:
        return jsonify({'error': str(e)}), 500
