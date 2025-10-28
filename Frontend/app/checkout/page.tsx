"use client";

import { useState } from "react";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    total: 0,
    items: [],
  });

  const handleOrder = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: form.name,
          customer_email: form.email,
          customer_phone: form.phone,
          total_amount: form.total,
          items: form.items,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Order placed successfully!");
        console.log(data.order);
      } else {
        alert("❌ Failed: " + data.error);
      }
    } catch (err) {
      console.error("Order Error:", err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded-2xl border">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      <input
        type="text"
        placeholder="Full Name"
        className="border p-2 w-full mb-3"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        className="border p-2 w-full mb-3"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="text"
        placeholder="Phone"
        className="border p-2 w-full mb-3"
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      <button
        onClick={handleOrder}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded-lg"
      >
        {loading ? "Processing..." : "Place Order"}
      </button>
    </div>
  );
}
