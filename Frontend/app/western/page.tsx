// app/western/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, X, Check, SlidersHorizontal, ChevronDown } from "lucide-react";

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
  const variants: Variant[] = Array.isArray(raw.variants) ? raw.variants.map((v: any) => ({
    _id: v._id,
    size: String(v.size ?? "Free"),
    colour: String(v.colour ?? raw.colour ?? "Standard"),
    stock: Number(v.stock ?? v.quantity ?? 0),
    price: Number(v.price ?? raw.price ?? 0),
    images: Array.isArray(v.images) ? v.images.map(imgUrl) : undefined,
  })) : [];

  const sizes = (raw.availableSizes?.length ? raw.availableSizes : Array.from(new Set(variants.map(v => v.size)))).filter(Boolean);
  const colors = (raw.availableColors?.length ? raw.availableColors : Array.from(new Set(variants.map(v => v.colour)))).filter(Boolean);

  const totalStock = typeof raw.totalStock === "number" ? raw.totalStock : variants.reduce((s, v) => s + (v.stock || 0), 0);
  const prices = variants.map(v => Number(v.price)).filter(n => !Number.isNaN(n));
  const minPrice = typeof raw.minPrice === "number" ? raw.minPrice : (prices.length ? Math.min(...prices) : Number(raw.price) || 0);
  const maxPrice = typeof raw.maxPrice === "number" ? raw.maxPrice : (prices.length ? Math.max(...prices) : (minPrice || 0));

  const images: string[] = Array.isArray(raw.images) && raw.images.length ? raw.images.map(imgUrl) : ["/images/placeholder.jpg"];

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
  const base = (p.product_name && p.product_name.length) ? p.product_name : `${p.material}-${p.category}`;
  const code = p.product_code ? `-${p.product_code}` : "";
  return (base + code).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

