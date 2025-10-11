// app/western/bottomwears/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  sizes: string[];
  colors: string[];
  category: string;
  featured: boolean;
  stock: number;
  fabric?: string;
  occasion?: string;
  delivery?: string;
  productCode?: string;
}

export default function BottomwearsPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [zoomImage, setZoomImage] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [addingToWishlist, setAddingToWishlist] = useState<number | null>(null);

  const bottomwearsProducts: Product[] = [
    {
      id: 1,
      name: "Classic Blue Jeans",
      description: "Comfortable classic blue jeans with perfect fit for everyday wear. Made with premium denim fabric that offers both comfort and style.",
      price: 1499,
      originalPrice: 1999,
      image: "/images/jeans-1.jpg",
      images: [
        "/images/jeans-1.jpg",
        "/images/jeans-2.jpg", 
        "/images/jeans-3.jpg",
        "/images/jeans-4.jpg"
      ],
      sizes: ["28", "30", "32", "34", "36"],
      colors: ["Light Blue", "Medium Blue", "Dark Blue"],
      category: "bottomwears",
      featured: true,
      stock: 15,
      fabric: "100% Cotton Denim",
      occasion: "Casual, Everyday",
      delivery: "2-3 days",
      productCode: "BOT-JN-001"
    },
    {
      id: 2,
      name: "Designer Palazzos",
      description: "Flowy palazzo pants with comfortable waistband and elegant drape. Perfect for both casual and party wear.",
      price: 1299,
      originalPrice: 1699,
      image: "/images/palazzo-1.jpg",
      images: [
        "/images/palazzo-1.jpg",
        "/images/palazzo-2.jpg",
        "/images/palazzo-3.jpg",
        "/images/palazzo-4.jpg"
      ],
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black", "Navy", "Burgundy", "White"],
      category: "bottomwears",
      featured: true,
      stock: 8,
      fabric: "Rayon Blend",
      occasion: "Casual, Party",
      delivery: "3-4 days",
      productCode: "BOT-PL-002"
    },
    {
      id: 3,
      name: "A-Line Skirt",
      description: "Flattering A-line skirt perfect for office and casual outings. Features comfortable waistband and perfect length.",
      price: 1099,
      originalPrice: 1499,
      image: "/images/skirt-1.jpg",
      images: [
        "/images/skirt-1.jpg",
        "/images/skirt-2.jpg",
        "/images/skirt-3.jpg",
        "/images/skirt-4.jpg"
      ],
      sizes: ["XS", "S", "M", "L"],
      colors: ["Black", "Grey", "Navy", "Brown"],
      category: "bottomwears",
      featured: false,
      stock: 12,
      fabric: "Polyester Blend",
      occasion: "Office, Casual",
      delivery: "2-3 days",
      productCode: "BOT-SK-003"
    },
    {
      id: 4,
      name: "Wide-Leg Trousers",
      description: "Comfortable wide-leg trousers with professional finish. Perfect for office wear and formal occasions.",
      price: 1599,
      originalPrice: 2199,
      image: "/images/trousers-1.jpg",
      images: [
        "/images/trousers-1.jpg",
        "/images/trousers-2.jpg",
        "/images/trousers-3.jpg",
        "/images/trousers-4.jpg"
      ],
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black", "Beige", "Navy", "Grey"],
      category: "bottomwears",
      featured: true,
      stock: 10,
      fabric: "Cotton Blend",
      occasion: "Office, Formal",
      delivery: "3-4 days",
      productCode: "BOT-TR-004"
    },
    {
      id: 5,
      name: "Denim Shorts",
      description: "Comfortable denim shorts perfect for summer and casual wear. Features trendy cuts and comfortable fit.",
      price: 899,
      originalPrice: 1299,
      image: "/images/shorts-1.jpg",
      images: [
        "/images/shorts-1.jpg",
        "/images/shorts-2.jpg",
        "/images/shorts-3.jpg",
        "/images/shorts-4.jpg"
      ],
      sizes: ["26", "28", "30", "32"],
      colors: ["Light Blue", "Medium Blue", "Black"],
      category: "bottomwears",
      featured: false,
      stock: 20,
      fabric: "Cotton Denim",
      occasion: "Casual, Summer",
      delivery: "2-3 days",
      productCode: "BOT-SH-005"
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
      const selectedColor = color || (product.colors.length > 0 ? product.colors[0] : "");
      
      const cartItem = {
        id: `${product.id}-${selectedSize}-${selectedColor}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
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
      alert(`${product.name} added to cart successfully!`);
      
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
        name: product.name,
        price: product.price,
        image: product.image,
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
        alert(`${product.name} removed from wishlist`);
      } else {
        // Add to wishlist
        updatedWishlist = [...existingWishlist, wishlistItem];
        alert(`${product.name} added to wishlist!`);
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
      addToCart(product, product.sizes[0], product.colors[0]);
    } else {
      // If multiple options, open quick view
      setSelectedProduct(product);
    }
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
          {bottomwearsProducts.map((product) => (
            <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-400 transition-colors group">
              {/* Product Image */}
              <div className="relative h-80 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300 cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                />
                
                {/* Wishlist Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToWishlist(product);
                  }}
                  disabled={addingToWishlist === product.id}
                  className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                  {addingToWishlist === product.id ? (
                    <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  )}
                </button>

                {product.stock === 0 && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
                    Out of Stock
                  </div>
                )}
                {product.featured && (
                  <div className="absolute top-12 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                    Featured
                  </div>
                )}

                {/* Quick Add to Cart Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickAddToCart(product);
                  }}
                  disabled={product.stock === 0 || addingToCart === product.id}
                  className={`absolute bottom-2 right-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                    product.stock === 0
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
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-gray-900">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                    )}
                    {product.originalPrice && (
                      <span className="text-sm text-green-600 font-medium">
                        {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-1">
                    {product.colors.slice(0, 3).map((color, index) => (
                      <div
                        key={index}
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ 
                          backgroundColor: color.toLowerCase().includes('blue') ? '#3b82f6' :
                                        color.toLowerCase().includes('black') ? '#000000' :
                                        color.toLowerCase().includes('white') ? '#ffffff' :
                                        color.toLowerCase().includes('grey') ? '#6b7280' :
                                        color.toLowerCase().includes('navy') ? '#1e3a8a' :
                                        color.toLowerCase().includes('burgundy') ? '#9d174d' :
                                        color.toLowerCase().includes('beige') ? '#d6d3d1' :
                                        color.toLowerCase().includes('brown') ? '#92400e' : '#ccc'
                        }}
                        title={color}
                      />
                    ))}
                    {product.colors.length > 3 && (
                      <div className="text-xs text-gray-500">+{product.colors.length - 3} more</div>
                    )}
                  </div>
                  <span className={`text-xs font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/product/${createSlug(product.name)}`}
                    className="flex-1 bg-gray-900 text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors text-center"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:border-gray-400 transition-colors"
                  >
                    Quick View
                  </button>
                </div>
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
                <div>
                  <h2 className="text-2xl font-light">{selectedProduct.name}</h2>
                  {selectedProduct.productCode && (
                    <p className="text-sm text-gray-500">Product Code: {selectedProduct.productCode}</p>
                  )}
                </div>
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
                    onClick={() => handleImageClick(selectedProduct.images?.[selectedImageIndex] || selectedProduct.image)}
                  >
                    <Image
                      src={selectedProduct.images?.[selectedImageIndex] || selectedProduct.image}
                      alt={`${selectedProduct.name} - View ${selectedImageIndex + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                    {selectedProduct.stock === 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Sold Out
                      </div>
                    )}
                  </div>
                  
                  {/* Thumbnail Gallery */}
                  <div className="grid grid-cols-4 gap-2">
                    {(selectedProduct.images || [selectedProduct.image]).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImageIndex === index ? "border-black" : "border-transparent"
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${selectedProduct.name} - View ${index + 1}`}
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
                    {selectedProduct.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">₹{selectedProduct.originalPrice}</span>
                    )}
                    {selectedProduct.originalPrice && (
                      <span className="text-green-600 font-medium">
                        {Math.round((1 - selectedProduct.price / selectedProduct.originalPrice) * 100)}% OFF
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className={`text-sm font-medium mb-4 ${selectedProduct.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedProduct.stock > 0 ? `${selectedProduct.stock} items in stock` : 'Out of Stock'}
                  </div>

                  {/* Colors */}
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Color</h4>
                    <div className="flex gap-3">
                      {selectedProduct.colors.map((color, index) => (
                        <button
                          key={index}
                          className={`px-4 py-2 border rounded-lg font-medium transition-all ${
                            selectedColor === color
                              ? "border-black bg-black text-white"
                              : "border-gray-300 hover:border-black"
                          }`}
                          onClick={() => setSelectedColor(color)}
                        >
                          {color}
                        </button>
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
                    {selectedProduct.fabric && (
                      <div><strong>Fabric:</strong> {selectedProduct.fabric}</div>
                    )}
                    {selectedProduct.occasion && (
                      <div><strong>Occasion:</strong> {selectedProduct.occasion}</div>
                    )}
                    {selectedProduct.delivery && (
                      <div><strong>Delivery:</strong> {selectedProduct.delivery}</div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mb-3">
                    <button
                      onClick={() => addToCart(selectedProduct, selectedSize, selectedColor)}
                      disabled={selectedProduct.stock === 0 || addingToCart === selectedProduct.id}
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
                      className="px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:border-black hover:text-black disabled:opacity-50 transition-colors flex items-center justify-center"
                    >
                      {addingToWishlist === selectedProduct.id ? (
                        <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      )}
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <Link
                      href={`/product/${createSlug(selectedProduct.name)}`}
                      className="flex-1 bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors text-center"
                    >
                      View Full Details
                    </Link>
                    <button
                      onClick={() => handleOrder(selectedProduct)}
                      disabled={selectedProduct.stock === 0}
                      className={`flex-1 py-3 rounded-lg font-medium ${
                        selectedProduct.stock > 0
                          ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      } transition-colors`}
                    >
                      {selectedProduct.stock > 0 ? "Order Now" : "Out of Stock"}
                    </button>
                  </div>
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
              Please sign in to place your order for <strong>{selectedProduct?.name}</strong>
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