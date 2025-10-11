// app/sale/under-499/page.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Filter, SortAsc, Heart, ShoppingBag, Eye, Zap, Star, Clock, TrendingUp, Sparkles } from "lucide-react";

type Item = {
  id: string;
  name: string;
  image: string;
  price: number;
  mrp?: number;
  badge?: string;
  category?: string;
  rating?: number;
  reviews?: number;
  colors?: string[];
  sizes?: string[];
  stock?: number;
  bestselling?: boolean;
  new?: boolean;
};

const items: Item[] = [
  {
    id: "u499-1",
    name: "Basic Cotton T-Shirt",
    image: "/products/basic-tee.jpg",
    price: 299,
    mrp: 599,
    badge: "-50%",
    category: "Tops",
    rating: 4.3,
    reviews: 342,
    colors: ["#000000", "#6b7280", "#dc2626", "#3b82f6"],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 45,
    bestselling: true
  },
  {
    id: "u499-2",
    name: "Casual Tank Top",
    image: "/products/tank-top.jpg",
    price: 249,
    mrp: 499,
    category: "Tops",
    rating: 4.2,
    reviews: 189,
    colors: ["#ffffff", "#000000", "#ec4899"],
    sizes: ["S", "M", "L"],
    stock: 32
  },
  {
    id: "u499-3",
    name: "Essential Crew Neck",
    image: "/products/crew-neck.jpg",
    price: 349,
    mrp: 699,
    badge: "-50%",
    category: "Tops",
    rating: 4.5,
    reviews: 267,
    colors: ["#000000", "#374151", "#065f46"],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 28,
    bestselling: true
  },
  {
    id: "u499-4",
    name: "Comfy Lounge Shorts",
    image: "/products/lounge-shorts.jpg",
    price: 399,
    mrp: 799,
    badge: "-50%",
    category: "Bottomwear",
    rating: 4.4,
    reviews: 156,
    colors: ["#6b7280", "#000000", "#0ea5e9"],
    sizes: ["S", "M", "L"],
    stock: 21
  },
  {
    id: "u499-5",
    name: "Stretchy Leggings",
    image: "/products/leggings.jpg",
    price: 449,
    mrp: 899,
    badge: "-50%",
    category: "Bottomwear",
    rating: 4.6,
    reviews: 423,
    colors: ["#000000", "#6b7280", "#7e22ce"],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 38,
    bestselling: true
  },
  {
    id: "u499-6",
    name: "Casual Sleeveless Top",
    image: "/products/sleeveless-top.jpg",
    price: 279,
    mrp: 559,
    category: "Tops",
    rating: 4.1,
    reviews: 98,
    colors: ["#ffffff", "#f59e0b", "#84cc16"],
    sizes: ["S", "M", "L"],
    stock: 15,
    new: true
  },
  {
    id: "u499-7",
    name: "Cotton Blend Scarf",
    image: "/products/scarf.jpg",
    price: 199,
    mrp: 399,
    badge: "-50%",
    category: "Accessories",
    rating: 4.7,
    reviews: 234,
    colors: ["#7e22ce", "#0ea5e9", "#84cc16", "#f59e0b"],
    sizes: ["One Size"],
    stock: 67
  },
  {
    id: "u499-8",
    name: "Basic Beanie Hat",
    image: "/products/beanie.jpg",
    price: 149,
    mrp: 299,
    category: "Accessories",
    rating: 4.3,
    reviews: 178,
    colors: ["#000000", "#6b7280", "#dc2626"],
    sizes: ["One Size"],
    stock: 52,
    new: true
  },
  {
    id: "u499-9",
    name: "Everyday Socks (Pack of 3)",
    image: "/products/socks-pack.jpg",
    price: 179,
    mrp: 359,
    badge: "-50%",
    category: "Accessories",
    rating: 4.8,
    reviews: 512,
    colors: ["#ffffff", "#000000", "#3b82f6"],
    sizes: ["One Size"],
    stock: 89,
    bestselling: true
  },
  {
    id: "u499-10",
    name: "Simple Hair Accessories Set",
    image: "/products/hair-accessories.jpg",
    price: 99,
    mrp: 199,
    badge: "-50%",
    category: "Accessories",
    rating: 4.2,
    reviews: 167,
    colors: ["#000000", "#ec4899", "#8b5cf6"],
    sizes: ["One Size"],
    stock: 124
  },
  {
    id: "u499-11",
    name: "Cotton Wristbands (Set of 5)",
    image: "/products/wristbands.jpg",
    price: 129,
    mrp: 259,
    category: "Accessories",
    rating: 4.0,
    reviews: 89,
    colors: ["#000000", "#ffffff", "#dc2626"],
    sizes: ["One Size"],
    stock: 76
  },
  {
    id: "u499-12",
    name: "Basic Headband",
    image: "/products/headband.jpg",
    price: 79,
    mrp: 159,
    badge: "-50%",
    category: "Accessories",
    rating: 4.4,
    reviews: 203,
    colors: ["#000000", "#6b7280", "#f472b6"],
    sizes: ["One Size"],
    stock: 93
  }
];

