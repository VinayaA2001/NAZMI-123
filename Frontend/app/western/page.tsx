// app/western/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, X, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";

/* ---------- Types ---------- */
type Variant = {
  _id?: string;
  size: string;
  colour: string;
  stock: number;
  price: number;
  images?: string[];
};

type Product = {
  _id: string;
  slug?: string;
  product_code: string;
  product_name?: string;
  material: string;          // treat as sub-category for filter
  category: string;          // "Western" / "Western Wears" / etc.
  images: string[];
  description?: string;
  variants: Variant[];
  availableSizes: string[];
  availableColors: string[];
  totalStock: number;
  minPrice: number;
  maxPrice: number;
};

/* ---------- Helpers ---------- */
const norm = (s?: string) => (s ?? "").trim().toLowerCase();
const imgUrl = (p?: string | null) => {
  if (!p || typeof p !== "string") return "/images/placeholder.jpg";
  if (p.startsWith("http") || p.startsWith("/")) return p;
  return `/images/${p}`;
};

function normalizeProduct(raw: any): Product {
  const variants: Variant[] = Array.isArray(raw.variants)
    ? raw.variants.map((v: any) => ({
        _id: v._id,
        size: String(v.size ?? "Free"),
        colour: String(v.colour ?? raw.colour ?? "Standard"),
        stock: Number(v.stock ?? v.quantity ?? 0),
        price: Number(v.price ?? raw.price ?? 0),
        images: Array.isArray(v.images) ? v.images.map(imgUrl) : undefined,
      }))
    : [];

  const sizes =
    (raw.availableSizes?.length ? raw.availableSizes : Array.from(new Set(variants.map((v) => v.size)))).filter(Boolean);
  const colors =
    (raw.availableColors?.length ? raw.availableColors : Array.from(new Set(variants.map((v) => v.colour)))).filter(
      Boolean
    );

  const totalStock =
    typeof raw.totalStock === "number" ? raw.totalStock : variants.reduce((s, v) => s + (v.stock || 0), 0);
  const prices = variants.map((v) => Number(v.price)).filter((n) => !Number.isNaN(n));
  const minPrice =
    typeof raw.minPrice === "number" ? raw.minPrice : prices.length ? Math.min(...prices) : Number(raw.price) || 0;
  const maxPrice =
    typeof raw.maxPrice === "number" ? raw.maxPrice : prices.length ? Math.max(...prices) : minPrice || 0;

  const images: string[] =
    Array.isArray(raw.images) && raw.images.length ? raw.images.map(imgUrl) : ["/images/placeholder.jpg"];

  return {
    _id: String(raw._id),
    slug: raw.slug,
    product_code: String(raw.product_code ?? ""),
    product_name: raw.product_name ?? "",
    material: String(raw.material ?? ""),
    category: String(raw.category ?? ""),
    images,
    description: raw.description ?? "",
    variants,
    availableSizes: sizes,
    availableColors: colors,
    totalStock,
    minPrice,
    maxPrice,
  };
}

