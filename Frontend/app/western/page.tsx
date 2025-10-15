// app/western/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";

export default function WesternPage() {
  const categories = [
    { href: "/western/bottomwears", image: "/images/bottom.png",  title: "Bottomwears",  description: "Jeans, skirts & palazzos" },
    { href: "/western/officewear",  image: "/images/office2.png", title: "Officewear",   description: "Polished looks for work" },
    { href: "/western/tops",        image: "/images/tops.png",    title: "Tops & Shirts",description: "Trendy casual & formal tops" },
  ];

  const features = [
    { icon: "👖", title: "Premium Fabrics",   description: "High-quality materials for comfort & style" },
    { icon: "💼", title: "Professional Look", description: "Smart pieces for office & events" },
    { icon: "🚚", title: "Free Shipping",     description: "On orders above ₹1999" },
    { icon: "↩️", title: "Easy Returns",      description: "10-day return window" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-12">
          <div className="text-center mx-auto max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-light text-gray-900">Western Collection</h1>
            <p className="mt-3 text-base md:text-lg text-gray-600">
              Contemporary styles for everyday comfort—from polished officewear to relaxed casuals.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="#categories"
                className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-6 py-3 text-white hover:bg-neutral-800 transition"
              >
                Explore Collection
              </Link>
              <Link
                href="/sale"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-6 py-3 text-gray-800 hover:border-neutral-900 hover:text-neutral-900 transition"
              >
                New Arrivals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-12">
          <header className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900">Shop Western Wear</h2>
            <p className="mt-2 text-gray-600">Browse our carefully curated categories</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="group relative rounded-lg overflow-hidden border border-gray-200 hover:border-neutral-900 transition"
              >
                <div className="relative h-72 overflow-hidden">
                  <Image
                    src={c.image}
                    alt={c.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                  />
                  <div className="absolute bottom-4 left-4 right-4 translate-y-3 group-hover:translate-y-0 transition-transform">
                    <div className="bg-white/90 backdrop-blur-sm rounded-md p-3 text-center">
                      <span className="text-neutral-900 text-sm font-medium">Explore Now →</span>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-neutral-900 transition">
                    {c.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">{c.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-12">
          <header className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-light text-gray-900">Why Choose Our Western Collection</h2>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <div key={i} className="text-center p-5 bg-white rounded-lg border border-gray-200 hover:border-neutral-900 transition">
                <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">{f.icon}</span>
                </div>
                <h3 className="text-base font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
