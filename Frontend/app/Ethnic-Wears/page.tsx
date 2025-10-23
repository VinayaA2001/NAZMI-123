"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, ZoomIn, Star, Shield, Truck, RotateCcw, Minus, Plus } from "lucide-react";

interface Product {
  id: string;
  product_code: string;
  images: string[];
  title: string;
  description?: string;
  price: number;
  sizes: string[];
  colours?: string[];
  category?: string;
  stock?: number;
  material?: string;
  occasion?: string;
  care?: string;
  discount?: number;
  rating?: number;
  reviews?: number;
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

  // Enhanced product data with multiple colors and professional details
  const enhancedProducts: Product[] = [
    {
      id: "1",
      product_code: "EW001",
      images: [
        "https://res.cloudinary.com/dq5xhg9uo/image/upload/v1760017048/cyan4_v8quew.jpg",
        "https://res.cloudinary.com/dq5xhg9uo/image/upload/v1760017047/cyan5_pnct28.jpg",
        "https://res.cloudinary.com/dq5xhg9uo/image/upload/v1760017050/cyan3_qr2e55.jpg",
      ],
      title: "Floral Print Churidar Set",
      description: "Elegant floral print churidar set in breathable cotton with intricate embroidery work. Perfect for festive occasions and daily wear. Features comfortable fit and premium quality fabric that lasts through multiple wears.",
      price: 1899,
      sizes: ["S", "M", "L", "XL"],
      colours: ["Cyan Blue", "Sky Blue", "Pink", "Purple"],
      category: "Churidar Set",
      stock: 15,
      material: "Premium Cotton",
      occasion: "Festive, Daily Wear",
      care: "Machine Wash, Dry in Shade",
      discount: 15,
      rating: 4.5,
      reviews: 128
    },
    {
      id: "2",
      product_code: "EW002",
      images: [
        "https://res.cloudinary.com/dq5xhg9uo/image/upload/v1760361420/violet-1_dejiae.jpg",
        "https://res.cloudinary.com/dq5xhg9uo/image/upload/v1760361420/violet-3_dbzzro.jpg",
      ],
      title: "Silk Anarkali Set",
      description: "Luxurious silk anarkali with detailed zari work and flowing silhouette. A timeless piece for special occasions featuring intricate embroidery and premium fabric quality.",
      price: 3599,
      sizes: ["M", "L", "XL", "XXL"],
      colours: ["Violet", "Lavender", "Gold"],
      category: "Anarkali",
      stock: 8,
      material: "Pure Silk",
      occasion: "Wedding, Festive",
      care: "Dry Clean Only",
      discount: 20,
      rating: 4.8,
      reviews: 89
    }
  ];

