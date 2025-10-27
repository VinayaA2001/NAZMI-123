"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  X,
  Check,
  Truck,
  Shield,
  RotateCcw,
  Star,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

/* ---------- Types ---------- */
interface ProductVariant {
  _id: string;
  size: string;
  colour: string;
  stock: number;
  price: number;
  images?: string[];
}

interface Product {
  _id: string;
  slug?: string;
  product_code: string;
  product_name: string;
  material: string;
  category: string;
  images: string[];
  description: string;
  variants: ProductVariant[];
  availableSizes: string[];
  availableColors: string[];
  totalStock: number;
  minPrice: number;
  maxPrice: number;
  hasMultipleOptions?: boolean;
}

/* ---------- Helpers ---------- */
const getImageUrl = (imagePath?: string | null): string => {
  if (!imagePath || typeof imagePath !== "string") return "/images/placeholder.jpg";
  if (imagePath.startsWith("http")) return imagePath;
  if (imagePath.startsWith("/")) return imagePath;
  return `/images/${imagePath}`;
};

function SafeImage({
  src,
  alt,
  className,
  fill,
  sizes,
}: {
  src: string | undefined | null;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
}) {
  const [imgSrc, setImgSrc] = useState(getImageUrl(src));
  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={!!fill}
      sizes={sizes}
      className={className}
      onError={() => setImgSrc("/images/placeholder.jpg")}
    />
  );
}

function normalizeProduct(raw: any): Product {
  const variants: ProductVariant[] = Array.isArray(raw.variants) ? raw.variants : [];

  const derivedSizes = Array.from(new Set(variants.map((v) => v.size).filter(Boolean)));
  const derivedColors = Array.from(new Set(variants.map((v) => v.colour).filter(Boolean)));

  const availableSizes = raw.availableSizes?.length ? raw.availableSizes : derivedSizes;
  const availableColors = raw.availableColors?.length ? raw.availableColors : derivedColors;

  const totalStock =
    typeof raw.totalStock === "number"
      ? raw.totalStock
      : variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);

  const prices = variants.map((v) => Number(v.price)).filter((n) => !Number.isNaN(n));
  const minPrice =
    typeof raw.minPrice === "number" && raw.minPrice > 0
      ? raw.minPrice
      : prices.length
      ? Math.min(...prices)
      : Number(raw.price) || 0;
  const maxPrice =
    typeof raw.maxPrice === "number" && raw.maxPrice > 0
      ? raw.maxPrice
      : prices.length
      ? Math.max(...prices)
      : minPrice;

  return {
    _id: raw._id,
    slug: raw.slug,
    product_code: raw.product_code ?? "",
    product_name: raw.product_name ?? "",
    material: raw.material ?? "",
    category: raw.category ?? "",
    images: (Array.isArray(raw.images) && raw.images.length
      ? raw.images
      : ["/images/placeholder.jpg"]
    ).map(getImageUrl),
    description: raw.description ?? "",
    variants,
    availableSizes,
    availableColors,
    totalStock,
    minPrice,
    maxPrice,
    hasMultipleOptions:
      variants.length > 1 || availableColors.length > 1 || availableSizes.length > 1,
  };
}

/* ---------- Ethnic-only filter ---------- */
const ETHNIC = ["ethnic", "traditional", "saree", "salwar", "kurta", "lehenga"];
const WESTERN = ["western", "jeans", "tops", "dress", "skirt", "officewear", "denim", "jacket"];

const isEthnicOnly = (p: Product) => {
  const txt = `${p.category} ${p.material} ${p.product_name}`.toLowerCase();
  return ETHNIC.some((k) => txt.includes(k)) && !WESTERN.some((k) => txt.includes(k));
};

