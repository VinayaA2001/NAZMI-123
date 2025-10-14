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
  productCode?: string;
  stock?: number; // optional stock count
}

export default function FestiveEditsPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [zoomImage, setZoomImage] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [addingToWishlist, setAddingToWishlist] = useState<number | null>(null);
  const [wishlistItems, setWishlistItems] = useState<Set<number>>(new Set());

  // PRODUCTS — keep these aligned to the Product interface above
  const products: Product[] = [
    {
  id: 1,
  productCode: "3108",
  images: [
    "https://res.cloudinary.com/dq5xhg9uo/image/upload/v1760377553/ash_pink5_qbfagi.jpg",
    "https://res.cloudinary.com/dq5xhg9uo/image/upload/v1760377548/ash_pink4_q99qjp.jpg",
    "https://res.cloudinary.com/dq5xhg9uo/image/upload/v1760377538/ash_pink2_bttpls.jpg",
    "https://res.cloudinary.com/dq5xhg9uo/image/upload/v1760377535/ash_pink1_cggyaq.jpg",
    "https://res.cloudinary.com/dq5xhg9uo/image/upload/v1760377543/ash_pink3_olebah.jpg",
  ],
  title: "Premium 3 Piece Churidar Set",
  description: "Premium three-piece silk churidar set in ash pink.",
  price: 3700,
  originalPrice: 3700,
  sizes: ["XXL"],
  colors: [
    { name: "Ash", value: "#B2BEB5" },
    { name: "Pink", value: "#ec4899" }
  ],
  fabric: "Silk",
  occasion: "Casual, Festive",
  care: "Dry Clean Only",
  delivery: "2-3 days",
  inStock: true,
  stock: 2,
},
    {
  id: 2,
  productCode: "3252",
  images: [
    "https://res.cloudinary.com/dq5xhg9uo/image/upload/v1760415680/pinkk4_dbraiq.jpg",
    "https://res.cloudinary.com/dq5xhg9uo/image/upload/v1760415679/pinkk3_bbnzgo.jpg",
    "https://res.cloudinary.com/dq5xhg9uo/image/upload/v1760415679/pinkk1_zlmz4u.jpg",
    "https://res.cloudinary.com/dq5xhg9uo/image/upload/v1760415680/pinkk2_mjahmo.jpg",
    "https://res.cloudinary.com/dq5xhg9uo/image/upload/v1760415679/pinkk5_s4fzuf.jpg",
  ],
  title: "Premium 3 Piece Salwar Set",
  description: "Premium silk three-piece salwar set in pink.",
  price: 3299,
  originalPrice: 3299,
  sizes: ["XXL"],
  colors: [{ name: "Pink", value: "#ec4899" }],
  fabric: "Silk",
  occasion: "Casual, Festive",
  care: "Dry Clean Only",
  delivery: "2-3 days",
  inStock: true,
  stock: 1,
},
    {
  id: 3,
  productCode: "3042",
  images: [
    "https://res.cloudinary.com/dq5xhg9uo/image/upload/v1760377761/yellw2_xifsez.jpg",
    "https://res.cloudinary.com/dq5xhg9uo/image/upload/v1760377779/yellw3_znutuf.jpg",
    "https://res.cloudinary.com/dq5xhg9uo/image/upload/v1760377755/yellw1_g3bkfl.jpg",
    "https://res.cloudinary.com/dq5xhg9uo/image/upload/v1760377785/yellw4_owxbrr.jpg",
    "https://res.cloudinary.com/dq5xhg9uo/image/upload/v1760377792/yellw5_udlf7f.jpg",
  ],
  title: "3 Piece Salwar Set",
  description: "Three-piece salwar set in yellow.",
  price: 3150,
  originalPrice: 3150,
  sizes: ["XXL"],
  colors: [{ name: "Yellow", value: "#eab308" }],
  fabric: "Not specified",
  occasion: "Casual, Festive",
  care: "Dry Clean Recommended",
  delivery: "2-3 days",
  inStock: true,
  stock: 1,
},
    {
  id: 4,
  productCode: "2920",
  images: [
    "https://res.cloudinary.com/dq5xhg9uo/image/upload/v1760377609/green1_j51fqj.jpg",
    "https://res.cloudinary.com/dq5xhg9uo/image/upload/v1760377615/green2_deje92.jpg",
    "https://res.cloudinary.com/dq5xhg9uo/image/upload/v1760377620/green3_min09x.jpg",
    "https://res.cloudinary.com/dq5xhg9uo/image/upload/v1760377626/green4_g3gqwl.jpg",
    "https://res.cloudinary.com/dq5xhg9uo/image/upload/v1760377631/green5_qbkvva.jpg",
  ],
  title: "3 Piece Salwar Set",
  description: "Three-piece salwar set in green.",
  price: 3150,
  originalPrice: 3150,
  sizes: ["XXL"],
  colors: [{ name: "Green", value: "#059669" }],
  fabric: "Not specified",
  occasion: "Casual, Festive",
  care: "Dry Clean Recommended",
  delivery: "2-3 days",
  inStock: true,
  stock: 1,
},
    {
  id: 5,
  productCode: "3328",
  images: [
    "https://res.cloudinary.com/dq5xhg9uo/image/upload/v1760016926/violet1_d5rrkh.jpg",
    "https://res.cloudinary.com/dq5xhg9uo/image/upload/v1760016926/violet2_anivym.jpg",
    "https://res.cloudinary.com/dq5xhg9uo/image/upload/v1760016925/violet3_kxdqbh.jpg",
    "https://res.cloudinary.com/dq5xhg9uo/image/upload/v1760016925/violet4_n9js0r.jpg",
    "https://res.cloudinary.com/dq5xhg9uo/image/upload/v1760016925/violet5_qkxg6g.jpg",
  ],
  title: "Premium 3 Piece Salwar Set",
  description: "Premium crepe three-piece salwar set in rich tone.",
  price: 4150,
  originalPrice: 4150,
  sizes: ["XXL"],
  colors: [{ name: "Brown", value: "#8B4513" }],
  fabric: "Crepe",
  occasion: "Casual, Festive",
  care: "Dry Clean Only",
  delivery: "2-3 days",
  inStock: true,
  stock: 1,
},
    {
  id: 6,
  productCode: "3335",
  images: [
    "https://res.cloudinary.com/dq5xhg9uo/image/upload/v1760416641/pgreen_dv4hps.jpg",
    "https://res.cloudinary.com/dq5xhg9uo/image/upload/v1760416641/pgreen1_rxesg5.jpg",
    "https://res.cloudinary.com/dq5xhg9uo/image/upload/v1760416642/pgreen2_cvm4ua.jpg",
    "https://res.cloudinary.com/dq5xhg9uo/image/upload/v1760416647/pgreen3_rveggo.jpg",
    "https://res.cloudinary.com/dq5xhg9uo/image/upload/v1760416648/pgreen4_i6z0mj.jpg",
  ],
  title: "Parrot Green Churidar Set",
  description: "Vibrant parrot green churidar set with a comfortable, everyday fit.",
  price: 2499,
  originalPrice: 2499,
  sizes: ["L", "XL"],
  colors: [{ name: "Parrot Green", value: "#32CD32" }],
  fabric: "Churidar",
  occasion: "Traditional, Daily Wear",
  care: "Machine Wash",
  delivery: "2-3 days",
  inStock: true,
  stock: 1,
},
  ];

  // stateful list so we can modify later if needed
  const [productList, setProductList] = useState<Product[]>(products);

  // Load wishlist from localStorage
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem("wishlist");
      if (savedWishlist) {
        const parsed = JSON.parse(savedWishlist);
        if (Array.isArray(parsed)) {
          const ids = new Set(parsed.map((i: any) => i.id));
          setWishlistItems(ids);
        }
      }
    } catch (e) {
      console.error("Error loading wishlist from localStorage:", e);
      setWishlistItems(new Set());
    }
  }, []);

  // Merge any saved per-product images (if you ever add uploading again)
  useEffect(() => {
    setProductList(prev =>
      prev.map(p => {
        const saved = localStorage.getItem(`prod-images-${p.id}`);
        if (saved) {
          try {
            const arr = JSON.parse(saved);
            if (Array.isArray(arr) && arr.length) {
              return { ...p, images: arr.slice(0, 5) };
            }
          } catch {}
        }
        return p;
      })
    );
  }, []);

  // Add to Cart
  const addToCart = async (product: Product, size: string = "", color: string = "") => {
    setAddingToCart(product.id);
    try {
      const s = size || (product.sizes.length > 0 ? product.sizes[0] : "");
      const c = color || (product.colors.length > 0 ? product.colors[0].name : "");

      const cartItem = {
        id: `${product.id}-${s}-${c}`,
        productId: product.id,
        name: product.title,
        price: product.price,
        image: product.images[0],
        quantity: 1,
        size: s,
        color: c,
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
          ? existing.map((item: any, i: number) => (i === idx ? { ...item, quantity: item.quantity + 1 } : item))
          : [...existing, cartItem];

      localStorage.setItem("cart", JSON.stringify(updated));
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setAddingToCart(null);
    }
  };

  // Wishlist
  const addToWishlist = async (product: Product) => {
    setAddingToWishlist(product.id);
    try {
      const item = {
        id: product.id,
        productId: product.id,
        name: product.title,
        price: product.price,
        image: product.images[0],
      };

      let existing: any[] = [];
      try {
        const data = localStorage.getItem("wishlist");
        if (data) existing = JSON.parse(data);
      } catch {
        existing = [];
      }

      const idx = existing.findIndex((i: any) => i.id === item.id);
      let updated;
      if (idx > -1) {
        updated = existing.filter((i: any) => i.id !== item.id);
        setWishlistItems(prev => {
          const n = new Set(prev);
          n.delete(product.id);
          return n;
        });
      } else {
        updated = [...existing, item];
        setWishlistItems(prev => new Set(prev).add(product.id));
      }

      localStorage.setItem("wishlist", JSON.stringify(updated));
      window.dispatchEvent(new Event("wishlistUpdated"));
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

  const handleImageClick = (image: string) => setZoomImage(image);

  const handleQuickAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.sizes.length === 1 && product.colors.length === 1) {
      addToCart(product, product.sizes[0], product.colors[0].name);
    } else {
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

  const isInWishlist = (productId: number) => wishlistItems.has(productId);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link href="/traditional" className="text-gray-600 hover:text-gray-900">
              ← Back to Traditional
            </Link>
            <h1 className="text-2xl font-light">Festive Edits</h1>
            <div className="w-8" />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productList.map((product) => (
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
                    isInWishlist(product.id) ? "text-red-500" : "text-gray-600"
                  }`}
                >
                  {addingToWishlist === product.id ? (
                    <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                  ) : isInWishlist(product.id) ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
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

                {/* Quick Add */}
                <button
                  onClick={(e) => handleQuickAddToCart(product, e)}
                  disabled={!product.inStock || addingToCart === product.id}
                  className={`absolute bottom-2 right-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                    !product.inStock ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-black text-white hover:bg-gray-800"
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
                  <span className={`text-xs font-medium ${product.inStock ? "text-green-600" : "text-red-600"}`}>
                    {product.inStock ? "In stock" : "Out of stock"}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickAddToCart(product, e);
                  }}
                  disabled={!product.inStock || addingToCart === product.id}
                  className={`w-full py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                    !product.inStock ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-black text-white hover:bg-gray-800"
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m-6-6h12" />
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
                {/* Images */}
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

                  {/* Thumbnails */}
                  <div className={`grid ${selectedProduct.images.length >= 5 ? "grid-cols-5" : "grid-cols-4"} gap-2`}>
                    {selectedProduct.images.slice(0, 5).map((image, index) => (
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

                  {/* Stock */}
                  <div className={`text-sm font-medium mb-4 ${selectedProduct.inStock ? "text-green-600" : "text-red-600"}`}>
                    {selectedProduct.inStock ? "In stock" : "Out of Stock"}
                    {typeof selectedProduct.stock === "number" && (
                      <span className="ml-2 text-gray-500">(Qty: {selectedProduct.stock})</span>
                    )}
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
                            selectedSize === size ? "border-black bg-black text-white" : "border-gray-300 hover:border-gray-400"
                          }`}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-2 text-sm text-gray-600 mb-6">
                    <div>
                      <strong>Fabric:</strong> {selectedProduct.fabric}
                    </div>
                    <div>
                      <strong>Occasion:</strong> {selectedProduct.occasion}
                    </div>
                    <div>
                      <strong>Care:</strong> {selectedProduct.care}
                    </div>
                    <div>
                      <strong>Delivery:</strong> {selectedProduct.delivery}
                    </div>
                  </div>

                  {/* Actions */}
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
                          ? "bg-red-50 border-red-300 text-red-600 hover:bg-red-100"
                          : "text-gray-700 hover:text-red-600"
                      }`}
                    >
                      {addingToWishlist === selectedProduct.id ? (
                        <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      ) : isInWishlist(selectedProduct.id) ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
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
            <Image src={zoomImage} alt="Zoomed product image" width={800} height={800} className="object-contain max-h-[80vh]" />
            <button onClick={() => setZoomImage("")} className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300">
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
