// app/sale/under-1499/page.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Filter, SortAsc, Heart, ShoppingBag, Eye, Crown, Star, Gem, TrendingUp, Zap } from "lucide-react";

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
  premium?: boolean;
  featured?: boolean;
};

const items: Item[] = [
  {
    id: "u1499-1",
    name: "Designer Floral Midi Dress",
    image: "/products/summer-midi.jpg",
    price: 1299,
    mrp: 1899,
    badge: "-32%",
    category: "Dresses",
    rating: 4.8,
    reviews: 156,
    colors: ["#ec4899", "#8b5cf6", "#10b981"],
    sizes: ["S", "M", "L"],
    stock: 8,
    premium: true,
    featured: true
  },
  {
    id: "u1499-2",
    name: "Bohemian Kurti Set",
    image: "/products/floral-a-line.jpg",
    price: 1199,
    mrp: 1699,
    category: "Kurtis",
    rating: 4.7,
    reviews: 89,
    colors: ["#7e22ce", "#0ea5e9", "#84cc16"],
    sizes: ["S", "M", "L", "XL"],
    stock: 12,
    premium: true
  },
  {
    id: "u1499-3",
    name: "Designer Puff-Sleeve Blouse",
    image: "/products/chic-puff.jpg",
    price: 999,
    mrp: 1299,
    badge: "Hot",
    category: "Tops",
    rating: 4.6,
    reviews: 203,
    colors: ["#ffffff", "#f59e0b", "#3b82f6"],
    sizes: ["XS", "S", "M", "L"],
    stock: 15
  },
  {
    id: "u1499-4",
    name: "Premium Denim Overshirt",
    image: "/products/denim-overshirt.jpg",
    price: 1449,
    mrp: 1899,
    category: "Outerwear",
    rating: 4.5,
    reviews: 78,
    colors: ["#1e40af", "#000000", "#374151"],
    sizes: ["S", "M", "L", "XL"],
    stock: 6,
    premium: true
  },
  {
    id: "u1499-5",
    name: "Printed Palazzo Set",
    image: "/products/printed-palazzo.jpg",
    price: 1099,
    mrp: 1499,
    category: "Bottomwear",
    rating: 4.4,
    reviews: 112,
    colors: ["#7e22ce", "#0ea5e9", "#84cc16"],
    sizes: ["S", "M", "L"],
    stock: 10
  },
  {
    id: "u1499-6",
    name: "Premium Cotton Collection Tee",
    image: "/products/everyday-tee.jpg",
    price: 749,
    mrp: 999,
    category: "Tops",
    rating: 4.3,
    reviews: 267,
    colors: ["#000000", "#6b7280", "#dc2626"],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 25
  },
  {
    id: "u1499-7",
    name: "Silk Blend Evening Top",
    image: "/products/silk-evening-top.jpg",
    price: 1399,
    mrp: 1999,
    badge: "-30%",
    category: "Tops",
    rating: 4.9,
    reviews: 45,
    colors: ["#ffffff", "#f472b6", "#a855f7"],
    sizes: ["S", "M", "L"],
    stock: 5,
    premium: true,
    featured: true
  },
  {
    id: "u1499-8",
    name: "Designer Linen Jumpsuit",
    image: "/products/linen-jumpsuit.jpg",
    price: 1499,
    mrp: 2199,
    badge: "-32%",
    category: "Jumpsuits",
    rating: 4.7,
    reviews: 67,
    colors: ["#fef3c7", "#6b7280", "#065f46"],
    sizes: ["S", "M", "L"],
    stock: 7,
    premium: true
  }
];

