// app/western/tops/page.tsx
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

export default function TopsPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [zoomImage, setZoomImage] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [addingToWishlist, setAddingToWishlist] = useState<number | null>(null);

  const topsProducts: Product[] = [
    {
      id: 1,
      name: "Classic Cotton T-Shirt",
      description: "Premium cotton t-shirt with perfect fit for everyday comfort",
      price: 599,
      originalPrice: 899,
      image: "/images/top1-1.jpg",
      images: ["/images/top1-1.jpg", "/images/top1-2.jpg", "/images/top1-3.jpg", "/images/top1-4.jpg"],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      colors: ["White", "Black", "Navy"],
      category: "tops",
      featured: true,
      stock: 25,
      fabric: "100% Premium Cotton",
      occasion: "Casual, Everyday",
      care: "Machine Wash",
      delivery: "2-3 days",
      productCode: "TOP-CT-001"
    },
    {
      id: 2,
      name: "Designer Crop Top",
      description: "Trendy crop top with unique design perfect for parties and outings",
      price: 899,
      originalPrice: 1299,
      image: "/images/top2-1.jpg",
      images: ["/images/top2-1.jpg", "/images/top2-2.jpg", "/images/top2-3.jpg", "/images/top2-4.jpg"],
      sizes: ["XS", "S", "M", "L"],
      colors: ["Pink", "Yellow", "Green"],
      category: "tops",
      featured: true,
      stock: 18,
      fabric: "Cotton Blend",
      occasion: "Party, Casual",
      care: "Machine Wash",
      delivery: "2-3 days",
      productCode: "TOP-CP-002"
    },
    {
      id: 3,
      name: "Formal Button-Down Shirt",
      description: "Crisp formal shirt with perfect tailoring for professional settings",
      price: 1299,
      originalPrice: 1799,
      image: "/images/top3-1.jpg",
      images: ["/images/top3-1.jpg", "/images/top3-2.jpg", "/images/top3-3.jpg", "/images/top3-4.jpg"],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      colors: ["White", "Light Blue", "Pale Pink"],
      category: "tops",
      featured: false,
      stock: 15,
      fabric: "Cotton Poplin",
      occasion: "Office, Formal",
      care: "Machine Wash",
      delivery: "3-4 days",
      productCode: "TOP-FS-003"
    },
    {
      id: 4,
      name: "Off-Shoulder Top",
      description: "Flirty off-shoulder top perfect for dates and special occasions",
      price: 799,
      originalPrice: 1199,
      image: "/images/top4-1.jpg",
      images: ["/images/top4-1.jpg", "/images/top4-2.jpg", "/images/top4-3.jpg", "/images/top4-4.jpg"],
      sizes: ["XS", "S", "M", "L"],
      colors: ["Red", "Black", "Royal Blue"],
      category: "tops",
      featured: true,
      stock: 12,
      fabric: "Rayon Blend",
      occasion: "Party, Date",
      care: "Hand Wash",
      delivery: "2-3 days",
      productCode: "TOP-OS-004"
    },
    {
      id: 5,
      name: "Casual Polo T-Shirt",
      description: "Comfortable polo t-shirt for smart casual looks",
      price: 699,
      originalPrice: 999,
      image: "/images/top5-1.jpg",
      images: ["/images/top5-1.jpg", "/images/top5-2.jpg", "/images/top5-3.jpg", "/images/top5-4.jpg"],
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Navy", "Grey", "Green"],
      category: "tops",
      featured: false,
      stock: 20,
      fabric: "Cotton Pique",
      occasion: "Casual, Sports",
      care: "Machine Wash",
      delivery: "2-3 days",
      productCode: "TOP-PL-005"
    },
    {
      id: 6,
      name: "Embroidered Blouse",
      description: "Elegant blouse with delicate embroidery for traditional occasions",
      price: 1499,
      originalPrice: 1999,
      image: "/images/top6-1.jpg",
      images: ["/images/top6-1.jpg", "/images/top6-2.jpg", "/images/top6-3.jpg", "/images/top6-4.jpg"],
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["White", "Peach", "Mint"],
      category: "tops",
      featured: true,
      stock: 8,
      fabric: "Silk Cotton",
      occasion: "Festive, Party",
      care: "Dry Clean Only",
      delivery: "3-4 days",
      productCode: "TOP-EB-006"
    },
    {
      id: 7,
      name: "Graphic Print T-Shirt",
      description: "Trendy graphic t-shirt with unique prints and comfortable fit",
      price: 649,
      originalPrice: 899,
      image: "/images/top7-1.jpg",
      images: ["/images/top7-1.jpg", "/images/top7-2.jpg", "/images/top7-3.jpg", "/images/top7-4.jpg"],
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Black", "White", "Grey"],
      category: "tops",
      featured: false,
      stock: 22,
      fabric: "100% Cotton",
      occasion: "Casual, Everyday",
      care: "Machine Wash",
      delivery: "2-3 days",
      productCode: "TOP-GP-007"
    },
    {
      id: 8,
      name: "Ruffled Sleeve Top",
      description: "Feminine top with ruffled sleeves for a romantic look",
      price: 999,
      originalPrice: 1399,
      image: "/images/top8-1.jpg",
      images: ["/images/top8-1.jpg", "/images/top8-2.jpg", "/images/top8-3.jpg", "/images/top8-4.jpg"],
      sizes: ["XS", "S", "M", "L"],
      colors: ["Pink", "Lavender", "Yellow"],
      category: "tops",
      featured: false,
      stock: 14,
      fabric: "Chiffon Blend",
      occasion: "Party, Date",
      care: "Hand Wash",
      delivery: "3-4 days",
      productCode: "TOP-RS-008"
    },
    {
      id: 9,
      name: "High-Neck Collar Top",
      description: "Stylish high-neck top with modern design for contemporary looks",
      price: 849,
      originalPrice: 1199,
      image: "/images/top9-1.jpg",
      images: ["/images/top9-1.jpg", "/images/top9-2.jpg", "/images/top9-3.jpg", "/images/top9-4.jpg"],
      sizes: ["XS", "S", "M", "L"],
      colors: ["Black", "Burgundy", "Emerald"],
      category: "tops",
      featured: true,
      stock: 16,
      fabric: "Cotton Blend",
      occasion: "Party, Casual",
      care: "Machine Wash",
      delivery: "2-3 days",
      productCode: "TOP-HN-009"
    },
    {
      id: 10,
      name: "Casual Linen Shirt",
      description: "Breathable linen shirt perfect for summer and casual outings",
      price: 1199,
      originalPrice: 1599,
      image: "/images/top10-1.jpg",
      images: ["/images/top10-1.jpg", "/images/top10-2.jpg", "/images/top10-3.jpg", "/images/top10-4.jpg"],
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Beige", "White", "Blue"],
      category: "tops",
      featured: false,
      stock: 11,
      fabric: "100% Linen",
      occasion: "Casual, Summer",
      care: "Machine Wash",
      delivery: "3-4 days",
      productCode: "TOP-LN-010"
    },
    {
      id: 11,
      name: "Sequined Party Top",
      description: "Sparkling sequined top perfect for parties and celebrations",
      price: 1599,
      originalPrice: 2199,
      image: "/images/top11-1.jpg",
      images: ["/images/top11-1.jpg", "/images/top11-2.jpg", "/images/top11-3.jpg", "/images/top11-4.jpg"],
      sizes: ["XS", "S", "M", "L"],
      colors: ["Silver", "Gold", "Black"],
      category: "tops",
      featured: true,
      stock: 6,
      fabric: "Net with Sequins",
      occasion: "Party, Celebration",
      care: "Dry Clean Only",
      delivery: "4-5 days",
      productCode: "TOP-SQ-011"
    },
    {
      id: 12,
      name: "Tie-Front Crop Top",
      description: "Cute crop top with tie-front detail for stylish looks",
      price: 749,
      originalPrice: 1099,
      image: "/images/top12-1.jpg",
      images: ["/images/top12-1.jpg", "/images/top12-2.jpg", "/images/top12-3.jpg", "/images/top12-4.jpg"],
      sizes: ["XS", "S", "M", "L"],
      colors: ["Pink", "Yellow", "Green"],
      category: "tops",
      featured: false,
      stock: 19,
      fabric: "Cotton Blend",
      occasion: "Casual, Party",
      care: "Machine Wash",
      delivery: "2-3 days",
      productCode: "TOP-TF-012"
    },
    {
      id: 13,
      name: "Oversized Denim Shirt",
      description: "Comfortable oversized denim shirt for layered looks",
      price: 1399,
      originalPrice: 1899,
      image: "/images/top13-1.jpg",
      images: ["/images/top13-1.jpg", "/images/top13-2.jpg", "/images/top13-3.jpg", "/images/top13-4.jpg"],
      sizes: ["S", "M", "L", "XL"],
      colors: ["Light Blue", "Dark Blue", "Black"],
      category: "tops",
      featured: false,
      stock: 13,
      fabric: "100% Cotton Denim",
      occasion: "Casual, Streetwear",
      care: "Machine Wash",
      delivery: "3-4 days",
      productCode: "TOP-OD-013"
    },
    {
      id: 14,
      name: "Bardot Neck Top",
      description: "Elegant bardot neck top for sophisticated evening looks",
      price: 1099,
      originalPrice: 1499,
      image: "/images/top14-1.jpg",
      images: ["/images/top14-1.jpg", "/images/top14-2.jpg", "/images/top14-3.jpg", "/images/top14-4.jpg"],
      sizes: ["XS", "S", "M", "L"],
      colors: ["Black", "Red", "Navy"],
      category: "tops",
      featured: true,
      stock: 9,
      fabric: "Crepe",
      occasion: "Party, Dinner",
      care: "Dry Clean Only",
      delivery: "3-4 days",
      productCode: "TOP-BN-014"
    },
    {
      id: 15,
      name: "Casual Hoodie",
      description: "Comfortable hoodie for casual everyday wear and lounging",
      price: 899,
      originalPrice: 1299,
      image: "/images/top15-1.jpg",
      images: ["/images/top15-1.jpg", "/images/top15-2.jpg", "/images/top15-3.jpg", "/images/top15-4.jpg"],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      colors: ["Grey", "Black", "Navy"],
      category: "tops",
      featured: false,
      stock: 24,
      fabric: "Cotton Fleece",
      occasion: "Casual, Sports",
      care: "Machine Wash",
      delivery: "2-3 days",
      productCode: "TOP-HD-015"
    },
    {
      id: 16,
      name: "Silk Camisole Top",
      description: "Luxurious silk camisole for elegant layering and special occasions",
      price: 1299,
      originalPrice: 1799,
      image: "/images/top16-1.jpg",
      images: ["/images/top16-1.jpg", "/images/top16-2.jpg", "/images/top16-3.jpg", "/images/top16-4.jpg"],
      sizes: ["XS", "S", "M", "L"],
      colors: ["Black", "Nude", "Burgundy"],
      category: "tops",
      featured: true,
      stock: 7,
      fabric: "Pure Silk",
      occasion: "Party, Evening",
      care: "Dry Clean Only",
      delivery: "4-5 days",
      productCode: "TOP-SC-016"
    },
    {
      id: 17,
      name: "Printed Kimono Sleeve Top",
      description: "Bohemian style top with kimono sleeves and ethnic prints",
      price: 949,
      originalPrice: 1349,
      image: "/images/top17-1.jpg",
      images: ["/images/top17-1.jpg", "/images/top17-2.jpg", "/images/top17-3.jpg", "/images/top17-4.jpg"],
      sizes: ["XS", "S", "M", "L"],
      colors: ["Multi Color", "Blue", "Red"],
      category: "tops",
      featured: false,
      stock: 17,
      fabric: "Rayon",
      occasion: "Casual, Festival",
      care: "Hand Wash",
      delivery: "3-4 days",
      productCode: "TOP-KS-017"
    },
    {
      id: 18,
      name: "Basic Tank Top",
      description: "Essential tank top for layering and casual summer wear",
      price: 399,
      originalPrice: 599,
      image: "/images/top18-1.jpg",
      images: ["/images/top18-1.jpg", "/images/top18-2.jpg", "/images/top18-3.jpg", "/images/top18-4.jpg"],
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["White", "Black", "Grey"],
      category: "tops",
      featured: false,
      stock: 30,
      fabric: "Cotton Jersey",
      occasion: "Casual, Everyday",
      care: "Machine Wash",
      delivery: "2-3 days",
      productCode: "TOP-TK-018"
    },
    {
      id: 19,
      name: "Embroidered Kurti Top",
      description: "Traditional kurti style top with modern embroidery",
      price: 1199,
      originalPrice: 1599,
      image: "/images/top19-1.jpg",
      images: ["/images/top19-1.jpg", "/images/top19-2.jpg", "/images/top19-3.jpg", "/images/top19-4.jpg"],
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Pink", "Blue", "Green"],
      category: "tops",
      featured: false,
      stock: 10,
      fabric: "Cotton with Embroidery",
      occasion: "Casual, Traditional",
      care: "Machine Wash",
      delivery: "3-4 days",
      productCode: "TOP-EK-019"
    },
    {
      id: 20,
      name: "Designer Asymmetric Top",
      description: "Fashion-forward asymmetric top with unique cut and design",
      price: 1399,
      originalPrice: 1899,
      image: "/images/top20-1.jpg",
      images: ["/images/top20-1.jpg", "/images/top20-2.jpg", "/images/top20-3.jpg", "/images/top20-4.jpg"],
      sizes: ["XS", "S", "M", "L"],
      colors: ["Black", "White", "Red"],
      category: "tops",
      featured: true,
      stock: 8,
      fabric: "Crepe",
      occasion: "Party, Fashion",
      care: "Dry Clean Only",
      delivery: "4-5 days",
      productCode: "TOP-AS-020"
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
            <h1 className="text-2xl font-light">Tops & Shirts</h1>
            <div className="w-8"></div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {topsProducts.map((product) => (
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
                          backgroundColor: color.toLowerCase().includes('white') ? '#ffffff' :
                                        color.toLowerCase().includes('black') ? '#000000' :
                                        color.toLowerCase().includes('navy') ? '#1e3a8a' :
                                        color.toLowerCase().includes('pink') ? '#ec4899' :
                                        color.toLowerCase().includes('yellow') ? '#facc15' :
                                        color.toLowerCase().includes('green') ? '#16a34a' :
                                        color.toLowerCase().includes('blue') ? '#0ea5e9' :
                                        color.toLowerCase().includes('red') ? '#dc2626' :
                                        color.toLowerCase().includes('royal blue') ? '#1e40af' :
                                        color.toLowerCase().includes('grey') ? '#6b7280' :
                                        color.toLowerCase().includes('peach') ? '#fb923c' :
                                        color.toLowerCase().includes('mint') ? '#34d399' :
                                        color.toLowerCase().includes('lavender') ? '#a78bfa' :
                                        color.toLowerCase().includes('burgundy') ? '#9d174d' :
                                        color.toLowerCase().includes('emerald') ? '#059669' :
                                        color.toLowerCase().includes('beige') ? '#d6d3d1' :
                                        color.toLowerCase().includes('silver') ? '#9ca3af' :
                                        color.toLowerCase().includes('gold') ? '#d97706' :
                                        color.toLowerCase().includes('nude') ? '#fef3c7' :
                                        color.toLowerCase().includes('multi') ? '#7c3aed' : '#ccc'
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