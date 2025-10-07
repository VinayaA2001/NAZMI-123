"use client";
import { useState, useEffect } from "react";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
};

const sampleProducts: Product[] = [
  {
    id: "p1",
    name: "Classic Blue Jeans",
    price: 1299,
    image: "/images/jeans.png",
  },
  {
    id: "p2",
    name: "Classic White Shirt",
    price: 999,
    image: "/images/shirt.png",
  },
  {
    id: "p3",
    name: "T-Shirts",
    price: 1499,
    image: "/images/tshirt.png",
  },
];

export default function ProductGrid() {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [cart, setCart] = useState<any[]>([]);

  // Load wishlist + cart from localStorage
  useEffect(() => {
    const storedWishlist = localStorage.getItem("wishlist");
    const storedCart = localStorage.getItem("cart");
    if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

  // Add/remove from wishlist
  const toggleWishlist = (product: Product) => {
    let updated: Product[];
    if (wishlist.some((item) => item.id === product.id)) {
      updated = wishlist.filter((item) => item.id !== product.id);
    } else {
      updated = [...wishlist, product];
    }
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));

    // 👇 Dispatch event so Header updates instantly
    window.dispatchEvent(new Event("wishlist-updated"));
  };

  // Add to cart
  const addToCart = (product: Product) => {
    const existing = cart.find((item) => item.id === product.id);
    let updated;
    if (existing) {
      updated = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updated = [...cart, { ...product, quantity: 1 }];
    }
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));

    // 👇 Dispatch event so Header updates instantly
    window.dispatchEvent(new Event("cart-updated"));
  };

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
      {sampleProducts.map((product) => {
        const inWishlist = wishlist.some((item) => item.id === product.id);
        return (
          <div
            key={product.id}
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-sm text-neutral-600">₹{product.price}</p>

              <div className="mt-4 flex items-center justify-between">
                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`text-xl ${
                    inWishlist ? "text-red-500" : "text-gray-400 hover:text-red-500"
                  }`}
                >
                  ♥
                </button>

                {/* Add to Cart */}
                <button
                  onClick={() => addToCart(product)}
                  className="px-4 py-1 rounded bg-black text-white hover:bg-neutral-800 text-sm"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