function makeSlug(p: Product) {
  if (p.slug) return p.slug;
  const base =
    p.product_name && p.product_name.length ? p.product_name : `${p.material}-${p.category}`;
  const code = p.product_code ? `-${p.product_code}` : "";
  return (base + code).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

/* ---------- Page ---------- */
export default function WesternListingPage() {
  /* data */
  const [rawProducts, setRawProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* wishlist */
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  /* filters (single-select like Ethnic page) */
  const [query, setQuery] = useState("");
  const [material, setMaterial] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(0);

  /* sort */
  const [sortBy, setSortBy] =
    useState<"relevance" | "price-asc" | "price-desc" | "newest">("relevance");

  /* UI */
  const [collapsed, setCollapsed] = useState(true); // collapsed filter bar like Ethnic

  /* fetch */
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/products?category=western", { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        const arr = await res.json();
        const normalized: Product[] = Array.isArray(arr) ? arr.map(normalizeProduct) : [];
        setRawProducts(normalized);
      } catch (e: any) {
        setError(e.message || "Failed to load western products");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* wishlist boot */
  useEffect(() => {
    try {
      const w = localStorage.getItem("wishlist");
      if (w) setWishlist(new Set(JSON.parse(w).map((i: any) => i.id)));
    } catch {}
  }, []);

  const toggleWishlist = (p: Product) => {
    const id = p._id;
    let existing: any[] = [];
    try {
      const d = localStorage.getItem("wishlist");
      if (d) existing = JSON.parse(d);
    } catch {}
    const has = existing.find((x: any) => x.id === id);
    const item = {
      id,
      productId: id,
      name: p.product_name || `${p.material} ${p.category}`,
      price: p.minPrice,
      image: p.images?.[0] || "/images/placeholder.jpg",
      productCode: p.product_code,
    };
    const updated = has ? existing.filter((x: any) => x.id !== id) : [...existing, item];
    localStorage.setItem("wishlist", JSON.stringify(updated));
    setWishlist(new Set(updated.map((x: any) => x.id)));
    window.dispatchEvent(new Event("wishlist-updated"));
  };
  const inWishlist = (id: string) => wishlist.has(id);

  /* facets from data */
  const allMaterials = useMemo(() => {
    const s = new Set<string>();
    rawProducts.forEach((p) => p.material && s.add(p.material));
    return ["", ...Array.from(s).sort((a, b) => a.localeCompare(b))];
  }, [rawProducts]);

  const allColors = useMemo(() => {
    const s = new Set<string>();
    rawProducts.forEach((p) => p.availableColors.forEach((c) => s.add(c)));
    return ["", ...Array.from(s).sort((a, b) => a.localeCompare(b))];
  }, [rawProducts]);

  const allSizes = useMemo(() => {
    const s = new Set<string>();
    rawProducts.forEach((p) => p.availableSizes.forEach((sz) => s.add(sz)));
    return ["", ...Array.from(s).sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
    )];
  }, [rawProducts]);

  const globalMinPrice = useMemo(
    () => Math.min(...rawProducts.map((p) => p.minPrice || 0), 0),
    [rawProducts]
  );
  const globalMaxPrice = useMemo(
    () => Math.max(...rawProducts.map((p) => p.maxPrice || 0), 0),
    [rawProducts]
  );

  /* init price bounds once data is in */
  useEffect(() => {
    if (rawProducts.length) {
      setPriceMin(globalMinPrice);
      setPriceMax(globalMaxPrice);
    }
  }, [rawProducts.length, globalMinPrice, globalMaxPrice]);

  /* filtered + sorted (single-select like Ethnic) */
  const products = useMemo(() => {
    let list = rawProducts.filter((p) => (p.totalStock ?? 0) > 0);

    // text query on name / material / code
    if (query.trim()) {
      const q = norm(query);
      list = list.filter(
        (p) =>
          norm(p.product_name).includes(q) ||
          norm(p.material).includes(q) ||
          norm(p.product_code).includes(q)
      );
    }

    // single selects
    if (material) list = list.filter((p) => p.material === material);
    if (color) list = list.filter((p) =>
      p.availableColors.some((c) => c.toLowerCase() === color.toLowerCase())
    );
    if (size) list = list.filter((p) => p.availableSizes.includes(size));

    // price range (overlap)
    list = list.filter((p) => p.minPrice <= priceMax && p.maxPrice >= priceMin);

    // sort
    switch (sortBy) {
      case "price-asc":
        list = [...list].sort((a, b) => a.minPrice - b.minPrice);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.minPrice - a.minPrice);
        break;
      case "newest":
        list = [...list].sort((a, b) =>
          String(b.product_code).localeCompare(String(a.product_code))
        );
        break;
      default:
        break;
    }

    return list;
  }, [rawProducts, query, material, color, size, priceMin, priceMax, sortBy]);

  const clearFilters = () => {
    setQuery("");
    setMaterial("");
    setColor("");
    setSize("");
    setPriceMin(globalMinPrice);
    setPriceMax(globalMaxPrice);
    setSortBy("relevance");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ---------- render ---------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-white grid place-items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading western picks…</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-white grid place-items-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-12 h-12 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load</h3>
          <p className="text-gray-600 mb-4 max-w-md">{error}</p>
          <button
            onClick={() => location.reload()}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header / title */}
      <div className="container mx-auto px-4 pt-20 pb-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-light text-gray-900">Western Collection</h1>
            <p className="text-gray-600 mt-1">
              Find your fit—filter by color, size, material and price.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none border rounded-lg py-2 pl-3 pr-9 text-sm text-gray-800 hover:border-black/60"
                aria-label="Sort products"
              >
                <option value="relevance">Sort: Relevance</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="newest">Newest</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Back to Home (sticky) */}
      <div className="sticky [top:var(--header-offset)] z-40 bg-white/80 backdrop-blur-sm border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-700 hover:text-black text-sm font-medium transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back to Home
          </Link>

          {/* Shipping notice */}
          <span className="text-xs sm:text-sm text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
            ₹60 shipping on orders below ₹1999
          </span>
        </div>
      </div>

      {/* Filter bar (Ethnic-style: sticky, collapsible) */}
      <div className="sticky [top:calc(var(--header-offset)+40px)] z-40 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-gray-700" />
            <span className="font-medium text-gray-800">Filters</span>
            {collapsed && (
              <span className="text-xs text-gray-500 ml-1.5">
                ₹{priceMin}–₹{priceMax}
                {size && ` · ${size}`}
                {color && ` · ${color}`}
                {material && ` · ${material}`}
                {query && ` · “${query}”`}
              </span>
            )}
          </div>
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="p-1 rounded-md border border-gray-300 hover:bg-gray-50"
            aria-label="Toggle filters"
          >
            {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        <div
          className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
            collapsed ? "max-h-0 opacity-0" : "max-h-[420px] opacity-100"
          }`}
        >
          <div className={`max-w-7xl mx-auto px-4 ${collapsed ? "pb-0" : "pb-3"}`}>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
              {/* Search */}
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, code or material"
                className="px-2 py-1.5 border border-gray-200 rounded-md text-sm"
              />

              {/* Price */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-500 w-9">Min</label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={priceMin}
                  onChange={(e) => setPriceMin(Number(e.target.value || 0))}
                  className="w-full md:w-24 px-2 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-gray-300"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-500 w-9">Max</label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value || 0))}
                  className="w-full md:w-24 px-2 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-gray-300"
                />
              </div>

              {/* Single-selects (material/color/size) */}
              <select
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="px-2 py-1.5 border border-gray-200 rounded-md text-sm bg-white"
              >
                {allMaterials.map((m) => (
                  <option key={m || "all"} value={m}>
                    {m ? `Material: ${m}` : "All Materials"}
                  </option>
                ))}
              </select>

              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="px-2 py-1.5 border border-gray-200 rounded-md text-sm bg-white"
              >
                {allColors.map((c) => (
                  <option key={c || "all"} value={c}>
                    {c ? `Color: ${c}` : "All Colors"}
                  </option>
                ))}
              </select>

              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="px-2 py-1.5 border border-gray-200 rounded-md text-sm bg-white"
              >
                {allSizes.map((s) => (
                  <option key={s || "all"} value={s}>
                    {s ? `Size: ${s}` : "All Sizes"}
                  </option>
                ))}
              </select>

              <button
                onClick={clearFilters}
                className="text-sm px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-14 pt-6">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 mb-4">No products match your filters.</p>
            <button
              onClick={clearFilters}
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {products.map((p) => {
              const name = p.product_name || `${p.material} ${p.category}`;
              const slug = makeSlug(p);
              const firstInStock = p.variants.find((v) => Number(v.stock) > 0) || p.variants[0];
              const q = firstInStock
                ? `?color=${encodeURIComponent(firstInStock.colour)}&size=${encodeURIComponent(
                    firstInStock.size
                  )}`
                : "";

              return (
                <Link
                  key={`${p._id}-${p.product_code}`}
                  href={`/Western/${slug}${q}`} // adjust if your folder is lowercase
                  className="group bg-white rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] shadow-sm hover:shadow-xl border border-gray-100"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={imgUrl(p.images?.[0])}
                      alt={name}
                      fill
                      className="object-cover group-hover:scale-110 transition duration-500"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(p);
                      }}
                      aria-label="Toggle wishlist"
                      className={`absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center ${
                        inWishlist(p._id) ? "text-red-500" : "text-gray-600 hover:text-red-500"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${inWishlist(p._id) ? "fill-current" : ""}`} />
                    </button>
                    {(p.availableColors.length > 1 || p.availableSizes.length > 1) && (
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
                        Options Available
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 text-sm mb-1 leading-tight line-clamp-2">
                      {name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">Code: {p.product_code}</p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-gray-900">
                        ₹{p.minPrice}
                        {p.minPrice !== p.maxPrice && ` - ₹${p.maxPrice}`}
                      </span>
                    </div>
                    <div className="w-full py-2 text-xs font-medium rounded bg-black text-white text-center">
                      {p.availableColors.length > 1 || p.availableSizes.length > 1
                        ? "VIEW OPTIONS"
                        : "VIEW PRODUCT"}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
