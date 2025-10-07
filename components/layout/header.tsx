"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Heart, ShoppingCart, User, Search } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const loadCounts = () => {
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setWishlistCount(wishlist.length);
      setCartCount(cart.reduce((sum: number, item: any) => sum + item.quantity, 0));
    };

    loadCounts();
    window.addEventListener("storage", loadCounts);
    window.addEventListener("wishlist-updated", loadCounts); // 👈 custom event
    window.addEventListener("cart-updated", loadCounts);     // 👈 for cart too

    return () => {
      window.removeEventListener("storage", loadCounts);
      window.removeEventListener("wishlist-updated", loadCounts);
      window.removeEventListener("cart-updated", loadCounts);
    };
  }, []);

  return (
    <header className="border-b bg-white sticky top-0 z-50 w-full">
      <div className="w-full px-6 h-16 flex items-center justify-between">
        {/* ✅ Logo on the left */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Nazmi Boutique Logo"
            width={48}
            height={48}
            priority
            className="rounded-full border border-gray-200 shadow-sm"
          />
        </Link>

        {/* ✅ Navigation Center */}
        <nav className="hidden md:flex gap-8 text-sm font-medium">
          <Link href="/" className="hover:text-gray-700">Home</Link>
          <Link href="/traditional" className="hover:text-gray-700">Traditional</Link>
          <Link href="/western" className="hover:text-gray-700">Western</Link>
          <Link href="/sale/under-999" className="text-red-600 hover:text-red-700">Sale</Link>
        </nav>

        {/* ✅ Actions on Right */}
        <div className="flex items-center gap-6 text-sm font-medium">
          {/* Search */}
          <Link href="/search" className="relative hover:text-gray-700">
            <Search className="w-5 h-5" />
          </Link>

          {/* Account */}
          <Link href="/account" className="relative hover:text-gray-700">
            <User className="w-5 h-5" />
          </Link>

          {/* Wishlist */}
          <Link href="/wishlist" className="relative hover:text-gray-700">
            <Heart className={`w-5 h-5 ${wishlistCount > 0 ? "fill-red-500 text-red-500" : ""}`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative hover:text-gray-700">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-black text-white w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
