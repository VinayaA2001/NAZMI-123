// app/traditional/ethnic-dresses/page.tsx
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
}

export default function EthnicDressesPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [zoomImage, setZoomImage] = useState("");

  const products: Product[] = [
    {
      id: 1,
      images: ["/images/ethnic1-1.jpg", "/images/ethnic1-2.jpg", "/images/ethnic1-3.jpg", "/images/ethnic1-4.jpg"],
      title: "Embroidered Anarkali Suit",
      description: "Beautiful hand-embroidered anarkali with intricate thread work and stone embellishments",
      price: 3499,
      originalPrice: 4999,
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [
        { name: "Red", value: "#dc2626" },
        { name: "Pink", value: "#ec4899" },
        { name: "Blue", value: "#2563eb" }
      ],
      fabric: "Georgette with Silk Embroidery",
      occasion: "Wedding, Festive",
      care: "Dry Clean Only",
      delivery: "3-4 days",
      inStock: true
    },
    {
      id: 2,
      images: ["/images/ethnic2-1.jpg", "/images/ethnic2-2.jpg", "/images/ethnic2-3.jpg", "/images/ethnic2-4.jpg"],
      title: "Designer Lehenga Choli",
      description: "Heavy work lehenga with zari and kundan work, perfect for bridal occasions",
      price: 8999,
      originalPrice: 12999,
      sizes: ["M", "L", "XL", "XXL"],
      colors: [
        { name: "Maroon", value: "#991b1b" },
        { name: "Gold", value: "#d97706" },
        { name: "Green", value: "#065f46" }
      ],
      fabric: "Velvet with Kundan Work",
      occasion: "Bridal, Wedding",
      care: "Dry Clean Only",
      delivery: "5-7 days",
      inStock: true
    },
    {
      id: 3,
      images: ["/images/ethnic3-1.jpg", "/images/ethnic3-2.jpg", "/images/ethnic3-3.jpg", "/images/ethnic3-4.jpg"],
      title: "Printed Gown with Dupatta",
      description: "Contemporary gown with traditional prints and flowing silhouette",
      price: 2799,
      originalPrice: 3999,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Black", value: "#000000" },
        { name: "Navy", value: "#1e3a8a" },
        { name: "Purple", value: "#7c3aed" }
      ],
      fabric: "Chiffon with Digital Print",
      occasion: "Party, Festive",
      care: "Machine Wash Cold",
      delivery: "2-3 days",
      inStock: true
    },
    {
      id: 4,
      images: ["/images/ethnic4-1.jpg", "/images/ethnic4-2.jpg", "/images/ethnic4-3.jpg", "/images/ethnic4-4.jpg"],
      title: "Silk Saree with Blouse",
      description: "Pure silk saree with golden zari border and matching blouse",
      price: 4599,
      originalPrice: 6599,
      sizes: ["Free Size"],
      colors: [
        { name: "Peach", value: "#fb923c" },
        { name: "Cream", value: "#fef3c7" },
        { name: "Yellow", value: "#facc15" }
      ],
      fabric: "Pure Banarasi Silk",
      occasion: "Festive, Wedding",
      care: "Dry Clean Only",
      delivery: "4-5 days",
      inStock: true
    },
    {
      id: 5,
      images: ["/images/ethnic5-1.jpg", "/images/ethnic5-2.jpg", "/images/ethnic5-3.jpg", "/images/ethnic5-4.jpg"],
      title: "Sharara Set with Dupatta",
      description: "Traditional sharara set with detailed embroidery and flowy dupatta",
      price: 3899,
      originalPrice: 5499,
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [
        { name: "White", value: "#ffffff" },
        { name: "Silver", value: "#9ca3af" },
        { name: "Rose", value: "#f472b6" }
      ],
      fabric: "Net with Sequins Work",
      occasion: "Festive, Party",
      care: "Dry Clean Only",
      delivery: "3-4 days",
      inStock: true
    },
    {
      id: 6,
      images: ["/images/ethnic6-1.jpg", "/images/ethnic6-2.jpg", "/images/ethnic6-3.jpg", "/images/ethnic6-4.jpg"],
      title: "Kalamkari Kurti Set",
      description: "Hand-painted kalamkari kurti with palazzo and dupatta",
      price: 2299,
      originalPrice: 3299,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Mustard", value: "#d97706" },
        { name: "Terracotta", value: "#92400e" },
        { name: "Olive", value: "#3f6212" }
      ],
      fabric: "Cotton with Kalamkari Print",
      occasion: "Casual, Festive",
      care: "Hand Wash",
      delivery: "2-3 days",
      inStock: true
    },
    {
      id: 7,
      images: ["/images/ethnic7-1.jpg", "/images/ethnic7-2.jpg", "/images/ethnic7-3.jpg", "/images/ethnic7-4.jpg"],
      title: "Bridal Lehenga with Heavy Work",
      description: "Exclusive bridal lehenga with heavy embroidery and stone work",
      price: 15999,
      originalPrice: 22999,
      sizes: ["M", "L", "XL", "XXL"],
      colors: [
        { name: "Red", value: "#dc2626" },
        { name: "Wine", value: "#831843" },
        { name: "Royal Blue", value: "#1e40af" }
      ],
      fabric: "Velvet with Zardozi Work",
      occasion: "Bridal, Wedding",
      care: "Dry Clean Only",
      delivery: "7-10 days",
      inStock: true
    },
    {
      id: 8,
      images: ["/images/ethnic8-1.jpg", "/images/ethnic8-2.jpg", "/images/ethnic8-3.jpg", "/images/ethnic8-4.jpg"],
      title: "Cotton Anarkali Suit",
      description: "Comfortable cotton anarkali with minimal embroidery for daily wear",
      price: 1799,
      originalPrice: 2599,
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
      id: 9,
      images: ["/images/ethnic9-1.jpg", "/images/ethnic9-2.jpg", "/images/ethnic9-3.jpg", "/images/ethnic9-4.jpg"],
      title: "Designer Gown with Trail",
      description: "Floor-length gown with trail and detailed back design",
      price: 5499,
      originalPrice: 7899,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Black", value: "#000000" },
        { name: "Emerald", value: "#059669" },
        { name: "Burgundy", value: "#9d174d" }
      ],
      fabric: "Satin with Lace Work",
      occasion: "Party, Reception",
      care: "Dry Clean Only",
      delivery: "4-5 days",
      inStock: true
    },
    {
      id: 10,
      images: ["/images/ethnic10-1.jpg", "/images/ethnic10-2.jpg", "/images/ethnic10-3.jpg", "/images/ethnic10-4.jpg"],
      title: "Traditional Saree with Blouse",
      description: "Traditional silk saree with temple border and matching blouse",
      price: 3299,
      originalPrice: 4699,
      sizes: ["Free Size"],
      colors: [
        { name: "Orange", value: "#ea580c" },
        { name: "Pink", value: "#db2777" },
        { name: "Green", value: "#16a34a" }
      ],
      fabric: "Kanjivaram Silk",
      occasion: "Festive, Traditional",
      care: "Dry Clean Only",
      delivery: "5-6 days",
      inStock: true
    },
    // Add 10 more products following the same structure...
    {
      id: 11,
      images: ["/images/ethnic11-1.jpg", "/images/ethnic11-2.jpg", "/images/ethnic11-3.jpg", "/images/ethnic11-4.jpg"],
      title: "Embroidered Palazzo Suit",
      description: "Contemporary palazzo suit with detailed embroidery and kurta",
      price: 2699,
      originalPrice: 3899,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Navy", value: "#1e3a8a" },
        { name: "Grey", value: "#6b7280" },
        { name: "Purple", value: "#7c3aed" }
      ],
      fabric: "Crepe with Embroidery",
      occasion: "Party, Festive",
      care: "Dry Clean Only",
      delivery: "3-4 days",
      inStock: true
    },
    {
      id: 12,
      images: ["/images/ethnic12-1.jpg", "/images/ethnic12-2.jpg", "/images/ethnic12-3.jpg", "/images/ethnic12-4.jpg"],
      title: "Designer Lehenga with Jacket",
      description: "Modern lehenga with designer jacket and dupatta",
      price: 6999,
      originalPrice: 9999,
      sizes: ["M", "L", "XL", "XXL"],
      colors: [
        { name: "Pastel Pink", value: "#fbcfe8" },
        { name: "Ivory", value: "#fefce8" },
        { name: "Mint", value: "#a7f3d0" }
      ],
      fabric: "Net with Stone Work",
      occasion: "Reception, Party",
      care: "Dry Clean Only",
      delivery: "5-6 days",
      inStock: true
    }
  ];

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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link href="/traditional" className="text-gray-600 hover:text-gray-900">
              ← Back to Traditional
            </Link>
            <h1 className="text-2xl font-light">Ethnic Dresses</h1>
            <div className="w-8"></div> {/* Spacer for balance */}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-400 transition-colors">
              {/* Product Image */}
              <div className="relative h-80 overflow-hidden">
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  className="object-cover hover:scale-105 transition duration-300"
                  onClick={() => setSelectedProduct(product)}
                />
                {!product.inStock && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
                    Out of Stock
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  {product.images.length} images
                </div>
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

                <div className="flex gap-2 mb-3">
                  {product.colors.slice(0, 3).map((color, index) => (
                    <div
                      key={index}
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setSelectedProduct(product)}
                  className="w-full bg-gray-900 text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-light">{selectedProduct.title}</h2>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Images */}
                <div>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {selectedProduct.images.map((image, index) => (
                      <div
                        key={index}
                        className="relative h-40 cursor-pointer"
                        onClick={() => handleImageClick(image)}
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
                  <p className="text-sm text-gray-600">Click on images to zoom</p>
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

                  {/* Order Button */}
                  <button
                    onClick={() => handleOrder(selectedProduct)}
                    disabled={!selectedProduct.inStock}
                    className={`w-full py-3 rounded-lg font-medium ${
                      selectedProduct.inStock
                        ? "bg-gray-900 text-white hover:bg-gray-800"
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