// app/sale/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Clock, Tag } from "lucide-react";

/** Fixed end time (prevents hydration mismatch) */
const SALE_END_ISO = "2025-10-17T23:59:59+05:30";

const CATEGORIES = [
  {
    title: "Last Chance",
    href: "/sale/last-chance",
    image: "/images/sales1.png",
    note: "Final pieces",
    badge: "Limited stock",
  },
  {
    title: "Under ₹999",
    href: "/sale/under-999",
    image: "/images/sales2.png",
    note: "Most-popular picks",
    badge: "Up to 60% OFF",
  },
  {
    title: "Under ₹1499",
    href: "/sale/under-1499",
    image: "/images/sales3.png",
    note: "Premium for less",
    badge: "Up to 50% OFF",
  },
] as const;

const pad = (n: number) => n.toString().padStart(2, "0");

export default function SalePage() {
  // hydration-safe countdown
  const endAt = useMemo(() => new Date(SALE_END_ISO), []);
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState<Date>(() => endAt);

  useEffect(() => {
    setMounted(true);
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const diff = Math.max(0, endAt.getTime() - now.getTime());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff / 3600000) % 24);
  const minutes = Math.floor((diff / 60000) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return (
    <div className="min-h-screen bg-white">
      {/* TIMER ONLY */}
      <div className="sticky top-0 z-40 border-b border-black/10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-center gap-3 text-neutral-900">
          <Clock className="h-5 w-5 text-neutral-700" />
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span suppressHydrationWarning>{mounted ? pad(days) : "--"}d</span>
            <span className="text-neutral-300">:</span>
            <span suppressHydrationWarning>{mounted ? pad(hours) : "--"}h</span>
            <span className="text-neutral-300">:</span>
            <span suppressHydrationWarning>{mounted ? pad(minutes) : "--"}m</span>
            <span className="text-neutral-300">:</span>
            <span suppressHydrationWarning>{mounted ? pad(seconds) : "--"}s</span>
          </div>
        </div>
      </div>

      {/* JUST THE 3 SECTIONS */}
      <section aria-label="Sale categories">
        <div className="mx-auto max-w-7xl px-4 py-6 md:py-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="relative overflow-hidden rounded-2xl border border-black/15 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                {/* image */}
                <div className="relative h-44 md:h-48">
                  <Image
                    src={c.image}
                    alt={c.title}
                    fill
                    className="object-cover"
                    sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                    priority
                  />
                </div>

                {/* text */}
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base md:text-lg font-semibold text-neutral-900">
                      {c.title}
                    </h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-900 border border-amber-200">
                      <Tag className="h-3.5 w-3.5" />
                      {c.badge}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-neutral-600">{c.note}</p>
                  <span className="mt-3 inline-block text-[12px] font-semibold text-neutral-900 underline underline-offset-4">
                    Shop now
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