/* ---------- Page ---------- */
export default function WesternListingPage() {
  /* data */
  const [rawProducts, setRawProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  /* wishlist */
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  /* filters */
  const [query, setQuery] = useState("");
  const [pickedMaterials, setPickedMaterials] = useState<Set<string>>(new Set());   // like subcategory
  const [pickedColors, setPickedColors]       = useState<Set<string>>(new Set());
  const [pickedSizes, setPickedSizes]         = useState<Set<string>>(new Set());
  const [priceMin, setPriceMin] = useState<number | "">("");
  const [priceMax, setPriceMax] = useState<number | "">("");

  /* sort */
  const [sortBy, setSortBy] = useState<"relevance"|"price-asc"|"price-desc"|"newest">("relevance");

  /* UI */
  const [openFilters, setOpenFilters] = useState(true);

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
    try { const d = localStorage.getItem("wishlist"); if (d) existing = JSON.parse(d); } catch {}
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
    rawProducts.forEach(p => { if (p.material) s.add(p.material); });
    return Array.from(s).sort((a,b)=>a.localeCompare(b));
  }, [rawProducts]);

  const allColors = useMemo(() => {
    const s = new Set<string>();
    rawProducts.forEach(p => p.availableColors.forEach(c => s.add(c)));
    return Array.from(s).sort((a,b)=>a.localeCompare(b));
  }, [rawProducts]);

  const allSizes = useMemo(() => {
    const s = new Set<string>();
    rawProducts.forEach(p => p.availableSizes.forEach(sz => s.add(sz)));
    return Array.from(s).sort((a,b)=>a.localeCompare(b, undefined, { numeric:true, sensitivity:"base" }));
  }, [rawProducts]);

  const globalMinPrice = useMemo(() => Math.min(...rawProducts.map(p => p.minPrice || 0), 0), [rawProducts]);
  const globalMaxPrice = useMemo(() => Math.max(...rawProducts.map(p => p.maxPrice || 0), 0), [rawProducts]);

  /* filtered + sorted */
  const products = useMemo(() => {
    let list = rawProducts.filter(p => (p.totalStock ?? 0) > 0);

    // text query on name / material / code
    if (query.trim()) {
      const q = norm(query);
      list = list.filter(p =>
        norm(p.product_name).includes(q) ||
        norm(p.material).includes(q) ||
        norm(p.product_code).includes(q)
      );
    }

    // materials
    if (pickedMaterials.size) {
      list = list.filter(p => pickedMaterials.has(p.material));
    }

    // colors
    if (pickedColors.size) {
      list = list.filter(p => p.availableColors.some(c => pickedColors.has(c)));
    }

    // sizes
    if (pickedSizes.size) {
      list = list.filter(p => p.availableSizes.some(s => pickedSizes.has(s)));
    }

    // price range
    list = list.filter(p => {
      const minOk = priceMin === "" ? true : p.maxPrice >= Number(priceMin);
      const maxOk = priceMax === "" ? true : p.minPrice <= Number(priceMax);
      return minOk && maxOk;
    });

    // sort
    switch (sortBy) {
      case "price-asc":
        list = [...list].sort((a,b)=>a.minPrice - b.minPrice);
        break;
      case "price-desc":
        list = [...list].sort((a,b)=>b.minPrice - a.minPrice);
        break;
      case "newest":
        // Without createdAt, approximate by id/code descending:
        list = [...list].sort((a,b)=>String(b.product_code).localeCompare(String(a.product_code)));
        break;
      default:
        // relevance (keep filtered order)
        break;
    }

    return list;
  }, [rawProducts, query, pickedMaterials, pickedColors, pickedSizes, priceMin, priceMax, sortBy]);

  /* ui helpers */
  const toggleSet = (setter: (s: Set<string>) => void, curr: Set<string>, value: string) => {
    const next = new Set(curr);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
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
          <button onClick={() => location.reload()} className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header / controls */}
      <div className="container mx-auto px-4 pt-20 pb-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-light text-gray-900">Western Collection</h1>
            <p className="text-gray-600 mt-1">Find your fit—filter by color, size, material and price.</p>
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

            <button
              onClick={() => setOpenFilters(s => !s)}
              className="inline-flex items-center gap-2 border rounded-lg px-3 py-2 text-sm hover:border-black/70"
              aria-expanded={openFilters}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-14 grid grid-cols-1 md:grid-cols-[260px,1fr] gap-6">
        {/* Filters */}
        <aside className={`${openFilters ? "block" : "hidden md:block"} border rounded-xl p-4 h-max sticky top-20 bg-white`}>
          {/* search */}
          <div className="mb-4">
            <input
              value={query}
              onChange={(e)=>setQuery(e.target.value)}
              placeholder="Search by name, code or material"
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          {/* price */}
          <div className="mb-5">
            <p className="text-sm font-medium text-gray-900 mb-2">Price</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                placeholder={`${globalMinPrice}`}
                value={priceMin}
                onChange={(e)=>setPriceMin(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-1/2 border rounded-lg px-3 py-2 text-sm"
              />
              <span className="text-gray-500">—</span>
              <input
                type="number"
                min={0}
                placeholder={`${globalMaxPrice}`}
                value={priceMax}
                onChange={(e)=>setPriceMax(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-1/2 border rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* materials (subcategory) */}
          {!!allMaterials.length && (
            <div className="mb-5">
              <p className="text-sm font-medium text-gray-900 mb-2">Material</p>
              <div className="flex flex-wrap gap-2">
                {allMaterials.map(m => (
                  <button
                    key={m}
                    onClick={()=>toggleSet(setPickedMaterials, pickedMaterials, m)}
                    className={`px-3 py-1.5 rounded-full border text-xs ${
                      pickedMaterials.has(m) ? "bg-black text-white border-black" : "hover:border-black/60"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* colors */}
          {!!allColors.length && (
            <div className="mb-5">
              <p className="text-sm font-medium text-gray-900 mb-2">Color</p>
              <div className="flex flex-wrap gap-2">
                {allColors.map(c => (
                  <button
                    key={c}
                    onClick={()=>toggleSet(setPickedColors, pickedColors, c)}
                    className={`px-3 py-1.5 rounded-full border text-xs ${
                      pickedColors.has(c) ? "bg-black text-white border-black" : "hover:border-black/60"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* sizes */}
          {!!allSizes.length && (
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-900 mb-2">Size</p>
              <div className="flex flex-wrap gap-2">
                {allSizes.map(s => (
                  <button
                    key={s}
                    onClick={()=>toggleSet(setPickedSizes, pickedSizes, s)}
                    className={`px-3 py-1.5 rounded-full border text-xs ${
                      pickedSizes.has(s) ? "bg-black text-white border-black" : "hover:border-black/60"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => {
                setQuery("");
                setPickedMaterials(new Set());
                setPickedColors(new Set());
                setPickedSizes(new Set());
                setPriceMin("");
                setPriceMax("");
                setSortBy("relevance");
              }}
              className="flex-1 border rounded-lg px-3 py-2 text-sm hover:border-black/70"
            >
              Clear
            </button>
            <button
              onClick={()=>window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex-1 bg-black text-white rounded-lg px-3 py-2 text-sm hover:bg-gray-800"
            >
              Apply
            </button>
          </div>
        </aside>

        {/* Grid */}
        <main>
          {products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 mb-4">No products match your filters.</p>
              <button
                onClick={() => {
                  setPickedMaterials(new Set());
                  setPickedColors(new Set());
                  setPickedSizes(new Set());
                  setPriceMin("");
                  setPriceMax("");
                  setQuery("");
                  setSortBy("relevance");
                }}
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
                const firstInStock = p.variants.find(v => Number(v.stock) > 0) || p.variants[0];
                const q = firstInStock
                  ? `?color=${encodeURIComponent(firstInStock.colour)}&size=${encodeURIComponent(firstInStock.size)}`
                  : "";

                return (
                  <Link
                    key={`${p._id}-${p.product_code}`}
                    href={`/Western/${slug}${q}`}  // <-- adjust if your folder is lowercase
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
                        onClick={(e)=>{ e.preventDefault(); toggleWishlist(p); }}
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
                      <h3 className="font-medium text-gray-900 text-sm mb-1 leading-tight line-clamp-2">{name}</h3>
                      <p className="text-xs text-gray-500 mb-2">Code: {p.product_code}</p>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-gray-900">
                          ₹{p.minPrice}{p.minPrice !== p.maxPrice && ` - ₹${p.maxPrice}`}
                        </span>
                      </div>
                      <div className="w-full py-2 text-xs font-medium rounded bg-black text-white text-center">
                        {(p.availableColors.length > 1 || p.availableSizes.length > 1) ? "VIEW OPTIONS" : "VIEW PRODUCT"}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Shared LS cart toast space (optional hook by other pages) */}
      {/* Keep this if you show cart toasts globally */}
    </div>
  );
}