export default function Under1499Page() {
  const [sortBy, setSortBy] = useState("premium");
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
      case "premium":
      default:
        // Premium first, then featured, then by discount
        sorted.sort((a, b) => {
          if (a.premium && !b.premium) return -1;
          if (!a.premium && b.premium) return 1;
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          const discountA = a.mrp ? ((a.mrp - a.price) / a.mrp) * 100 : 0;
          const discountB = b.mrp ? ((b.mrp - b.price) / b.mrp) * 100 : 0;
          return discountB - discountA;
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

  const categories = ["all", "Dresses", "Tops", "Kurtis", "Outerwear", "Bottomwear", "Jumpsuits"];
  const totalSavings = items.reduce((sum, item) => 
    sum + (item.mrp && item.mrp > item.price ? item.mrp - item.price : 0), 0
  );
  const premiumItems = items.filter(item => item.premium).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-3xl">
                <Crown className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-5xl md:text-6xl font-bold mb-2">Under ₹1499</h1>
                <p className="text-xl opacity-95">Where Premium Meets Affordable</p>
              </div>
            </div>
            
            {/* Stats Bar */}
            <div className="flex flex-wrap justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold">{items.length}</div>
                <div className="text-sm opacity-90">Premium Pieces</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{premiumItems}</div>
                <div className="text-sm opacity-90">Designer Items</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">₹{totalSavings}</div>
                <div className="text-sm opacity-90">Total Savings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">4.7★</div>
                <div className="text-sm opacity-90">Avg Rating</div>
              </div>
            </div>

            {/* Value Proposition */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto border border-white/30">
              <div className="flex items-center justify-center gap-4 text-lg font-semibold">
                <Gem className="w-6 h-6" />
                Premium Quality • Designer Styles • Unbeatable Prices
                <TrendingUp className="w-6 h-6" />
              </div>
              <p className="text-white/90 mt-3 text-sm">
                Experience luxury fashion at accessible prices. Premium fabrics, designer details, and exceptional craftsmanship.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
          <div className="flex-1">
            <h2 className="text-3xl font-light text-gray-900 mb-3">
              Premium Fashion Collection
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl">
              Discover designer-quality pieces with premium fabrics and exceptional craftsmanship, all under ₹1499.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Category Filter */}
            <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200">
              <Filter className="w-5 h-5 text-purple-600" />
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent text-sm focus:outline-none focus:ring-0 border-0"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Sort Options */}
            <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200">
              <SortAsc className="w-5 h-5 text-purple-600" />
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-sm focus:outline-none focus:ring-0 border-0"
              >
                <option value="premium">Premium First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Highest Discount</option>
                <option value="rating">Customer Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredItems.map((item) => (
            <ProductCard 
              key={item.id} 
              item={item} 
              isWishlisted={wishlist.includes(item.id)}
              onWishlistToggle={toggleWishlist}
            />
          ))}
        </div>

        {/* Premium Features Section */}
        <div className="mt-20 bg-white rounded-3xl p-12 shadow-xl border border-gray-100">
          <div className="text-center mb-12">
            <Crown className="w-16 h-16 text-purple-600 mx-auto mb-4" />
            <h3 className="text-3xl font-light text-gray-900 mb-4">Why Choose Premium Under ₹1499?</h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Experience luxury without the luxury price tag. Our collection combines premium quality with exceptional value.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-purple-100 rounded-3xl flex items-center justify-center mb-6">
                <Gem className="w-10 h-10 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-3">Premium Fabrics</h4>
              <p className="text-gray-600 text-sm">Luxury materials like silk, linen, and premium cotton</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-pink-100 rounded-3xl flex items-center justify-center mb-6">
                <Star className="w-10 h-10 text-pink-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-3">Designer Details</h4>
              <p className="text-gray-600 text-sm">Handcrafted embroidery and premium finishes</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center mb-6">
                <TrendingUp className="w-10 h-10 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-3">Exceptional Value</h4>
              <p className="text-gray-600 text-sm">Premium quality at 50-70% below retail prices</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center mb-6">
                <Zap className="w-10 h-10 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-3">Fast Shipping</h4>
              <p className="text-gray-600 text-sm">Free delivery on orders above ₹1999</p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-12 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
              <div className="absolute bottom-10 right-10 w-24 h-24 bg-white rounded-full"></div>
            </div>
            
            <div className="relative z-10">
              <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
              <h3 className="text-3xl font-light mb-4">
                Ready to Elevate Your Style?
              </h3>
              <p className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of fashion lovers who've discovered the perfect blend of luxury and affordability.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/sale/last-chance"
                  className="bg-white text-purple-700 px-10 py-4 rounded-2xl font-semibold hover:bg-purple-50 transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
                >
                  Explore Last Chance Items
                </Link>
                <Link
                  href="/western"
                  className="border-2 border-white text-white px-10 py-4 rounded-2xl font-semibold hover:bg-white hover:text-purple-700 transition-all duration-300"
                >
                  Browse All Collections
                </Link>
              </div>
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
  const { id, name, image, price, mrp, badge, category, rating, reviews, colors, sizes, stock, premium, featured } = item;
  
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
      className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100"
    >
      {/* Premium Crown Badge */}
      {premium && (
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1">
            <Crown className="w-3 h-3" />
            PREMIUM
          </div>
        </div>
      )}

      {/* Featured Ribbon */}
      {featured && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            ⭐ FEATURED
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        
        {/* Discount Badge */}
        {badge && (
          <span className="absolute top-16 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
            {badge}
          </span>
        )}

        {/* Stock Alert */}
        {stock && stock < 10 && (
          <span className="absolute top-28 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
            Only {stock} left
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-4 right-16 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
            isWishlisted 
              ? 'bg-red-500 text-white transform scale-110 shadow-lg' 
              : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white hover:scale-110 hover:shadow-lg'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Actions */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
          <div className="flex gap-2">
            <button 
              onClick={handleQuickAdd}
              className="flex-1 bg-gray-900 text-white py-3 px-4 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <ShoppingBag className="w-4 h-4" />
              Quick Add
            </button>
            <button className="w-12 h-12 bg-white border border-gray-300 rounded-xl flex items-center justify-center hover:border-gray-400 transition-colors shadow-lg">
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        {/* Category */}
        {category && (
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2 block">
            {category}
          </span>
        )}
        
        {/* Name */}
        <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors text-lg leading-tight">
          {name}
        </h3>

        {/* Rating */}
        {rating && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-gray-900">{rating}</span>
            </div>
            {reviews && (
              <span className="text-xs text-gray-500">({reviews} reviews)</span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-2xl font-bold text-gray-900">₹{price.toLocaleString()}</span>
          {mrp && mrp > price && (
            <>
              <span className="text-lg text-gray-500 line-through">₹{mrp.toLocaleString()}</span>
              <span className="ml-auto text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                Save ₹{(mrp - price).toLocaleString()}
              </span>
            </>
          )}
        </div>

        {/* Premium Value Badge */}
        {premium && discount > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-3 text-center mb-3">
            <span className="text-sm font-bold text-purple-700">
              💎 Premium Quality • {discount}% OFF
            </span>
          </div>
        )}

        {/* Color Options */}
        {colors && colors.length > 0 && (
          <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">Colors:</span>
            <div className="flex gap-1">
              {colors.slice(0, 4).map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border border-gray-300 shadow-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
              {colors.length > 4 && (
                <span className="text-xs text-gray-500">+{colors.length - 4}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}