﻿// app/traditional/kurta-and-sets/page.tsx
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

export default function KurtaAndSetsPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [zoomImage, setZoomImage] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [addingToWishlist, setAddingToWishlist] = useState<number | null>(null);
  const [wishlistItems, setWishlistItems] = useState<Set<number>>(new Set());

  // Load wishlist from localStorage on component mount
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem("wishlist");
      if (savedWishlist) {
        const parsedWishlist = JSON.parse(savedWishlist);
        if (Array.isArray(parsedWishlist)) {
          const wishlistIds = new Set(parsedWishlist.map((item: any) => item.id));
          setWishlistItems(wishlistIds);
        }
      }
    } catch (error) {
      console.error("Error loading wishlist from localStorage:", error);
      setWishlistItems(new Set());
    }
  }, []);

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
      inStock: true
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
      inStock: true
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
      inStock: true
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
      inStock: true
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
      inStock: true
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
      inStock: true
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
      inStock: true
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
      inStock: true
    },
    {
      id: 9,
      images: ["/images/kurta9-1.jpg", "/images/kurta9-2.jpg", "/images/kurta9-3.jpg", "/images/kurta9-4.jpg"],
      title: "Designer Kurta with Jacket",
      description: "Contemporary kurta set with designer jacket and embroidery",
      price: 3199,
      originalPrice: 4299,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Navy", value: "#1e3a8a" },
        { name: "Maroon", value: "#991b1b" },
        { name: "Emerald", value: "#059669" }
      ],
      fabric: "Silk with Embroidery",
      occasion: "Festive, Party",
      care: "Dry Clean Only",
      delivery: "4-5 days",
      inStock: true
    },
    {
      id: 10,
      images: ["/images/kurta10-1.jpg", "/images/kurta10-2.jpg", "/images/kurta10-3.jpg", "/images/kurta10-4.jpg"],
      title: "Cotton Anarkali Set",
      description: "Comfortable cotton anarkali with minimal embroidery",
      price: 1799,
      originalPrice: 2399,
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [
        { name: "Sky Blue", value: "#0ea5e9" },
        { name: "Mint", value: "#34d399" },
        { name: "Lavender", value: "#a78bfa" }
      ],
      fabric: "Pure Cotton",
      occasion: "Casual, Daily Wear",
      care: "Machine Wash",
      delivery: "2-3 days",
      inStock: true
    },
    {
      id: 11,
      images: ["/images/kurta11-1.jpg", "/images/kurta11-2.jpg", "/images/kurta11-3.jpg", "/images/kurta11-4.jpg"],
      title: "Silk Palazzo Set",
      description: "Pure silk kurta with matching palazzo and dupatta",
      price: 2799,
      originalPrice: 3699,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Peach", value: "#fb923c" },
        { name: "Cream", value: "#fef3c7" },
        { name: "Rose", value: "#f472b6" }
      ],
      fabric: "Pure Silk",
      occasion: "Festive, Party",
      care: "Dry Clean Only",
      delivery: "4-5 days",
      inStock: true
    },
    {
      id: 12,
      images: ["/images/kurta12-1.jpg", "/images/kurta12-2.jpg", "/images/kurta12-3.jpg", "/images/kurta12-4.jpg"],
      title: "Embroidered Anarkali",
      description: "Heavy embroidered anarkali with detailed work",
      price: 3499,
      originalPrice: 4699,
      sizes: ["M", "L", "XL", "XXL"],
      colors: [
        { name: "Royal Blue", value: "#1e40af" },
        { name: "Purple", value: "#7c3aed" },
        { name: "Black", value: "#000000" }
      ],
      fabric: "Georgette with Stone Work",
      occasion: "Wedding, Festive",
      care: "Dry Clean Only",
      delivery: "5-6 days",
      inStock: true
    },
    {
      id: 13,
      images: ["/images/kurta13-1.jpg", "/images/kurta13-2.jpg", "/images/kurta13-3.jpg", "/images/kurta13-4.jpg"],
      title: "Linen Cotton Blend Set",
      description: "Comfortable linen-cotton blend for everyday wear",
      price: 1599,
      originalPrice: 2099,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Beige", value: "#d6d3d1" },
        { name: "Olive", value: "#3f6212" },
        { name: "Terracotta", value: "#92400e" }
      ],
      fabric: "Linen-Cotton Blend",
      occasion: "Casual, Office Wear",
      care: "Machine Wash",
      delivery: "2-3 days",
      inStock: true
    },
    {
      id: 14,
      images: ["/images/kurta14-1.jpg", "/images/kurta14-2.jpg", "/images/kurta14-3.jpg", "/images/kurta14-4.jpg"],
      title: "Designer Kurta with Cape",
      description: "Modern kurta set with designer cape and embroidery",
      price: 3899,
      originalPrice: 5199,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Burgundy", value: "#9d174d" },
        { name: "Navy", value: "#1e3a8a" },
        { name: "Emerald", value: "#059669" }
      ],
      fabric: "Chiffon with Embroidery",
      occasion: "Party, Reception",
      care: "Dry Clean Only",
      delivery: "5-6 days",
      inStock: true
    },
    {
      id: 15,
      images: ["/images/kurta15-1.jpg", "/images/kurta15-2.jpg", "/images/kurta15-3.jpg", "/images/kurta15-4.jpg"],
      title: "Cotton Silk Kurta Set",
      description: "Premium cotton silk blend with minimal embroidery",
      price: 2299,
      originalPrice: 3099,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Pastel Pink", value: "#fbcfe8" },
        { name: "Mint", value: "#a7f3d0" },
        { name: "Lavender", value: "#ddd6fe" }
      ],
      fabric: "Cotton Silk Blend",
      occasion: "Festive, Casual",
      care: "Dry Clean Only",
      delivery: "3-4 days",
      inStock: true
    },
    {
      id: 16,
      images: ["/images/kurta16-1.jpg", "/images/kurta16-2.jpg", "/images/kurta16-3.jpg", "/images/kurta16-4.jpg"],
      title: "Heavy Bridal Kurta",
      description: "Exclusive bridal kurta with heavy zardozi work",
      price: 5999,
      originalPrice: 7999,
      sizes: ["M", "L", "XL", "XXL"],
      colors: [
        { name: "Red", value: "#dc2626" },
        { name: "Maroon", value: "#991b1b" },
        { name: "Pink", value: "#db2777" }
      ],
      fabric: "Velvet with Zardozi",
      occasion: "Bridal, Wedding",
      care: "Dry Clean Only",
      delivery: "7-10 days",
      inStock: true
    },
    {
      id: 17,
      images: ["/images/kurta17-1.jpg", "/images/kurta17-2.jpg", "/images/kurta17-3.jpg", "/images/kurta17-4.jpg"],
      title: "Printed Anarkali Set",
      description: "Digital printed anarkali with flowy silhouette",
      price: 1999,
      originalPrice: 2699,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Multi Color", value: "#7c3aed" },
        { name: "Blue", value: "#1e40af" },
        { name: "Green", value: "#16a34a" }
      ],
      fabric: "Georgette with Digital Print",
      occasion: "Party, Festive",
      care: "Dry Clean Only",
      delivery: "3-4 days",
      inStock: true
    },
    {
      id: 18,
      images: ["/images/kurta18-1.jpg", "/images/kurta18-2.jpg", "/images/kurta18-3.jpg", "/images/kurta18-4.jpg"],
      title: "Silk Kurta with Embroidery",
      description: "Pure silk kurta with delicate embroidery work",
      price: 2699,
      originalPrice: 3599,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Gold", value: "#d97706" },
        { name: "Peach", value: "#fb923c" },
        { name: "Cream", value: "#fef3c7" }
      ],
      fabric: "Pure Silk",
      occasion: "Festive, Wedding",
      care: "Dry Clean Only",
      delivery: "4-5 days",
      inStock: true
    },
    {
      id: 19,
      images: ["/images/kurta19-1.jpg", "/images/kurta19-2.jpg", "/images/kurta19-3.jpg", "/images/kurta19-4.jpg"],
      title: "Cotton Kurta with Print",
      description: "Comfortable cotton kurta with traditional prints",
      price: 1399,
      originalPrice: 1899,
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [
        { name: "White", value: "#ffffff" },
        { name: "Blue", value: "#0ea5e9" },
        { name: "Yellow", value: "#facc15" }
      ],
      fabric: "100% Cotton",
      occasion: "Casual, Daily Wear",
      care: "Machine Wash",
      delivery: "2-3 days",
      inStock: true
    },
    {
      id: 20,
      images: ["/images/kurta20-1.jpg", "/images/kurta20-2.jpg", "/images/kurta20-3.jpg", "/images/kurta20-4.jpg"],
      title: "Designer Kurta Set",
      description: "Contemporary designer kurta with modern cuts",
      price: 3199,
      originalPrice: 4299,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Black", value: "#000000" },
        { name: "Navy", value: "#1e3a8a" },
        { name: "Burgundy", value: "#9d174d" }
      ],
      fabric: "Crepe with Embroidery",
      occasion: "Party, Festive",
      care: "Dry Clean Only",
      delivery: "4-5 days",
      inStock: true
    }
  ];

  // Add to Cart Function - No alerts
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
        color: selectedColor
      };

      // Get existing cart from localStorage with proper error handling
      let existingCart = [];
      try {
        const cartData = localStorage.getItem("cart");
        if (cartData) {
          existingCart = JSON.parse(cartData);
        }
      } catch (error) {
        console.error("Error reading cart from localStorage:", error);
        existingCart = [];
      }

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
      
      // Dispatch event for header update - this will update the cart count in header
      window.dispatchEvent(new Event('cartUpdated'));
      
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setAddingToCart(null);
    }
  };

  // Add to Wishlist Function - No alerts
  const addToWishlist = async (product: Product) => {
    setAddingToWishlist(product.id);
    
    try {
      const wishlistItem = {
        id: product.id,
        productId: product.id,
        name: product.title,
        price: product.price,
        image: product.images[0]
      };

      // Get existing wishlist from localStorage with proper error handling
      let existingWishlist = [];
      try {
        const wishlistData = localStorage.getItem("wishlist");
        if (wishlistData) {
          existingWishlist = JSON.parse(wishlistData);
        }
      } catch (error) {
        console.error("Error reading wishlist from localStorage:", error);
        existingWishlist = [];
      }

      const existingItemIndex = existingWishlist.findIndex(
        (item: any) => item.id === wishlistItem.id
      );

      let updatedWishlist;
      if (existingItemIndex > -1) {
        // Remove if already in wishlist
        updatedWishlist = existingWishlist.filter((item: any) => item.id !== wishlistItem.id);
        setWishlistItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(product.id);
          return newSet;
        });
      } else {
        // Add to wishlist
        updatedWishlist = [...existingWishlist, wishlistItem];
        setWishlistItems(prev => new Set(prev).add(product.id));
      }

      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      
      // Dispatch event for header update
      window.dispatchEvent(new Event('wishlistUpdated'));
      
    } catch (error) {
      console.error("Error updating wishlist:", error);
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

  const handleQuickAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizes[0] || "");
    setSelectedColor(product.colors[0]?.name || "");
    setSelectedImageIndex(0);
  };

  // Check if product is in wishlist
  const isInWishlist = (productId: number) => {
    return wishlistItems.has(productId);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link href="/traditional" className="text-gray-600 hover:text-gray-900">
              ← Back to Traditional
            </Link>
            <h1 className="text-2xl font-light">Kurta & Sets</h1>
            <div className="w-8"></div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-400 transition-colors group cursor-pointer"
              onClick={() => handleProductClick(product)}
            >
              {/* Product Image */}
              <div className="relative h-80 overflow-hidden">
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                />
                
                {/* Wishlist Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToWishlist(product);
                  }}
                  disabled={addingToWishlist === product.id}
                  className={`absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors ${
                    isInWishlist(product.id) ? 'text-red-500' : 'text-gray-600'
                  }`}
                >
                  {addingToWishlist === product.id ? (
                    <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                  ) : isInWishlist(product.id) ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  )}
                </button>

                {!product.inStock && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
                    Out of Stock
                  </div>
                )}
                <div className="absolute top-12 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  {product.images.length} views
                </div>

                {/* Quick Add to Cart Button */}
                <button
                  onClick={(e) => handleQuickAddToCart(product, e)}
                  disabled={!product.inStock || addingToCart === product.id}
                  className={`absolute bottom-2 right-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                    !product.inStock
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  {addingToCart === product.id ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{product.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-gray-900">₹{product.price}</span>
                    <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                    <span className="text-sm text-green-600 font-medium">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-1">
                    {product.colors.slice(0, 3).map((color, index) => (
                      <div
                        key={index}
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                    {product.colors.length > 3 && (
                      <div className="text-xs text-gray-500">+{product.colors.length - 3} more</div>
                    )}
                  </div>
                  <span className={`text-xs font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {product.inStock ? 'In stock' : 'Out of stock'}
                  </span>
                </div>

                {/* Single Add to Cart Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickAddToCart(product, e);
                  }}
                  disabled={!product.inStock || addingToCart === product.id}
                  className={`w-full py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                    !product.inStock
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  {addingToCart === product.id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add to Cart
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-light">{selectedProduct.title}</h2>
                <button
                  onClick={() => {
                    setSelectedProduct(null);
                    setSelectedImageIndex(0);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Images with 4-angle view */}
                <div>
                  {/* Main Image */}
                  <div 
                    className="relative h-80 bg-gray-100 rounded-lg mb-4 cursor-zoom-in"
                    onClick={() => handleImageClick(selectedProduct.images[selectedImageIndex])}
                  >
                    <Image
                      src={selectedProduct.images[selectedImageIndex]}
                      alt={`${selectedProduct.title} - View ${selectedImageIndex + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                    {!selectedProduct.inStock && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Sold Out
                      </div>
                    )}
                  </div>
                  
                  {/* Thumbnail Gallery */}
                  <div className="grid grid-cols-4 gap-2">
                    {selectedProduct.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImageIndex === index ? "border-black" : "border-transparent"
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
                  <p className="text-sm text-gray-600 mt-2">Click on images to zoom</p>
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

                  {/* Stock Status */}
                  <div className={`text-sm font-medium mb-4 ${selectedProduct.inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedProduct.inStock ? 'In stock' : 'Out of Stock'}
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
                          className={`px-4 py-2 border rounded-lg font-medium transition-all ${
                            selectedSize === size
                              ? "border-black bg-black text-white"
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
                  <div className="flex gap-3 mb-3">
                    <button
                      onClick={() => addToCart(selectedProduct, selectedSize, selectedColor)}
                      disabled={!selectedProduct.inStock || addingToCart === selectedProduct.id}
                      className="flex-1 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      {addingToCart === selectedProduct.id ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Adding...
                        </>
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
                      onClick={() => addToWishlist(selectedProduct)}
                      disabled={addingToWishlist === selectedProduct.id}
                      className={`px-4 border border-gray-300 rounded-lg font-medium hover:border-red-500 disabled:opacity-50 transition-colors flex items-center justify-center ${
                        isInWishlist(selectedProduct.id) 
                          ? 'bg-red-50 border-red-300 text-red-600 hover:bg-red-100' 
                          : 'text-gray-700 hover:text-red-600'
                      }`}
                    >
                      {addingToWishlist === selectedProduct.id ? (
                        <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      ) : isInWishlist(selectedProduct.id) ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      )}
                    </button>
                  </div>

                  <button
                    onClick={() => handleOrder(selectedProduct)}
                    disabled={!selectedProduct.inStock}
                    className={`w-full py-3 rounded-lg font-medium ${
                      selectedProduct.inStock
                        ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    } transition-colors`}
                  >
                    {selectedProduct.inStock ? "Order Now" : "Out of Stock"}
                  </button>
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