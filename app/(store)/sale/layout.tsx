"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const categories = [
  {
    title: "LAST CHANCE",
    subtitle: "Grab your favorites before they're gone!",
    href: "/sale/last-chance",
    image: "/images/sale-lastchance.jpg",
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

export default function SaleLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isIndex = pathname === "/sale"; // render image cards only on /sale

  return (
    <section className="container mx-auto py-10 space-y-8">
      <header className="text-center space-y-3">
        <h1 className="text-3xl font-bold">Sale Collections</h1>
        <p className="text-gray-600">
          Discover the best deals and discounts across our categories.
        </p>

        {/* SUB-NAV for subpages */}
        {!isIndex && (
          <nav className="flex flex-wrap justify-center gap-3 pt-2">
            <Link href="/sale/last-chance" className="px-4 py-2 rounded-full border hover:shadow">
              Last Chance
            </Link>
            <Link href="/sale/under-999" className="px-4 py-2 rounded-full border hover:shadow">
              Under ₹999
            </Link>
            <Link href="/sale/under-1499" className="px-4 py-2 rounded-full border hover:shadow">
              Under ₹1499
            </Link>
          </nav>
        )}
      </header>

      {/* IMAGE CATEGORY CARDS (only on /sale) */}
      {isIndex && (
        <div className="grid gap-8 md:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group relative block overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition"
            >
              <div className="relative h-72 md:h-80">
                <Image
                  src={c.image}
                  alt={c.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
                <h2 className="text-2xl font-bold tracking-wide">{c.title}</h2>
                <p className="mt-2 text-sm md:text-base opacity-95">{c.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Child page content */}
      <div>{children}</div>
    </section>
  );
}
