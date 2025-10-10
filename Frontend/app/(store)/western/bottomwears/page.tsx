// app/western/bottomwears/page.tsx
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

export default function BottomwearsPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [zoomImage, setZoomImage] = useState("");

  const products: Product[] = [
    {
      id: 1,
      images: ["/images/bottom1-1.jpg", "/images/bottom1-2.jpg", "/images/bottom1-3.jpg", "/images/bottom1-4.jpg"],
      title: "Classic Blue Jeans",
      description: "Comfortable classic blue jeans with perfect fit for everyday wear",
      price: 1499,
      originalPrice: 1999,
      sizes: ["28", "30", "32", "34", "36", "38"],
      colors: [
        { name: "Light Blue", value: "#93c5fd" },
        { name: "Medium Blue", value: "#60a5fa" },
        { name: "Dark Blue", value: "#1d4ed8" }
      ],
      fabric: "100% Cotton Denim",
      occasion: "Casual, Everyday",
      care: "Machine Wash",
      delivery: "2-3 days",
      inStock: true
    },
    {
      id: 2,
      images: ["/images/bottom2-1.jpg", "/images/bottom2-2.jpg", "/images/bottom2-3.jpg", "/images/bottom2-4.jpg"],
      title: "Palazzo Pants",
      description: "Flowy palazzo pants with comfortable waistband and elegant drape",
      price: 1299,
      originalPrice: 1699,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Black", value: "#000000" },
        { name: "Navy", value: "#1e3a8a" },
        { name: "Burgundy", value: "#9d174d" }
      ],
      fabric: "Rayon Blend",
      occasion: "Casual, Party",
      care: "Hand Wash",
      delivery: "3-4 days",
      inStock: true
    },
    {
      id: 3,
      images: ["/images/bottom3-1.jpg", "/images/bottom3-2.jpg", "/images/bottom3-3.jpg", "/images/bottom3-4.jpg"],
      title: "A-Line Skirt",
      description: "Flattering A-line skirt perfect for office and casual outings",
      price: 1099,
      originalPrice: 1499,
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: [
        { name: "Black", value: "#000000" },
        { name: "Grey", value: "#6b7280" },
        { name: "Navy", value: "#1e3a8a" }
      ],
      fabric: "Polyester Blend",
      occasion: "Office, Casual",
      care: "Machine Wash",
      delivery: "2-3 days",
      inStock: true
    },
    {
      id: 4,
      images: ["/images/bottom4-1.jpg", "/images/bottom4-2.jpg", "/images/bottom4-3.jpg", "/images/bottom4-4.jpg"],
      title: "Wide-Leg Trousers",
      description: "Comfortable wide-leg trousers with professional finish",
      price: 1599,
      originalPrice: 2199,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Black", value: "#000000" },
        { name: "Beige", value: "#d6d3d1" },
        { name: "Olive", value: "#3f6212" }
      ],
      fabric: "Cotton Blend",
      occasion: "Office, Formal",
      care: "Machine Wash",
      delivery: "3-4 days",
      inStock: true
    },
    {
      id: 5,
      images: ["/images/bottom5-1.jpg", "/images/bottom5-2.jpg", "/images/bottom5-3.jpg", "/images/bottom5-4.jpg"],
      title: "Denim Shorts",
      description: "Comfortable denim shorts perfect for summer and casual wear",
      price: 899,
      originalPrice: 1299,
      sizes: ["26", "28", "30", "32", "34"],
      colors: [
        { name: "Light Blue", value: "#93c5fd" },
        { name: "Medium Blue", value: "#60a5fa" },
        { name: "Black", value: "#000000" }
      ],
      fabric: "Cotton Denim",
      occasion: "Casual, Summer",
      care: "Machine Wash",
      delivery: "2-3 days",
      inStock: true
    },
    {
      id: 6,
      images: ["/images/bottom6-1.jpg", "/images/bottom6-2.jpg", "/images/bottom6-3.jpg", "/images/bottom6-4.jpg"],
      title: "Maxi Skirt",
      description: "Elegant maxi skirt with flowy design for comfortable all-day wear",
      price: 1399,
      originalPrice: 1899,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Black", value: "#000000" },
        { name: "Navy", value: "#1e3a8a" },
        { name: "Maroon", value: "#991b1b" }
      ],
      fabric: "Chiffon Blend",
      occasion: "Casual, Party",
      care: "Hand Wash",
      delivery: "3-4 days",
      inStock: true
    },
    {
      id: 7,
      images: ["/images/bottom7-1.jpg", "/images/bottom7-2.jpg", "/images/bottom7-3.jpg", "/images/bottom7-4.jpg"],
      title: "Culottes",
      description: "Modern culottes with wide-leg design for stylish comfort",
      price: 1199,
      originalPrice: 1599,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Black", value: "#000000" },
        { name: "White", value: "#ffffff" },
        { name: "Grey", value: "#6b7280" }
      ],
      fabric: "Linen Blend",
      occasion: "Casual, Office",
      care: "Machine Wash",
      delivery: "3-4 days",
      inStock: true
    },
    {
      id: 8,
      images: ["/images/bottom8-1.jpg", "/images/bottom8-2.jpg", "/images/bottom8-3.jpg", "/images/bottom8-4.jpg"],
      title: "Jogger Pants",
      description: "Comfortable jogger pants with elastic waistband for casual wear",
      price: 999,
      originalPrice: 1399,
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [
        { name: "Grey", value: "#6b7280" },
        { name: "Black", value: "#000000" },
        { name: "Navy", value: "#1e3a8a" }
      ],
      fabric: "Cotton Jersey",
      occasion: "Casual, Sports",
      care: "Machine Wash",
      delivery: "2-3 days",
      inStock: true
    },
    {
      id: 9,
      images: ["/images/bottom9-1.jpg", "/images/bottom9-2.jpg", "/images/bottom9-3.jpg", "/images/bottom9-4.jpg"],
      title: "Pencil Skirt",
      description: "Professional pencil skirt with perfect length for office wear",
      price: 1299,
      originalPrice: 1799,
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: [
        { name: "Black", value: "#000000" },
        { name: "Navy", value: "#1e3a8a" },
        { name: "Brown", value: "#92400e" }
      ],
      fabric: "Polyester Blend",
      occasion: "Office, Formal",
      care: "Machine Wash",
      delivery: "2-3 days",
      inStock: true
    },
    {
      id: 10,
      images: ["/images/bottom10-1.jpg", "/images/bottom10-2.jpg", "/images/bottom10-3.jpg", "/images/bottom10-4.jpg"],
      title: "Wide-Leg Jeans",
      description: "Trendy wide-leg jeans with comfortable fit and modern style",
      price: 1699,
      originalPrice: 2299,
      sizes: ["28", "30", "32", "34", "36"],
      colors: [
        { name: "Light Blue", value: "#93c5fd" },
        { name: "Medium Blue", value: "#60a5fa" },
        { name: "Black", value: "#000000" }
      ],
      fabric: "Cotton Denim",
      occasion: "Casual, Fashion",
      care: "Machine Wash",
      delivery: "3-4 days",
      inStock: true
    },
    {
      id: 11,
      images: ["/images/bottom11-1.jpg", "/images/bottom11-2.jpg", "/images/bottom11-3.jpg", "/images/bottom11-4.jpg"],
      title: "Pleated Skirt",
      description: "Elegant pleated skirt with sophisticated design for formal occasions",
      price: 1499,
      originalPrice: 1999,
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: [
        { name: "Black", value: "#000000" },
        { name: "Grey", value: "#6b7280" },
        { name: "Burgundy", value: "#9d174d" }
      ],
      fabric: "Polyester Blend",
      occasion: "Office, Party",
      care: "Dry Clean Only",
      delivery: "3-4 days",
      inStock: true
    },
    {
      id: 12,
      images: ["/images/bottom12-1.jpg", "/images/bottom12-2.jpg", "/images/bottom12-3.jpg", "/images/bottom12-4.jpg"],
      title: "Cargo Pants",
      description: "Utility cargo pants with multiple pockets for practical style",
      price: 1399,
      originalPrice: 1899,
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [
        { name: "Khaki", value: "#d97706" },
        { name: "Black", value: "#000000" },
        { name: "Olive", value: "#3f6212" }
      ],
      fabric: "Cotton Twill",
      occasion: "Casual, Outdoor",
      care: "Machine Wash",
      delivery: "3-4 days",
      inStock: true
    },
    {
      id: 13,
      images: ["/images/bottom13-1.jpg", "/images/bottom13-2.jpg", "/images/bottom13-3.jpg", "/images/bottom13-4.jpg"],
      title: "Midi Skirt",
      description: "Versatile midi skirt perfect for both office and casual outings",
      price: 1199,
      originalPrice: 1599,
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: [
        { name: "Black", value: "#000000" },
        { name: "Navy", value: "#1e3a8a" },
        { name: "Forest Green", value: "#166534" }
      ],
      fabric: "Cotton Blend",
      occasion: "Office, Casual",
      care: "Machine Wash",
      delivery: "2-3 days",
      inStock: true
    },
    {
      id: 14,
      images: ["/images/bottom14-1.jpg", "/images/bottom14-2.jpg", "/images/bottom14-3.jpg", "/images/bottom14-4.jpg"],
      title: "Tailored Trousers",
      description: "Perfectly tailored trousers with professional finish for office wear",
      price: 1799,
      originalPrice: 2399,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Black", value: "#000000" },
        { name: "Grey", value: "#6b7280" },
        { name: "Navy", value: "#1e3a8a" }
      ],
      fabric: "Wool Blend",
      occasion: "Office, Formal",
      care: "Dry Clean Only",
      delivery: "4-5 days",
      inStock: true
    },
    {
      id: 15,
      images: ["/images/bottom15-1.jpg", "/images/bottom15-2.jpg", "/images/bottom15-3.jpg", "/images/bottom15-4.jpg"],
      title: "Denim Skirt",
      description: "Classic denim skirt with comfortable fit for casual styling",
      price: 1099,
      originalPrice: 1499,
      sizes: ["26", "28", "30", "32", "34"],
      colors: [
        { name: "Light Blue", value: "#93c5fd" },
        { name: "Medium Blue", value: "#60a5fa" },
        { name: "Dark Blue", value: "#1d4ed8" }
      ],
      fabric: "Cotton Denim",
      occasion: "Casual, Everyday",
      care: "Machine Wash",
      delivery: "2-3 days",
      inStock: true
    },
    {
      id: 16,
      images: ["/images/bottom16-1.jpg", "/images/bottom16-2.jpg", "/images/bottom16-3.jpg", "/images/bottom16-4.jpg"],
      title: "Palazzo with Prints",
      description: "Beautiful printed palazzo pants with ethnic designs",
      price: 1399,
      originalPrice: 1899,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Multi Color", value: "#7c3aed" },
        { name: "Blue Print", value: "#1e40af" },
        { name: "Red Print", value: "#dc2626" }
      ],
      fabric: "Rayon",
      occasion: "Casual, Festive",
      care: "Hand Wash",
      delivery: "3-4 days",
      inStock: true
    },
    {
      id: 17,
      images: ["/images/bottom17-1.jpg", "/images/bottom17-2.jpg", "/images/bottom17-3.jpg", "/images/bottom17-4.jpg"],
      title: "High-Waisted Jeans",
      description: "Flattering high-waisted jeans with comfortable stretch",
      price: 1599,
      originalPrice: 2199,
      sizes: ["28", "30", "32", "34", "36"],
      colors: [
        { name: "Light Blue", value: "#93c5fd" },
        { name: "Medium Blue", value: "#60a5fa" },
        { name: "Black", value: "#000000" }
      ],
      fabric: "Cotton Denim with Stretch",
      occasion: "Casual, Fashion",
      care: "Machine Wash",
      delivery: "3-4 days",
      inStock: true
    },
    {
      id: 18,
      images: ["/images/bottom18-1.jpg", "/images/bottom18-2.jpg", "/images/bottom18-3.jpg", "/images/bottom18-4.jpg"],
      title: "Wrap Skirt",
      description: "Elegant wrap skirt with adjustable fit for versatile styling",
      price: 1299,
      originalPrice: 1799,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Black", value: "#000000" },
        { name: "Navy", value: "#1e3a8a" },
        { name: "Emerald", value: "#059669" }
      ],
      fabric: "Crepe",
      occasion: "Office, Party",
      care: "Dry Clean Only",
      delivery: "3-4 days",
      inStock: true
    },
    {
      id: 19,
      images: ["/images/bottom19-1.jpg", "/images/bottom19-2.jpg", "/images/bottom19-3.jpg", "/images/bottom19-4.jpg"],
      title: "Linen Trousers",
      description: "Breathable linen trousers perfect for summer and warm weather",
      price: 1499,
      originalPrice: 1999,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Beige", value: "#d6d3d1" },
        { name: "White", value: "#ffffff" },
        { name: "Light Blue", value: "#bfdbfe" }
      ],
      fabric: "100% Linen",
      occasion: "Casual, Summer",
      care: "Machine Wash",
      delivery: "3-4 days",
      inStock: true
    },
    {
      id: 20,
      images: ["/images/bottom20-1.jpg", "/images/bottom20-2.jpg", "/images/bottom20-3.jpg", "/images/bottom20-4.jpg"],
      title: "Leather-Look Skirt",
      description: "Fashion-forward leather-look skirt for edgy styling",
      price: 1899,
      originalPrice: 2499,
      sizes: ["XS", "S", "M", "L"],
      colors: [
        { name: "Black", value: "#000000" },
        { name: "Brown", value: "#92400e" },
        { name: "Burgundy", value: "#9d174d" }
      ],
      fabric: "Faux Leather",
      occasion: "Party, Fashion",
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
            <Link href="/western" className="text-gray-600 hover:text-gray-900">
              ← Back to Western
            </Link>
            <h1 className="text-2xl font-light">Bottomwears</h1>
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