// app/(store)/western/Officewear/page.tsx
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

export default function OfficewearPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [zoomImage, setZoomImage] = useState("");

  const products: Product[] = [
    {
      id: 1,
      images: ["/images/office1-1.jpg", "/images/office1-2.jpg", "/images/office1-3.jpg", "/images/office1-4.jpg"],
      title: "Professional Blazer Set",
      description: "Elegant blazer set with perfect tailoring for corporate meetings and formal occasions",
      price: 2499,
      originalPrice: 3299,
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: [
        { name: "Navy", value: "#1e3a8a" },
        { name: "Black", value: "#000000" },
        { name: "Grey", value: "#6b7280" }
      ],
      fabric: "Wool Blend",
      occasion: "Office, Formal",
      care: "Dry Clean Only",
      delivery: "3-4 days",
      inStock: true
    },
    {
      id: 2,
      images: ["/images/office2-1.jpg", "/images/office2-2.jpg", "/images/office2-3.jpg", "/images/office2-4.jpg"],
      title: "Office Dress",
      description: "Sophisticated office dress with modest length and professional design",
      price: 1799,
      originalPrice: 2299,
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: [
        { name: "Black", value: "#000000" },
        { name: "Navy", value: "#1e3a8a" },
        { name: "Burgundy", value: "#9d174d" }
      ],
      fabric: "Polyester Blend",
      occasion: "Office, Business",
      care: "Machine Wash",
      delivery: "2-3 days",
      inStock: true
    },
    {
      id: 3,
      images: ["/images/office3-1.jpg", "/images/office3-2.jpg", "/images/office3-3.jpg", "/images/office3-4.jpg"],
      title: "Business Trousers",
      description: "Comfortable and stylish business trousers with perfect fit for all-day wear",
      price: 1299,
      originalPrice: 1699,
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      colors: [
        { name: "Black", value: "#000000" },
        { name: "Grey", value: "#6b7280" },
        { name: "Navy", value: "#1e3a8a" }
      ],
      fabric: "Cotton Blend",
      occasion: "Office, Formal",
      care: "Machine Wash",
      delivery: "2-3 days",
      inStock: true
    },
    {
      id: 4,
      images: ["/images/office4-1.jpg", "/images/office4-2.jpg", "/images/office4-3.jpg", "/images/office4-4.jpg"],
      title: "Formal Shirt & Skirt Set",
      description: "Coordinated shirt and skirt set for professional office attire",
      price: 2199,
      originalPrice: 2899,
      sizes: ["XS", "S", "M", "L"],
      colors: [
        { name: "White", value: "#ffffff" },
        { name: "Light Blue", value: "#bfdbfe" },
        { name: "Pale Pink", value: "#fbcfe8" }
      ],
      fabric: "Cotton Poplin",
      occasion: "Office, Corporate",
      care: "Machine Wash",
      delivery: "3-4 days",
      inStock: true
    },
    {
      id: 5,
      images: ["/images/office5-1.jpg", "/images/office5-2.jpg", "/images/office5-3.jpg", "/images/office5-4.jpg"],
      title: "Corporate Blouse",
      description: "Elegant corporate blouse with delicate details for professional settings",
      price: 1599,
      originalPrice: 2099,
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: [
        { name: "White", value: "#ffffff" },
        { name: "Black", value: "#000000" },
        { name: "Cream", value: "#fef3c7" }
      ],
      fabric: "Silk Cotton",
      occasion: "Office, Business",
      care: "Hand Wash",
      delivery: "3-4 days",
      inStock: true
    },
    {
      id: 6,
      images: ["/images/office6-1.jpg", "/images/office6-2.jpg", "/images/office6-3.jpg", "/images/office6-4.jpg"],
      title: "Executive Suit",
      description: "Complete executive suit for important meetings and corporate events",
      price: 3299,
      originalPrice: 4299,
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: [
        { name: "Black", value: "#000000" },
        { name: "Navy", value: "#1e3a8a" },
        { name: "Charcoal", value: "#374151" }
      ],
      fabric: "Wool Blend",
      occasion: "Corporate, Formal",
      care: "Dry Clean Only",
      delivery: "4-5 days",
      inStock: true
    },
    {
      id: 7,
      images: ["/images/office7-1.jpg", "/images/office7-2.jpg", "/images/office7-3.jpg", "/images/office7-4.jpg"],
      title: "Office Jumpsuit",
      description: "Stylish and comfortable jumpsuit perfect for modern office environments",
      price: 1899,
      originalPrice: 2499,
      sizes: ["XS", "S", "M", "L"],
      colors: [
        { name: "Navy", value: "#1e3a8a" },
        { name: "Black", value: "#000000" },
        { name: "Burgundy", value: "#9d174d" }
      ],
      fabric: "Crepe",
      occasion: "Office, Business Casual",
      care: "Dry Clean Only",
      delivery: "3-4 days",
      inStock: true
    },
    {
      id: 8,
      images: ["/images/office8-1.jpg", "/images/office8-2.jpg", "/images/office8-3.jpg", "/images/office8-4.jpg"],
      title: "Formal Pencil Skirt",
      description: "Classic pencil skirt for professional office wardrobe",
      price: 1199,
      originalPrice: 1599,
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: [
        { name: "Black", value: "#000000" },
        { name: "Grey", value: "#6b7280" },
        { name: "Navy", value: "#1e3a8a" }
      ],
      fabric: "Polyester Blend",
      occasion: "Office, Formal",
      care: "Machine Wash",
      delivery: "2-3 days",
      inStock: true
    },
    {
      id: 9,
      images: ["/images/office9-1.jpg", "/images/office9-2.jpg", "/images/office9-3.jpg", "/images/office9-4.jpg"],
      title: "Business Casual Top",
      description: "Versatile business casual top that pairs well with formal bottoms",
      price: 999,
      originalPrice: 1399,
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: [
        { name: "White", value: "#ffffff" },
        { name: "Light Blue", value: "#bfdbfe" },
        { name: "Lavender", value: "#a78bfa" }
      ],
      fabric: "Cotton Blend",
      occasion: "Office, Business Casual",
      care: "Machine Wash",
      delivery: "2-3 days",
      inStock: true
    },
    {
      id: 10,
      images: ["/images/office10-1.jpg", "/images/office10-2.jpg", "/images/office10-3.jpg", "/images/office10-4.jpg"],
      title: "Professional Blazer Dress",
      description: "Sophisticated blazer dress that makes a powerful statement",
      price: 2799,
      originalPrice: 3599,
      sizes: ["XS", "S", "M", "L"],
      colors: [
        { name: "Black", value: "#000000" },
        { name: "Navy", value: "#1e3a8a" },
        { name: "Grey", value: "#6b7280" }
      ],
      fabric: "Wool Blend",
      occasion: "Corporate, Formal",
      care: "Dry Clean Only",
      delivery: "4-5 days",
      inStock: true
    },
    {
      id: 11,
      images: ["/images/office11-1.jpg", "/images/office11-2.jpg", "/images/office11-3.jpg", "/images/office11-4.jpg"],
      title: "Office Wear Saree",
      description: "Contemporary saree designed for modern professional settings",
      price: 1999,
      originalPrice: 2699,
      sizes: ["Free Size"],
      colors: [
        { name: "Pastel Pink", value: "#fbcfe8" },
        { name: "Mint Green", value: "#a7f3d0" },
        { name: "Light Grey", value: "#d1d5db" }
      ],
      fabric: "Georgette",
      occasion: "Office, Corporate",
      care: "Dry Clean Only",
      delivery: "3-4 days",
      inStock: true
    },
    {
      id: 12,
      images: ["/images/office12-1.jpg", "/images/office12-2.jpg", "/images/office12-3.jpg", "/images/office12-4.jpg"],
      title: "Formal Culottes Set",
      description: "Modern culottes set for comfortable yet professional office wear",
      price: 1699,
      originalPrice: 2299,
      sizes: ["XS", "S", "M", "L"],
      colors: [
        { name: "Black", value: "#000000" },
        { name: "Navy", value: "#1e3a8a" },
        { name: "Olive", value: "#65a30d" }
      ],
      fabric: "Linen Blend",
      occasion: "Office, Business Casual",
      care: "Machine Wash",
      delivery: "3-4 days",
      inStock: true
    },
    {
      id: 13,
      images: ["/images/office13-1.jpg", "/images/office13-2.jpg", "/images/office13-3.jpg", "/images/office13-4.jpg"],
      title: "Corporate Jacket Set",
      description: "Elegant jacket set perfect for client meetings and presentations",
      price: 2399,
      originalPrice: 3199,
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: [
        { name: "Navy", value: "#1e3a8a" },
        { name: "Black", value: "#000000" },
        { name: "Brown", value: "#92400e" }
      ],
      fabric: "Wool Blend",
      occasion: "Corporate, Formal",
      care: "Dry Clean Only",
      delivery: "4-5 days",
      inStock: true
    },
    {
      id: 14,
      images: ["/images/office14-1.jpg", "/images/office14-2.jpg", "/images/office14-3.jpg", "/images/office14-4.jpg"],
      title: "Office Appropriate Kurti",
      description: "Professional kurti with modern cut for corporate environment",
      price: 1399,
      originalPrice: 1899,
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: [
        { name: "Blue", value: "#0ea5e9" },
        { name: "Green", value: "#16a34a" },
        { name: "Maroon", value: "#9d174d" }
      ],
      fabric: "Cotton Blend",
      occasion: "Office, Business Casual",
      care: "Machine Wash",
      delivery: "2-3 days",
      inStock: true
    },
    {
      id: 15,
      images: ["/images/office15-1.jpg", "/images/office15-2.jpg", "/images/office15-3.jpg", "/images/office15-4.jpg"],
      title: "Business Formal Dress",
      description: "Elegant dress suitable for important business occasions",
      price: 2099,
      originalPrice: 2799,
      sizes: ["XS", "S", "M", "L"],
      colors: [
        { name: "Black", value: "#000000" },
        { name: "Navy", value: "#1e3a8a" },
        { name: "Burgundy", value: "#9d174d" }
      ],
      fabric: "Crepe",
      occasion: "Corporate, Formal",
      care: "Dry Clean Only",
      delivery: "3-4 days",
      inStock: true
    },
    {
      id: 16,
      images: ["/images/office16-1.jpg", "/images/office16-2.jpg", "/images/office16-3.jpg", "/images/office16-4.jpg"],
      title: "Professional Trousers & Top Set",
      description: "Complete professional set with trousers and matching top",
      price: 1899,
      originalPrice: 2499,
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: [
        { name: "Grey", value: "#6b7280" },
        { name: "Navy", value: "#1e3a8a" },
        { name: "Black", value: "#000000" }
      ],
      fabric: "Polyester Blend",
      occasion: "Office, Business",
      care: "Machine Wash",
      delivery: "3-4 days",
      inStock: true
    },
    {
      id: 17,
      images: ["/images/office17-1.jpg", "/images/office17-2.jpg", "/images/office17-3.jpg", "/images/office17-4.jpg"],
      title: "Formal Blouse with Trousers",
      description: "Sophisticated blouse and trousers combination for office wear",
      price: 1599,
      originalPrice: 2199,
      sizes: ["XS", "S", "M", "L"],
      colors: [
        { name: "White", value: "#ffffff" },
        { name: "Cream", value: "#fef3c7" },
        { name: "Light Pink", value: "#fbcfe8" }
      ],
      fabric: "Silk Blend",
      occasion: "Office, Formal",
      care: "Dry Clean Only",
      delivery: "3-4 days",
      inStock: true
    },
    {
      id: 18,
      images: ["/images/office18-1.jpg", "/images/office18-2.jpg", "/images/office18-3.jpg", "/images/office18-4.jpg"],
      title: "Corporate Dress Pants",
      description: "Comfortable and stylish dress pants for professional settings",
      price: 1299,
      originalPrice: 1799,
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      colors: [
        { name: "Black", value: "#000000" },
        { name: "Grey", value: "#6b7280" },
        { name: "Navy", value: "#1e3a8a" }
      ],
      fabric: "Cotton Blend",
      occasion: "Office, Business",
      care: "Machine Wash",
      delivery: "2-3 days",
      inStock: true
    },
    {
      id: 19,
      images: ["/images/office19-1.jpg", "/images/office19-2.jpg", "/images/office19-3.jpg", "/images/office19-4.jpg"],
      title: "Executive Blazer & Skirt",
      description: "Powerful executive combination for leadership roles",
      price: 2999,
      originalPrice: 3899,
      sizes: ["XS", "S", "M", "L"],
      colors: [
        { name: "Black", value: "#000000" },
        { name: "Navy", value: "#1e3a8a" },
        { name: "Charcoal", value: "#374151" }
      ],
      fabric: "Wool Blend",
      occasion: "Corporate, Executive",
      care: "Dry Clean Only",
      delivery: "4-5 days",
      inStock: true
    },
    {
      id: 20,
      images: ["/images/office20-1.jpg", "/images/office20-2.jpg", "/images/office20-3.jpg", "/images/office20-4.jpg"],
      title: "Business Casual Dress",
      description: "Comfortable yet professional dress for everyday office wear",
      price: 1499,
      originalPrice: 1999,
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: [
        { name: "Blue", value: "#0ea5e9" },
        { name: "Green", value: "#16a34a" },
        { name: "Purple", value: "#7c3aed" }
      ],
      fabric: "Cotton Blend",
      occasion: "Office, Business Casual",
      care: "Machine Wash",
      delivery: "2-3 days",
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
            <h1 className="text-2xl font-light">Officewear</h1>
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