/* ---------- Slug ---------- */
const makeSlug = (p: Product) =>
  (p.slug ||
    (p.product_name?.length ? p.product_name : `${p.material}-${p.category}`) +
      (p.product_code ? `-${p.product_code}` : ""))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export default function EthnicWearListingPage() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [showCartToast, setShowCartToast] = useState(false);
  const [addedProductName, setAddedProductName] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Filters (single-select for a clean, professional UX)
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(0);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [material, setMaterial] = useState("");

  // Collapsible filter bar
  const [collapsed, setCollapsed] = useState(true); // default closed for tight layout
  const scrollRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      const prev = scrollRef.current || 0;
      if (y > 120 && y > prev + 10) setCollapsed(true); // scrolling down: fold
      else if (y < prev - 10) setCollapsed(false); // scrolling up: expand
      scrollRef.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const clearFilters = () => {
    setSize("");
    setColor("");
    setMaterial("");
    setPriceMin(globalMinPrice);
    setPriceMax(globalMaxPrice);
  };

  // Fetch ethnic-only products
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const r = await fetch("/api/products?category=ethnic", { cache: "no-store" });
        const data = r.ok ? await r.json() : [];
        const products = (Array.isArray(data) ? data : []).map(normalizeProduct).filter(isEthnicOnly);
        setProductList(products);
      } catch (e: any) {
        setError(e.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Options + price bounds
  const { allSizes, allColors, allMaterials, globalMinPrice, globalMaxPrice } = useMemo(() => {
    const s = new Set<string>(), c = new Set<string>(), m = new Set<string>();
    let min = Infinity, max = 0;
    for (const p of productList) {
      p.availableSizes?.forEach((x) => x && s.add(String(x)));
      p.availableColors?.forEach((x) => x && c.add(String(x)));
      if (p.material) m.add(p.material);
      min = Math.min(min, p.minPrice);
      max = Math.max(max, p.maxPrice);
    }
    if (!Number.isFinite(min)) min = 0;
    return {
      allSizes: ["", ...Array.from(s).sort()],
      allColors: ["", ...Array.from(c).sort()],
      allMaterials: ["", ...Array.from(m).sort()],
      globalMinPrice: min,
      globalMaxPrice: max,
    };
  }, [productList]);

  useEffect(() => {
    if (productList.length) {
      setPriceMin(globalMinPrice);
      setPriceMax(globalMaxPrice);
    }
  }, [productList.length, globalMinPrice, globalMaxPrice]);

  const filteredProducts = useMemo(
    () =>
      productList.filter((p) => {
        const priceOk = p.minPrice <= priceMax && p.maxPrice >= priceMin;
        if (!priceOk) return false;
        if (size && !p.availableSizes.includes(size)) return false;
        if (color && !p.availableColors.some((x) => x.toLowerCase() === color.toLowerCase()))
          return false;
        if (material && p.material.toLowerCase() !== material.toLowerCase()) return false;
        return true;
      }),
    [productList, priceMin, priceMax, size, color, material]
  );

  // Wishlist helpers (unchanged)
  const toggleWishlist = (product: Product) => {
    const next = new Set(wishlist);
    const item = {
      id: product._id,
      productId: product._id,
      name: product.product_name || `${product.material} ${product.category}`,
      price: product.minPrice,
      image: getImageUrl(product.images?.[0]),
      productCode: product.product_code,
    };

    let existing: any[] = [];
    try {
      const data = localStorage.getItem("wishlist");
      if (data) existing = JSON.parse(data);
    } catch {
      existing = [];
    }

    if (next.has(product._id)) {
      next.delete(product._id);
      localStorage.setItem("wishlist", JSON.stringify(existing.filter((i: any) => i.id !== product._id)));
    } else {
      next.add(product._id);
      localStorage.setItem("wishlist", JSON.stringify([...existing, item]));
    }
    setWishlist(next);
    window.dispatchEvent(new Event("wishlist-updated"));
  };
  const isInWishlist = (id: string) => wishlist.has(id);

  /* ---------------- UI ---------------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-600 text-sm">Loading our Ethnic collection…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Products</h3>
          <p className="text-gray-600 mb-4 max-w-md">{error}</p>
          <button
            onClick={() => location.reload()}
            className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Compact hero (reduced padding to remove big gap) */}
      <div className="bg-gradient-to-b from-rose-50/70 via-white to-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-8 md:py-10 text-center">
          <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-2">Ethnic Collection</h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Traditional elegance meets contemporary minimalism. Handcrafted pieces from Kerala.
          </p>
        </div>
      </div>

      {/* Collapsible filter bar (tight spacing, no extra gap when closed) */}
      <div className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="container mx-auto px-4 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-gray-700" />
            <span className="font-medium text-gray-800">Filters</span>
            {collapsed && (
              <span className="text-xs text-gray-500 ml-1.5">
                ₹{priceMin}–₹{priceMax}
                {size && ` · ${size}`}
                {color && ` · ${color}`}
                {material && ` · ${material}`}
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
          className={`overflow-hidden transition-[max-height,opacity] duration-500 ease-in-out ${
            collapsed ? "max-h-0 opacity-0" : "max-h-[420px] opacity-100"
          }`}
        >
          <div className={`container mx-auto px-4 ${collapsed ? "pb-0" : "pb-3"}`}>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
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

      {/* Products */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {filteredProducts.map((p) => {
            const slug = makeSlug(p);
            const first = p.variants.find((v) => Number(v.stock) > 0) || p.variants[0];
            const q = first
              ? `?color=${encodeURIComponent(first.colour)}&size=${encodeURIComponent(first.size)}`
              : "";

            return (
              <Link
                key={p._id}
                href={`/Ethnic-Wears/${slug}${q}`}
                className="group bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <SafeImage
                    src={p.images?.[0]}
                    alt={p.product_name || `${p.material} ${p.category}`}
                    fill
                    sizes="(min-width:1024px) 25vw, 50vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {p.hasMultipleOptions && (
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
                      Options Available
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-900 text-sm mb-1 leading-tight line-clamp-2">
                    {p.product_name || `${p.material} ${p.category}`}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">Code: {p.product_code}</p>
                  <p className="text-sm font-semibold text-gray-900">
                    ₹{p.minPrice}
                    {p.minPrice !== p.maxPrice && ` - ₹${p.maxPrice}`}
                  </p>
                  <div className="w-full mt-2 py-2 text-xs font-medium rounded bg-black text-white text-center">
                    {p.hasMultipleOptions ? "VIEW OPTIONS" : "VIEW PRODUCT"}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-lg font-light text-gray-900 mb-2">No Ethnic Products Found</h3>
            <p className="text-gray-600 mb-4">Try widening your filters or clearing them.</p>
            <button
              onClick={clearFilters}
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Trust strip (kept concise) */}
      <div className="border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Truck className="w-7 h-7 text-gray-900 mb-2" />
              <h4 className="font-medium text-gray-900 mb-1">Free Shipping</h4>
              <p className="text-sm text-gray-600">Across Kerala</p>
            </div>
            <div className="flex flex-col items-center">
              <Shield className="w-7 h-7 text-gray-900 mb-2" />
              <h4 className="font-medium text-gray-900 mb-1">Secure Payment</h4>
              <p className="text-sm text-gray-600">100% Protected</p>
            </div>
            <div className="flex flex-col items-center">
              <RotateCcw className="w-7 h-7 text-gray-900 mb-2" />
              <h4 className="font-medium text-gray-900 mb-1">Easy Returns</h4>
              <p className="text-sm text-gray-600">7 Day Policy</p>
            </div>
            <div className="flex flex-col items-center">
              <Star className="w-7 h-7 text-gray-900 mb-2" />
              <h4 className="font-medium text-gray-900 mb-1">Quality Assured</h4>
              <p className="text-sm text-gray-600">Handcrafted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