export default function Under499Page() {
  const [sortBy, setSortBy] = useState("bestselling");
  const [filteredItems, setFilteredItems] = useState(items);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    let sorted = [...items];
    
    // Filter by category
    if (selectedCategory !== "all") {
      sorted = sorted.filter(item => item.category?.toLowerCase() === selectedCategory.toLowerCase());
    }
    
    // Sort items
    switch (sortBy) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "discount":
        sorted.sort((a, b) => {
          const discountA = a.mrp ? ((a.mrp - a.price) / a.mrp) * 100 : 0;
          const discountB = b.mrp ? ((b.mrp - b.price) / b.mrp) * 100 : 0;
          return discountB - discountA;
        });
        break;
      case "rating":
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "bestselling":
      default:
        // Bestselling first, then new, then by price
        sorted.sort((a, b) => {
          if (a.bestselling && !b.bestselling) return -1;
          if (!a.bestselling && b.bestselling) return 1;
          if (a.new && !b.new) return -1;
          if (!a.new && b.new) return 1;
          return a.price - b.price;
        });
    }
    
    setFilteredItems(sorted);
  }, [sortBy, selectedCategory]);

  const toggleWishlist = (id: string) => {
    setWishlist(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const categories = ["all", "Tops", "Bottomwear", "Accessories"];
  const totalSavings = items.reduce((sum, item) => 
    sum + (item.mrp && item.mrp > item.price ? item.mrp - item.price : 0), 0
  );
  const bestsellingItems = items.filter(item => item.bestselling).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Zap className="w-8 h-8" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">Under ₹499</h1>
            </div>
            <p className="text-xl opacity-95 mb-6 max-w-2xl mx-auto">
              Unbeatable deals on everyday essentials. Quality basics at pocket-friendly prices!
            </p>
            
            {/* Stats Bar */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold">{items.length}+</div>
                <div className="text-sm opacity-90">Essential Items</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">₹{totalSavings}</div>
                <div className="text-sm opacity-90">Total Savings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{bestsellingItems}</div>
                <div className="text-sm opacity-90">Bestsellers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">4.4★</div>
                <div className="text-sm opacity-90">Avg Rating</div>
              </div>
            </div>

            {/* Value Proposition */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 text-sm font-semibold">
                <Sparkles className="w-5 h-5" />
                Everyday Essentials • Premium Quality • Budget Prices
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-light text-gray-900 mb-2">
              Budget-Friendly Essentials
            </h2>
            <p className="text-gray-600">
              {filteredItems.length} amazing deals under ₹499 - Perfect for everyday wear!
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Category Filter */}
            <div className="flex items-center gap-3">
              <Filter className="w-4 h-4 text-orange-600" />
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-2xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Sort Options */}
            <div className="flex items-center gap-3">
              <SortAsc className="w-4 h-4 text-orange-600" />
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-2xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="bestselling">Bestselling</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Highest Discount</option>
                <option value="rating">Customer Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <ProductCard 
              key={item.id} 
              item={item} 
              isWishlisted={wishlist.includes(item.id)}
              onWishlistToggle={toggleWishlist}
            />
          ))}
        </div>

        {/* Value Features Section */}
        <div className="mt-16 bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <div className="text-center mb-12">
            <Zap className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h3 className="text-3xl font-light text-gray-900 mb-4">Why Shop Under ₹499?</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get premium quality basics without breaking the bank. Perfect for building your everyday wardrobe.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Premium Quality</h4>
              <p className="text-gray-600 text-sm">Same great quality as higher-priced items</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Best Value</h4>
              <p className="text-gray-600 text-sm">Maximum savings on everyday essentials</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Fast Shipping</h4>
              <p className="text-gray-600 text-sm">Quick delivery on all orders</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Easy Returns</h4>
              <p className="text-gray-600 text-sm">30-day hassle-free returns</p>
            </div>
          </div>
        </div>

        {/* Bundle Deal Section */}
        <div className="mt-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-8 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">🚀 Bundle & Save More!</h3>
            <p className="text-orange-100 mb-6">
              Buy any 3 items and get extra 10% OFF + Free Shipping!
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <div className="bg-white/20 px-4 py-2 rounded-lg">Mix & Match</div>
              <div className="bg-white/20 px-4 py-2 rounded-lg">All Categories</div>
              <div className="bg-white/20 px-4 py-2 rounded-lg">No Minimum</div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-2xl font-light text-gray-900 mb-4">
              Build Your Perfect Wardrobe
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Start with these affordable basics and build your style foundation. Quality pieces that won't break the bank.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/sale/under-999"
                className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-xl transition-all duration-300"
              >
                Explore Under ₹999
              </Link>
              <Link
                href="/western/tops"
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-2xl font-semibold hover:border-gray-400 transition-all duration-300"
              >
                Browse All Tops
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ 
  item, 
  isWishlisted, 
  onWishlistToggle 
}: { 
  item: Item; 
  isWishlisted: boolean;
  onWishlistToggle: (id: string) => void;
}) {
  const { id, name, image, price, mrp, badge, category, rating, reviews, colors, sizes, stock, bestselling, new: isNew } = item;
  
  const discount = mrp ? Math.round(((mrp - price) / mrp) * 100) : 0;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onWishlistToggle(id);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Quick add to cart functionality
    console.log("Quick add:", name);
  };

  return (
    <Link
      href={`/product/${encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'))}`}
      className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
    >
      {/* Bestseller Badge */}
      {bestselling && (
        <div className="absolute top-3 left-3 z-10">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            🔥 BESTSELLER
          </div>
        </div>
      )}

      {/* New Badge */}
      {isNew && (
        <div className="absolute top-3 left-3 z-10">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            🆕 NEW
          </div>
        </div>
      )}

      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <Image
          src={image || "/images/product-1.jpg"}
          alt={name}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/images/product-1.jpg";
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        
        {/* Discount Badge */}
        {badge && (
          <span className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            {badge}
          </span>
        )}

        {/* Stock Alert */}
        {stock && stock < 20 && (
          <span className="absolute top-12 right-3 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            Selling Fast!
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-14 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
            isWishlisted 
              ? 'bg-red-500 text-white transform scale-110' 
              : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white hover:scale-110'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Actions */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
          <div className="flex gap-2">
            <button 
              onClick={handleQuickAdd}
              className="flex-1 bg-gray-900 text-white py-3 px-4 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Quick Add
            </button>
            <button className="w-12 h-12 bg-white border border-gray-300 rounded-xl flex items-center justify-center hover:border-gray-400 transition-colors">
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Category */}
        {category && (
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2 block">
            {category}
          </span>
        )}
        
        {/* Name */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors">
          {name}
        </h3>

        {/* Rating */}
        {rating && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-gray-900">{rating}</span>
            </div>
            {reviews && (
              <span className="text-xs text-gray-500">({reviews})</span>
            )}
          </div>
        )}

        {/* Price - Emphasized for budget section */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-xl font-bold text-gray-900">₹{price.toLocaleString()}</span>
          {mrp && mrp > price && (
            <>
              <span className="text-lg text-gray-500 line-through">₹{mrp.toLocaleString()}</span>
              <span className="ml-auto text-sm font-bold text-green-600">
                Save ₹{(mrp - price).toLocaleString()}
              </span>
            </>
          )}
        </div>

        {/* Budget Value Badge */}
        {price < 300 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-2 text-center mb-3">
            <span className="text-sm font-bold text-green-700">
              💰 Super Saver Deal!
            </span>
          </div>
        )}

        {/* Color Options */}
        {colors && colors.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Colors:</span>
            <div className="flex gap-1">
              {colors.slice(0, 4).map((color, index) => (
                <div
                  key={index}
                  className="w-3 h-3 rounded-full border border-gray-300"
                  style={{ backgroundColor: color }}
                />
              ))}
              {colors.length > 4 && (
                <span className="text-xs text-gray-500">+{colors.length - 4}</span>
              )}
            </div>
          </div>
        )}

        {/* Size Options */}
        {sizes && sizes.length > 1 && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-gray-500">Sizes:</span>
            <div className="flex gap-1">
              {sizes.slice(0, 3).map((size, index) => (
                <span key={index} className="text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                  {size}
                </span>
              ))}
              {sizes.length > 3 && (
                <span className="text-xs text-gray-500">+{sizes.length - 3}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}