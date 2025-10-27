"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Minus, Plus, X, Check, CreditCard, ArrowLeft } from "lucide-react";

/* ========= Types ========= */
type Variant = {
  _id: string;
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

type ShippingInfo = {
  name: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
};

/* ========= Config ========= */
const MAX_OPTIONS = 10;

/* ========= Utils ========= */
const imgUrl = (p?: string | null) => {
  if (!p || typeof p !== "string") return "/images/placeholder.jpg";
  if (p.startsWith("http") || p.startsWith("/")) return p;
  return `/images/${p}`;
};

const makeSlug = (p: Product) => {
  const base = p.slug || p.product_name || `${p.material || ""}-${p.category || ""}`.trim();
  const code = p.product_code ? `-${p.product_code}` : "";
  return (base + code).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
};

const displayName = (p: Product) => p.product_name || `${p.material} ${p.category}`;
const inr = (n: number | string) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

// normalizers
const norm = (s?: string) => (s ?? "").trim().toLowerCase();
const same = (a?: string, b?: string) => norm(a) === norm(b);

/* ========= Component ========= */
export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const search = useSearchParams();
  const router = useRouter();

  /* Data */
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);

  /* Variant/UI state */
  const [color, setColor] = useState<string>(search.get("color") || "");
  const [size, setSize] = useState<string>(search.get("size") || "");
  const [imgIndex, setImgIndex] = useState(0);
  const [qty, setQty] = useState(1);

  /* Wishlist/Cart/Order state */
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [showCartToast, setShowCartToast] = useState(false);
  const [addedName, setAddedName] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [shipping, setShipping] = useState<ShippingInfo>({
    name: "", email: "", phone: "",
    address1: "", address2: "",
    city: "", state: "", pincode: "", country: "India",
  });

  /* Show-all toggles for large option sets */
  const [showAllColors, setShowAllColors] = useState(false);
  const [showAllSizes, setShowAllSizes] = useState(false);

  /* ========= Fetch Product ========= */
  useEffect(() => {
    (async () => {
      setLoading(true);
      setProduct(null);
      try {
        const slugParam = decodeURIComponent(String(slug || "")).toLowerCase();

        // Try API: /api/products/[slug]
        const one = await fetch(`/api/products/${slugParam}`, { cache: "no-store" });
        if (one.ok) {
          const p: Product = await one.json();
          p.images = (p.images?.length ? p.images : ["/images/placeholder.jpg"]).map(imgUrl);
          if (p.colorImages) Object.keys(p.colorImages).forEach(c => {
            p.colorImages![c] = (p.colorImages![c] || []).map(imgUrl);
          });
          setProduct(p);
          return;
        }

        // Fallback: load all and match locally
        const res = await fetch("/api/products", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load products");
        const list: Product[] = await res.json();

        list.forEach((p: any) => {
          p.images = (Array.isArray(p.images) && p.images.length ? p.images : ["/images/placeholder.jpg"]).map(imgUrl);
          if (p.colorImages) {
            Object.keys(p.colorImages).forEach((c) => {
              p.colorImages[c] = (p.colorImages[c] || []).map(imgUrl);
            });
          }
        });

        const found =
          list.find(p => (p.slug || "").toLowerCase() === slugParam) ||
          list.find(p => makeSlug(p) === slugParam) ||
          list.find(p => p._id?.toLowerCase?.() === slugParam) ||
          list.find(p => (p.product_code || "").toLowerCase() === slugParam) ||
          null;

        setProduct(found);
      } catch (e) {
        console.error("[Detail] fetch error:", e);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  /* ========= Full options (independent of stock/selection) ========= */
  const fullColors = useMemo(() => {
    if (!product) return [] as string[];
    const fromBackend = (product.availableColors || []).filter(Boolean);
    const fromVariants = Array.from(new Set(product.variants.map(v => v.colour).filter(Boolean)));
    const base = fromBackend.length ? fromBackend : fromVariants;
    const seen = new Set<string>(), out: string[] = [];
    for (const c of base) { const k = norm(c); if (!seen.has(k)) { seen.add(k); out.push(c); } }
    return out;
  }, [product]);

  const fullSizes = useMemo(() => {
    if (!product) return [] as string[];
    const fromBackend = (product.availableSizes || []).filter(Boolean);
    const fromVariants = Array.from(new Set(product.variants.map(v => v.size).filter(Boolean)));
    const base = fromBackend.length ? fromBackend : fromVariants;
    const seen = new Set<string>(), out: string[] = [];
    for (const s of base) { const k = norm(s); if (!seen.has(k)) { seen.add(k); out.push(s); } }
    return out;
  }, [product]);

  /* ========= Init defaults & sync URL ========= */
  useEffect(() => {
    if (!product) return;
    const colors = fullColors;
    const sizes = fullSizes;
    const firstInStock = product.variants.find(v => v.stock > 0) || product.variants[0];
    const c = color || firstInStock?.colour || colors[0] || "";
    const s = size || firstInStock?.size || sizes[0] || "";
    setColor(c); setSize(s);
    const q = new URLSearchParams(search.toString());
    if (c) q.set("color", c);
    if (s) q.set("size", s);
    router.replace(`/Ethnic-Wears/${slug}?${q.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, fullColors.length, fullSizes.length]);

  /* ========= Variant helpers ========= */
  const variant = useMemo(() => {
    if (!product) return null;
    return product.variants.find(v =>
      (!color || same(v.colour, color)) && (!size || same(v.size, size))
    ) || null;
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

  /* Render-limited lists with toggles */
  const colorsAvail = showAllColors ? fullColors : fullColors.slice(0, MAX_OPTIONS);
  const sizesAvail  = showAllSizes  ? fullSizes  : fullSizes.slice(0, MAX_OPTIONS);

  const pickColor = (c: string) => {
    if (!product) return;
    setColor(c);
    const hasPair = size && product.variants.some(v => same(v.colour, c) && same(v.size, size) && v.stock > 0);
    const nextSize = hasPair ? size
      : (fullSizes.find(s => product.variants.some(v => same(v.colour, c) && same(v.size, s) && v.stock > 0)) || "");
    if (nextSize !== size) setSize(nextSize);
    const q = new URLSearchParams(search.toString());
    if (c) q.set("color", c);
    if (nextSize) q.set("size", nextSize);
    router.replace(`/Ethnic-Wears/${slug}?${q.toString()}`);
  };

  const pickSize = (s: string) => {
    if (!product) return;
    setSize(s);
    const hasPair = color && product.variants.some(v => same(v.size, s) && same(v.colour, color) && v.stock > 0);
    const nextColor = hasPair ? color
      : (fullColors.find(c => product.variants.some(v => same(v.size, s) && same(v.colour, c) && v.stock > 0)) || "");
    if (nextColor !== color) setColor(nextColor);
    const q = new URLSearchParams(search.toString());
    if (nextColor) q.set("color", nextColor);
    if (s) q.set("size", s);
    router.replace(`/Ethnic-Wears/${slug}?${q.toString()}`);
  };

  /* ========= Wishlist ========= */
  useEffect(() => {
    try {
      const w = localStorage.getItem("wishlist");
      if (w) {
        const arr = JSON.parse(w);
        setWishlistIds(new Set(arr.map((i: any) => i.id)));
      }
    } catch {}
  }, []);
  const inWishlist = (pid: string) => wishlistIds.has(pid);

  const toggleWishlist = () => {
    if (!product) return;
    const id = product._id;
    const item = {
      id,
      productId: id,
      name: displayName(product),
      price: product.minPrice,
      image: (gallery[0] || product.images[0]) ?? "/images/placeholder.jpg",
      productCode: product.product_code,
    };
    let existing: any[] = [];
    try { const data = localStorage.getItem("wishlist"); if (data) existing = JSON.parse(data); } catch {}
    const has = existing.find((x: any) => x.id === id);
    const updated = has ? existing.filter((x: any) => x.id !== id) : [...existing, item];
    localStorage.setItem("wishlist", JSON.stringify(updated));
    setWishlistIds(new Set(updated.map((i: any) => i.id)));
    window.dispatchEvent(new Event("wishlist-updated"));
  };

  /* ========= Cart ========= */
  const addToCart = () => {
    if (!product || !variant) { alert("Please select available options."); return; }
    const item = {
      id: `${product._id}-${variant.size}-${variant.colour}`,
      productId: product._id,
      variantId: variant._id,
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
    if (qty > variant.stock) { alert(`Only ${variant.stock} available.`); return; }
    let existing: any[] = [];
    try { const d = localStorage.getItem("cart"); if (d) existing = JSON.parse(d); } catch {}
    const idx = existing.findIndex((i: any) => i.id === item.id);
    if (idx > -1) {
      const newQty = existing[idx].quantity + qty;
      if (newQty > item.maxStock) { alert(`Only ${item.maxStock} available. You already have ${existing[idx].quantity} in cart.`); return; }
      existing[idx] = { ...existing[idx], quantity: newQty };
    } else {
      existing.push(item);
    }
    localStorage.setItem("cart", JSON.stringify(existing));
    window.dispatchEvent(new Event("cart-updated"));
    setAddedName(displayName(product));
    setShowCartToast(true);
    setTimeout(() => setShowCartToast(false), 2500);
  };

  /* ========= Order / Payment ========= */
  const openPayment = () => {
    if (!product || !variant) { alert("Please select available options."); return; }
    setShowPaymentModal(true); setOrderSuccess(false);
  };

  const createOrderOnline = async () => {
    if (!product || !variant) return;
    const required = ["name","email","phone","address1","city","state","pincode","country"] as const;
    for (const k of required) {
      const val = (shipping as any)[k];
      if (!val || String(val).trim() === "") { alert(`Please enter ${k.toUpperCase()}.`); return; }
    }
    if (qty > variant.stock) { alert(`Only ${variant.stock} available.`); return; }

    setOrderProcessing(true);
    try {
      const orderData = {
        items: [{ product_id: product._id, variant_id: variant._id, quantity: qty, price: variant.price, size: variant.size, color: variant.colour, product_code: product.product_code }],
        customer_name: shipping.name,
        customer_email: shipping.email,
        customer_phone: shipping.phone,
        shipping_address: `${shipping.address1}${shipping.address2 ? ", " + shipping.address2 : ""}, ${shipping.city}, ${shipping.state} - ${shipping.pincode}, ${shipping.country}`,
        shipping: { ...shipping },
        total_amount: variant.price * qty,
        payment_method: "online",
      };
      const res = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token") || ""}` }, body: JSON.stringify(orderData) });
      if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.message || `Order failed (${res.status})`); }
      setProduct(prev => {
        if (!prev) return prev;
        const updated = prev.variants.map(v => v._id === variant._id ? { ...v, stock: v.stock - qty } : v);
        const totalStock = updated.reduce((s, v) => s + v.stock, 0);
        return { ...prev, variants: updated, totalStock };
      });
      setOrderSuccess(true);
      setTimeout(() => {
        setShowPaymentModal(false);
        setShipping({ name: "", email: "", phone: "", address1: "", address2: "", city: "", state: "", pincode: "", country: "India" });
        setOrderSuccess(false);
      }, 2500);
    } catch (e: any) {
      console.error(e); alert(e.message || "Order failed. Please try again.");
    } finally { setOrderProcessing(false); }
  };

  /* ========= Render ========= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-700">Product not found.</p>
        <Link href="/Ethnic-Wears" className="inline-flex items-center gap-2 px-4 py-2 border rounded">
          <ArrowLeft className="w-4 h-4" /> Back to Ethnic Collection
        </Link>
      </div>
    );
  }

  const wishActive = inWishlist(product._id);

  return (
    <div className="min-h-screen bg-white">
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

      <div className="container mx-auto px-4 py-6">
        <Link href="/Ethnic-Wears" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4" /> Back to Ethnic Collection
        </Link>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-8">
          {/* LEFT: Gallery */}
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
                    <Image src={imgUrl(g)} alt={`${displayName(product)} view ${i + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Essentials ONLY */}
          <div>
            {/* Title + Wishlist */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl md:text-3xl font-light text-gray-900">
                  {displayName(product)}
                </h1>
                {product.product_code && (
                  <p className="text-sm text-gray-500 mt-1">Product Code: {product.product_code}</p>
                )}
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

            {/* Essentials list */}
            <div className="mt-4 space-y-1 text-sm">
              <p><span className="text-gray-500">Material:</span> <span className="font-medium text-gray-900">{product.material}</span></p>
              <p><span className="text-gray-500">Price:</span> <span className="font-medium text-gray-900">{inr(price)}</span></p>
              <p><span className="text-gray-500">Color:</span> <span className="font-medium text-gray-900">{color || "—"}</span></p>
              <p><span className="text-gray-500">Size:</span> <span className="font-medium text-gray-900">{size || "—"}</span></p>
            </div>

            {/* Price (prominent) */}
            <div className="mt-4">
              <span className="text-3xl font-light text-gray-900">{inr(price)}</span>
              {product.minPrice !== product.maxPrice && (
                <span className="ml-2 text-sm text-gray-500">(range {inr(product.minPrice)}–{inr(product.maxPrice)})</span>
              )}
            </div>

            {/* Color picker */}
            {fullColors.length > 0 && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Select Color {color && `: ${color}`}
                </label>
                <div className="flex flex-wrap gap-2">
                  {colorsAvail.map(c => {
                    const disabled = !product.variants.some(
                      v => same(v.colour, c) && (!size || same(v.size, size)) && v.stock > 0
                    );
                    return (
                      <button
                        key={c}
                        onClick={() => !disabled && pickColor(c)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                          same(color, c) ? "border-black bg-black text-white" : "border-gray-300 hover:border-gray-400"
                        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={disabled}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
                {fullColors.length > MAX_OPTIONS && (
                  <button onClick={() => setShowAllColors(s => !s)} className="mt-2 text-xs underline text-gray-600 hover:text-gray-900">
                    {showAllColors ? "Show fewer colors" : `Show all colors (+${fullColors.length - MAX_OPTIONS})`}
                  </button>
                )}
              </div>
            )}

            {/* Size picker */}
            {fullSizes.length > 0 && (
              <div className="mt-5">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Select Size {size && `: ${size}`}
                </label>
                <div className="flex flex-wrap gap-2">
                  {sizesAvail.map(s => {
                    const disabled = !product.variants.some(
                      v => same(v.size, s) && (!color || same(v.colour, color)) && v.stock > 0
                    );
                    return (
                      <button
                        key={s}
                        onClick={() => !disabled && pickSize(s)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                          same(size, s) ? "border-black bg-black text-white" : "border-gray-300 hover:border-gray-400"
                        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={disabled}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
                {fullSizes.length > MAX_OPTIONS && (
                  <button onClick={() => setShowAllSizes(s => !s)} className="mt-2 text-xs underline text-gray-600 hover:text-gray-900">
                    {showAllSizes ? "Show fewer sizes" : `Show all sizes (+${fullSizes.length - MAX_OPTIONS})`}
                  </button>
                )}
              </div>
            )}

            {/* Stock + Qty */}
            <div className="mt-6 flex items-center gap-4">
              <p className={`text-sm font-medium ${stock > 5 ? "text-green-600" : stock > 0 ? "text-yellow-700" : "text-red-600"}`}>
                {stock > 0 ? `${stock} in stock` : "Out of stock"}
              </p>
              {stock > 0 && (
                <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 hover:bg-gray-100" aria-label="Decrease quantity">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-medium">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(stock, q + 1))} className="w-10 h-10 hover:bg-gray-100" aria-label="Increase quantity">
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
              <button
                disabled={!variant || stock === 0}
                onClick={openPayment}
                className={`flex-1 border py-3 px-6 rounded-lg transition-colors font-medium ${
                  (!variant || stock === 0) ? "border-gray-300 text-gray-400 cursor-not-allowed" : "border-black text-black hover:bg-black hover:text-white"
                }`}
              >
                Order Now
              </button>
            </div>

            <div className="mt-4 text-xs text-gray-500">Secure online payment • Easy returns • Fast shipping in Kerala</div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && product && variant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl">
            <div className="p-6">
              {/* Top bar with Back */}
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setShowPaymentModal(false)} className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="w-4 h-4" />
                  Back to product
                </button>
                <button onClick={() => setShowPaymentModal(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {orderSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Order Placed Successfully!</h3>
                  <p className="text-gray-600 mb-1">We’ll contact you at <b>{shipping.phone}</b> with delivery details.</p>
                  <p className="text-sm text-gray-500">You can close this window.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {/* LEFT: Shipping form */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Shipping Details</h4>
                    <div className="space-y-3">
                      <input type="text" placeholder="Full Name" value={shipping.name} onChange={(e) => setShipping(s => ({ ...s, name: e.target.value }))} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" />
                      <input type="email" placeholder="Email Address" value={shipping.email} onChange={(e) => setShipping(s => ({ ...s, email: e.target.value }))} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" />
                      <input type="tel" placeholder="Phone Number" value={shipping.phone} onChange={(e) => setShipping(s => ({ ...s, phone: e.target.value }))} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" />
                      <input type="text" placeholder="Address Line 1" value={shipping.address1} onChange={(e) => setShipping(s => ({ ...s, address1: e.target.value }))} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" />
                      <input type="text" placeholder="Address Line 2 (optional)" value={shipping.address2} onChange={(e) => setShipping(s => ({ ...s, address2: e.target.value }))} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" />
                      <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="City" value={shipping.city} onChange={(e) => setShipping(s => ({ ...s, city: e.target.value }))} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" />
                        <input type="text" placeholder="State" value={shipping.state} onChange={(e) => setShipping(s => ({ ...s, state: e.target.value }))} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="Pincode" value={shipping.pincode} onChange={(e) => setShipping(s => ({ ...s, pincode: e.target.value }))} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" />
                        <input type="text" placeholder="Country" value={shipping.country} onChange={(e) => setShipping(s => ({ ...s, country: e.target.value }))} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" />
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: Summary + Pay Online */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                          <Image src={(gallery[0] || product.images[0]) ?? "/images/placeholder.jpg"} alt={displayName(product)} width={48} height={48} className="object-cover w-full h-full" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{displayName(product)}</p>
                          <p className="text-xs text-gray-500">
                            {size && `Size: ${size}`} {size && color && " • "} {color && `Color: ${color}`}
                          </p>
                          <p className="text-xs text-gray-500">Qty: {qty}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">{inr(variant.price * qty)}</p>
                        </div>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Total</span>
                          <span className="text-lg font-semibold text-gray-900">{inr(variant.price * qty)}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={createOrderOnline}
                      disabled={
                        orderProcessing ||
                        !shipping.name || !shipping.email || !shipping.phone ||
                        !shipping.address1 || !shipping.city || !shipping.state ||
                        !shipping.pincode || !shipping.country
                      }
                      className="w-full bg-black text-white py-4 px-6 rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-3 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {orderProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5" />
                          Pay Online
                        </>
                      )}
                    </button>

                    <button onClick={() => setShowPaymentModal(false)} className="w-full mt-3 text-sm text-gray-600 hover:text-gray-900 underline">
                      Back to product
                    </button>
                    <button onClick={() => router.back()} className="w-full mt-1 text-xs text-gray-500 hover:text-gray-800 underline">
                      (Go back to previous page)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
