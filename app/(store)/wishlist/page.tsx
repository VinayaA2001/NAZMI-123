"use client";
import { useState, useEffect } from "react";
import { Heart } from "lucide-react"; // using lucide-react for heart icon

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("wishlist");
    if (saved) setWishlist(JSON.parse(saved));
  }, []);

  const removeItem = (id: number) => {
    const updated = wishlist.filter((item) => item.id !== id);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  return (
    <section className="container py-10">
      <h1 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        My Wishlist <Heart className="w-6 h-6 fill-red-500 text-red-500" />
      </h1>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 text-neutral-500">
          <p className="text-lg">Your wishlist is empty.</p>
          <p className="mt-2">Browse products and click the ❤️ icon to save them here.</p>
          <a
            href="/"
            className="inline-block mt-6 px-6 py-2 bg-black text-white rounded-md hover:bg-neutral-800 transition"
          >
            Continue Shopping
          </a>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 relative">
              {/* Heart button for removing */}
              <button
                onClick={() => removeItem(item.id)}
                className="absolute top-3 right-3"
              >
                <Heart className="w-6 h-6 fill-red-500 text-red-500 hover:scale-110 transition" />
              </button>

              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover rounded-md"
              />
              <h2 className="mt-2 font-medium">{item.name}</h2>
              <p className="text-sm text-neutral-600">{item.price}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
