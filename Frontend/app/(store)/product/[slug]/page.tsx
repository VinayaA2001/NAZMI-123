// app/traditional/festive-edits/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: number;
  images: string[];
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  sizes: string[];
  colors: { name: string; value: string }[];
  fabric: string;
  occasion: string;
  care: string;
  delivery: string;
  inStock: boolean;
}

interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

export default function FestiveEditsPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [zoomImage, setZoomImage] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const products: Product[] = [
    {
      id: 1,
      images: ["/images/festive1-1.jpg", "/images/festive1-2.jpg", "/images/festive1-3.jpg", "/images/festive1-4.jpg"],
      title: "Embroidered Silk Sharara",
      description: "Hand-embroidered silk sharara set with intricate zari work and flowing dupatta",
      price: 2499,
      originalPrice: 3499,
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [
        { name: "Red", value: "#dc2626" },
        { name: "Black", value: "#000000" },
        { name: "Purple", value: "#7c3aed" }
      ],
      fabric: "Silk with Zari Work",
      occasion: "Festive, Wedding",
      care: "Dry Clean Only",
      delivery: "3-4 days",
      inStock: true
    },
    {
      id: 2,
      images: ["/images/festive2-1.jpg", "/images/festive2-2.jpg", "/images/festive2-3.jpg", "/images/festive2-4.jpg"],
      title: "Festive Churidhar Set",
      description: "Party wear churidhar with designer dupatta and embellishments",
      price: 2199,
      originalPrice: 2999,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Blue", value: "#0ea5e9" },
        { name: "Pink", value: "#ec4899" },
        { name: "Gold", value: "#f59e0b" }
      ],
      fabric: "Georgette with Embroidery",
      occasion: "Party, Festive",
      care: "Dry Clean Only",
      delivery: "2-3 days",
      inStock: true
    },
    {
      id: 3,
      images: ["/images/festive3-1.jpg", "/images/festive3-2.jpg", "/images/festive3-3.jpg", "/images/festive3-4.jpg"],
      title: "Bridal Lehenga Collection",
      description: "Heavy work lehenga for weddings and special occasions with detailed embroidery",
      price: 4599,
      originalPrice: 5999,
      sizes: ["M", "L", "XL", "XXL"],
      colors: [
        { name: "White", value: "#ffffff" },
        { name: "Pink", value: "#f472b6" },
        { name: "Red", value: "#dc2626" }
      ],
      fabric: "Velvet with Stone Work",
      occasion: "Bridal, Wedding",
      care: "Dry Clean Only",
      delivery: "5-7 days",
      inStock: true
    },
    {
      id: 4,
      images: ["/images/festive4-1.jpg", "/images/festive4-2.jpg", "/images/festive4-3.jpg", "/images/festive4-4.jpg"],
      title: "Royal Anarkali Suit",
      description: "Floor-length anarkali with detailed embroidery and stone work",
      price: 2899,
      originalPrice: 3899,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Black", value: "#000000" },
        { name: "Purple", value: "#7c3aed" },
        { name: "Green", value: "#059669" }
      ],
      fabric: "Georgette with Stone Work",
      occasion: "Festive, Party",
      care: "Dry Clean Only",
      delivery: "3-4 days",
      inStock: true
    },
    {
      id: 5,
      images: ["/images/festive5-1.jpg", "/images/festive5-2.jpg", "/images/festive5-3.jpg", "/images/festive5-4.jpg"],
      title: "Designer Evening Gown",
      description: "Western-inspired gown with traditional Indian embroidery and trail",
      price: 3299,
      originalPrice: 4299,
      sizes: ["S", "M", "L"],
      colors: [
        { name: "Purple", value: "#7c3aed" },
        { name: "Red", value: "#dc2626" },
        { name: "Black", value: "#000000" }
      ],
      fabric: "Satin with Embroidery",
      occasion: "Party, Reception",
      care: "Dry Clean Only",
      delivery: "4-5 days",
      inStock: true
    },
    {
      id: 6,
      images: ["/images/festive6-1.jpg", "/images/festive6-2.jpg", "/images/festive6-3.jpg", "/images/festive6-4.jpg"],
      title: "Banarasi Silk Saree",
      description: "Pure Banarasi silk saree with golden zari border and matching blouse",
      price: 3899,
      originalPrice: 4999,
      sizes: ["Free Size"],
      colors: [
        { name: "Gold", value: "#f59e0b" },
        { name: "Red", value: "#dc2626" },
        { name: "Black", value: "#000000" }
      ],
      fabric: "Pure Banarasi Silk",
      occasion: "Festive, Wedding",
      care: "Dry Clean Only",
      delivery: "5-6 days",
      inStock: true
    },
    {
      id: 7,
      images: ["/images/festive7-1.jpg", "/images/festive7-2.jpg", "/images/festive7-3.jpg", "/images/festive7-4.jpg"],
      title: "Sequined Cocktail Dress",
      description: "Short cocktail dress with sequin work for festive parties",
      price: 1899,
      originalPrice: 2699,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Silver", value: "#9ca3af" },
        { name: "Navy", value: "#1e3a8a" },
        { name: "Burgundy", value: "#9d174d" }
      ],
      fabric: "Net with Sequin Work",
      occasion: "Party, Cocktail",
      care: "Dry Clean Only",
      delivery: "2-3 days",
      inStock: true
    },
    {
      id: 8,
      images: ["/images/festive8-1.jpg", "/images/festive8-2.jpg", "/images/festive8-3.jpg", "/images/festive8-4.jpg"],
      title: "Traditional Silk Kurta Set",
      description: "Pure silk kurta set with embroidered dupatta and palazzo",
      price: 2799,
      originalPrice: 3799,
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [
        { name: "Peach", value: "#fb923c" },
        { name: "Mint", value: "#34d399" },
        { name: "Lavender", value: "#a78bfa" }
      ],
      fabric: "Pure Silk",
      occasion: "Festive, Traditional",
      care: "Dry Clean Only",
      delivery: "3-4 days",
      inStock: true
    },
    {
      id: 9,
      images: ["/images/festive9-1.jpg", "/images/festive9-2.jpg", "/images/festive9-3.jpg", "/images/festive9-4.jpg"],
      title: "Designer Gown with Cape",
      description: "Modern gown with detachable cape and detailed back design",
      price: 4299,
      originalPrice: 5799,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Emerald", value: "#059669" },
        { name: "Royal Blue", value: "#1e40af" },
        { name: "Wine", value: "#831843" }
      ],
      fabric: "Chiffon with Lace",
      occasion: "Reception, Party",
      care: "Dry Clean Only",
      delivery: "4-5 days",
      inStock: true
    },
    {
      id: 10,
      images: ["/images/festive10-1.jpg", "/images/festive10-2.jpg", "/images/festive10-3.jpg", "/images/festive10-4.jpg"],
      title: "Embroidered Palazzo Suit",
      description: "Contemporary palazzo suit with detailed embroidery and flowy kurta",
      price: 2399,
      originalPrice: 3299,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Teal", value: "#0d9488" },
        { name: "Coral", value: "#f97316" },
        { name: "Plum", value: "#7e22ce" }
      ],
      fabric: "Crepe with Embroidery",
      occasion: "Festive, Party",
      care: "Dry Clean Only",
      delivery: "3-4 days",
      inStock: true
    }
  ];

  // Get recommended products (excluding current selected product)
  const getRecommendedProducts = () => {
    if (!selectedProduct) return products.slice(0, 6);
    return products.filter(p => p.id !== selectedProduct.id).slice(0, 6);
  };

  const handleAddToCart = (product: Product) => {
    if (!selectedSize || !selectedColor) {
      alert("Please select size and color before adding to cart");
      return;
    }

    const existingItem = cart.find(
      item => item.product.id === product.id && item.size === selectedSize && item.color === selectedColor
    );

    if (existingItem) {
      setCart(cart.map(item =>
        item.product.id === product.id && item.size === selectedSize && item.color === selectedColor
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, size: selectedSize, color: selectedColor, quantity: 1 }]);
    }

    alert("Added to cart successfully!");
  };

  const handleAddToWishlist = (product: Product) => {
    if (wishlist.find(item => item.id === product.id)) {
      setWishlist(wishlist.filter(item => item.id !== product.id));
      alert("Removed from wishlist");
    } else {
      setWishlist([...wishlist, product]);
      alert("Added to wishlist successfully!");
    }
  };

  const handleOrder = (product: Product) => {
    if (!selectedSize || !selectedColor) {
      alert("Please select size and color before ordering");
      return;
    }
    setShowLoginModal(true);
  };

  const handleImageClick = (image: string) => {
    setZoomImage(image);
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCart(cart.map((item, i) => i === index ? { ...item, quantity: newQuantity } : item));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setActiveImageIndex(0);
    setSelectedSize("");
    setSelectedColor("");
    setShowProductDetail(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b py-4 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link href="/traditional" className="text-gray-600 hover:text-gray-900">
              ← Back
            </Link>
            <h1 className="text-xl md:text-2xl font-light">Festive Collection</h1>
            <div className="flex gap-4">
              <Link 
                href="/wishlist"
                className="relative text-gray-600 hover:text-gray-900"
              >
                ♡
                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              <button 
                onClick={() => setShowCart(true)}
                className="relative text-gray-600 hover:text-gray-900"
              >
                🛒
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Product Detail View */}
      {isMobile && showProductDetail && selectedProduct && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          {/* Header */}
          <div className="bg-white border-b py-4 px-4 sticky top-0 z-10">
            <div className="flex justify-between items-center">
              <button 
                onClick={() => setShowProductDetail(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back
              </button>
              <h2 className="text-lg font-medium truncate max-w-[200px]">
                {selectedProduct.title}
              </h2>
              <div className="w-6"></div>
            </div>
          </div>

          {/* Product Images */}
          <div className="relative">
            <div className="relative h-80 w-full">
              <Image
                src={selectedProduct.images[activeImageIndex]}
                alt={selectedProduct.title}
                fill
                className="object-cover"
                onClick={() => handleImageClick(selectedProduct.images[activeImageIndex])}
              />
            </div>
            
            {/* Image Thumbnails */}
            <div className="flex gap-2 p-4 overflow-x-auto">
              {selectedProduct.images.map((image, index) => (
                <div
                  key={index}
                  className={`relative h-16 w-16 min-w-16 cursor-pointer border-2 rounded ${
                    activeImageIndex === index ? "border-gray-900" : "border-gray-300"
                  }`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <Image
                    src={image}
                    alt={`${selectedProduct.title} ${index + 1}`}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="p-4 border-b">
            <h1 className="text-xl font-semibold mb-2">{selectedProduct.title}</h1>
            <p className="text-gray-600 mb-3">{selectedProduct.description}</p>
            
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl font-bold text-gray-900">₹{selectedProduct.price}</span>
              <span className="text-lg text-gray-500 line-through">₹{selectedProduct.originalPrice}</span>
              <span className="text-green-600 font-medium">
                {Math.round((1 - selectedProduct.price / selectedProduct.originalPrice) * 100)}% OFF
              </span>
            </div>

            {/* Colors */}
            <div className="mb-4">
              <h4 className="font-medium mb-2">Color</h4>
              <div className="flex gap-3">
                {selectedProduct.colors.map((color, index) => (
                  <button
                    key={index}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColor === color.name ? "border-gray-900" : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setSelectedColor(color.name)}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-4">
              <h4 className="font-medium mb-2">Size</h4>
              <div className="flex gap-2 flex-wrap">
                {selectedProduct.sizes.map((size) => (
                  <button
                    key={size}
                    className={`px-4 py-2 border rounded-lg ${
                      selectedSize === size
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-2 text-sm text-gray-600">
              <div><strong>Fabric:</strong> {selectedProduct.fabric}</div>
              <div><strong>Occasion:</strong> {selectedProduct.occasion}</div>
              <div><strong>Care:</strong> {selectedProduct.care}</div>
              <div><strong>Delivery:</strong> {selectedProduct.delivery}</div>
            </div>
          </div>

          {/* Action Buttons - Fixed at bottom */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
            <div className="flex gap-3">
              <button
                onClick={() => handleAddToWishlist(selectedProduct)}
                className={`flex-1 py-3 border rounded-lg font-medium ${
                  wishlist.find(item => item.id === selectedProduct.id) 
                    ? "border-red-500 text-red-500" 
                    : "border-gray-300 text-gray-700"
                }`}
              >
                {wishlist.find(item => item.id === selectedProduct.id) ? "❤️" : "♡"}
              </button>
              <button
                onClick={() => handleAddToCart(selectedProduct)}
                disabled={!selectedProduct.inStock || !selectedSize || !selectedColor}
                className={`flex-1 py-3 rounded-lg font-medium ${
                  selectedProduct.inStock && selectedSize && selectedColor
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Add to Cart
              </button>
              <button
                onClick={() => handleOrder(selectedProduct)}
                disabled={!selectedProduct.inStock || !selectedSize || !selectedColor}
                className={`flex-1 py-3 rounded-lg font-medium ${
                  selectedProduct.inStock && selectedSize && selectedColor
                    ? "bg-gray-900 text-white hover:bg-gray-800"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Recommended Products */}
          <div className="p-4 pb-20">
            <h3 className="text-lg font-semibold mb-4">You May Also Like</h3>
            <div className="grid grid-cols-2 gap-4">
              {getRecommendedProducts().map((product) => (
                <div 
                  key={product.id} 
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                  onClick={() => openProductDetail(product)}
                >
                  <div className="relative h-40">
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-2">
                    <h4 className="text-sm font-medium line-clamp-2 mb-1">{product.title}</h4>
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-sm font-semibold">₹{product.price}</span>
                      <span className="text-xs text-gray-500 line-through">₹{product.originalPrice}</span>
                    </div>
                    <div className="flex gap-1">
                      {product.colors.slice(0, 2).map((color, index) => (
                        <div
                          key={index}
                          className="w-3 h-3 rounded-full border border-gray-300"
                          style={{ backgroundColor: color.value }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Products Grid */}
      {(!isMobile || !showProductDetail) && (
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-400 transition-colors"
                onClick={() => isMobile ? openProductDetail(product) : setSelectedProduct(product)}
              >
                {/* Product Image */}
                <div className="relative h-48 md:h-56 overflow-hidden">
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    className="object-cover hover:scale-105 transition duration-300 cursor-pointer"
                  />
                  {!product.inStock && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                      Out of Stock
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToWishlist(product);
                    }}
                    className={`absolute top-2 right-2 p-1 rounded-full ${
                      wishlist.find(item => item.id === product.id) 
                        ? "bg-red-500 text-white" 
                        : "bg-white/80 text-gray-600"
                    }`}
                  >
                    {wishlist.find(item => item.id === product.id) ? "❤️" : "♡"}
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">{product.title}</h3>
                  
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-sm font-semibold text-gray-900">₹{product.price}</span>
                    <span className="text-xs text-gray-500 line-through">₹{product.originalPrice}</span>
                    <span className="text-xs text-green-600 font-medium">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </span>
                  </div>

                  <div className="flex gap-1 mb-2">
                    {product.colors.slice(0, 2).map((color, index) => (
                      <div
                        key={index}
                        className="w-3 h-3 rounded-full border border-gray-300"
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>

                  <button className="w-full bg-gray-900 text-white py-2 rounded text-sm font-medium hover:bg-gray-800 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Desktop Product Detail Modal */}
      {!isMobile && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-light">{selectedProduct.title}</h2>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Images */}
                <div>
                  <div className="flex flex-col lg:flex-row gap-4">
                    {/* Thumbnails */}
                    <div className="flex lg:flex-col gap-2 order-2 lg:order-1 overflow-x-auto lg:overflow-x-visible">
                      {selectedProduct.images.map((image, index) => (
                        <div
                          key={index}
                          className={`relative h-20 w-20 min-w-20 cursor-pointer border-2 rounded-lg ${
                            activeImageIndex === index ? "border-gray-900" : "border-gray-300"
                          }`}
                          onClick={() => setActiveImageIndex(index)}
                        >
                          <Image
                            src={image}
                            alt={`${selectedProduct.title} ${index + 1}`}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                    
                    {/* Main Image */}
                    <div className="relative h-96 w-full lg:flex-1 order-1 lg:order-2">
                      <Image
                        src={selectedProduct.images[activeImageIndex]}
                        alt={selectedProduct.title}
                        fill
                        className="object-cover rounded-lg cursor-zoom-in"
                        onClick={() => handleImageClick(selectedProduct.images[activeImageIndex])}
                      />
                    </div>
                  </div>
                </div>

                {/* Product Details */}
                <div>
                  <p className="text-gray-600 mb-4">{selectedProduct.description}</p>

                  {/* Price */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl font-semibold text-gray-900">₹{selectedProduct.price}</span>
                    <span className="text-lg text-gray-500 line-through">₹{selectedProduct.originalPrice}</span>
                    <span className="text-green-600 font-medium">
                      {Math.round((1 - selectedProduct.price / selectedProduct.originalPrice) * 100)}% OFF
                    </span>
                  </div>

                  {/* Colors */}
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Color</h4>
                    <div className="flex gap-3">
                      {selectedProduct.colors.map((color, index) => (
                        <button
                          key={index}
                          className={`w-8 h-8 rounded-full border-2 ${
                            selectedColor === color.name ? "border-gray-900" : "border-gray-300"
                          }`}
                          style={{ backgroundColor: color.value }}
                          onClick={() => setSelectedColor(color.name)}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Sizes */}
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Size</h4>
                    <div className="flex gap-2 flex-wrap">
                      {selectedProduct.sizes.map((size) => (
                        <button
                          key={size}
                          className={`px-4 py-2 border rounded-lg ${
                            selectedSize === size
                              ? "border-gray-900 bg-gray-900 text-white"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-2 text-sm text-gray-600 mb-6">
                    <div><strong>Fabric:</strong> {selectedProduct.fabric}</div>
                    <div><strong>Occasion:</strong> {selectedProduct.occasion}</div>
                    <div><strong>Care:</strong> {selectedProduct.care}</div>
                    <div><strong>Delivery:</strong> {selectedProduct.delivery}</div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={() => handleAddToCart(selectedProduct)}
                      disabled={!selectedProduct.inStock || !selectedSize || !selectedColor}
                      className={`w-full py-3 rounded-lg font-medium ${
                        selectedProduct.inStock && selectedSize && selectedColor
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      } transition-colors`}
                    >
                      {selectedProduct.inStock ? "Add to Cart" : "Out of Stock"}
                    </button>

                    <button
                      onClick={() => handleOrder(selectedProduct)}
                      disabled={!selectedProduct.inStock || !selectedSize || !selectedColor}
                      className={`w-full py-3 rounded-lg font-medium ${
                        selectedProduct.inStock && selectedSize && selectedColor
                          ? "bg-gray-900 text-white hover:bg-gray-800"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      } transition-colors`}
                    >
                      {selectedProduct.inStock ? "Buy Now" : "Out of Stock"}
                    </button>

                    <button
                      onClick={() => handleAddToWishlist(selectedProduct)}
                      className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:border-gray-400 transition-colors"
                    >
                      {wishlist.find(item => item.id === selectedProduct.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Recommended Products for Desktop */}
              <div className="mt-12">
                <h3 className="text-xl font-semibold mb-6">You May Also Like</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {getRecommendedProducts().map((product) => (
                    <div 
                      key={product.id} 
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-400 transition-colors cursor-pointer"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <div className="relative h-40">
                        <Image
                          src={product.images[0]}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <h4 className="text-sm font-medium line-clamp-2 mb-1">{product.title}</h4>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-semibold">₹{product.price}</span>
                          <span className="text-xs text-gray-500 line-through">₹{product.originalPrice}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Zoom Modal */}
      {zoomImage && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
          <div className="relative max-w-4xl max-h-full">
            <Image
              src={zoomImage}
              alt="Zoomed product image"
              width={800}
              height={800}
              className="object-contain max-h-[80vh]"
            />
            <button
              onClick={() => setZoomImage("")}
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-light">Shopping Cart</h3>
                <button onClick={() => setShowCart(false)} className="text-gray-500 hover:text-gray-700">
                  ✕
                </button>
              </div>

              {cart.length === 0 ? (
                <p className="text-gray-600 text-center py-8">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item, index) => (
                      <div key={index} className="flex gap-4 border-b pb-4">
                        <div className="relative h-20 w-20 min-w-20">
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.title}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.product.title}</h4>
                          <p className="text-sm text-gray-600">Size: {item.size} | Color: {item.color}</p>
                          <p className="font-semibold">₹{item.product.price} x {item.quantity}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(index, item.quantity - 1)}
                            className="w-8 h-8 border rounded flex items-center justify-center"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(index, item.quantity + 1)}
                            className="w-8 h-8 border rounded flex items-center justify-center"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(index)}
                            className="text-red-500 hover:text-red-700 ml-2"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold">Total: ₹{getTotalPrice()}</span>
                    </div>
                    <button
                      onClick={() => setShowLoginModal(true)}
                      className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-light mb-4">Sign In Required</h3>
            <p className="text-gray-600 mb-6">
              Please sign in to place your order for <strong>{selectedProduct?.title}</strong>
            </p>
            
            <div className="space-y-3">
              <button className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                Sign In
              </button>
              <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:border-gray-400 transition-colors">
                Create Account
              </button>
              <button
                onClick={() => setShowLoginModal(false)}
                className="w-full text-gray-600 py-3 rounded-lg font-medium hover:text-gray-800 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
