"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Heart, ShoppingCart, ZoomIn, Star, Shield, Truck, RotateCcw, Minus, Plus, Check, X, CreditCard, Lock } from "lucide-react";

interface ProductVariant {
  _id: string;
  size: string;
  colour: string;
  stock: number;
  price: number;
}

interface Product {
  _id: string;
  product_code: string;
  product_name: string;
  material: string;
  category: string;
  images: string[];
  description: string;
  variants: ProductVariant[];
  availableSizes: string[];
  availableColors: string[];
  totalStock: number;
  minPrice: number;
  maxPrice: number;
}

interface OrderData {
  items: Array<{
    product_id: string;
    variant_id: string;
    quantity: number;
    price: number;
    size: string;
    color: string;
    product_code: string;
  }>;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  total_amount: number;
  payment_method: string;
}

export default function EthnicWearPage() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderingProduct, setOrderingProduct] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [cart, setCart] = useState<any[]>([]);
  const [zoomImage, setZoomImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showCartToast, setShowCartToast] = useState(false);
  const [addedProductName, setAddedProductName] = useState("");
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });
  const [error, setError] = useState<string | null>(null);

  // Fetch products from MongoDB
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Starting to fetch products from MongoDB...");
      
      const res = await fetch("http://127.0.0.1:5000/api/products");
      console.log("Response status:", res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log("Raw API response data:", data);
        
        if (!data || !Array.isArray(data)) {
          console.error("Invalid data format received:", data);
          setError("Invalid data format received from server");
          return;
        }

        if (data.length === 0) {
          console.log("No products found in database");
          setProductList([]);
          return;
        }

        // The backend now returns properly formatted data, so we can use it directly
        const formattedProducts: Product[] = data.map((product: any) => ({
          ...product,
          // Ensure images are properly formatted for Cloudinary
          images: product.images.map((img: string) => {
            if (img.startsWith('http')) {
              return img; // Cloudinary URL
            } else if (img.startsWith('/')) {
              return img; // Local path
            } else {
              return `/images/${img}`; // Assume it's a local image filename
            }
          })
        }));

        console.log("Formatted products:", formattedProducts);
        setProductList(formattedProducts);
      } else {
        const errorText = await res.text();
        console.error("Failed to fetch products. Status:", res.status, "Response:", errorText);
        setError(`Failed to load products: ${res.status} ${errorText}`);
      }
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Retry fetching products
  const retryFetch = () => {
    fetchProducts();
  };

  // Load wishlist & cart from localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    const savedCart = localStorage.getItem("cart");
    if (savedWishlist) {
      const wishlistData = JSON.parse(savedWishlist);
      setWishlist(new Set(wishlistData.map((item: any) => item.id)));
    }
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Cart Toast Notification
  const showCartNotification = (productName: string) => {
    setAddedProductName(productName);
    setShowCartToast(true);
    setTimeout(() => setShowCartToast(false), 3000);
  };

  const toggleWishlist = (product: Product) => {
    const newWishlist = new Set(wishlist);
    const item = {
      id: product._id,
      productId: product._id,
      name: `${product.material} ${product.category}`,
      price: product.minPrice,
      image: product.images[0],
      productCode: product.product_code
    };

    let existing: any[] = [];
    try {
      const data = localStorage.getItem("wishlist");
      if (data) existing = JSON.parse(data);
    } catch {
      existing = [];
    }

    if (newWishlist.has(product._id)) {
      newWishlist.delete(product._id);
      const updated = existing.filter((i: any) => i.id !== product._id);
      localStorage.setItem("wishlist", JSON.stringify(updated));
    } else {
      newWishlist.add(product._id);
      const updated = [...existing, item];
      localStorage.setItem("wishlist", JSON.stringify(updated));
    }

    setWishlist(newWishlist);
    window.dispatchEvent(new Event("wishlist-updated"));
  };

  const addToCart = (product: Product, size: string = "", color: string = "", qty: number = 1) => {
    // For products with variants, require size and color selection
    if (product.variants.length > 1) {
      if (!size) {
        alert("Please select a size before adding to cart.");
        return;
      }
      if (!color) {
        alert("Please select a color before adding to cart.");
        return;
      }
    }

    // Find the specific variant
    const variant = product.variants.find(v => v.size === size && v.colour === color);
    if (!variant) {
      alert("Selected variant not available.");
      return;
    }

    if (variant.stock < qty) {
      alert(`Only ${variant.stock} items available in stock for ${size} - ${color}.`);
      return;
    }

    const cartItem = {
      id: `${product._id}-${size}-${color}`,
      productId: product._id,
      variantId: variant._id,
      name: `${product.material} ${product.category}`,
      price: variant.price,
      image: product.images[0] || "/images/placeholder.jpg",
      quantity: qty,
      size: size,
      color: color,
      productCode: product.product_code,
      material: product.material,
      category: product.category,
      maxStock: variant.stock
    };

    let existing: any[] = [];
    try {
      const data = localStorage.getItem("cart");
      if (data) existing = JSON.parse(data);
    } catch {
      existing = [];
    }

    const existingItemIndex = existing.findIndex((item: any) => item.id === cartItem.id);
    let updated;

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      const newQuantity = existing[existingItemIndex].quantity + qty;
      if (newQuantity > cartItem.maxStock) {
        alert(`Only ${cartItem.maxStock} items available in stock. You already have ${existing[existingItemIndex].quantity} in cart.`);
        return;
      }
      updated = existing.map((item: any, i: number) => 
        i === existingItemIndex ? { ...item, quantity: newQuantity } : item
      );
    } else {
      // Add new item
      updated = [...existing, cartItem];
    }

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cart-updated"));
    
    // Show success notification
    showCartNotification(`${product.material} ${product.category}`);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setSelectedSize("");
    setSelectedColor("");
    setSelectedImageIndex(0);
    setQuantity(1);
  };

  const handleOrderNow = (product: Product) => {
    // For products with variants, validate selections
    if (product.variants.length > 1) {
      if (!selectedSize) {
        alert("Please select a size before ordering.");
        return;
      }
      if (!selectedColor) {
        alert("Please select a color before ordering.");
        return;
      }
    }

    setOrderingProduct(product);
    setShowPaymentModal(true);
  };

  const handlePayment = async (method: string) => {
    if (!orderingProduct || !selectedProduct) return;

    // Validate customer information
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
      alert("Please fill in all customer information before proceeding with payment.");
      return;
    }

    setOrderProcessing(true);

    try {
      // Find the selected variant
      const variant = selectedProduct.variants.find(v => 
        v.size === selectedSize && v.colour === selectedColor
      );

      if (!variant) {
        alert("Selected variant not found.");
        setOrderProcessing(false);
        return;
      }

      if (variant.stock < quantity) {
        alert(`Sorry, only ${variant.stock} items available in stock for ${selectedSize} - ${selectedColor}.`);
        setOrderProcessing(false);
        return;
      }

      // Create order in backend
      const orderData: OrderData = {
        items: [{
          product_id: selectedProduct._id,
          variant_id: variant._id,
          quantity: quantity,
          price: variant.price,
          size: selectedSize,
          color: selectedColor,
          product_code: selectedProduct.product_code
        }],
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        shipping_address: customerInfo.address,
        total_amount: variant.price * quantity,
        payment_method: method
      };

      const response = await fetch("http://127.0.0.1:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token") || ''}`
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const orderResult = await response.json();
        
        // Update local stock
        const updatedProducts = productList.map(product => {
          if (product._id === selectedProduct._id) {
            const updatedVariants = product.variants.map(v => {
              if (v._id === variant._id) {
                return { ...v, stock: v.stock - quantity };
              }
              return v;
            });
            
            const totalStock = updatedVariants.reduce((sum, v) => sum + v.stock, 0);
            
            return {
              ...product,
              variants: updatedVariants,
              totalStock
            };
          }
          return product;
        });

        setProductList(updatedProducts);

        alert(`Order placed successfully!\nOrder Number: ${orderResult.order_number}\nAmount: ₹${variant.price * quantity}\nWe will contact you at ${customerInfo.phone} for delivery details.`);
        
        // Reset states
        setShowPaymentModal(false);
        setOrderingProduct(null);
        setSelectedProduct(null);
        setCustomerInfo({ name: "", email: "", phone: "", address: "" });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Order creation failed");
      }
    } catch (error: any) {
      console.error("Order creation error:", error);
      alert(`Order failed: ${error.message || "Please try again later."}`);
    } finally {
      setOrderProcessing(false);
    }
  };

  const isInWishlist = (productId: string) => wishlist.has(productId);

  // Get available colors for selected size
  const getAvailableColors = (product: Product, size: string) => {
    return [...new Set(product.variants
      .filter(v => v.size === size && v.stock > 0)
      .map(v => v.colour)
    )];
  };

  // Get available sizes for selected color
  const getAvailableSizes = (product: Product, color: string) => {
    return [...new Set(product.variants
      .filter(v => v.colour === color && v.stock > 0)
      .map(v => v.size)
    )];
  };

  // Get price for selected variant
  const getSelectedVariantPrice = (product: Product) => {
    if (!selectedSize || !selectedColor) return product.minPrice;
    
    const variant = product.variants.find(v => 
      v.size === selectedSize && v.colour === selectedColor
    );
    return variant ? variant.price : product.minPrice;
  };

  // Get selected variant stock
  const getSelectedVariantStock = (product: Product) => {
    if (!selectedSize || !selectedColor) return 0;
    
    const variant = product.variants.find(v => 
      v.size === selectedSize && v.colour === selectedColor
    );
    return variant ? variant.stock : 0;
  };

  // Handle Cloudinary image URLs
  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http')) {
      return imagePath; // Cloudinary URL
    } else if (imagePath.startsWith('/')) {
      return imagePath; // Local path
    } else {
      return `/images/${imagePath}`; // Fallback
    }
  };

  // Filter out products with zero stock
  const availableProducts = productList.filter(product => product.totalStock > 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-light">Loading our exclusive collection...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-12 h-12 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Products</h3>
          <p className="text-gray-600 mb-4 max-w-md">{error}</p>
          <button
            onClick={retryFetch}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Cart Success Toast */}
      {showCartToast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-in slide-in-from-right duration-300 flex items-center gap-3">
          <Check className="w-5 h-5" />
          <div>
            <p className="font-semibold">Added to Cart!</p>
            <p className="text-sm opacity-90">{addedProductName}</p>
          </div>
          <button 
            onClick={() => setShowCartToast(false)}
            className="ml-2 hover:bg-green-600 rounded-full p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Collection Banner */}
      <div className="bg-gradient-to-br from-rose-50 via-white to-amber-50 border-b border-gray-100 pt-20">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 tracking-wide">Ethnic Collection</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Traditional elegance meets contemporary minimalism. Handcrafted pieces from Kerala.
          </p>
        </div>
      </div>

      {/* Debug Info - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="container mx-auto px-4 py-2">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
            <p><strong>Debug Info:</strong> {productList.length} products loaded</p>
            <button 
              onClick={() => console.log('Product List:', productList)}
              className="text-blue-600 hover:text-blue-800 underline text-xs mr-4"
            >
              Log Products to Console
            </button>
            <button 
              onClick={() => fetch("http://127.0.0.1:5000/api/debug/products").then(r => r.json()).then(console.log)}
              className="text-blue-600 hover:text-blue-800 underline text-xs"
            >
              Check Raw API Data
            </button>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {availableProducts.map((product) => (
            <div
              key={`${product._id}-${product.product_code}`}
              className="group bg-white rounded-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-xl border border-gray-100"
              onClick={() => handleProductClick(product)}
            >
              {/* Product Image */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={getImageUrl(product.images[0]) || "/images/placeholder.jpg"}
                  alt={`${product.material} ${product.category}`}
                  fill
                  className="object-cover group-hover:scale-110 transition duration-500"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/placeholder.jpg";
                  }}
                />
                
                {/* Wishlist Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product);
                  }}
                  className={`absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 ${
                    isInWishlist(product._id) 
                      ? "text-red-500" 
                      : "text-gray-600 hover:text-red-500"
                  }`}
                >
                  <Heart 
                    className={`w-4 h-4 ${isInWishlist(product._id) ? "fill-current" : ""}`} 
                  />
                </button>

                {/* Stock Status */}
                <div className={`absolute bottom-2 left-2 px-2 py-1 rounded text-xs font-bold ${
                  product.totalStock > 5 ? 'bg-green-500 text-white' : 
                  product.totalStock > 0 ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  {product.totalStock > 0 ? `${product.totalStock} in stock` : 'Out of stock'}
                </div>

                {/* Variant Indicator */}
                {product.variants.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
                    {product.availableSizes.length} Sizes • {product.availableColors.length} Colors
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-3">
                <h3 className="font-medium text-gray-900 text-sm mb-1 leading-tight line-clamp-2">
                  {product.material} {product.category}
                </h3>
                <p className="text-xs text-gray-500 mb-2">Code: {product.product_code}</p>
                
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">
                      {product.minPrice === product.maxPrice ? (
                        `₹${product.minPrice}`
                      ) : (
                        `₹${product.minPrice} - ₹${product.maxPrice}`
                      )}
                    </span>
                  </div>
                </div>

                {/* Quick Actions */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (product.totalStock === 0) {
                      alert("This product is currently out of stock.");
                      return;
                    }
                    if (product.variants.length > 1) {
                      handleProductClick(product);
                    } else {
                      // For single variant, use the only available size and color
                      const variant = product.variants[0];
                      addToCart(product, variant.size, variant.colour);
                    }
                  }}
                  disabled={product.totalStock === 0}
                  className={`w-full py-2 text-xs font-medium rounded transition-all duration-300 ${
                    product.totalStock === 0 
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  {product.totalStock === 0 
                    ? "OUT OF STOCK" 
                    : product.variants.length > 1 
                      ? "SELECT OPTIONS" 
                      : "ADD TO CART"
                  }
                </button>
              </div>
            </div>
          ))}
        </div>

        {availableProducts.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-light text-gray-900 mb-2 tracking-wide">No Products Available</h3>
            <p className="text-gray-600 font-light">We're curating our next collection</p>
            <button
              onClick={retryFetch}
              className="mt-4 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Refresh Products
            </button>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 md:p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl md:rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="relative">
              {/* Close Button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="grid md:grid-cols-2 gap-8 p-6">
                {/* Product Images */}
                <div className="space-y-4">
                  {/* Main Image */}
                  <div 
                    className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-zoom-in"
                    onClick={() => setZoomImage(getImageUrl(selectedProduct.images[selectedImageIndex]))}
                  >
                    <Image
                      src={getImageUrl(selectedProduct.images[selectedImageIndex]) || "/images/placeholder.jpg"}
                      alt={selectedProduct.description}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white p-1 rounded">
                      <ZoomIn className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Thumbnail Images */}
                  {selectedProduct.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {selectedProduct.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`relative aspect-square rounded border-2 overflow-hidden ${
                            selectedImageIndex === index ? 'border-black' : 'border-transparent'
                          }`}
                        >
                          <Image
                            src={getImageUrl(image) || "/images/placeholder.jpg"}
                            alt={`${selectedProduct.description} view ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-light text-gray-900 mb-2">
                      {selectedProduct.material} {selectedProduct.category}
                    </h1>
                    <p className="text-sm text-gray-500 mb-4">Product Code: {selectedProduct.product_code}</p>
                    <p className="text-gray-700 leading-relaxed">{selectedProduct.description}</p>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-light text-gray-900">
                      ₹{getSelectedVariantPrice(selectedProduct)}
                    </span>
                    {selectedProduct.minPrice !== selectedProduct.maxPrice && (
                      <span className="text-sm text-gray-500">
                        (₹{selectedProduct.minPrice} - ₹{selectedProduct.maxPrice})
                      </span>
                    )}
                  </div>

                  {/* Variant Selection */}
                  {selectedProduct.variants.length > 1 && (
                    <div className="space-y-4">
                      {/* Size Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Size {selectedSize && `: ${selectedSize}`}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.availableSizes.map((size) => (
                            <button
                              key={size}
                              onClick={() => {
                                setSelectedSize(size);
                                // Reset color when size changes
                                setSelectedColor("");
                              }}
                              className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all ${
                                selectedSize === size
                                  ? 'border-black bg-black text-white'
                                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Color Selection */}
                      {selectedSize && (
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Color {selectedColor && `: ${selectedColor}`}
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {getAvailableColors(selectedProduct, selectedSize).map((color) => (
                              <button
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all ${
                                  selectedColor === color
                                    ? 'border-black bg-black text-white'
                                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                }`}
                              >
                                {color}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quantity Selection */}
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-900">Quantity:</label>
                    <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{quantity}</span>
                      <button
                        onClick={() => {
                          const maxStock = selectedSize && selectedColor 
                            ? getSelectedVariantStock(selectedProduct)
                            : selectedProduct.totalStock;
                          setQuantity(Math.min(maxStock, quantity + 1));
                        }}
                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        disabled={quantity >= getSelectedVariantStock(selectedProduct)}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">
                      {getSelectedVariantStock(selectedProduct)} available
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => {
                        if (selectedProduct.variants.length > 1) {
                          if (!selectedSize || !selectedColor) {
                            alert("Please select size and color before adding to cart.");
                            return;
                          }
                        }
                        addToCart(
                          selectedProduct,
                          selectedSize || selectedProduct.variants[0]?.size,
                          selectedColor || selectedProduct.variants[0]?.colour,
                          quantity
                        );
                        setSelectedProduct(null);
                      }}
                      className="flex-1 bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleOrderNow(selectedProduct)}
                      className="flex-1 border border-black text-black py-3 px-6 rounded-lg hover:bg-black hover:text-white transition-colors font-medium"
                    >
                      Buy Now
                    </button>
                  </div>

                  {/* Stock Warning */}
                  {getSelectedVariantStock(selectedProduct) < 5 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-yellow-800 text-sm">
                        Only {getSelectedVariantStock(selectedProduct)} items left in stock!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && orderingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Complete Your Order</h2>
              
              {/* Customer Information Form */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
                  <textarea
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Enter your complete shipping address"
                  />
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Order Summary</h3>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{orderingProduct.material} {orderingProduct.category}</span>
                  <span>₹{getSelectedVariantPrice(orderingProduct)} × {quantity}</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-900 mt-2">
                  <span>Total</span>
                  <span>₹{getSelectedVariantPrice(orderingProduct) * quantity}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <button
                  onClick={() => handlePayment('card')}
                  disabled={orderProcessing}
                  className="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {orderProcessing ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      Pay with Card
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => handlePayment('cod')}
                  disabled={orderProcessing}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                >
                  {orderProcessing ? 'Processing...' : 'Cash on Delivery'}
                </button>
              </div>

              {/* Security Note */}
              <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
                <Lock className="w-3 h-3" />
                <span>Your payment information is secure and encrypted</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trust Features Section */}
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center p-4">
              <Truck className="w-8 h-8 text-black mb-2" />
              <h4 className="font-semibold text-gray-900 text-sm">Free Shipping</h4>
              <p className="text-gray-600 text-xs mt-1">On orders over ₹1999</p>
            </div>

            <div className="flex flex-col items-center p-4">
              <Star className="w-8 h-8 text-black mb-2" />
              <h4 className="font-semibold text-gray-900 text-sm">Premium Quality</h4>
              <p className="text-gray-600 text-xs mt-1">Handpicked fabrics</p>
            </div>

            <div className="flex flex-col items-center p-4">
              <RotateCcw className="w-8 h-8 text-black mb-2" />
              <h4 className="font-semibold text-gray-900 text-sm">Easy Returns</h4>
              <p className="text-gray-600 text-xs mt-1">7-day return policy</p>
            </div>

            <div className="flex flex-col items-center p-4">
              <Shield className="w-8 h-8 text-black mb-2" />
              <h4 className="font-semibold text-gray-900 text-sm">Secure Payment</h4>
              <p className="text-gray-600 text-xs mt-1">100% Protected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Zoom Modal */}
      {zoomImage && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="relative max-w-4xl max-h-full">
            <Image 
              src={zoomImage} 
              alt="Zoomed product image" 
              width={800} 
              height={800} 
              className="object-contain max-h-[80vh] rounded-lg"
            />
            <button 
              onClick={() => setZoomImage("")} 
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}