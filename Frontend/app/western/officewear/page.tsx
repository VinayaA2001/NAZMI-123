// app/(store)/western/Officewear/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  images: string[];
  sizes: string[];
  colors: string[];
  category: string;
  featured: boolean;
  stock: number;
  fabric: string;
  occasion: string;
  care: string;
  delivery: string;
  productCode?: string;
}

export default function OfficewearPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [zoomImage, setZoomImage] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [addingToWishlist, setAddingToWishlist] = useState<number | null>(null);

  const officewearProducts: Product[] = [
    {
      id: 1,
      name: "Professional Blazer Set",
      description: "Elegant blazer set with perfect tailoring for corporate meetings and formal occasions",
      price: 2499,
      originalPrice: 3299,
      image: "/images/office1-1.jpg",
      images: ["/images/office1-1.jpg", "/images/office1-2.jpg", "/images/office1-3.jpg", "/images/office1-4.jpg"],
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Navy", "Black", "Grey"],
      category: "officewear",
      featured: true,
      stock: 8,
      fabric: "Wool Blend",
      occasion: "Office, Formal",
      care: "Dry Clean Only",
      delivery: "3-4 days",
      productCode: "OFF-BZ-001"
    },
    {
      id: 2,
      name: "Office Dress",
      description: "Sophisticated office dress with modest length and professional design",
      price: 1799,
      originalPrice: 2299,
      image: "/images/office2-1.jpg",
      images: ["/images/office2-1.jpg", "/images/office2-2.jpg", "/images/office2-3.jpg", "/images/office2-4.jpg"],
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Black", "Navy", "Burgundy"],
      category: "officewear",
      featured: true,
      stock: 12,
      fabric: "Polyester Blend",
      occasion: "Office, Business",
      care: "Machine Wash",
      delivery: "2-3 days",
      productCode: "OFF-DR-002"
    },
    {
      id: 3,
      name: "Business Trousers",
      description: "Comfortable and stylish business trousers with perfect fit for all-day wear",
      price: 1299,
      originalPrice: 1699,
      image: "/images/office3-1.jpg",
      images: ["/images/office3-1.jpg", "/images/office3-2.jpg", "/images/office3-3.jpg", "/images/office3-4.jpg"],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      colors: ["Black", "Grey", "Navy"],
      category: "officewear",
      featured: false,
      stock: 15,
      fabric: "Cotton Blend",
      occasion: "Office, Formal",
      care: "Machine Wash",
      delivery: "2-3 days",
      productCode: "OFF-TR-003"
    },
    {
      id: 4,
      name: "Formal Shirt & Skirt Set",
      description: "Coordinated shirt and skirt set for professional office attire",
      price: 2199,
      originalPrice: 2899,
      image: "/images/office4-1.jpg",
      images: ["/images/office4-1.jpg", "/images/office4-2.jpg", "/images/office4-3.jpg", "/images/office4-4.jpg"],
      sizes: ["XS", "S", "M", "L"],
      colors: ["White", "Light Blue", "Pale Pink"],
      category: "officewear",
      featured: true,
      stock: 6,
      fabric: "Cotton Poplin",
      occasion: "Office, Corporate",
      care: "Machine Wash",
      delivery: "3-4 days",
      productCode: "OFF-SS-004"
    },
    {
      id: 5,
      name: "Corporate Blouse",
      description: "Elegant corporate blouse with delicate details for professional settings",
      price: 1599,
      originalPrice: 2099,
      image: "/images/office5-1.jpg",
      images: ["/images/office5-1.jpg", "/images/office5-2.jpg", "/images/office5-3.jpg", "/images/office5-4.jpg"],
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["White", "Black", "Cream"],
      category: "officewear",
      featured: false,
      stock: 10,
      fabric: "Silk Cotton",
      occasion: "Office, Business",
      care: "Hand Wash",
      delivery: "3-4 days",
      productCode: "OFF-BL-005"
    },
    {
      id: 6,
      name: "Executive Suit",
      description: "Complete executive suit for important meetings and corporate events",
      price: 3299,
      originalPrice: 4299,
      image: "/images/office6-1.jpg",
      images: ["/images/office6-1.jpg", "/images/office6-2.jpg", "/images/office6-3.jpg", "/images/office6-4.jpg"],
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Black", "Navy", "Charcoal"],
      category: "officewear",
      featured: true,
      stock: 5,
      fabric: "Wool Blend",
      occasion: "Corporate, Formal",
      care: "Dry Clean Only",
      delivery: "4-5 days",
      productCode: "OFF-ES-006"
    },
    {
      id: 7,
      name: "Office Jumpsuit",
      description: "Stylish and comfortable jumpsuit perfect for modern office environments",
      price: 1899,
      originalPrice: 2499,
      image: "/images/office7-1.jpg",
      images: ["/images/office7-1.jpg", "/images/office7-2.jpg", "/images/office7-3.jpg", "/images/office7-4.jpg"],
      sizes: ["XS", "S", "M", "L"],
      colors: ["Navy", "Black", "Burgundy"],
      category: "officewear",
      featured: false,
      stock: 9,
      fabric: "Crepe",
      occasion: "Office, Business Casual",
      care: "Dry Clean Only",
      delivery: "3-4 days",
      productCode: "OFF-JP-007"
    },
    {
      id: 8,
      name: "Formal Pencil Skirt",
      description: "Classic pencil skirt for professional office wardrobe",
      price: 1199,
      originalPrice: 1599,
      image: "/images/office8-1.jpg",
      images: ["/images/office8-1.jpg", "/images/office8-2.jpg", "/images/office8-3.jpg", "/images/office8-4.jpg"],
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Black", "Grey", "Navy"],
      category: "officewear",
      featured: false,
      stock: 14,
      fabric: "Polyester Blend",
      occasion: "Office, Formal",
      care: "Machine Wash",
      delivery: "2-3 days",
      productCode: "OFF-PS-008"
    },
    {
      id: 9,
      name: "Business Casual Top",
      description: "Versatile business casual top that pairs well with formal bottoms",
      price: 999,
      originalPrice: 1399,
      image: "/images/office9-1.jpg",
      images: ["/images/office9-1.jpg", "/images/office9-2.jpg", "/images/office9-3.jpg", "/images/office9-4.jpg"],
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["White", "Light Blue", "Lavender"],
      category: "officewear",
      featured: false,
      stock: 18,
      fabric: "Cotton Blend",
      occasion: "Office, Business Casual",
      care: "Machine Wash",
      delivery: "2-3 days",
      productCode: "OFF-BC-009"
    },
    {
      id: 10,
      name: "Professional Blazer Dress",
      description: "Sophisticated blazer dress that makes a powerful statement",
      price: 2799,
      originalPrice: 3599,
      image: "/images/office10-1.jpg",
      images: ["/images/office10-1.jpg", "/images/office10-2.jpg", "/images/office10-3.jpg", "/images/office10-4.jpg"],
      sizes: ["XS", "S", "M", "L"],
      colors: ["Black", "Navy", "Grey"],
      category: "officewear",
      featured: true,
      stock: 7,
      fabric: "Wool Blend",
      occasion: "Corporate, Formal",
      care: "Dry Clean Only",
      delivery: "4-5 days",
      productCode: "OFF-BD-010"
    },
    {
      id: 11,
      name: "Office Wear Saree",
      description: "Contemporary saree designed for modern professional settings",
      price: 1999,
      originalPrice: 2699,
      image: "/images/office11-1.jpg",
      images: ["/images/office11-1.jpg", "/images/office11-2.jpg", "/images/office11-3.jpg", "/images/office11-4.jpg"],
      sizes: ["Free Size"],
      colors: ["Pastel Pink", "Mint Green", "Light Grey"],
      category: "officewear",
      featured: false,
      stock: 11,
      fabric: "Georgette",
      occasion: "Office, Corporate",
      care: "Dry Clean Only",
      delivery: "3-4 days",
      productCode: "OFF-SR-011"
    },
    {
      id: 12,
      name: "Formal Culottes Set",
      description: "Modern culottes set for comfortable yet professional office wear",
      price: 1699,
      originalPrice: 2299,
      image: "/images/office12-1.jpg",
      images: ["/images/office12-1.jpg", "/images/office12-2.jpg", "/images/office12-3.jpg", "/images/office12-4.jpg"],
      sizes: ["XS", "S", "M", "L"],
      colors: ["Black", "Navy", "Olive"],
      category: "officewear",
      featured: false,
      stock: 8,
      fabric: "Linen Blend",
      occasion: "Office, Business Casual",
      care: "Machine Wash",
      delivery: "3-4 days",
      productCode: "OFF-CL-012"
    },
    {
      id: 13,
      name: "Corporate Jacket Set",
      description: "Elegant jacket set perfect for client meetings and presentations",
      price: 2399,
      originalPrice: 3199,
      image: "/images/office13-1.jpg",
      images: ["/images/office13-1.jpg", "/images/office13-2.jpg", "/images/office13-3.jpg", "/images/office13-4.jpg"],
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Navy", "Black", "Brown"],
      category: "officewear",
      featured: true,
      stock: 6,
      fabric: "Wool Blend",
      occasion: "Corporate, Formal",
      care: "Dry Clean Only",
      delivery: "4-5 days",
      productCode: "OFF-CJ-013"
    },
    {
      id: 14,
      name: "Office Appropriate Kurti",
      description: "Professional kurti with modern cut for corporate environment",
      price: 1399,
      originalPrice: 1899,
      image: "/images/office14-1.jpg",
      images: ["/images/office14-1.jpg", "/images/office14-2.jpg", "/images/office14-3.jpg", "/images/office14-4.jpg"],
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Blue", "Green", "Maroon"],
      category: "officewear",
      featured: false,
      stock: 16,
      fabric: "Cotton Blend",
      occasion: "Office, Business Casual",
      care: "Machine Wash",
      delivery: "2-3 days",
      productCode: "OFF-KT-014"
    },
    {
      id: 15,
      name: "Business Formal Dress",
      description: "Elegant dress suitable for important business occasions",
      price: 2099,
      originalPrice: 2799,
      image: "/images/office15-1.jpg",
      images: ["/images/office15-1.jpg", "/images/office15-2.jpg", "/images/office15-3.jpg", "/images/office15-4.jpg"],
      sizes: ["XS", "S", "M", "L"],
      colors: ["Black", "Navy", "Burgundy"],
      category: "officewear",
      featured: true,
      stock: 9,
      fabric: "Crepe",
      occasion: "Corporate, Formal",
      care: "Dry Clean Only",
      delivery: "3-4 days",
      productCode: "OFF-BF-015"
    },
    {
      id: 16,
      name: "Professional Trousers & Top Set",
      description: "Complete professional set with trousers and matching top",
      price: 1899,
      originalPrice: 2499,
      image: "/images/office16-1.jpg",
      images: ["/images/office16-1.jpg", "/images/office16-2.jpg", "/images/office16-3.jpg", "/images/office16-4.jpg"],
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Grey", "Navy", "Black"],
      category: "officewear",
      featured: false,
      stock: 12,
      fabric: "Polyester Blend",
      occasion: "Office, Business",
      care: "Machine Wash",
      delivery: "3-4 days",
      productCode: "OFF-PT-016"
    },
    {
      id: 17,
      name: "Formal Blouse with Trousers",
      description: "Sophisticated blouse and trousers combination for office wear",
      price: 1599,
      originalPrice: 2199,
      image: "/images/office17-1.jpg",
      images: ["/images/office17-1.jpg", "/images/office17-2.jpg", "/images/office17-3.jpg", "/images/office17-4.jpg"],
      sizes: ["XS", "S", "M", "L"],
      colors: ["White", "Cream", "Light Pink"],
      category: "officewear",
      featured: false,
      stock: 10,
      fabric: "Silk Blend",
      occasion: "Office, Formal",
      care: "Dry Clean Only",
      delivery: "3-4 days",
      productCode: "OFF-FB-017"
    },
    {
      id: 18,
      name: "Corporate Dress Pants",
      description: "Comfortable and stylish dress pants for professional settings",
      price: 1299,
      originalPrice: 1799,
      image: "/images/office18-1.jpg",
      images: ["/images/office18-1.jpg", "/images/office18-2.jpg", "/images/office18-3.jpg", "/images/office18-4.jpg"],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      colors: ["Black", "Grey", "Navy"],
      category: "officewear",
      featured: false,
      stock: 20,
      fabric: "Cotton Blend",
      occasion: "Office, Business",
      care: "Machine Wash",
      delivery: "2-3 days",
      productCode: "OFF-DP-018"
    },
    {
      id: 19,
      name: "Executive Blazer & Skirt",
      description: "Powerful executive combination for leadership roles",
      price: 2999,
      originalPrice: 3899,
      image: "/images/office19-1.jpg",
      images: ["/images/office19-1.jpg", "/images/office19-2.jpg", "/images/office19-3.jpg", "/images/office19-4.jpg"],
      sizes: ["XS", "S", "M", "L"],
      colors: ["Black", "Navy", "Charcoal"],
      category: "officewear",
      featured: true,
      stock: 4,
      fabric: "Wool Blend",
      occasion: "Corporate, Executive",
      care: "Dry Clean Only",
      delivery: "4-5 days",
      productCode: "OFF-EB-019"
    },
    {
      id: 20,
      name: "Business Casual Dress",
      description: "Comfortable yet professional dress for everyday office wear",
      price: 1499,
      originalPrice: 1999,
      image: "/images/office20-1.jpg",
      images: ["/images/office20-1.jpg", "/images/office20-2.jpg", "/images/office20-3.jpg", "/images/office20-4.jpg"],
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Blue", "Green", "Purple"],
      category: "officewear",
      featured: false,
      stock: 15,
      fabric: "Cotton Blend",
      occasion: "Office, Business Casual",
      care: "Machine Wash",
      delivery: "2-3 days",
      productCode: "OFF-BC-020"
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
            <h1 className="text-2xl font-light">Officewear</h1>
            <div className="w-8"></div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {officewearProducts.map((product) => (
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
                                        color.toLowerCase().includes('cream') ? '#fef3c7' :
                                        color.toLowerCase().includes('pink') ? '#fbcfe8' :
                                        color.toLowerCase().includes('green') ? '#16a34a' :
                                        color.toLowerCase().includes('purple') ? '#7c3aed' :
                                        color.toLowerCase().includes('brown') ? '#92400e' :
                                        color.toLowerCase().includes('charcoal') ? '#374151' :
                                        color.toLowerCase().includes('olive') ? '#65a30d' :
                                        color.toLowerCase().includes('lavender') ? '#a78bfa' :
                                        color.toLowerCase().includes('mint') ? '#a7f3d0' : '#ccc'
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
                    {selectedProduct.care && (
                      <div><strong>Care:</strong> {selectedProduct.care}</div>
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