  // Fetch products from MongoDB with fallback
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/products");
        if (res.ok) {
          const data = await res.json();
          const mapped = data.map((p: any) => ({
            id: p.id,
            product_code: p.product_code,
            images: p.images || [],
            title: p.title || `${p.material} ${p.category}`,
            description: p.description || "",
            price: p.price,
            sizes: Array.isArray(p.sizes) ? p.sizes : [p.size],
            colours: p.colours || [p.colour],
            category: p.category,
            stock: p.stock ?? 1,
            material: p.material,
            occasion: p.occasion || "Casual, Festive",
            care: p.care || "Machine Wash",
            discount: p.discount || Math.floor(Math.random() * 30) + 10,
            rating: p.rating || (Math.random() * 1 + 4).toFixed(1),
            reviews: p.reviews || Math.floor(Math.random() * 200) + 50
          }));
          // Filter out products with stock 0 or less
          const filtered = mapped.filter((p: Product) => (p.stock ?? 0) > 0);
          setProductList(filtered);
        } else {
          const filtered = enhancedProducts.filter(p => (p.stock ?? 0) > 0);
          setProductList(filtered);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        const filtered = enhancedProducts.filter(p => (p.stock ?? 0) > 0);
        setProductList(filtered);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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

  const toggleWishlist = (product: Product) => {
    const newWishlist = new Set(wishlist);
    const item = {
      id: product.id,
      productId: product.id,
      name: product.title,
      price: product.price,
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

    if (newWishlist.has(product.id)) {
      newWishlist.delete(product.id);
      const updated = existing.filter((i: any) => i.id !== product.id);
      localStorage.setItem("wishlist", JSON.stringify(updated));
    } else {
      newWishlist.add(product.id);
      const updated = [...existing, item];
      localStorage.setItem("wishlist", JSON.stringify(updated));
    }

    setWishlist(newWishlist);
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const addToCart = (product: Product, size: string = "", color: string = "", qty: number = 1) => {
    const s = size || (product.sizes.length > 0 ? product.sizes[0] : "");
    const c = color || (product.colours && product.colours.length > 0 ? product.colours[0] : "");

    const cartItem = {
      id: `${product.id}-${s}-${c}-${selectedImageIndex}`,
      productId: product.id,
      name: product.title,
      price: product.price,
      image: product.images[selectedImageIndex],
      quantity: qty,
      size: s,
      color: c,
      colorIndex: selectedImageIndex,
      productCode: product.product_code
    };

    let existing: any[] = [];
    try {
      const data = localStorage.getItem("cart");
      if (data) existing = JSON.parse(data);
    } catch {
      existing = [];
    }

    const idx = existing.findIndex((item: any) => item.id === cartItem.id);
    const updated =
      idx > -1
        ? existing.map((item: any, i: number) => (i === idx ? { ...item, quantity: item.quantity + qty } : item))
        : [...existing, cartItem];

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizes[0] || "");
    setSelectedColor(product.colours && product.colours.length > 0 ? product.colours[0] : "");
    setSelectedImageIndex(0);
    setQuantity(1);
  };

  const handleOrderNow = (product: Product) => {
    // Validate size selection
    if (!selectedSize && product.sizes.length > 0) {
      alert("Please select a size before ordering.");
      return;
    }
    setOrderingProduct(product);
    setShowPaymentModal(true);
  };

  const handlePayment = (method: string) => {
    if (orderingProduct) {
      alert(`Order placed successfully!\nProduct: ${orderingProduct.title}\nSize: ${selectedSize}\nColor: ${selectedColor}\nQuantity: ${quantity}\nAmount: ₹${orderingProduct.price * quantity}\nPayment Method: ${method}\nDelivery: 7 days`);
      setShowPaymentModal(false);
      setOrderingProduct(null);
      setSelectedProduct(null);
    }
  };

  const isInWishlist = (productId: string) => wishlist.has(productId);

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

  return (
    <div className="min-h-screen bg-white">
      {/* Collection Banner */}
      <div className="bg-gradient-to-br from-rose-50 via-white to-amber-50 border-b border-gray-100 pt-20">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-4xl font-light text-gray-900 mb-4 tracking-wide">Ethnic Collection</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Traditional elegance meets contemporary minimalism. Handcrafted pieces from Kerala.
          </p>
        </div>
      </div>

      {/* Products Grid - 2 columns on mobile */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {productList.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-xl border border-gray-100"
              onClick={() => handleProductClick(product)}
            >
              {/* Product Image */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={product.images[0] || "/images/placeholder.jpg"}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-110 transition duration-500"
                />
                
                {/* Wishlist Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product);
                  }}
                  className={`absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 ${
                    isInWishlist(product.id) 
                      ? "text-red-500" 
                      : "text-gray-600 hover:text-red-500"
                  }`}
                >
                  <Heart 
                    className={`w-4 h-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} 
                  />
                </button>

                {/* Discount Badge */}
                {product.discount && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                    {product.discount}% OFF
                  </div>
                )}

                {/* Stock Status */}
                <div className="absolute bottom-2 left-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-bold">
                  {product.stock} in stock
                </div>

                {/* Quick Actions */}
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product, product.sizes[0], product.colours ? product.colours[0] : "");
                    }}
                    className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-3">
                <h3 className="font-medium text-gray-900 text-sm mb-1 leading-tight line-clamp-2">{product.title}</h3>
                
                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex items-center">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600 ml-1">{product.rating}</span>
                    </div>
                    <span className="text-xs text-gray-400">({product.reviews})</span>
                  </div>
                )}

                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">₹{product.price}</span>
                    {product.discount && (
                      <span className="text-xs text-gray-500 line-through">
                        ₹{Math.round(product.price / (1 - product.discount / 100))}
                      </span>
                    )}
                  </div>
                </div>

                {/* Color Variants Preview */}
                {product.colours && product.colours.length > 0 && (
                  <div className="flex gap-1 mb-2">
                    {product.colours.slice(0, 3).map((color, index) => (
                      <div
                        key={index}
                        className="w-3 h-3 rounded-full border border-gray-300 flex items-center justify-center text-[8px] text-gray-500"
                        title={color}
                      >
                        {index + 1}
                      </div>
                    ))}
                    {product.colours.length > 3 && (
                      <div className="text-xs text-gray-500">+{product.colours.length - 3}</div>
                    )}
                  </div>
                )}

