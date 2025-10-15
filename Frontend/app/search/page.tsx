"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Heart, ShoppingBag, Eye, ArrowRight } from "lucide-react";
import { ALL_PRODUCTS, type Product } from "@/lib/product";

function ProductCard({ p }: { p: Product }) {
  return (
    <div className="border rounded-lg p-4 flex flex-col items-center">
      <Image src={p.image} alt={p.name} width={150} height={150} className="mb-2 object-contain" />
      <h2 className="text-sm font-semibold mb-1">{p.name}</h2>
      <p className="text-xs text-neutral-500 mb-2">{p.category}</p>
      <div className="flex gap-2">
        <Link href={`/product/${p.id}`} className="text-blue-600 hover:underline text-xs flex items-center gap-1">
          <Eye className="w-4 h-4" /> View
        </Link>
        <button className="text-pink-600 hover:underline text-xs flex items-center gap-1">
          <Heart className="w-4 h-4" /> Wishlist
        </button>
        <button className="text-green-600 hover:underline text-xs flex items-center gap-1">
          <ShoppingBag className="w-4 h-4" /> Add to Cart
        </button>
      </div>
    </div>
  );
}

function SearchContent() {
  const router = useRouter();
  const params = useSearchParams();

  const [query, setQuery] = useState("");
  useEffect(() => {
    const q = params.get("q") || "";
    setQuery(q);
  }, [params]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_PRODUCTS;
    return ALL_PRODUCTS.filter((p) => {
      const name = p.name.toLowerCase();
      const cat = (p.category || "").toLowerCase();
      return name.includes(q) || cat.includes(q);
    });
  }, [query]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-lg md:text-xl font-semibold tracking-tight text-neutral-900">Search</h1>
        <form onSubmit={onSubmit} className="w-full sm:w-[480px]">
          <label className="relative block">
            <span className="sr-only">Search all products</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search all products…"
              className="w-full rounded-lg border border-black/10 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-black/40"
            />
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          </label>
        </form>
      </div>

      <div className="mb-4 text-xs text-neutral-600">
        {filtered.length} result{filtered.length !== 1 ? "s" : ""} {query ? `for “${query}”` : "(showing all)"}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
        {filtered.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-neutral-500">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
