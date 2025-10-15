// app/sale/last-chance/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, ShoppingBag, ArrowRight, Eye } from "lucide-react";

type Item = {
  id: string;
  name: string;
  image: string;
  price: number;
  mrp?: number;
  rating?: number;
};

const items: Item[] = [
  {
    id: "lc-1",
    name: "Premium Satin Wrap Dress",
    image: "/products/lastchance-wrap-dress.jpg",
    price: 1099,
    mrp: 1899,
    rating: 4.8,
  },
  {
    id: "lc-2",
    name: "Embroidered Designer Kurti",
    image: "/products/lastchance-embro-kurti.jpg",
    price: 999,
    mrp: 1499,
    rating: 4.6,
  },
  {
    id: "lc-3",
    name: "Elegant Pleated Midi Skirt",
    image: "/products/lastchance-pleated-midi.jpg",
    price: 899,
    mrp: 1299,
    rating: 4.7,
  },
  {
    id: "lc-4",
    name: "Chiffon Ruffle Blouse",
    image: "/images/top1.png",
    price: 749,
    mrp: 1099,
    rating: 4.5,
  },
  {
    id: "lc-5",
    name: "Bohemian Maxi Dress",
    image: "/products/lastchance-boho-maxi.jpg",
    price: 1199,
    mrp: 1999,
    rating: 4.9,
  },
  {
    id: "lc-6",
    name: "Designer Denim Shirt Dress",
    image: "/products/lastchance-denim-shirt.jpg",
    price: 999,
    mrp: 1599,
    rating: 4.4,
  },
];

export default function LastChancePage() {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [adding, setAdding] = useState<string | null>(null);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const addToCart = async (id: string) => {
    setAdding(id);
    // simulate
    await new Promise((r) => setTimeout(r, 600));
    setAdding(null);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      {/* Minimal heading row (optional) */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg md:text-xl font-semibold tracking-tight text-neutral-900">
          Last Chance
        </h1>
        <span className="text-xs text-neutral-600">
          Final units · Fast moving
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
        {items.map((item) => (
          <article
            key={item.id}
            className="group rounded-xl border border-black/10 bg-white overflow-hidden"
          >
            {/* Image */}
            <Link
              href={`/product/${encodeURIComponent(item.id)}`}
              className="block relative aspect-[3/4]"
            >
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width:768px) 50vw, (max-width:1200px) 25vw, 20vw"
                priority
              />
              {/* Tiny “views” pill */}
              <span className="absolute top-2 left-2 rounded-full bg-black/70 text-white text-[10px] px-2 py-1">
                5 viewing
              </span>
              {/* Wishlist icon */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleWishlist(item.id);
                }}
                aria-label="Wishlist"
                className={[
                  "absolute top-2 right-2 h-8 w-8 rounded-full flex items-center justify-center",
                  wishlist.includes(item.id)
                    ? "bg-rose-600 text-white"
                    : "bg-white/90 text-neutral-700 hover:bg-white",
                ].join(" ")}
              >
                <Heart
                  className={`h-4 w-4 ${
                    wishlist.includes(item.id) ? "fill-current" : ""
                  }`}
                />
              </button>
            </Link>

            {/* Body */}
            <div className="p-3">
              <Link
                href={`/product/${encodeURIComponent(item.id)}`}
                className="block"
              >
                <h3 className="line-clamp-2 text-sm font-medium text-neutral-900">
                  {item.name}
                </h3>
              </Link>

              {/* Price row */}
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-base font-semibold text-neutral-900">
                  ₹{item.price.toLocaleString()}
                </span>
                {item.mrp && item.mrp > item.price && (
                  <>
                    <span className="text-xs text-neutral-500 line-through">
                      ₹{item.mrp.toLocaleString()}
                    </span>
                    <span className="ml-auto text-[11px] font-semibold text-emerald-700">
                      {Math.round(((item.mrp - item.price) / item.mrp) * 100)}%
                      OFF
                    </span>
                  </>
                )}
              </div>

              {/* Rating compact */}
              {item.rating && (
                <div className="mt-1 text-[11px] text-neutral-600">
                  ⭐ {item.rating.toFixed(1)}
                </div>
              )}

              {/* Actions */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={() => addToCart(item.id)}
                  className="inline-flex items-center justify-center gap-1 rounded-lg bg-neutral-900 text-white text-xs py-2 hover:bg-neutral-800"
                >
                  {adding === item.id ? (
                    <span className="inline-block h-3 w-3 animate-spin rounded-full border border-white/30 border-t-white" />
                  ) : (
                    <ShoppingBag className="h-4 w-4" />
                  )}
                  Add to Cart
                </button>

                <Link
                  href={`/checkout?product=${encodeURIComponent(item.id)}`}
                  className="inline-flex items-center justify-center gap-1 rounded-lg border border-neutral-300 text-neutral-800 text-xs py-2 hover:border-neutral-500"
                >
                  <ArrowRight className="h-4 w-4" />
                  Order Now
                </Link>

                <Link
                  href={`/product/${encodeURIComponent(item.id)}`}
                  className="col-span-2 inline-flex items-center justify-center gap-1 rounded-lg bg-white text-neutral-800 text-xs py-2 border border-neutral-300 hover:border-neutral-500"
                >
                  <Eye className="h-4 w-4" />
                  Product Details
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
