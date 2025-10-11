// app/western/tops/page.tsx
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

export default function TopsPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [zoomImage, setZoomImage] = useState("");

  const products: Product[] = [
    {
      id: 1,
      images: ["/images/top1-1.jpg", "/images/top1-2.jpg", "/images/top1-3.jpg", "/images/top1-4.jpg"],
      title: "Classic Cotton T-Shirt",
      description: "Premium cotton t-shirt with perfect fit for everyday comfort",
      price: 599,
      originalPrice: 899,
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      colors: [
        { name: "White", value: "#ffffff" },
        { name: "Black", value: "#000000" },
        { name: "Navy", value: "#1e3a8a" }
      ],
      fabric: "100% Premium Cotton",
      occasion: "Casual, Everyday",
      care: "Machine Wash",
      delivery: "2-3 days",
      inStock: true
    },
    {
      id: 2,
      images: ["/images/top2-1.jpg", "/images/top2-2.jpg", "/images/top2-3.jpg", "/images/top2-4.jpg"],
      title: "Designer Crop Top",
      description: "Trendy crop top with unique design perfect for parties and outings",
      price: 899,
      originalPrice: 1299,
      sizes: ["XS", "S", "M", "L"],
      colors: [
        { name: "Pink", value: "#ec4899" },
        { name: "Yellow", value: "#facc15" },
        { name: "Green", value: "#16a34a" }
      ],
      fabric: "Cotton Blend",
      occasion: "Party, Casual",
      care: "Machine Wash",
      delivery: "2-3 days",
      inStock: true
    },
    {
      id: 3,
      images: ["/images/top3-1.jpg", "/images/top3-2.jpg", "/images/top3-3.jpg", "/images/top3-4.jpg"],
      title: "Formal Button-Down Shirt",
      description: "Crisp formal shirt with perfect tailoring for professional settings",
      price: 1299,
      originalPrice: 1799,
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      colors: [
        { name: "White", value: "#ffffff" },
        { name: "Light Blue", value: "#bfdbfe" },
        { name: "Pale Pink", value: "#fbcfe8" }
      ],
      fabric: "Cotton Poplin",
      occasion: "Office, Formal",
      care: "Machine Wash",
      delivery: "3-4 days",
      inStock: true
    },
    {
      id: 4,
      images: ["/images/top4-1.jpg", "/images/top4-2.jpg", "/images/top4-3.jpg", "/images/top4-4.jpg"],
      title: "Off-Shoulder Top",
      description: "Flirty off-shoulder top perfect for dates and special occasions",
      price: 799,
      originalPrice: 1199,
      sizes: ["XS", "S", "M", "L"],
      colors: [
        { name: "Red", value: "#dc2626" },
        { name: "Black", value: "#000000" },
        { name: "Royal Blue", value: "#1e40af" }
      ],
      fabric: "Rayon Blend",
      occasion: "Party, Date",
      care: "Hand Wash",
      delivery: "2-3 days",
      inStock: true
    },
    {
      id: 5,
      images: ["/images/top5-1.jpg", "/images/top5-2.jpg", "/images/top5-3.jpg", "/images/top5-4.jpg"],
      title: "Casual Polo T-Shirt",
      description: "Comfortable polo t-shirt for smart casual looks",
      price: 699,
      originalPrice: 999,
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: [
        { name: "Navy", value: "#1e3a8a" },
        { name: "Grey", value: "#6b7280" },
        { name: "Green", value: "#059669" }
      ],
      fabric: "Cotton Pique",
      occasion: "Casual, Sports",
      care: "Machine Wash",
      delivery: "2-3 days",
      inStock: true
    },
    {
      id: 6,
      images: ["/images/top6-1.jpg", "/images/top6-2.jpg", "/images/top6-3.jpg", "/images/top6-4.jpg"],
      title: "Embroidered Blouse",
      description: "Elegant blouse with delicate embroidery for traditional occasions",
      price: 1499,
      originalPrice: 1999,
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: [
        { name: "White", value: "#ffffff" },
        { name: "Peach", value: "#fb923c" },
        { name: "Mint", value: "#34d399" }
      ],
      fabric: "Silk Cotton",
      occasion: "Festive, Party",
      care: "Dry Clean Only",
      delivery: "3-4 days",
      inStock: true
    },
    {
      id: 7,
      images: ["/images/top7-1.jpg", "/images/top7-2.jpg", "/images/top7-3.jpg", "/images/top7-4.jpg"],
      title: "Graphic Print T-Shirt",
      description: "Trendy graphic t-shirt with unique prints and comfortable fit",
      price: 649,
      originalPrice: 899,
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: [
        { name: "Black", value: "#000000" },
        { name: "White", value: "#ffffff" },
        { name: "Grey", value: "#6b7280" }
      ],
      fabric: "100% Cotton",
      occasion: "Casual, Everyday",
      care: "Machine Wash",
      delivery: "2-3 days",
      inStock: true
    },
    {
      id: 8,
      images: ["/images/top8-1.jpg", "/images/top8-2.jpg", "/images/top8-3.jpg", "/images/top8-4.jpg"],
      title: "Ruffled Sleeve Top",
      description: "Feminine top with ruffled sleeves for a romantic look",
      price: 999,
      originalPrice: 1399,
      sizes: ["XS", "S", "M", "L"],
      colors: [
        { name: "Pink", value: "#f472b6" },
        { name: "Lavender", value: "#a78bfa" },
        { name: "Yellow", value: "#facc15" }
      ],
      fabric: "Chiffon Blend",
      occasion: "Party, Date",
      care: "Hand Wash",
      delivery: "3-4 days",
      inStock: true
    },
    {
      id: 9,
      images: ["/images/top9-1.jpg", "/images/top9-2.jpg", "/images/top9-3.jpg", "/images/top9-4.jpg"],
      title: "High-Neck Collar Top",
      description: "Stylish high-neck top with modern design for contemporary looks",
      price: 849,
      originalPrice: 1199,
      sizes: ["XS", "S", "M", "L"],
      colors: [
        { name: "Black", value: "#000000" },
        { name: "Burgundy", value: "#9d174d" },
        { name: "Emerald", value: "#059669" }
      ],
      fabric: "Cotton Blend",
      occasion: "Party, Casual",
      care: "Machine Wash",
      delivery: "2-3 days",
      inStock: true
    },
    {
      id: 10,
      images: ["/images/top10-1.jpg", "/images/top10-2.jpg", "/images/top10-3.jpg", "/images/top10-4.jpg"],
      title: "Casual Linen Shirt",
      description: "Breathable linen shirt perfect for summer and casual outings",
      price: 1199,
      originalPrice: 1599,
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: [
        { name: "Beige", value: "#d6d3d1" },
        { name: "White", value: "#ffffff" },
        { name: "Blue", value: "#0ea5e9" }
      ],
      fabric: "100% Linen",
      occasion: "Casual, Summer",
      care: "Machine Wash",
      delivery: "3-4 days",
      inStock: true
    },
    {
      id: 11,
      images: ["/images/top11-1.jpg", "/images/top11-2.jpg", "/images/top11-3.jpg", "/images/top11-4.jpg"],
      title: "Sequined Party Top",
      description: "Sparkling sequined top perfect for parties and celebrations",
      price: 1599,
      originalPrice: 2199,
      sizes: ["XS", "S", "M", "L"],
      colors: [
        { name: "Silver", value: "#9ca3af" },
        { name: "Gold", value: "#d97706" },
        { name: "Black", value: "#000000" }
      ],
      fabric: "Net with Sequins",
      occasion: "Party, Celebration",
      care: "Dry Clean Only",
      delivery: "4-5 days",
      inStock: true
    },
    {
      id: 12,
      images: ["/images/top12-1.jpg", "/images/top12-2.jpg", "/images/top12-3.jpg", "/images/top12-4.jpg"],
      title: "Tie-Front Crop Top",
      description: "Cute crop top with tie-front detail for stylish looks",
      price: 749,
      originalPrice: 1099,
      sizes: ["XS", "S", "M", "L"],
      colors: [
        { name: "Pink", value: "#ec4899" },
        { name: "Yellow", value: "#facc15" },
        { name: "Green", value: "#16a34a" }
      ],
      fabric: "Cotton Blend",
      occasion: "Casual, Party",
      care: "Machine Wash",
      delivery: "2-3 days",
      inStock: true
    },
    {
      id: 13,
      images: ["/images/top13-1.jpg", "/images/top13-2.jpg", "/images/top13-3.jpg", "/images/top13-4.jpg"],
      title: "Oversized Denim Shirt",
      description: "Comfortable oversized denim shirt for layered looks",
      price: 1399,
      originalPrice: 1899,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Light Blue", value: "#bfdbfe" },
        { name: "Dark Blue", value: "#1e3a8a" },
        { name: "Black", value: "#000000" }
      ],
      fabric: "100% Cotton Denim",
      occasion: "Casual, Streetwear",
      care: "Machine Wash",
      delivery: "3-4 days",
      inStock: true
    },
    {
      id: 14,
      images: ["/images/top14-1.jpg", "/images/top14-2.jpg", "/images/top14-3.jpg", "/images/top14-4.jpg"],
      title: "Bardot Neck Top",
      description: "Elegant bardot neck top for sophisticated evening looks",
      price: 1099,
      originalPrice: 1499,
      sizes: ["XS", "S", "M", "L"],
      colors: [
        { name: "Black", value: "#000000" },
        { name: "Red", value: "#dc2626" },
        { name: "Navy", value: "#1e3a8a" }
      ],
      fabric: "Crepe",
      occasion: "Party, Dinner",
      care: "Dry Clean Only",
      delivery: "3-4 days",
      inStock: true
    },
    {
      id: 15,
      images: ["/images/top15-1.jpg", "/images/top15-2.jpg", "/images/top15-3.jpg", "/images/top15-4.jpg"],
      title: "Casual Hoodie",
      description: "Comfortable hoodie for casual everyday wear and lounging",
      price: 899,
      originalPrice: 1299,
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      colors: [
        { name: "Grey", value: "#6b7280" },
        { name: "Black", value: "#000000" },
        { name: "Navy", value: "#1e3a8a" }
      ],
      fabric: "Cotton Fleece",
      occasion: "Casual, Sports",
      care: "Machine Wash",
      delivery: "2-3 days",
      inStock: true
    },
    {
      id: 16,
      images: ["/images/top16-1.jpg", "/images/top16-2.jpg", "/images/top16-3.jpg", "/images/top16-4.jpg"],
      title: "Silk Camisole Top",
      description: "Luxurious silk camisole for elegant layering and special occasions",
      price: 1299,
      originalPrice: 1799,
      sizes: ["XS", "S", "M", "L"],
      colors: [
        { name: "Black", value: "#000000" },
        { name: "Nude", value: "#fef3c7" },
        { name: "Burgundy", value: "#9d174d" }
      ],
      fabric: "Pure Silk",
      occasion: "Party, Evening",
      care: "Dry Clean Only",
      delivery: "4-5 days",
      inStock: true
    },
    {
      id: 17,
      images: ["/images/top17-1.jpg", "/images/top17-2.jpg", "/images/top17-3.jpg", "/images/top17-4.jpg"],
      title: "Printed Kimono Sleeve Top",
      description: "Bohemian style top with kimono sleeves and ethnic prints",
      price: 949,
      originalPrice: 1349,
      sizes: ["XS", "S", "M", "L"],
      colors: [
        { name: "Multi Color", value: "#7c3aed" },
        { name: "Blue", value: "#1e40af" },
        { name: "Red", value: "#dc2626" }
      ],
      fabric: "Rayon",
      occasion: "Casual, Festival",
      care: "Hand Wash",
      delivery: "3-4 days",
      inStock: true
    },
    {
      id: 18,
      images: ["/images/top18-1.jpg", "/images/top18-2.jpg", "/images/top18-3.jpg", "/images/top18-4.jpg"],
      title: "Basic Tank Top",
      description: "Essential tank top for layering and casual summer wear",
      price: 399,
      originalPrice: 599,
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: [
        { name: "White", value: "#ffffff" },
        { name: "Black", value: "#000000" },
        { name: "Grey", value: "#6b7280" }
      ],
      fabric: "Cotton Jersey",
      occasion: "Casual, Everyday",
      care: "Machine Wash",
      delivery: "2-3 days",
      inStock: true
    },
    {
      id: 19,
      images: ["/images/top19-1.jpg", "/images/top19-2.jpg", "/images/top19-3.jpg", "/images/top19-4.jpg"],
      title: "Embroidered Kurti Top",
      description: "Traditional kurti style top with modern embroidery",
      price: 1199,
      originalPrice: 1599,
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: [
        { name: "Pink", value: "#f472b6" },
        { name: "Blue", value: "#0ea5e9" },
        { name: "Green", value: "#16a34a" }
      ],
      fabric: "Cotton with Embroidery",
      occasion: "Casual, Traditional",
      care: "Machine Wash",
      delivery: "3-4 days",
      inStock: true
    },
    {
      id: 20,
      images: ["/images/top20-1.jpg", "/images/top20-2.jpg", "/images/top20-3.jpg", "/images/top20-4.jpg"],
      title: "Designer Asymmetric Top",
      description: "Fashion-forward asymmetric top with unique cut and design",
      price: 1399,
      originalPrice: 1899,
      sizes: ["XS", "S", "M", "L"],
      colors: [
        { name: "Black", value: "#000000" },
        { name: "White", value: "#ffffff" },
        { name: "Red", value: "#dc2626" }
      ],
      fabric: "Crepe",
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
            <h1 className="text-2xl font-light">Tops & Shirts</h1>
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