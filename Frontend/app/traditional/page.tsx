// app/traditional/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";

export default function TraditionalPage() {
  const categories = [
    { href: "/traditional/ethnic-dresses", image: "/images/churidhar1.png", title: "Ethnic Dresses", description: "Explore traditional anarkalis & gowns" },
    { href: "/traditional/festive-edits",  image: "/images/churidhar2.png", title: "Festive Edits",  description: "Special picks for celebrations" },
    { href: "/traditional/kurta-and-sets", image: "/images/kurta1.png",     title: "Kurta & Sets",  description: "Stylish & comfortable sets" },
  ];

  const features = [
    { icon: "🎁", title: "Premium Quality",   description: "Finest fabrics and craftsmanship" },
    { icon: "✨", title: "Authentic Designs", description: "Traditional patterns and embroidery" },
    { icon: "🚚", title: "Free Shipping",     description: "On orders above ₹1999" },
    { icon: "↩️", title: "Easy Returns",      description: "10-days return policy" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero (tighter spacing, neutral buttons) */}
      <section className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-12">
          <div className="text-center mx-auto max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-light text-gray-900">Traditional Collection</h1>
            <p className="mt-3 text-base md:text-lg text-gray-600">
              Discover our exquisite collection of traditional Indian wear, where timeless elegance meets contemporary style.
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
                Festive Sale
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories (reduced gaps, neutral hovers) */}
      <section id="categories">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900">Shop Traditional Wear</h2>
            <p className="mt-2 text-gray-600">Browse through our carefully curated categories</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.href}
                href={category.href}
                className="group relative rounded-lg overflow-hidden border border-gray-200 hover:border-neutral-900 transition"
              >
                <div className="relative h-72 overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.title}
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
                    {category.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features (trimmed spacing) */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-light text-gray-900">Why Choose Us?</h2>
            <p className="mt-2 text-gray-600">We bring you the finest traditional wear with unmatched quality</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, i) => (
              <div
                key={i}
                className="text-center p-5 bg-white rounded-lg border border-gray-200 hover:border-neutral-900 transition"
              >
                <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">{feature.icon}</span>
                </div>
                <h3 className="text-base font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* (CTA section was removed as requested) */}
    </div>
  );
}
