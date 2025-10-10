"use client";

import { useState, useEffect } from "react";
import { use } from "react"; // Import the use hook
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  sizes: string[];
  category: string;
  featured: boolean;
  stock: number;
  images?: string[]; // Added for the enhanced product data
}

interface ProductPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Record<string, string | string[] | undefined>;
}

export default function ProductPage({ params }: ProductPageProps) {
  // Unwrap the params promise using React.use()
  const unwrappedParams = use(params);
  const slug = decodeURIComponent(unwrappedParams.slug);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [addingToCart, setAddingToCart] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  
  const router = useRouter();

  useEffect(() => {
    fetchProductData();
  }, [slug]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      // Fetch all products and find the one matching the slug
      const response = await fetch('http://localhost:5000/api/products');
      const products = await response.json();
      
      // Find product by name (slug is the product name)
      const productData = products.find((p: Product) => 
        p.name.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase().replace(/\s+/g, '-') ||
        p.name.toLowerCase() === slug.toLowerCase()
      );
      
      if (productData) {
        // Create additional images array
        const images = [
          productData.image,
          "/images/product-2.jpg",
          "/images/product-3.jpg", 
          "/images/product-4.jpg"
        ];
        
        // Set the product with enhanced data
        setProduct({
          ...productData,
          images: images
        });
        
        if (productData.sizes && productData.sizes.length > 0) {
          setSelectedSize(productData.sizes[0]);
        }
        
        // Fetch related products
        fetchRelatedProducts(productData.category, productData.id);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (category: string, currentProductId: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products?category=${category}`);
      const products = await response.json();
      // Filter out current product and get first 4 related products
      const filteredProducts = products
        .filter((p: Product) => p.id !== currentProductId)
        .slice(0, 4);
      setRelatedProducts(filteredProducts);
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };

  const addToCart = async () => {
    if (!product || !selectedSize) return;
    
    setAddingToCart(true);
    try {
      const cartItem = {
        id: `${product.id}-${selectedSize}-${selectedColor}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
        size: selectedSize,
        color: selectedColor || "Default"
      };

      // Get existing cart
      const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existingItemIndex = existingCart.findIndex(
        (item: any) => item.id === cartItem.id
      );

      let updatedCart;
      if (existingItemIndex > -1) {
        // Update quantity if item exists
        updatedCart = existingCart.map((item: any, index: number) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        updatedCart = [...existingCart, cartItem];
      }

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      
      // Show success feedback
      console.log("Added to cart:", cartItem);
      
      // Optional: Show cart sidebar or notification
      setTimeout(() => setAddingToCart(false), 1000);
      
    } catch (error) {
      console.error("Error adding to cart:", error);
      setAddingToCart(false);
    }
  };

  const buyNow = () => {
    addToCart();
    router.push("/cart");
  };

  // Available colors for all products
  const availableColors = ["Black", "Navy Blue", "Burgundy", "Forest Green"];
  
  // Product details and care instructions
  const productDetails = [
    "Premium quality fabric",
    "Handcrafted embroidery", 
    "Comfortable fit",
    "Machine washable"
  ];
  
  const careInstructions = [
    "Machine wash cold with similar colors",
    "Tumble dry low",
    "Iron on low heat", 
    "Do not bleach"
  ];

  if (loading) {
    return (
      <section className="container py-8">
        <div className="animate-pulse">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Image Gallery Skeleton */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="aspect-square bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
            {/* Product Info Skeleton */}
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
              <div className="h-12 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="container py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been moved.</p>
          <Link href="/products" className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition">
            Browse Products
          </Link>
        </div>
      </section>
    );
  }

  // Create images array for the product
  const productImages = [
    product.image,
    "/images/product-2.jpg",
    "/images/product-3.jpg",
    "/images/product-4.jpg"
  ];

  return (
    <section className="container py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
        <Link href="/" className="hover:text-black transition">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-black transition">Products</Link>
        <span>/</span>
        <Link href={`/products?category=${product.category}`} className="hover:text-black transition capitalize">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-black">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
            <Image
              src={productImages[selectedImage]}
              alt={product.name}
              width={600}
              height={600}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          
          {/* Thumbnail Gallery */}
          <div className="grid grid-cols-4 gap-3">
            {productImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 transition-all ${
                  selectedImage === index ? "border-black" : "border-transparent"
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.name} view ${index + 1}`}
                  width={150}
                  height={150}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Category & Brand */}
          <div>
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium mb-2">
              {product.category}
            </span>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                {"★".repeat(5)}
                <span className="text-gray-400">★</span>
              </div>
              <span className="text-gray-600">(42 reviews)</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-gray-900">
              ₹{product.price.toLocaleString()}
            </span>
            {product.price > 2999 && (
              <span className="text-lg text-gray-500 line-through">
                ₹{(product.price * 1.2).toLocaleString()}
              </span>
            )}
            {product.price > 2999 && (
              <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm font-medium">
                20% OFF
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 text-lg leading-relaxed">
            {product.description}
          </p>

          {/* Color Selection */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Color: {selectedColor || "Black"}</h3>
            <div className="flex gap-3">
              {availableColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    selectedColor === color ? "border-black ring-2 ring-gray-200" : "border-gray-300"
                  }`}
                  style={{ 
                    backgroundColor: color.toLowerCase().includes('black') ? '#000' :
                                  color.toLowerCase().includes('navy') ? '#001f3f' :
                                  color.toLowerCase().includes('burgundy') ? '#800020' :
                                  color.toLowerCase().includes('green') ? '#228B22' : '#ccc'
                  }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Size</h3>
              <button className="text-sm text-gray-600 hover:text-black transition">
                Size Guide
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {product.sizes && product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 border rounded-lg font-medium transition-all ${
                    selectedSize === size
                      ? "border-black bg-black text-white"
                      : "border-gray-300 hover:border-black"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Actions */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-gray-900">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-l-lg transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-r-lg transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={addToCart}
                disabled={addingToCart || product.stock === 0}
                className="flex-1 bg-black text-white py-4 px-8 rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3"
              >
                {addingToCart ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Adding...
                  </>
                ) : product.stock === 0 ? (
                  "Out of Stock"
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add to Cart
                  </>
                )}
              </button>
              <button
                onClick={buyNow}
                disabled={product.stock === 0}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 px-8 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-colors"
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t">
            <div className="text-center">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span>🚚</span>
              </div>
              <p className="text-xs text-gray-600">Free Shipping</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span>↩️</span>
              </div>
              <p className="text-xs text-gray-600">Easy Returns</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span>🔒</span>
              </div>
              <p className="text-xs text-gray-600">Secure Payment</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="border-t pt-12">
        <div className="flex border-b mb-8">
          {[
            { id: "description", label: "Description" },
            { id: "details", label: "Product Details" },
            { id: "care", label: "Care Instructions" },
            { id: "reviews", label: "Reviews" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-black text-black"
                  : "border-transparent text-gray-600 hover:text-black"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="prose max-w-none">
          {activeTab === "description" && (
            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
              <p className="text-gray-600 leading-relaxed">
                Crafted with premium materials and attention to detail, this piece combines traditional 
                elegance with contemporary style. Perfect for special occasions and everyday wear.
              </p>
            </div>
          )}

          {activeTab === "details" && (
            <ul className="space-y-2">
              {productDetails.map((detail, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-600">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {detail}
                </li>
              ))}
            </ul>
          )}

          {activeTab === "care" && (
            <ul className="space-y-2">
              {careInstructions.map((instruction, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-600">
                  <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {instruction}
                </li>
              ))}
            </ul>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">
              <div className="text-center py-8">
                <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                href={`/product/${encodeURIComponent(relatedProduct.name.toLowerCase().replace(/\s+/g, '-'))}`}
                className="group"
              >
                <div className="bg-gray-100 rounded-xl overflow-hidden aspect-square mb-4">
                  <Image
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-black transition">
                  {relatedProduct.name}
                </h3>
                <p className="text-gray-600">₹{relatedProduct.price.toLocaleString()}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}