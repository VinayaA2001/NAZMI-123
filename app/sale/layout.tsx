"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Tag, Clock, Zap, Star, ArrowRight, Sparkles, Crown, TrendingUp, ShoppingBag } from "lucide-react";

const categories = [
  {
    title: "LAST CHANCE",
    subtitle: "Final clearance - Up to 70% OFF",
    description: "Don't miss out on these amazing deals. Limited stock available!",
    href: "/sale/last-chance",
    image: "/images/sale-lastchance.jpg",
    icon: Clock,
    gradient: "from-red-500 to-orange-500",
    badge: "Limited Stock",
    items: 23,
    timeLeft: "2 days left",
    exclusive: true
  },
  {
    title: "SALE UNDER ₹999",
    subtitle: "Budget-friendly fashion steals",
    description: "Premium quality at unbelievable prices. Perfect for everyday wear.",
    href: "/sale/under-999",
    image: "/images/sale-999.jpg",
    icon: Zap,
    gradient: "from-green-500 to-emerald-500",
    badge: "Most Popular",
    items: 47,
    discount: "Up to 60% OFF",
    trending: true
  },
  {
    title: "SALE UNDER ₹1499",
    subtitle: "Premium deals at amazing prices",
    description: "Elevate your style without breaking the bank. Luxury within reach.",
    href: "/sale/under-1499",
    image: "/images/sale-1499.jpg",
    icon: Star,
    gradient: "from-purple-500 to-pink-500",
    badge: "Best Value",
    items: 34,
    discount: "Up to 50% OFF",
    value: true
  },
];

export default function SaleLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isIndex = pathname === "/sale";
  const [isVisible, setIsVisible] = useState(false);
  const [activeNav, setActiveNav] = useState(pathname);

  useEffect(() => {
    setIsVisible(true);
    setActiveNav(pathname);
  }, [pathname]);

  const navigationItems = [
    { href: "/sale/last-chance", label: "Last Chance", icon: Clock },
    { href: "/sale/under-999", label: "Under ₹999", icon: Zap },
    { href: "/sale/under-1499", label: "Under ₹1499", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Premium Header Section */}
      <section className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="text-center space-y-4">
            {/* Premium Header with Icon */}
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl shadow-lg">
                <Tag className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-2">
                  Sale Collections
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Discover incredible deals and exclusive discounts across all categories. 
                  Limited time offers with premium quality guaranteed.
                </p>
              </div>
            </div>

            {/* Promo Banner */}
            <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-4 text-white max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-3">
                <Sparkles className="w-5 h-5" />
                <span className="font-semibold">EXTRA 15% OFF</span>
                <span className="text-sm">Use code: <strong>SALE2024</strong></span>
                <Sparkles className="w-5 h-5" />
              </div>
            </div>

            {/* Professional Sub Navigation */}
            {!isIndex && (
              <nav className="flex flex-wrap justify-center gap-3 pt-6">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeNav === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 ${
                        isActive
                          ? "bg-gradient-to-r from-gray-900 to-gray-700 text-white shadow-lg"
                          : "bg-white text-gray-700 border border-gray-200 hover:shadow-lg hover:border-gray-300"
                      }`}
                      onClick={() => setActiveNav(item.href)}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Premium Category Cards - Only on /sale */}
        {isIndex && (
          <div className={`mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gray-100 px-6 py-3 rounded-full mb-6">
                <Crown className="w-5 h-5 text-amber-500" />
                <span className="text-sm font-semibold text-gray-700">CURATED COLLECTIONS</span>
              </div>
              <h2 className="text-3xl font-light text-gray-900 mb-4">
                Explore Premium Deals
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Handpicked collections designed to elevate your wardrobe with exceptional value
              </p>
            </div>

            {/* Enhanced Category Grid */}
            <div className="grid gap-8 lg:grid-cols-3">
              {categories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <Link
                    key={category.href}
                    href={category.href}
                    className="group relative block overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    {/* Image Container */}
                    <div className="relative h-80">
                      <Image
                        src={category.image}
                        alt={category.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        priority
                      />
                      
                      {/* Gradient Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-colors duration-500`} />
                      
                      {/* Animated Border */}
                      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}>
                        <div className="absolute inset-[2px] rounded-3xl bg-black/90"></div>
                      </div>

                      {/* Exclusive Badge */}
                      {category.exclusive && (
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-3 py-1 rounded-full text-xs font-bold rotate-[-5deg] shadow-lg">
                          EXCLUSIVE
                        </div>
                      )}
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
                      {/* Top Section */}
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-2">
                          <span className={`bg-gradient-to-r ${category.gradient} px-3 py-1.5 rounded-xl text-sm font-bold shadow-lg backdrop-blur-sm`}>
                            {category.badge}
                          </span>
                          {category.timeLeft && (
                            <span className="bg-red-600 px-2 py-1 rounded-full text-xs font-medium animate-pulse">
                              ⏰ {category.timeLeft}
                            </span>
                          )}
                        </div>
                        <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl group-hover:scale-110 transition-transform duration-300">
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>

                      {/* Middle Section */}
                      <div className="text-center">
                        <h2 className="text-xl font-bold mb-2 tracking-wide group-hover:translate-x-1 transition-transform duration-300">
                          {category.title}
                        </h2>
                        <p className="text-gray-200 text-sm mb-1 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-200">
                          {category.subtitle}
                        </p>
                        <p className="text-gray-300 text-xs opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-300">
                          {category.description}
                        </p>
                      </div>

                      {/* Bottom Section */}
                      <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-400">
                        <div className="text-xs">
                          <span className="font-semibold">{category.items}+ Items</span>
                          {category.discount && (
                            <span className="block text-green-300 font-bold text-xs">{category.discount}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-xl text-sm font-semibold hover:bg-white/30 transition-colors group-hover:scale-105">
                          Shop Now
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Trust Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Free Shipping</h4>
                <p className="text-sm text-gray-600">Above ₹1999</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Best Prices</h4>
                <p className="text-sm text-gray-600">Guaranteed</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Premium Quality</h4>
                <p className="text-sm text-gray-600">Curated Items</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Easy Returns</h4>
                <p className="text-sm text-gray-600">30 Days Policy</p>
              </div>
            </div>
          </div>
        )}

        {/* Child Page Content */}
        <div className={isIndex ? '' : 'animate-fade-in'}>
          {children}
        </div>

        {/* Bottom CTA for Subpages */}
        {!isIndex && (
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-gray-900 to-gray-700 rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-light mb-4">Explore More Deals</h3>
              <p className="text-gray-300 mb-6 max-w-md mx-auto">
                Discover amazing offers across all our sale categories
              </p>
              <Link
                href="/sale"
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Back to All Sales
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}