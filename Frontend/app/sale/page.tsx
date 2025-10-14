// app/sale/page.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Clock, Zap, Star, Tag, ArrowRight, ShoppingBag, Heart, Sparkles, Crown, Gem, TrendingUp, Users, Award, CheckCircle } from "lucide-react";

export default function SalePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 12,
    minutes: 45,
    seconds: 30
  });
  const [activeCategory, setActiveCategory] = useState("all");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const { days, hours, minutes, seconds } = prev;
        if (seconds > 0) return { ...prev, seconds: seconds - 1 };
        if (minutes > 0) return { ...prev, minutes: minutes - 1, seconds: 59 };
        if (hours > 0) return { ...prev, hours: hours - 1, minutes: 59, seconds: 59 };
        if (days > 0) return { ...prev, days: days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    // Scroll progress
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', updateScrollProgress);
    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', updateScrollProgress);
    };
  }, []);

  const saleCategories = [
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
      exclusive: true,
      premium: true
    },
    {
      title: "LUXURY FINDS",
      subtitle: "Premium designer pieces",
      description: "High-end fashion at unprecedented prices. Luxury redefined.",
      href: "/sale/luxury",
      image: "/images/sale-luxury.jpg",
      icon: Crown,
      gradient: "from-amber-500 to-yellow-500",
      badge: "Premium",
      items: 15,
      discount: "Up to 60% OFF",
      exclusive: true,
      premium: true
    },
    {
      title: "UNDER ₹999",
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
      title: "UNDER ₹1499",
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

  const featuredDeals = [
    {
      id: 1,
      name: "Designer Silk Summer Dress",
      price: 799,
      originalPrice: 2999,
      image: "/images/featured-1.jpg",
      category: "under-999",
      rating: 4.8,
      sold: 124,
      exclusive: true,
      tags: ["Bestseller", "Limited"]
    },
    {
      id: 2,
      name: "Premium Denim Jacket",
      price: 1299,
      originalPrice: 3599,
      image: "/images/featured-2.jpg",
      category: "under-1499",
      rating: 4.6,
      sold: 89,
      trending: true,
      tags: ["Trending", "Premium"]
    },
    {
      id: 3,
      name: "Evening Party Wear Top",
      price: 599,
      originalPrice: 1899,
      image: "/images/featured-3.jpg",
      category: "under-999",
      rating: 4.9,
      sold: 156,
      tags: ["New", "Popular"]
    },
    {
      id: 4,
      name: "Designer Leather Handbag",
      price: 1999,
      originalPrice: 4999,
      image: "/images/featured-4.jpg",
      category: "luxury",
      rating: 4.7,
      sold: 67,
      premium: true,
      tags: ["Luxury", "Exclusive"]
    }
  ];

  const stats = [
    { number: "10K+", label: "Happy Customers", icon: Users },
    { number: "95%", label: "Positive Reviews", icon: Star },
    { number: "48H", label: "Fast Delivery", icon: Zap },
    { number: "30D", label: "Easy Returns", icon: CheckCircle }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Fashion Blogger",
      comment: "The quality is exceptional for the price! My entire wardrobe is from here.",
      rating: 5,
      image: "/images/testimonial-1.jpg"
    },
    {
      name: "Rohan Mehta",
      role: "Regular Customer",
      comment: "Best deals I've ever found online. The luxury collection is unbelievable!",
      rating: 5,
      image: "/images/testimonial-2.jpg"
    },
    {
      name: "Ananya Patel",
      role: "Style Influencer",
      comment: "From casual to luxury, they have it all. My go-to for premium fashion.",
      rating: 5,
      image: "/images/testimonial-3.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating CTA */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 rounded-2xl shadow-2xl animate-bounce">
          <div className="text-center">
            <p className="text-sm font-bold">FLASH SALE</p>
            <p className="text-xs">Extra 15% OFF</p>
          </div>
        </div>
      </div>

      {/* Premium Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white max-w-6xl mx-auto">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-full mb-8">
              <Crown className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-semibold">PREMIUM BOUTIQUE COLLECTION</span>
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </div>

            <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight bg-gradient-to-r from-white via-yellow-100 to-orange-200 bg-clip-text text-transparent">
              ELEVATED
              <br />
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">SALE</span>
            </h1>

            <p className="text-xl md:text-2xl mb-8 opacity-90 font-light max-w-3xl mx-auto leading-relaxed">
              Experience luxury redefined. Curated designer pieces at unprecedented prices. 
              Where exceptional quality meets extraordinary value.
            </p>

            {/* Countdown Timer */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 inline-block border border-white/20">
              <p className="text-sm font-medium mb-4 opacity-90">OFFER ENDS IN</p>
              <div className="flex gap-4 justify-center">
                {Object.entries(timeLeft).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 w-16">
                      <span className="text-2xl font-bold">{value.toString().padStart(2, '0')}</span>
                    </div>
                    <span className="text-xs mt-2 block capitalize opacity-80">{key}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="#categories"
                className="group bg-gradient-to-r from-orange-500 to-red-500 text-white px-12 py-4 rounded-2xl font-semibold text-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 flex items-center gap-3"
              >
                <Sparkles className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                EXPLORE COLLECTION
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link
                href="/sale/last-chance"
                className="group border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm"
              >
                LAST CHANCE ITEMS
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 mt-12 opacity-80">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <Icon className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
                    <div className="text-2xl font-bold">{stat.number}</div>
                    <div className="text-sm opacity-90">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Premium Categories Grid */}
      <section id="categories" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-200 px-6 py-3 rounded-full mb-6">
              <Gem className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-semibold text-gray-700">CURATED COLLECTIONS</span>
            </div>
            <h2 className="text-5xl font-light text-gray-900 mb-6">
              Discover Your Style
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Handpicked collections designed to elevate your wardrobe. From everyday essentials to statement pieces.
            </p>
          </div>

          <div className={`grid gap-8 lg:grid-cols-2 xl:grid-cols-4 mb-20 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            {saleCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.href}
                  href={category.href}
                  className="group relative block overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:-translate-y-4"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {/* Premium Background */}
                  <div className="relative h-96">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      priority
                    />
                    
                    {/* Premium Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent group-hover:from-black/95 transition-colors duration-500`} />
                    
                    {/* Animated Border */}
                    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}>
                      <div className="absolute inset-[3px] rounded-3xl bg-black/95 backdrop-blur-sm"></div>
                    </div>

                    {/* Exclusive Ribbon */}
                    {category.exclusive && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-4 py-2 rounded-full text-sm font-bold rotate-[-5deg] shadow-lg z-10">
                        ⭐ EXCLUSIVE
                      </div>
                    )}
                  </div>

                  {/* Premium Content */}
                  <div className="absolute inset-0 flex flex-col justify-between p-8 text-white">
                    {/* Top Section */}
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-2">
                        <span className={`bg-gradient-to-r ${category.gradient} px-4 py-2 rounded-2xl text-sm font-bold shadow-lg inline-block w-fit backdrop-blur-sm`}>
                          {category.badge}
                        </span>
                        {category.timeLeft && (
                          <span className="bg-red-600/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium animate-pulse">
                            ⏰ {category.timeLeft}
                          </span>
                        )}
                      </div>
                      <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 border border-white/30">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>

                    {/* Middle Section */}
                    <div className="text-center">
                      <h2 className="text-2xl md:text-3xl font-bold mb-3 tracking-wide group-hover:translate-x-2 transition-transform duration-300">
                        {category.title}
                      </h2>
                      <p className="text-gray-200 text-lg font-medium mb-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-200">
                        {category.subtitle}
                      </p>
                      <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-300">
                        {category.description}
                      </p>
                    </div>

                    {/* Bottom Section */}
                    <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-400">
                      <div className="text-sm">
                        <span className="font-semibold">{category.items}+ Curated Items</span>
                        {category.discount && (
                          <span className="block text-green-300 font-bold">{category.discount}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-3 rounded-2xl font-semibold hover:bg-white/30 transition-all duration-300 group-hover:scale-105 border border-white/30">
                        Explore
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Premium Testimonials */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-12 mb-16">
            <div className="text-center mb-12">
              <Award className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-3xl font-light text-gray-900 mb-4">
                Loved by Fashion Enthusiasts
              </h3>
              <p className="text-gray-600 text-lg">
                Discover why thousands choose us for their style journey
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 italic">"{testimonial.comment}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-gray-900 to-gray-700 rounded-3xl p-12 text-white">
              <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
              <h3 className="text-3xl font-light mb-4">
                Ready to Elevate Your Style?
              </h3>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers who've discovered the perfect blend of quality, style, and value.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/sale/last-chance"
                  className="bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 px-12 py-4 rounded-2xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-3"
                >
                  <Sparkles className="w-5 h-5" />
                  SHOP PREMIUM COLLECTION
                </Link>
                <Link
                  href="/western"
                  className="border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/10 transition-all duration-300"
                >
                  BROWSE ALL CATEGORIES
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}