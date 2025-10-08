// app/sale/page.tsx
import Image from "next/image";
import Link from "next/link";

export default function SalePage() {
  const saleCategories = [
    {
      title: "LAST CHANCE",
      subtitle: "Grab your favorites before they're gone!",
      href: "/sale/last-chance",
      image: "/images/sale-lastchance.jpg", // put this file in /public/images/
    },
    {
      title: "SALE UNDER ₹999",
      subtitle: "Exclusive limited-time offers",
      href: "/sale/under-999",
      image: "/images/sale-999.jpg",
    },
    {
      title: "SALE UNDER ₹1499",
      subtitle: "Affordable elegance for every occasion",
      href: "/sale/under-1499",
      image: "/images/sale-1499.jpg",
    },
  ];

  return (
    <section className="pt-4">
      <div className="grid gap-8 md:grid-cols-3">
        {saleCategories.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group relative block overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition"
          >
            {/* Background image */}
            <div className="relative h-72 md:h-80">
              <Image
                src={c.image}
                alt={c.title}
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* Overlay (match your Explore style) */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
            </div>

            {/* Text overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
              <h2 className="text-2xl font-bold tracking-wide">{c.title}</h2>
              <p className="mt-2 text-sm md:text-base opacity-95">{c.subtitle}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
