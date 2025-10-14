"use client";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { Heart, ShoppingCart, User, Search, Menu, X, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Define types for custom events
declare global {
  interface WindowEventMap {
    "wishlist-updated": CustomEvent;
    "cart-updated": CustomEvent;
  }
}

interface NavItem {
  href: string;
  label: string;
  icon?: string;
  highlight?: boolean;
}

export default function Header() {
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();

  // Memoized count loader to prevent unnecessary re-renders
  const loadCounts = useCallback(() => {
    try {
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setWishlistCount(wishlist.length);
      setCartCount(cart.reduce((sum: number, item: any) => sum + item.quantity, 0));
    } catch (error) {
      console.error("Error loading counts:", error);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    // Initial load
    loadCounts();

    // Event listeners
    const handleStorageUpdate = () => loadCounts();
    
    window.addEventListener("storage", handleStorageUpdate);
    window.addEventListener("wishlist-updated", handleStorageUpdate);
    window.addEventListener("cart-updated", handleStorageUpdate);
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Polling for cart updates (fallback)
    const pollInterval = setInterval(loadCounts, 2000);

    return () => {
      window.removeEventListener("storage", handleStorageUpdate);
      window.removeEventListener("wishlist-updated", handleStorageUpdate);
      window.removeEventListener("cart-updated", handleStorageUpdate);
      window.removeEventListener("scroll", handleScroll);
      clearInterval(pollInterval);
    };
  }, [loadCounts, pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const closeAllMenus = () => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  };

  const desktopNavItems: NavItem[] = [
    { href: "/", label: "Home" },
    { href: "/traditional", label: "Traditional" },
    { href: "/western", label: "Western" },
    { href: "/sale", label: "Sale", highlight: true },
    { href: "/new-arrivals", label: "New Arrivals" }
  ];

  const mobileNavItems: NavItem[] = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/traditional", label: "TRADITIONAL" },
    { href: "/western", label: "WESTERN" },
    { href: "/sale", label: "SALES", highlight: true },
    { href: "/new-arrivals", label: "New Arrivals", icon: "🆕" },
    { href: "/account", label: "My Account", icon: "👤" },
    { href: "/wishlist", label: `Wishlist (${wishlistCount})`, icon: "❤️" },
    { href: "/cart", label: `Cart (${cartCount})`, icon: "🛒" }
  ];

  const quickSearchTerms = ["Kurtis", "Dresses", "Tops", "Sale", "Traditional"];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-[#6D7E5F] to-[#8A9B7E] text-white text-sm py-2 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6">
          <div className="flex items-center gap-2">
            <Phone className="w-3 h-3" />
            <span>Free Shipping on Orders Above ₹1999</span>
          </div>
          <div className="hidden sm:block">|</div>
          <div className="flex items-center gap-2">
            <Mail className="w-3 h-3" />
            <span>30-Day Easy Returns</span>
          </div>
        </div>
      </div>

      {/* Main Header - Fixed with solid background */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-[#E8E9E0] shadow-xl border-b border-[#6D7E5F]/20" 
          : "bg-[#E8E9E0] border-b border-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center group transition-transform duration-300 hover:scale-105 flex-shrink-0"
              onClick={closeAllMenus}
            >
              <div className="relative">
                <Image
                  src="/logo.png"
                  alt="Nazmi Boutique Logo"
                  width={52}
                  height={52}
                  priority
                  className="rounded-full border-2 border-[#E8E9E0] shadow-lg transition-all duration-300 group-hover:border-[#6D7E5F] group-hover:shadow-xl"
                />
                <div className="absolute inset-0 rounded-full bg-[#6D7E5F]/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="ml-3">
                <span className="text-2xl font-serif font-bold text-[#2C2C2C] tracking-wider block leading-tight">
                  NAZMI
                </span>
                <span className="text-xs text-[#6D7E5F] font-medium tracking-widest uppercase">
                  Boutique
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8 xl:space-x-12">
              {desktopNavItems.map(({ href, label, highlight }) => (
                <Link 
                  key={href}
                  href={href} 
                  className={`relative transition-all duration-300 font-medium text-lg group ${
                    isActiveLink(href)
                      ? highlight ? "text-red-600 font-semibold" : "text-[#6D7E5F] font-semibold"
                      : highlight ? "text-red-500 hover:text-red-700" : "text-[#2C2C2C] hover:text-[#6D7E5F]"
                  }`}
                >
                  {label}
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                    isActiveLink(href) || highlight 
                      ? "w-full bg-red-600" 
                      : highlight ? "bg-red-500" : "bg-[#6D7E5F]"
                  }`} />
                  {highlight && (
                    <span className="absolute -top-2 -right-3">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Action Icons */}
            <div className="flex items-center space-x-4 sm:space-x-6">
              
              {/* Search with Expandable Input */}
              <div className="relative">
                <button 
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="relative p-2 text-[#2C2C2C] hover:text-[#6D7E5F] transition-all duration-300 group"
                  aria-label="Search products"
                >
                  <Search className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-[#6D7E5F]/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                </button>

                {/* Search Dropdown */}
                {searchOpen && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-[#E8E9E0] p-4 animate-in slide-in-from-top-5 duration-300">
                    <form onSubmit={handleSearch} className="space-y-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search for traditional, western, or sale items..."
                          className="w-full pl-10 pr-4 py-3 border border-[#E8E9E0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6D7E5F] focus:border-transparent bg-gray-50"
                          autoFocus
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-[#6D7E5F] text-white py-3 rounded-xl font-medium hover:bg-[#5A6B4F] transition-colors duration-300"
                      >
                        Search Products
                      </button>
                    </form>
                    
                    {/* Quick Search Suggestions */}
                    <div className="mt-3 pt-3 border-t border-[#E8E9E0]">
                      <p className="text-xs text-gray-500 mb-2">Popular Searches:</p>
                      <div className="flex flex-wrap gap-2">
                        {quickSearchTerms.map((term) => (
                          <button
                            key={term}
                            type="button"
                            onClick={() => setSearchQuery(term)}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg hover:bg-[#6D7E5F] hover:text-white transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Account */}
              <Link 
                href="/account" 
                className="relative p-2 text-[#2C2C2C] hover:text-[#6D7E5F] transition-all duration-300 group hidden sm:block"
                onClick={closeAllMenus}
                aria-label="My account"
              >
                <User className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 bg-[#6D7E5F]/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
              </Link>

              {/* Wishlist */}
              <Link 
                href="/wishlist" 
                className="relative p-2 text-[#2C2C2C] hover:text-red-500 transition-all duration-300 group"
                onClick={closeAllMenus}
                aria-label={`Wishlist with ${wishlistCount} items`}
              >
                <Heart 
                  className={`w-5 h-5 transition-all duration-300 group-hover:scale-110 ${
                    wishlistCount > 0 ? "fill-red-500 text-red-500 animate-pulse" : ""
                  }`} 
                />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full font-medium border-2 border-white shadow-lg">
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </span>
                )}
                <div className="absolute inset-0 bg-red-500/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
              </Link>

              {/* Cart */}
              <Link 
                href="/cart" 
                className="relative p-2 text-[#2C2C2C] hover:text-[#6D7E5F] transition-all duration-300 group"
                onClick={closeAllMenus}
                aria-label={`Shopping cart with ${cartCount} items`}
              >
                <ShoppingCart className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 text-xs bg-[#6D7E5F] text-white w-5 h-5 flex items-center justify-center rounded-full font-medium border-2 border-white shadow-lg animate-bounce">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
                <div className="absolute inset-0 bg-[#6D7E5F]/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
              </Link>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => {
                  setMobileMenuOpen(!mobileMenuOpen);
                  setSearchOpen(false);
                }}
                className="lg:hidden p-2 text-[#2C2C2C] hover:text-[#6D7E5F] transition-colors relative"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#E8E9E0] border-t border-[#6D7E5F]/20 shadow-2xl animate-in slide-in-from-top duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-1">
              {mobileNavItems.map(({ href, label, icon, highlight }) => (
                <Link 
                  key={href}
                  href={href} 
                  className={`flex items-center py-4 px-4 text-lg font-medium transition-all duration-300 rounded-xl ${
                    isActiveLink(href)
                      ? highlight ? "bg-red-50 text-red-700 border-l-4 border-red-500" : "bg-[#6D7E5F]/20 text-[#6D7E5F] border-l-4 border-[#6D7E5F] font-semibold"
                      : highlight ? "text-red-600 hover:bg-red-50 hover:text-red-700" : "text-[#2C2C2C] hover:bg-[#6D7E5F]/10 hover:text-[#6D7E5F]"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-xl mr-3">{icon}</span>
                  {label}
                  {highlight && (
                    <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full animate-pulse">
                      HOT
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Spacer for fixed header */}
      <div className="h-20" />

      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Overlay for search */}
      {searchOpen && (
        <div 
          className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40 animate-in fade-in duration-300"
          onClick={() => setSearchOpen(false)}
        />
      )}
    </>
  );
}