// app/traditional/kurta-and-sets/page.tsx
"use client";

import { useState } from "react";
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
  featured?: boolean;
  stock?: number;
  productCode?: string;
}

export default function KurtaAndSetsPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [zoomImage, setZoomImage] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [addingToWishlist, setAddingToWishlist] = useState<number | null>(null);

  const products: Product[] = [
    {
      id: 1,
      images: ["/images/kurta1-1.jpg", "/images/kurta1-2.jpg", "/images/kurta1-3.jpg", "/images/kurta1-4.jpg"],
      title: "Classic Cotton Kurta Set",
      description: "Breathable cotton kurta with straight pants and dupatta for daily wear",
      price: 1499,
      originalPrice: 1999,
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [
        { name: "White", value: "#ffffff" },
        { name: "Blue", value: "#0ea5e9" },
        { name: "Green", value: "#059669" }
      ],
      fabric: "100% Premium Cotton",
      occasion: "Casual, Daily Wear",
      care: "Machine Wash",
      delivery: "2-3 days",
      inStock: true,
      featured: true,
      stock: 15,
      productCode: "KUR-CS-001"
    },
    {
      id: 2,
      images: ["/images/kurta2-1.jpg", "/images/kurta2-2.jpg", "/images/kurta2-3.jpg", "/images/kurta2-4.jpg"],
      title: "Embroidered Kurta Set",
      description: "Hand-embroidered kurta with detailed thread work and palazzo pants",
      price: 1899,
      originalPrice: 2499,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Pink", value: "#ec4899" },
        { name: "Purple", value: "#7c3aed" },
        { name: "Black", value: "#000000" }
      ],
      fabric: "Chanderi Silk with Embroidery",
      occasion: "Festive, Party",
      care: "Dry Clean Only",
      delivery: "3-4 days",
      inStock: true,
      featured: true,
      stock: 8,
      productCode: "KUR-EM-002"
    },
    {
      id: 3,
      images: ["/images/kurta3-1.jpg", "/images/kurta3-2.jpg", "/images/kurta3-3.jpg", "/images/kurta3-4.jpg"],
      title: "Designer Anarkali Kurta",
      description: "Floor-length anarkali with heavy embroidery and flowy silhouette",
      price: 2599,
      originalPrice: 3499,
      sizes: ["M", "L", "XL", "XXL"],
      colors: [
        { name: "Red", value: "#dc2626" },
        { name: "Black", value: "#000000" },
        { name: "Gold", value: "#f59e0b" }
      ],
      fabric: "Georgette with Stone Work",
      occasion: "Wedding, Festive",
      care: "Dry Clean Only",
      delivery: "4-5 days",
      inStock: true,
      featured: true,
      stock: 12,
      productCode: "KUR-AN-003"
    },
    {
      id: 4,
      images: ["/images/kurta4-1.jpg", "/images/kurta4-2.jpg", "/images/kurta4-3.jpg", "/images/kurta4-4.jpg"],
      title: "Pure Silk Kurta Set",
      description: "Luxurious pure silk kurta with printed pants and stole",
      price: 3299,
      originalPrice: 4299,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Gold", value: "#f59e0b" },
        { name: "Red", value: "#dc2626" },
        { name: "Purple", value: "#7c3aed" }
      ],
      fabric: "Pure Banarasi Silk",
      occasion: "Festive, Wedding",
      care: "Dry Clean Only",
      delivery: "5-7 days",
      inStock: true,
      featured: false,
      stock: 6,
      productCode: "KUR-SL-004"
    },
    {
      id: 5,
      images: ["/images/kurta5-1.jpg", "/images/kurta5-2.jpg", "/images/kurta5-3.jpg", "/images/kurta5-4.jpg"],
      title: "Printed Kurta Set",
      description: "Contemporary printed kurta with dhoti pants and dupatta",
      price: 1699,
      originalPrice: 2199,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "White", value: "#ffffff" },
        { name: "Blue", value: "#0ea5e9" },
        { name: "Green", value: "#059669" }
      ],
      fabric: "Rayon with Digital Print",
      occasion: "Casual, Party",
      care: "Machine Wash",
      delivery: "2-3 days",
      inStock: true,
      featured: false,
      stock: 18,
      productCode: "KUR-PR-005"
    },
    {
      id: 6,
      images: ["/images/kurta6-1.jpg", "/images/kurta6-2.jpg", "/images/kurta6-3.jpg", "/images/kurta6-4.jpg"],
      title: "Party Wear Kurta Set",
      description: "Sequined and embellished kurta for special occasions",
      price: 2899,
      originalPrice: 3799,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Black", value: "#000000" },
        { name: "Purple", value: "#7c3aed" },
        { name: "Red", value: "#dc2626" }
      ],
      fabric: "Net with Sequins Work",
      occasion: "Party, Reception",
      care: "Dry Clean Only",
      delivery: "4-5 days",
      inStock: true,
      featured: true,
      stock: 10,
      productCode: "KUR-PT-006"
    },
    {
      id: 7,
      images: ["/images/kurta7-1.jpg", "/images/kurta7-2.jpg", "/images/kurta7-3.jpg", "/images/kurta7-4.jpg"],
      title: "Linen Kurta Set",
      description: "Sustainable linen kurta with wide-leg pants for comfort",
      price: 1999,
      originalPrice: 2599,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Brown", value: "#d97706" },
        { name: "Green", value: "#059669" },
        { name: "Black", value: "#000000" }
      ],
      fabric: "100% Pure Linen",
      occasion: "Casual, Summer Wear",
      care: "Machine Wash",
      delivery: "3-4 days",
      inStock: true,
      featured: false,
      stock: 14,
      productCode: "KUR-LN-007"
    },
    {
      id: 8,
      images: ["/images/kurta8-1.jpg", "/images/kurta8-2.jpg", "/images/kurta8-3.jpg", "/images/kurta8-4.jpg"],
      title: "Bridal Kurta Collection",
      description: "Heavy bridal kurta with elaborate embroidery and dupatta",
      price: 4599,
      originalPrice: 5999,
      sizes: ["M", "L", "XL", "XXL"],
      colors: [
        { name: "Red", value: "#dc2626" },
        { name: "White", value: "#ffffff" },
        { name: "Pink", value: "#f472b6" }
      ],
      fabric: "Velvet with Kundan Work",
      occasion: "Bridal, Wedding",
      care: "Dry Clean Only",
      delivery: "7-10 days",
      inStock: true,
      featured: true,
      stock: 5,
      productCode: "KUR-BR-008"
    }
  ];

  // Function to create slug from product name
  const createSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  };

  // Add to Cart Function
  const addToCart = async (product: Product, size: string = "", color: string = "") => {
    setAddingToCart(product.id);
    
    try {
      const selectedSize = size || (product.sizes.length > 0 ? product.sizes[0] : "");
      const selectedColor = color || (product.colors.length > 0 ? product.colors[0].name : "");
      
      const cartItem = {
        id: `${product.id}-${selectedSize}-${selectedColor}`,
        productId: product.id,
        name: product.title,
        price: product.price,
        image: product.images[0],
        quantity: 1,
        size: selectedSize,
        color: selectedColor,
        productCode: product.productCode
      };

      // Get existing cart from localStorage
      const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existingItemIndex = existingCart.findIndex(
        (item: any) => item.id === cartItem.id
      );

      let updatedCart;
      if (existingItemIndex > -1) {
        // Update quantity if item exists
        updatedCart = existingCart.map((item: any, index: number) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item
        updatedCart = [...existingCart, cartItem];
      }

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      
      // Dispatch event for header update
      window.dispatchEvent(new Event('cartUpdated'));
      
      // Show success message
      alert(`${product.title} added to cart successfully!`);
      
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add product to cart");
    } finally {
      setAddingToCart(null);
    }
  };

  // Add to Wishlist Function
  const addToWishlist = async (product: Product) => {
    setAddingToWishlist(product.id);
    
    try {
      const wishlistItem = {
        id: product.id,
        productId: product.id,
        name: product.title,
        price: product.price,
        image: product.images[0],
        productCode: product.productCode
      };

      // Get existing wishlist from localStorage
      const existingWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      const existingItemIndex = existingWishlist.findIndex(
        (item: any) => item.id === wishlistItem.id
      );

      let updatedWishlist;
      if (existingItemIndex > -1) {
        // Remove if already in wishlist
        updatedWishlist = existingWishlist.filter((item: any) => item.id !== wishlistItem.id);
        alert(`${product.title} removed from wishlist`);
      } else {
        // Add to wishlist
        updatedWishlist = [...existingWishlist, wishlistItem];
        alert(`${product.title} added to wishlist!`);
      }

      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      
      // Dispatch event for header update
      window.dispatchEvent(new Event('wishlistUpdated'));
      
    } catch (error) {
      console.error("Error updating wishlist:", error);
      alert("Failed to update wishlist");
    } finally {
      setAddingToWishlist(null);
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

  const handleQuickAddToCart = (product: Product) => {
    if (product.sizes.length === 1 && product.colors.length === 1) {
      // If only one size and color, add directly to cart
      addToCart(product, product.sizes[0], product.colors[0].name);
    } else {
      // If multiple options, open quick view
      setSelectedProduct(product);
      setSelectedSize(product.sizes[0] || "");
      setSelectedColor(product.colors[0]?.name || "");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-pink-50">
      {/* Ethnic Header */}
      <div className="bg-gradient-to-r from-rose-800 to-pink-700 text-white py-6 shadow-lg relative overflow-hidden">
        {/* Ethnic Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '200px'
        }}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex justify-between items-center">
            <Link href="/traditional" className="text-rose-100 hover:text-white transition-colors flex items-center gap-2 backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Traditional
            </Link>
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-2 font-serif">🌸 Kurta & Sets 🌸</h1>
              <p className="text-rose-100 text-sm">Traditional Ethnic Collection 2024</p>
            </div>
            <div className="w-8"></div>
          </div>
        </div>
      </div>

      {/* Ethnic Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-pink-600 to-rose-600 text-white py-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-repeat" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px'
          }}></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <p className="font-semibold text-lg">🪷 Traditional Craftsmanship • Premium Fabrics • Authentic Designs 🪷</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-rose-100 group relative overflow-hidden">
              {/* Ethnic Corner Design */}
              <div className="absolute top-0 left-0 w-12 h-12 bg-gradient-to-br from-rose-500 to-purple-600 opacity-10 rounded-br-2xl"></div>
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-rose-500 to-purple-600 opacity-10 rounded-bl-2xl"></div>
              
              {/* Product Image */}
              <div className="relative h-80 overflow-hidden rounded-t-2xl">
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-110 transition duration-500 cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                />
                
                {/* Ethnic Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {!product.inStock && (
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      Out of Stock
                    </div>
                  )}
                  {product.featured && (
                    <div className="bg-gradient-to-r from-rose-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      ✨ Featured
                    </div>
                  )}
                  <div className="bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                    {product.images.length} views
                  </div>
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToWishlist(product);
                  }}
                  disabled={addingToWishlist === product.id}
                  className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 shadow-lg hover:scale-110"
                >
                  {addingToWishlist === product.id ? (
                    <div className="w-5 h-5 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  )}
                </button>

                {/* Quick Add to Cart Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickAddToCart(product);
                  }}
                  disabled={!product.inStock || addingToCart === product.id}
                  className={`absolute bottom-3 right-3 px-4 py-2 rounded-full font-semibold transition-all duration-300 shadow-lg hover:scale-105 ${
                    !product.inStock
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-rose-500 to-purple-600 text-white hover:from-rose-600 hover:to-purple-700"
                  }`}
                >
                  {addingToCart === product.id ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-lg font-serif">{product.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                
                {/* Price Section */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
                    <span className="text-lg text-gray-500 line-through">₹{product.originalPrice}</span>
                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </span>
                  </div>
                </div>

                {/* Colors and Stock */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1">
                    {product.colors.slice(0, 3).map((color, index) => (
                      <div
                        key={index}
                        className="w-5 h-5 rounded-full border-2 border-white shadow-md"
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                    {product.colors.length > 3 && (
                      <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">+{product.colors.length - 3}</div>
                    )}
                  </div>
                  <span className={`text-sm font-semibold ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {product.inStock ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link
                    href={`/product/${createSlug(product.title)}`}
                    className="flex-1 bg-gradient-to-r from-gray-800 to-gray-900 text-white py-3 rounded-xl font-semibold hover:from-gray-900 hover:to-black transition-all duration-300 text-center shadow-md hover:shadow-lg"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="px-6 border-2 border-rose-500 text-rose-600 rounded-xl font-semibold hover:bg-rose-500 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Quick View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ethnic Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-white to-rose-50 rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border-2 border-rose-200 shadow-2xl relative overflow-hidden">
            {/* Ethnic Pattern Background */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-repeat" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ec4899' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                backgroundSize: '150px'
              }}></div>
            </div>
            
            <div className="p-8 relative z-10">
              {/* Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2 font-serif">{selectedProduct.title}</h2>
                  {selectedProduct.productCode && (
                    <p className="text-rose-600 font-semibold">Product Code: {selectedProduct.productCode}</p>
                  )}
                </div>
                <button
                  onClick={() => {
                    setSelectedProduct(null);
                    setSelectedImageIndex(0);
                  }}
                  className="w-10 h-10 bg-rose-100 text-rose-600 rounded-full hover:bg-rose-200 transition-colors flex items-center justify-center text-xl font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Images with Ethnic Gallery */}
                <div>
                  {/* Main Image */}
                  <div 
                    className="relative h-96 bg-gradient-to-br from-rose-100 to-pink-100 rounded-2xl mb-6 cursor-zoom-in border-2 border-rose-200 shadow-lg"
                    onClick={() => handleImageClick(selectedProduct.images[selectedImageIndex])}
                  >
                    <Image
                      src={selectedProduct.images[selectedImageIndex]}
                      alt={`${selectedProduct.title} - View ${selectedImageIndex + 1}`}
                      fill
                      className="object-cover rounded-2xl"
                    />
                    {!selectedProduct.inStock && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        Sold Out
                      </div>
                    )}
                  </div>
                  
                  {/* Thumbnail Gallery */}
                  <div className="grid grid-cols-4 gap-3">
                    {selectedProduct.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`aspect-square bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl overflow-hidden border-2 transition-all duration-300 shadow-md hover:shadow-lg ${
                          selectedImageIndex === index 
                            ? "border-rose-500 scale-105 shadow-rose-200" 
                            : "border-rose-100 hover:border-rose-300"
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
                  <p className="text-rose-600 text-sm mt-3 text-center">🌸 Click on images to zoom 🌸</p>
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                  <p className="text-gray-700 text-lg leading-relaxed">{selectedProduct.description}</p>

                  {/* Ethnic Price Section */}
                  <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-200">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-4xl font-bold text-gray-900">₹{selectedProduct.price}</span>
                      <span className="text-2xl text-gray-500 line-through">₹{selectedProduct.originalPrice}</span>
                      <span className="text-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full font-bold">
                        {Math.round((1 - selectedProduct.price / selectedProduct.originalPrice) * 100)}% OFF
                      </span>
                    </div>
                    <div className={`text-lg font-semibold ${selectedProduct.inStock ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedProduct.inStock ? `🪷 ${selectedProduct.stock} items in stock` : 'Out of Stock'}
                    </div>
                  </div>

                  {/* Colors */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-gray-900 text-lg font-serif">Color</h4>
                    <div className="flex gap-4">
                      {selectedProduct.colors.map((color, index) => (
                        <button
                          key={index}
                          className={`w-12 h-12 rounded-full border-4 shadow-lg transition-all duration-300 transform hover:scale-110 ${
                            selectedColor === color.name 
                              ? "border-rose-500 ring-4 ring-rose-200" 
                              : "border-white hover:border-rose-300"
                          }`}
                          style={{ backgroundColor: color.value }}
                          onClick={() => setSelectedColor(color.name)}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Sizes */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-gray-900 text-lg font-serif">Size</h4>
                    <div className="flex gap-3 flex-wrap">
                      {selectedProduct.sizes.map((size) => (
                        <button
                          key={size}
                          className={`px-6 py-3 border-2 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                            selectedSize === size
                              ? "bg-gradient-to-r from-rose-500 to-purple-600 text-white border-transparent shadow-lg"
                              : "border-rose-300 text-gray-700 hover:border-rose-500 hover:bg-rose-50"
                          }`}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="bg-white rounded-2xl p-6 border border-rose-200 space-y-3">
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="font-bold text-rose-600">Fabric:</span>
                      <span>{selectedProduct.fabric}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="font-bold text-rose-600">Occasion:</span>
                      <span>{selectedProduct.occasion}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="font-bold text-rose-600">Care:</span>
                      <span>{selectedProduct.care}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="font-bold text-rose-600">Delivery:</span>
                      <span>{selectedProduct.delivery}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <button
                        onClick={() => addToCart(selectedProduct, selectedSize, selectedColor)}
                        disabled={!selectedProduct.inStock || addingToCart === selectedProduct.id}
                        className="flex-1 bg-gradient-to-r from-rose-500 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-rose-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                      >
                        {addingToCart === selectedProduct.id ? (
                          <>
                            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                            Adding to Cart...
                          </>
                        ) : (
                          <>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add to Cart
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => addToWishlist(selectedProduct)}
                        disabled={addingToWishlist === selectedProduct.id}
                        className="px-6 border-2 border-rose-500 text-rose-600 rounded-xl font-bold hover:bg-rose-500 hover:text-white disabled:opacity-50 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
                      >
                        {addingToWishlist === selectedProduct.id ? (
                          <div className="w-6 h-6 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        )}
                      </button>
                    </div>

                    <div className="flex gap-4">
                      <Link
                        href={`/product/${createSlug(selectedProduct.title)}`}
                        className="flex-1 bg-gradient-to-r from-gray-800 to-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:from-gray-900 hover:to-black transition-all duration-300 shadow-lg hover:shadow-xl text-center"
                      >
                        View Full Details
                      </Link>
                      <button
                        onClick={() => handleOrder(selectedProduct)}
                        disabled={!selectedProduct.inStock}
                        className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl ${
                          selectedProduct.inStock
                            ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {selectedProduct.inStock ? "🌸 Order Now" : "Out of Stock"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ethnic Zoom Modal */}
      {zoomImage && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="relative max-w-5xl max-h-full">
            <div className="bg-gradient-to-br from-rose-100 to-pink-100 p-4 rounded-3xl shadow-2xl">
              <Image
                src={zoomImage}
                alt="Zoomed product image"
                width={800}
                height={800}
                className="object-contain max-h-[80vh] rounded-2xl"
              />
            </div>
            <button
              onClick={() => setZoomImage("")}
              className="absolute top-6 right-6 w-12 h-12 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors flex items-center justify-center text-xl font-bold shadow-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Ethnic Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-white to-rose-50 rounded-3xl p-8 max-w-md w-full border-2 border-rose-200 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-rose-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2 font-serif">Sign In Required</h3>
              <p className="text-gray-600">
                Please sign in to place your order for <strong className="text-rose-600">{selectedProduct?.title}</strong>
              </p>
            </div>
            
            <div className="space-y-4">
              <button className="w-full bg-gradient-to-r from-rose-500 to-purple-600 text-white py-4 rounded-xl font-bold hover:from-rose-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                Sign In Now
              </button>
              <button className="w-full border-2 border-rose-500 text-rose-600 py-4 rounded-xl font-bold hover:bg-rose-500 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg">
                Create New Account
              </button>
              <button
                onClick={() => setShowLoginModal(false)}
                className="w-full text-gray-600 py-4 rounded-xl font-bold hover:text-rose-600 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ethnic Footer Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-pink-600 to-rose-600 text-white py-6 text-center mt-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-repeat" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px'
          }}></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <p className="text-xl font-bold mb-2 font-serif">🌸 Traditional Elegance • Authentic Craftsmanship • Premium Quality 🌸</p>
          <p className="text-rose-100">Free Shipping on orders above ₹1999 • Easy Returns • Cash on Delivery</p>
        </div>
      </div>
    </div>
  );
}