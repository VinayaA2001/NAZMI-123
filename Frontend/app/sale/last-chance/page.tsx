// app/sale/last-chance/page.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Clock, Heart, ShoppingBag, Eye, Zap, TrendingDown, AlertTriangle, Star } from "lucide-react";

type Item = {
  id: string;
  name: string;
  image: string;
  price: number;
  mrp?: number;
  badge?: string;
  stock?: number;
  category?: string;
  rating?: number;
  reviews?: number;
  colors?: string[];
  sizes?: string[];
  exclusive?: boolean;
};

const items: Item[] = [
  {
    id: "lc-1",
    name: "Premium Satin Wrap Dress",
    image: "/products/lastchance-wrap-dress.jpg",
    price: 1099,
    mrp: 1899,
    badge: "-42%",
    stock: 3,
    category: "Dresses",
    rating: 4.8,
    reviews: 124,
    colors: ["#ef4444", "#3b82f6", "#10b981"],
    sizes: ["S", "M", "L"],
    exclusive: true
  },
  {
    id: "lc-2",
    name: "Embroidered Designer Kurti",
    image: "/products/lastchance-embro-kurti.jpg",
    price: 999,
    mrp: 1499,
    badge: "Last Few",
    stock: 5,
    category: "Kurtis",
    rating: 4.6,
    reviews: 89,
    colors: ["#8b5cf6", "#ec4899", "#f59e0b"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "lc-3",
    name: "Elegant Pleated Midi Skirt",
    image: "/products/lastchance-pleated-midi.jpg",
    price: 899,
    mrp: 1299,
    stock: 2,
    category: "Skirts",
    rating: 4.7,
    reviews: 67,
    colors: ["#000000", "#6b7280", "#dc2626"],
    sizes: ["XS", "S", "M"]
  },
  {
    id: "lc-4",
    name: "Chiffon Ruffle Blouse",
    image: "/images/top1.png",
    price: 749,
    mrp: 1099,
    category: "Tops",
    rating: 4.5,
    reviews: 203,
    colors: ["#ffffff", "#f472b6", "#a855f7"],
    sizes: ["S", "M", "L"],
    exclusive: true
  },
  {
    id: "lc-5",
    name: "Bohemian Maxi Dress",
    image: "/products/lastchance-boho-maxi.jpg",
    price: 1199,
    mrp: 1999,
    badge: "-40%",
    category: "Dresses",
    rating: 4.9,
    reviews: 156,
    colors: ["#84cc16", "#f59e0b", "#ec4899"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "lc-6",
    name: "Designer Denim Shirt Dress",
    image: "/products/lastchance-denim-shirt.jpg",
    price: 999,
    mrp: 1599,
    category: "Dresses",
    rating: 4.4,
    reviews: 78,
    colors: ["#1e40af", "#000000", "#374151"],
    sizes: ["S", "M", "L"]
  },
  {
    id: "lc-7",
    name: "Silk Blend Evening Gown",
    image: "/products/lastchance-silk-gown.jpg",
    price: 1999,
    mrp: 3499,
    badge: "-43%",
    stock: 1,
    category: "Dresses",
    rating: 4.9,
    reviews: 45,
    colors: ["#7e22ce", "#000000"],
    sizes: ["S", "M"],
    exclusive: true
  },
  {
    id: "lc-8",
    name: "Casual Linen Jumpsuit",
    image: "/products/lastchance-linen-jumpsuit.jpg",
    price: 1299,
    mrp: 2199,
    stock: 4,
    category: "Jumpsuits",
    rating: 4.6,
    reviews: 112,
    colors: ["#fef3c7", "#6b7280", "#065f46"],
    sizes: ["S", "M", "L"]
  }
];

export default function LastChancePage() {
  const [sortBy, setSortBy] = useState("recommended");
  const [filteredItems, setFilteredItems] = useState(items);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    let sorted = [...items];
    
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
      default:
        // Recommended - stock urgency first
        sorted.sort((a, b) => (a.stock || 999) - (b.stock || 999));
    }
    
    setFilteredItems(sorted);
  }, [sortBy]);

  const toggleWishlist = (id: string) => {
    setWishlist(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const totalSavings = items.reduce((sum, item) => 
    sum + (item.mrp && item.mrp > item.price ? item.mrp - item.price : 0), 0
  );

  const lowStockItems = items.filter(item => item.stock && item.stock <= 5).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-orange-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Clock className="w-8 h-8" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">Last Chance</h1>
            </div>
            <p className="text-xl opacity-95 mb-6 max-w-2xl mx-auto">
              Final opportunity to grab these premium pieces. Once they're gone, they're gone forever!
            </p>
            
            {/* Stats Bar */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold">{lowStockItems}</div>
                <div className="text-sm opacity-90">Low Stock Items</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">₹{totalSavings}</div>
                <div className="text-sm opacity-90">Total Savings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{items.length}</div>
                <div className="text-sm opacity-90">Exclusive Pieces</div>
              </div>
            </div>

            {/* Urgency Alert */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 text-sm font-semibold">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
                Limited Stock Alert - Don't miss out on these final pieces!
                <TrendingDown className="w-5 h-5 animate-pulse" />
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
              Final Clearance Items
            </h2>
            <p className="text-gray-600">
              {items.length} premium pieces available for final purchase
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 font-medium">Sort by:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-2xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="discount">Highest Discount</option>
              <option value="rating">Customer Rating</option>
            </select>
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

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-light text-gray-900 mb-4">
              Running Out of Time!
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              These items are in high demand and won't be restocked. Secure your favorites before they disappear.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/sale/under-999"
                className="bg-gradient-to-r from-gray-900 to-gray-700 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-xl transition-all duration-300"
              >
                Explore More Deals
              </Link>
              <Link
                href="/western"
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-2xl font-semibold hover:border-gray-400 transition-all duration-300"
              >
                Browse New Arrivals
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
  const { id, name, image, price, mrp, badge, stock, category, rating, reviews, colors, sizes, exclusive } = item;
  
  const discount = mrp ? Math.round(((mrp - price) / mrp) * 100) : 0;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onWishlistToggle(id);
  };

  return (
    <Link
      href={`/product/${encodeURIComponent(id)}`}
      className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {exclusive && (
            <span className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              ⭐ EXCLUSIVE
            </span>
          )}
          {badge && (
            <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              {badge}
            </span>
          )}
        </div>

        {/* Stock Alert */}
        {stock && stock <= 5 && (
          <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
            🔥 Only {stock} left
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
            <button className="flex-1 bg-gray-900 text-white py-3 px-4 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
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
              <span className="text-xs text-gray-500">({reviews} reviews)</span>
            )}
          </div>
        )}

        {/* Price */}
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

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-2 text-center mb-3">
            <span className="text-sm font-bold text-green-700">
              {discount}% OFF • Amazing Deal!
            </span>
          </div>
        )}

        {/* Color Options */}
        {colors && colors.length > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-gray-500">Colors:</span>
            <div className="flex gap-1">
              {colors.slice(0, 3).map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: color }}
                />
              ))}
              {colors.length > 3 && (
                <span className="text-xs text-gray-500">+{colors.length - 3}</span>
              )}
            </div>
          </div>
        )}

        {/* Size Options */}
        {sizes && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Sizes:</span>
            <div className="flex gap-1">
              {sizes.slice(0, 3).map((size, index) => (
                <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
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