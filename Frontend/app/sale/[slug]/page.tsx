// app/sale/[slug]/page.tsx
"use client";

import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Heart, ShoppingCart, Minus, Plus, X, Check, ArrowLeft } from "lucide-react";

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
  material: string;
  category: string;
  images: string[];
  colorImages?: Record<string, string[]>;
  description: string;
  variants: Variant[];
  availableSizes: string[];
  availableColors: string[];
  totalStock: number;
  minPrice: number;
  maxPrice: number;
};

/* ---------- Helpers ---------- */
const imgUrl = (p?: string | null) => {
  if (!p || typeof p !== "string") return "/images/placeholder.jpg";
  if (p.startsWith("http") || p.startsWith("/")) return p;
  return `/images/${p}`;
};
const norm = (s?: string) => (s ?? "").trim().toLowerCase();
const same = (a?: string, b?: string) => norm(a) === norm(b);
const displayName = (p: Product) => p.product_name || `${p.material} ${p.category}`.trim();
const makeSlug = (p: Product) =>
  (p.slug ||
    (p.product_name || `${p.material || ""}-${p.category || ""}`).trim() +
      (p.product_code ? `-${p.product_code}` : "")
  )
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

/* ---------- Page ---------- */
export default function SaleSlugPage() {
  const { slug } = useParams<{ slug: string }>();
  const search = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  // UI
  const [imgIndex, setImgIndex] = useState(0);
  const [size, setSize] = useState(search.get("size") || "");
  const [color, setColor] = useState(search.get("color") || "");
  const [qty, setQty] = useState(1);

  // wishlist + toast
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [showCartToast, setShowCartToast] = useState(false);
  const [addedName, setAddedName] = useState("");

  /* ---------- normalize ---------- */
  function normalize(p: any): Product {
    const imgs = (Array.isArray(p.images) && p.images.length ? p.images : ["/images/placeholder.jpg"]).map(imgUrl);

    const vs: Variant[] = Array.isArray(p.variants)
      ? p.variants.map((v: any) => ({
          _id: v._id,
          size: String(v.size ?? "One Size"),
          colour: String(v.colour ?? "Standard"),
          stock: Number(v.stock ?? v.quantity ?? 0),
          price: Number(v.price ?? 0),
          images: Array.isArray(v.images) ? v.images.map(imgUrl) : undefined,
        }))
      : [];

    const availableSizes = p.availableSizes?.length ? p.availableSizes : Array.from(new Set(vs.map((v) => v.size)));
    const availableColors = p.availableColors?.length ? p.availableColors : Array.from(new Set(vs.map((v) => v.colour)));
    const totalStock = typeof p.totalStock === "number" ? p.totalStock : vs.reduce((s, v) => s + (v.stock || 0), 0);
    const prices = vs.map((v) => v.price).filter((n) => typeof n === "number");
    const minPrice = typeof p.minPrice === "number" ? p.minPrice : prices.length ? Math.min(...prices) : 0;
    const maxPrice = typeof p.maxPrice === "number" ? p.maxPrice : prices.length ? Math.max(...prices) : minPrice;

    if (p.colorImages) {
      Object.keys(p.colorImages).forEach((c: string) => {
        p.colorImages[c] = (p.colorImages[c] || []).map(imgUrl);
      });
    }

    return {
      _id: String(p._id),
      slug: p.slug,
      product_code: String(p.product_code ?? ""),
      product_name: p.product_name,
      material: String(p.material ?? ""),
      category: String(p.category ?? ""),
      images: imgs,
      colorImages: p.colorImages || undefined,
      description: String(p.description ?? p.product_name ?? `${p.material || ""} ${p.category || ""}`.trim()),
      variants: vs,
      availableSizes,
      availableColors,
      totalStock,
      minPrice,
      maxPrice,
    };
  }

  /* ---------- fetch product (sale only) ---------- */
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      setProduct(null);
      try {
        const s = decodeURIComponent(String(slug || "")).toLowerCase();

        // Try direct hit: /api/products/[slug]
        const one = await fetch(`/api/products/${s}`, { cache: "no-store" });
        if (one.ok) {
          const raw = await one.json();
          const cat = String(raw.category || "").toLowerCase();
          const isSale = /\bsale\b/.test(cat) || raw.isSale === true || (Array.isArray(raw.tags) && raw.tags.map((t: any) => String(t).toLowerCase()).includes("sale"));
          if (!isSale) throw new Error("Product is not a sale item");
          setProduct(normalize(raw));
          return;
        }

        // Fallback: load /api/products?category=sale and match
        const res = await fetch("/api/products?category=sale", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load sale products");
        const list = (await res.json()).map(normalize) as Product[];

        const found =
          list.find((p) => (p.slug || "").toLowerCase() === s) ||
          list.find((p) => makeSlug(p) === s) ||
          list.find((p) => p._id?.toLowerCase?.() === s) ||
          list.find((p) => (p.product_code || "").toLowerCase() === s) ||
          null;

        if (!found) throw new Error("Product not found");
        setProduct(found);
      } catch (e: any) {
        setError(e.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  /* ---------- init defaults & sync URL ---------- */
  useEffect(() => {
    if (!product) return;
    const colors = product.availableColors || [];
    const sizes = product.availableSizes || [];
    const first = product.variants.find((v) => v.stock > 0) || product.variants[0];

    const c = color || first?.colour || colors[0] || "";
    const s = size || first?.size || sizes[0] || "";
    setColor(c);
    setSize(s);

    const q = new URLSearchParams(search.toString());
    if (c) q.set("color", c);
    if (s) q.set("size", s);
    const finalSlug = product.slug || makeSlug(product);
    // LOWERCASE route
    router.replace(`/sale/${finalSlug}?${q.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  /* ---------- wishlist ---------- */
  useEffect(() => {
    try {
      const w = localStorage.getItem("wishlist");
      if (w) setWishlistIds(new Set(JSON.parse(w).map((i: any) => i.id)));
    } catch {}
  }, []);
  const inWishlist = (id: string) => wishlistIds.has(id);
  const toggleWishlist = () => {
    if (!product) return;
    const id = product._id;
    let existing: any[] = [];
    try { const d = localStorage.getItem("wishlist"); if (d) existing = JSON.parse(d); } catch {}
    const has = existing.find((x: any) => x.id === id);
    const item = {
      id, productId: id,
      name: displayName(product),
      price: product.minPrice,
      image: product.images[0] || "/images/placeholder.jpg",
      productCode: product.product_code,
    };
    const updated = has ? existing.filter((x: any) => x.id !== id) : [...existing, item];
    localStorage.setItem("wishlist", JSON.stringify(updated));
    setWishlistIds(new Set(updated.map((i: any) => i.id)));
    window.dispatchEvent(new Event("wishlist-updated"));
  };

  /* ---------- variant helpers ---------- */
  const variant = useMemo(() => {
    if (!product) return null;
    return product.variants.find((v) => (!color || same(v.colour, color)) && (!size || same(v.size, size))) || null;
  }, [product, color, size]);

  const gallery = useMemo(() => {
    if (!product) return ["/images/placeholder.jpg"];
    if (variant?.images?.length) return variant.images.map(imgUrl);
    if (product.colorImages?.[color]?.length) return product.colorImages[color];
    return product.images;
  }, [product, variant, color]);

  useEffect(() => setImgIndex(0), [gallery.join("|")]);

  const price = variant ? variant.price : (product?.minPrice || 0);
  const stock = variant ? variant.stock : (product?.totalStock || 0);

  const colorsAvail = useMemo(() => {
    if (!product) return [];
    if (!size) return product.availableColors;
    const s = new Set(product.variants.filter((v) => same(v.size, size) && v.stock > 0).map((v) => v.colour));
    const arr = Array.from(s);
    return arr.length ? arr : product.availableColors;
  }, [product, size]);

  const sizesAvail = useMemo(() => {
    if (!product) return [];
    if (!color) return product.availableSizes;
    const s = new Set(product.variants.filter((v) => same(v.colour, color) && v.stock > 0).map((v) => v.size));
    const arr = Array.from(s);
    return arr.length ? arr : product.availableSizes;
  }, [product, color]);

  const pickColor = (c: string) => {
    if (!product) return;
    setColor(c);
    if (size && !product.variants.some((v) => same(v.colour, c) && same(v.size, size) && v.stock > 0)) {
      const s = sizesAvail[0] || "";
      setSize(s);
    }
    const q = new URLSearchParams(search.toString());
    if (c) q.set("color", c);
    if (size) q.set("size", size);
    router.replace(`/sale/${product.slug || makeSlug(product)}?${q.toString()}`);
  };

  const pickSize = (s: string) => {
    if (!product) return;
    setSize(s);
    if (color && !product.variants.some((v) => same(v.size, s) && same(v.colour, color) && v.stock > 0)) {
      const c = colorsAvail[0] || "";
      setColor(c);
    }
    const q = new URLSearchParams(search.toString());
    if (color) q.set("color", color);
    if (s) q.set("size", s);
    router.replace(`/sale/${product.slug || makeSlug(product)}?${q.toString()}`);
  };

  /* ---------- cart (localStorage) ---------- */
  const addToCart = () => {
    if (!product || !variant) { alert("Please select available options."); return; }
    if (qty > variant.stock) { alert(`Only ${variant.stock} available.`); return; }
    const item = {
      id: `${product._id}-${variant.size}-${variant.colour}`,
      productId: product._id,
      variantId: variant._id || `${variant.size}-${variant.colour}`,
      name: displayName(product),
      price: variant.price,
      image: (gallery[0] || product.images[0]) ?? "/images/placeholder.jpg",
      quantity: qty,
      size: variant.size,
      color: variant.colour,
      productCode: product.product_code,
      material: product.material,
      category: product.category,
      maxStock: variant.stock,
    };
    let existing: any[] = [];
    try { const d = localStorage.getItem("cart"); if (d) existing = JSON.parse(d); } catch {}
    const i = existing.findIndex((x: any) => x.id === item.id);
    if (i > -1) {
      const newQty = existing[i].quantity + qty;
      if (newQty > item.maxStock) { alert(`Only ${item.maxStock} available. You already have ${existing[i].quantity} in cart.`); return; }
      existing[i] = { ...existing[i], quantity: newQty };
    } else {
      existing.push(item);
    }
    localStorage.setItem("cart", JSON.stringify(existing));
    window.dispatchEvent(new Event("cart-updated"));
    setAddedName(item.name);
    setShowCartToast(true);
    setTimeout(() => setShowCartToast(false), 2500);
  };

  /* ---------- RENDER ---------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
      </div>
    );
  }
  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-700">{error || "Product not found."}</p>
        <button onClick={() => router.push("/sale")} className="inline-flex items-center gap-2 px-4 py-2 border rounded">
          <ArrowLeft className="w-4 h-4" /> Back to Sale
        </button>
      </div>
    );
  }

  const wishActive = inWishlist(product._id);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6">
        <button onClick={() => router.push("/sale")} className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4" /> Back to Sale
        </button>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Gallery */}
          <div>
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
              <Image src={imgUrl(gallery[imgIndex])} alt={displayName(product)} fill className="object-cover" />
            </div>
            {gallery.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-3">
                {gallery.map((g, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIndex(i)}
                    className={`relative aspect-square rounded border-2 overflow-hidden ${imgIndex === i ? "border-black" : "border-transparent"}`}
                  >
                    <Image src={imgUrl(g)} alt={`view ${i + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right side */}
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl md:text-3xl font-light text-gray-900">{displayName(product)}</h1>
                <p className="text-sm text-gray-500 mt-1">Product Code: {product.product_code}</p>
              </div>
              <button
                onClick={toggleWishlist}
                className={`w-10 h-10 rounded-full border flex items-center justify-center ${
                  wishActive ? "border-red-500 text-red-500" : "border-gray-300 text-gray-600 hover:text-red-500"
                }`}
                aria-label="Wishlist"
                title={wishActive ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                <Heart className={`w-5 h-5 ${wishActive ? "fill-current" : ""}`} />
              </button>
            </div>

            <div className="mt-4 text-sm text-gray-700 space-y-1">
              <div><span className="text-gray-500">Material:</span> {product.material || "-"}</div>
              <div><span className="text-gray-500">Category:</span> {product.category || "-"}</div>
              <div><span className="text-gray-500">Price:</span> ₹{price}{product.minPrice !== product.maxPrice && ` (₹${product.minPrice} - ₹${product.maxPrice})`}</div>
              <div><span className="text-gray-500">Available Colors:</span> {(product.availableColors || []).join(", ") || "-"}</div>
              <div><span className="text-gray-500">Available Sizes:</span> {(product.availableSizes || []).join(", ") || "-"}</div>
              <div><span className="text-gray-500">Stock:</span> {stock}</div>
            </div>

            {/* Color */}
            {product.availableColors.length > 0 && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">Color {color && `: ${color}`}</label>
                <div className="flex flex-wrap gap-2">
                  {product.availableColors.map((c) => {
                    const disabled = !product.variants.some(
                      (v) => same(v.colour, c) && (!size || same(v.size, size)) && v.stock > 0
                    );
                    return (
                      <button
                        key={c}
                        onClick={() => !disabled && pickColor(c)}
                        disabled={disabled}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                          same(color, c) ? "border-black bg-black text-white" : "border-gray-300 hover:border-gray-400"
                        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size */}
            {product.availableSizes.length > 0 && (
              <div className="mt-5">
                <label className="block text-sm font-medium text-gray-900 mb-2">Size {size && `: ${size}`}</label>
                <div className="flex flex-wrap gap-2">
                  {product.availableSizes.map((s) => {
                    const disabled = !product.variants.some(
                      (v) => same(v.size, s) && (!color || same(v.colour, color)) && v.stock > 0
                    );
                    return (
                      <button
                        key={s}
                        onClick={() => !disabled && pickSize(s)}
                        disabled={disabled}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                          same(size, s) ? "border-black bg-black text-white" : "border-gray-300 hover:border-gray-400"
                        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stock + Qty */}
            <div className="mt-6 flex items-center gap-4">
              <p className={`text-sm font-medium ${stock > 5 ? "text-green-600" : stock > 0 ? "text-yellow-700" : "text-red-600"}`}>
                {stock > 0 ? `${stock} in stock` : "Out of stock"}
              </p>
              {stock > 0 && (
                <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-10 hover:bg-gray-100" aria-label="Decrease quantity">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-medium">{qty}</span>
                  <button onClick={() => setQty((q) => Math.min(stock, q + 1))} className="w-10 h-10 hover:bg-gray-100" aria-label="Increase quantity">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                disabled={!variant || stock === 0}
                onClick={addToCart}
                className={`flex-1 bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors font-medium inline-flex items-center justify-center gap-2 ${
                  (!variant || stock === 0) ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cart toast */}
      {showCartToast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <Check className="w-5 h-5" />
          <div>
            <p className="text-sm font-medium">Added to Cart</p>
            <p className="text-xs opacity-90">{addedName}</p>
          </div>
          <button onClick={() => setShowCartToast(false)} className="ml-2 hover:bg-green-600 rounded-full p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