                {/* Add to Cart Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product, product.sizes[0], product.colours ? product.colours[0] : "");
                  }}
                  className="w-full py-2 text-xs font-medium rounded transition-all duration-300 bg-black text-white hover:bg-gray-800"
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          ))}
        </div>

        {productList.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-light text-gray-900 mb-2 tracking-wide">No Products Available</h3>
            <p className="text-gray-600 font-light">We're curating our next collection</p>
          </div>
        )}
      </div>

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

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 md:p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl md:rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-8">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-1">{selectedProduct.title}</h2>
                  <p className="text-gray-500 text-sm">Product Code: {selectedProduct.product_code}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleWishlist(selectedProduct)}
                    className={`p-2 rounded-lg transition-colors ${
                      isInWishlist(selectedProduct.id) 
                        ? "text-red-500 bg-red-50" 
                        : "text-gray-600 hover:text-red-500 hover:bg-gray-100"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isInWishlist(selectedProduct.id) ? "fill-current" : ""}`} />
                  </button>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {/* Images Section */}
                <div>
                  <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden mb-4">
                    <Image
                      src={selectedProduct.images[selectedImageIndex] || "/images/placeholder.jpg"}
                      alt={selectedProduct.title}
                      fill
                      className="object-cover cursor-zoom-in"
                      onClick={() => setZoomImage(selectedProduct.images[selectedImageIndex])}
                    />
                    <button 
                      onClick={() => setZoomImage(selectedProduct.images[selectedImageIndex])}
                      className="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {selectedProduct.images.slice(0, 4).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedImageIndex(index);
                          if (selectedProduct.colours && selectedProduct.colours[index]) {
                            setSelectedColor(selectedProduct.colours[index]);
                          }
                        }}
                        className={`aspect-square bg-gray-50 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImageIndex === index ? "border-black" : "border-transparent hover:border-gray-300"
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${selectedProduct.title} - View ${index + 1}`}
                          width={100}
                          height={100}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                  {/* Price & Rating */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl md:text-3xl font-bold text-gray-900">₹{selectedProduct.price}</span>
                        {selectedProduct.discount && (
                          <>
                            <span className="text-lg text-gray-500 line-through">
                              ₹{Math.round(selectedProduct.price / (1 - selectedProduct.discount / 100))}
                            </span>
                            <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                              {selectedProduct.discount}% OFF
                            </span>
                          </>
                        )}
                      </div>
                      {selectedProduct.rating && (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="text-sm font-medium ml-1">{selectedProduct.rating}</span>
                          </div>
                          <span className="text-sm text-gray-600">({selectedProduct.reviews} reviews)</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stock Information */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">{selectedProduct.stock} items</span> available in stock
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Description</h4>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {selectedProduct.description}
                    </p>
                  </div>

                  {/* Colors */}
                  {selectedProduct.colours && selectedProduct.colours.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Select Color</h4>
                      <div className="flex gap-2 flex-wrap">
                        {selectedProduct.colours.map((color, index) => (
                          <button
                            key={index}
                            className={`px-4 py-2 border-2 rounded-lg font-medium transition-all ${
                              selectedColor === color 
                                ? "border-black bg-black text-white" 
                                : "border-gray-300 text-gray-700 hover:border-gray-400"
                            }`}
                            onClick={() => {
                              setSelectedColor(color);
                              if (selectedProduct.images[index]) {
                                setSelectedImageIndex(index);
                              }
                            }}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sizes */}
                  {selectedProduct.sizes.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Select Size</h4>
                      <div className="flex gap-2 flex-wrap">
                        {selectedProduct.sizes.map((size) => (
                          <button
                            key={size}
                            className={`px-4 py-2 border-2 rounded-lg font-medium transition-all ${
                              selectedSize === size 
                                ? "border-black bg-black text-white" 
                                : "border-gray-300 text-gray-700 hover:border-gray-400"
                            }`}
                            onClick={() => setSelectedSize(size)}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity Selector */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Quantity</h4>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="p-2 hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 min-w-12 text-center font-medium">{quantity}</span>
                        <button
                          onClick={() => setQuantity(Math.min(selectedProduct.stock || 10, quantity + 1))}
                          className="p-2 hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-sm text-gray-600">Max: {selectedProduct.stock} items</span>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="space-y-3 text-sm border-t pt-4">
                    {selectedProduct.material && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Material</span>
                        <span className="text-gray-900 font-medium">{selectedProduct.material}</span>
                      </div>
                    )}
                    {selectedProduct.occasion && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Occasion</span>
                        <span className="text-gray-900 font-medium">{selectedProduct.occasion}</span>
                      </div>
                    )}
                    {selectedProduct.care && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Care Instructions</span>
                        <span className="text-gray-900 font-medium">{selectedProduct.care}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Delivery</span>
                      <span className="text-gray-900 font-medium">7 Business Days</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Returns</span>
                      <span className="text-gray-900 font-medium">7 days for damaged items</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => addToCart(selectedProduct, selectedSize, selectedColor, quantity)}
                      className="flex-1 bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      ADD TO CART
                    </button>
                    <button
                      onClick={() => handleOrderNow(selectedProduct)}
                      className="flex-1 bg-white border-2 border-black text-black py-4 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300"
                    >
                      BUY NOW
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && orderingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">Complete Payment</h3>
            <p className="text-gray-600 text-center mb-6">{orderingProduct.title}</p>
            
            <div className="text-center mb-6">
              <div className="text-2xl font-bold text-gray-900 mb-2">₹{orderingProduct.price * quantity}</div>
              <p className="text-sm text-gray-500">
                Quantity: {quantity} | Size: {selectedSize} | Color: {selectedColor}
              </p>
              <p className="text-sm text-gray-500 mt-1">Delivery in 7 business days</p>
            </div>

            <div className="space-y-3 mb-6">
              <h4 className="font-semibold text-gray-900 mb-3 text-center">Choose Payment Method</h4>
              
              {/* Credit Card */}
              <button
                onClick={() => handlePayment("Credit Card")}
                className="w-full bg-white border-2 border-gray-300 text-gray-900 py-3 rounded-lg font-medium hover:border-black transition-all duration-300 flex items-center justify-center gap-3"
              >
                <div className="w-6 h-6 border border-gray-400 rounded flex items-center justify-center">
                  <span className="text-xs font-bold">CC</span>
                </div>
                Credit Card
              </button>

              {/* Debit Card */}
              <button
                onClick={() => handlePayment("Debit Card")}
                className="w-full bg-white border-2 border-gray-300 text-gray-900 py-3 rounded-lg font-medium hover:border-black transition-all duration-300 flex items-center justify-center gap-3"
              >
                <div className="w-6 h-6 border border-gray-400 rounded flex items-center justify-center">
                  <span className="text-xs font-bold">DC</span>
                </div>
                Debit Card
              </button>

              {/* UPI */}
              <button
                onClick={() => handlePayment("UPI")}
                className="w-full bg-white border-2 border-gray-300 text-gray-900 py-3 rounded-lg font-medium hover:border-black transition-all duration-300 flex items-center justify-center gap-3"
              >
                <div className="w-6 h-6 border border-gray-400 rounded flex items-center justify-center">
                  <span className="text-xs font-bold">UP</span>
                </div>
                UPI Payment
              </button>

              {/* Net Banking */}
              <button
                onClick={() => handlePayment("Net Banking")}
                className="w-full bg-white border-2 border-gray-300 text-gray-900 py-3 rounded-lg font-medium hover:border-black transition-all duration-300 flex items-center justify-center gap-3"
              >
                <div className="w-6 h-6 border border-gray-400 rounded flex items-center justify-center">
                  <span className="text-xs font-bold">NB</span>
                </div>
                Net Banking
              </button>

              {/* Wallet */}
              <button
                onClick={() => handlePayment("Wallet")}
                className="w-full bg-white border-2 border-gray-300 text-gray-900 py-3 rounded-lg font-medium hover:border-black transition-all duration-300 flex items-center justify-center gap-3"
              >
                <div className="w-6 h-6 border border-gray-400 rounded flex items-center justify-center">
                  <span className="text-xs font-bold">W</span>
                </div>
                Wallet
              </button>
            </div>

            <button
              onClick={() => setShowPaymentModal(false)}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:border-gray-400 transition-all duration-300"
            >
              Cancel
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Your payment is secure and encrypted. Return available within 7 days for damaged products.
            </p>
          </div>
        </div>
      )}

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
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}