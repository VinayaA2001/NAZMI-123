"use client";
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
};

const products: Product[] = [
  {
    id: "anarkali",
    name: "Ethnic Anarkali",
    price: 1799,
    image: "/images/anarkali1.png",
  },
  {
    id: "gown",
    name: "Ethnic churidhar",
    price: 1999,
    image: "/images/anarkali2.png",
  },
];

export default function EthnicDressesPage() {
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Load wishlist from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("wishlist");
    if (stored) setWishlist(JSON.parse(stored));
  }, []);

  // Toggle wishlist
  const toggleWishlist = (product: Product) => {
    let updated: Product[];
    const stored = JSON.parse(localStorage.getItem("wishlist") || "[]");

    if (wishlist.includes(product.id)) {
      // remove
      updated = stored.filter((item: Product) => item.id !== product.id);
    } else {
      // add
      updated = [...stored, product];
    }

    setWishlist(updated.map((p: Product) => p.id));
    localStorage.setItem("wishlist", JSON.stringify(updated));

    // Trigger storage event for header badge
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <section className="container py-10">
      <h1 className="text-2xl font-semibold mb-6">Ethnic Dresses</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 relative">
            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product)}
              className="absolute top-3 right-3 p-2 rounded-full bg-white shadow hover:scale-110 transition"
            >
              <Heart
                size={20}
                className={
                  wishlist.includes(product.id)
                    ? "fill-red-500 text-red-500"
                    : "text-gray-500"
                }
              />
            </button>

            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover rounded-md"
            />
            <h2 className="mt-2 font-semibold">{product.name}</h2>
            <p>₹{product.price}</p>
            <button className="mt-2 px-4 py-2 bg-black text-white rounded">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
