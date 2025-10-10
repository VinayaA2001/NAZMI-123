// app/traditional/festive-edits/page.tsx
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

export default function FestiveEditsPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [zoomImage, setZoomImage] = useState("");

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
    },
    {
      id: 11,
      images: ["/images/festive11-1.jpg", "/images/festive11-2.jpg", "/images/festive11-3.jpg", "/images/festive11-4.jpg"],
      title: "Heavy Bridal Lehenga",
      description: "Exclusive bridal lehenga with heavy zardozi work and stone embellishments",
      price: 12999,
      originalPrice: 17999,
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
      id: 12,
      images: ["/images/festive12-1.jpg", "/images/festive12-2.jpg", "/images/festive12-3.jpg", "/images/festive12-4.jpg"],
      title: "Festive Anarkali with Jacket",
      description: "Anarkali suit with designer jacket and detailed embroidery",
      price: 3599,
      originalPrice: 4899,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Navy", value: "#1e3a8a" },
        { name: "Silver", value: "#6b7280" },
        { name: "Purple", value: "#7c3aed" }
      ],
      fabric: "Georgette with Stone Work",
      occasion: "Festive, Wedding",
      care: "Dry Clean Only",
      delivery: "4-5 days",
      inStock: true
    },
    {
      id: 13,
      images: ["/images/festive13-1.jpg", "/images/festive13-2.jpg", "/images/festive13-3.jpg", "/images/festive13-4.jpg"],
      title: "Designer Saree with Blouse",
      description: "Contemporary saree with modern blouse design and embroidery",
      price: 3199,
      originalPrice: 4399,
      sizes: ["Free Size"],
      colors: [
        { name: "Pastel Pink", value: "#fbcfe8" },
        { name: "Ivory", value: "#fefce8" },
        { name: "Mint", value: "#a7f3d0" }
      ],
      fabric: "Chiffon with Embroidery",
      occasion: "Party, Festive",
      care: "Dry Clean Only",
      delivery: "3-4 days",
      inStock: true
    },
    {
      id: 14,
      images: ["/images/festive14-1.jpg", "/images/festive14-2.jpg", "/images/festive14-3.jpg", "/images/festive14-4.jpg"],
      title: "Embroidered Gown with Trail",
      description: "Floor-length gown with detailed trail and back embroidery",
      price: 4899,
      originalPrice: 6599,
      sizes: ["S", "M", "L"],
      colors: [
        { name: "Black", value: "#000000" },
        { name: "Emerald", value: "#059669" },
        { name: "Burgundy", value: "#9d174d" }
      ],
      fabric: "Satin with Lace Work",
      occasion: "Reception, Party",
      care: "Dry Clean Only",
      delivery: "5-6 days",
      inStock: true
    },
    {
      id: 15,
      images: ["/images/festive15-1.jpg", "/images/festive15-2.jpg", "/images/festive15-3.jpg", "/images/festive15-4.jpg"],
      title: "Traditional Sharara Set",
      description: "Classic sharara set with intricate embroidery and flowing dupatta",
      price: 2699,
      originalPrice: 3699,
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [
        { name: "White", value: "#ffffff" },
        { name: "Silver", value: "#9ca3af" },
        { name: "Rose", value: "#f472b6" }
      ],
      fabric: "Net with Sequins",
      occasion: "Festive, Party",
      care: "Dry Clean Only",
      delivery: "3-4 days",
      inStock: true
    },
    {
      id: 16,
      images: ["/images/festive16-1.jpg", "/images/festive16-2.jpg", "/images/festive16-3.jpg", "/images/festive16-4.jpg"],
      title: "Designer Lehenga with Cape",
      description: "Modern lehenga with designer cape and heavy embroidery",
      price: 7899,
      originalPrice: 10999,
      sizes: ["M", "L", "XL", "XXL"],
      colors: [
        { name: "Royal Blue", value: "#1e40af" },
        { name: "Gold", value: "#d97706" },
        { name: "Wine", value: "#831843" }
      ],
      fabric: "Velvet with Kundan",
      occasion: "Bridal, Reception",
      care: "Dry Clean Only",
      delivery: "6-8 days",
      inStock: true
    },
    {
      id: 17,
      images: ["/images/festive17-1.jpg", "/images/festive17-2.jpg", "/images/festive17-3.jpg", "/images/festive17-4.jpg"],
      title: "Festive Kurti with Palazzo",
      description: "Embroidered kurti with matching palazzo and dupatta",
      price: 1999,
      originalPrice: 2799,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Sky Blue", value: "#0ea5e9" },
        { name: "Lavender", value: "#a78bfa" },
        { name: "Mint", value: "#34d399" }
      ],
      fabric: "Cotton with Embroidery",
      occasion: "Festive, Casual",
      care: "Machine Wash",
      delivery: "2-3 days",
      inStock: true
    },
    {
      id: 18,
      images: ["/images/festive18-1.jpg", "/images/festive18-2.jpg", "/images/festive18-3.jpg", "/images/festive18-4.jpg"],
      title: "Designer Gown with Embroidery",
      description: "Western gown with traditional Indian embroidery details",
      price: 3699,
      originalPrice: 4999,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Navy", value: "#1e3a8a" },
        { name: "Burgundy", value: "#9d174d" },
        { name: "Forest Green", value: "#166534" }
      ],
      fabric: "Georgette with Embroidery",
      occasion: "Party, Reception",
      care: "Dry Clean Only",
      delivery: "4-5 days",
      inStock: true
    },
    {
      id: 19,
      images: ["/images/festive19-1.jpg", "/images/festive19-2.jpg", "/images/festive19-3.jpg", "/images/festive19-4.jpg"],
      title: "Traditional Saree with Blouse",
      description: "Pure silk saree with traditional border and designer blouse",
      price: 4199,
      originalPrice: 5699,
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
    {
      id: 20,
      images: ["/images/festive20-1.jpg", "/images/festive20-2.jpg", "/images/festive20-3.jpg", "/images/festive20-4.jpg"],
      title: "Embroidered Anarkali Set",
      description: "Beautiful anarkali set with detailed embroidery and flowy silhouette",
      price: 2999,
      originalPrice: 4099,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Red", value: "#dc2626" },
        { name: "Purple", value: "#7c3aed" },
        { name: "Black", value: "#000000" }
      ],
      fabric: "Georgette with Stone Work",
      occasion: "Festive, Wedding",
      care: "Dry Clean Only",
      delivery: "3-4 days",
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
            <h1 className="text-2xl font-light">Festive Collection</h1>
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