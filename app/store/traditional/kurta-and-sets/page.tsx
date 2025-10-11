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
}

export default function KurtaAndSetsPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [zoomImage, setZoomImage] = useState("");

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
            <h1 className="text-2xl font-light">Kurta & Sets</h1>
            <div className="w-8"></div>
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
                  className="object-cover hover:scale-105 transition duration-300 cursor-pointer"
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