// app/page.tsx
import Slomo from "@/components/blocks/slomo";
import Image from "next/image";

export default function HomePage() {
  const categories = [
    { name: "Traditional", href: "/traditional", desc: "Festive Edits • Kurtis • Ethnic Sets", img: "images/anarkali2.png" },
    { name: "Western", href: "/western", desc: "Tops • Dresses • Officewear", img: "images/short top1.png" },
    { name: "Special Offers", href: "/sale", desc: "Exclusive Deals • Limited Time", img: "images/sales.png", sale: true },
  ];

  return (
    <div className="min-h-screen">
      {/* HERO — full bleed, no side whitespace */}
      <div className="full-bleed"> 
        <section
          className="relative h-[50vh] xs:h-[54vh] sm:h-[58vh] md:h-[64vh] lg:h-[70vh] max-h-[820px] flex items-center justify-center overflow-hidden border-b border-black/10"
          aria-label="Hero"
        >
          {/* Slomo background (fills, no padding/margins) */}
          <div className="absolute inset-0">
            <Slomo />
            <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5" />
          </div>

          {/* Minimal overlay content */}
          <div className="relative z-10 text-center px-2">
            <h1 className="text-3xl md:text-5xl font-serif font-semibold text-white drop-shadow-[0_1px_6px_rgba(0,0,0,.35)]">
              Nazmi Boutique
            </h1>
            <p className="mt-2 md:mt-3 text-sm md:text-base text-white/90">
              Traditional elegance meets contemporary style
            </p>
          </div>
        </section>
      </div>

      {/* …the rest of your page stays the same… */}
      <section className="py-8 md:py-10 bg-white">
        <div className="mx-auto max-w-6xl px-4">
          {/* header */}
          <div className="text-center mb-8 md:mb-10">
            <span className="inline-block px-3 py-1.5 bg-amber-100 text-amber-900 rounded-full text-xs md:text-sm font-medium mb-3 uppercase tracking-wide border border-black/10">
              Collections
            </span>
            <h2 className="text-2xl md:text-4xl font-serif font-semibold text-gray-900 mb-2">
              Discover Our Curated Collections
            </h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
              Explore selections that blend traditional elegance with contemporary style.
            </p>
          </div>

          {/* cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {categories.map((cat, idx) => (
              <a
                key={cat.name}
                href={cat.href}
                className="group relative block overflow-hidden rounded-xl ring-1 ring-black/10 hover:ring-black/40 transition-shadow bg-white"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={`/${cat.img}`}
                    alt={`${cat.name} Collection`}
                    fill
                    priority={idx === 0}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />
                  {cat.sale && (
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-full shadow-sm ring-1 ring-black/10">
                        SALE
                      </span>
                    </div>
                  )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 text-white">
                  <div className="transition-transform duration-300 group-hover:-translate-y-1">
                    <h3 className="text-xl md:text-2xl font-serif font-semibold">{cat.name}</h3>
                    <p className="text-amber-200 text-xs md:text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {cat.desc}
                    </p>
                    <div className="w-10 h-[2px] bg-black/70 md:bg-amber-400 mt-3 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 md:py-10 bg-gradient-to-br from-amber-50 to-white border-t border-black/10">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 text-center">
            {/* …brand promise cards… */}
          </div>
        </div>
      </section>
    </div>
  );
}
