// app/page.tsx
import Slomo from "@/components/blocks/slomo";
import Image from "next/image";
import Link from "next/link";

type Category = {
  name: string;
  href: string;
  desc: string;
  img: string;
  sale?: boolean;
};

/* ---------- Mobile Bottom Dock ---------- */
function MobileCategoryDock({ categories }: { categories: Category[] }) {
  const mains = categories.map((c) => ({
    ...c,
    emoji:
      c.name.toLowerCase().includes("ethnic")
        ? "🪔"
        : c.name.toLowerCase().includes("western")
        ? "👗"
        : "🔥",
  }));

  return (
    <nav
      className="sm:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-t border-gray-200"
      aria-label="Primary categories"
    >
      <ul className="grid grid-cols-3">
        {mains.map((m) => (
          <li key={m.name} className="flex">
            <Link
              href={m.href}
              className="flex-1 py-2.5 px-1.5 flex flex-col items-center justify-center gap-1 active:scale-[0.98] transition"
              aria-label={m.name}
            >
              <span className="text-lg leading-none">{m.emoji}</span>
              <span className="text-[11px] font-medium text-gray-900">{m.name}</span>
              {m.sale ? (
                <span className="text-[10px] font-semibold text-red-600">SALE</span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ---------- Category Quick Nav (under hero) ---------- */
function CategoryQuickNav({ categories }: { categories: Category[] }) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:justify-center">
          {categories.map((c) => (
            <Link
              key={c.name}
              href={c.href}
              className="inline-flex items-center gap-2 whitespace-nowrap px-3.5 py-2 rounded-full text-sm border border-gray-300 hover:border-gray-900 hover:bg-gray-50 transition-colors"
              aria-label={`Go to ${c.name}`}
            >
              <span className="text-base" aria-hidden>•</span>
              <span className="font-medium">{c.name}</span>
              {c.sale ? <span className="text-[10px] font-semibold text-red-600">SALE</span> : null}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const categories: Category[] = [
    {
      name: "Ethnic Wears",
      href: "/Ethnic-Wears",
      desc: "Festive Edits • Kurtis • Ethnic Sets",
      img: "images/anarkali2.png",
    },
    {
      name: "Western",
      href: "/western",
      desc: "Tops • Dresses • Officewear",
      img: "images/short top1.png",
    },
    {
      name: "Special Offers",
      href: "/sale",
      desc: "Exclusive Deals • Limited Time",
      img: "images/sales.png",
      sale: true,
    },
  ];

  const testimonials = [
    { quote: "The quality of fabric and stitching is exceptional. Perfect fit every time!", author: "Shamna", role: "Regular Customer", rating: 5 },
    { quote: "Love how they blend traditional designs with modern styles. Always get compliments!", author: "Anjali", role: "Fashion Blogger", rating: 5 },
    { quote: "Fast shipping and excellent customer service. My go-to for ethnic wear!", author: "Shamsiya", role: "Working Professional", rating: 5 },
    { quote: "The attention to detail in every piece is remarkable. Worth every penny!", author: "Lakshmi", role: "Loyal Customer", rating: 5 },
  ];

  const features = [
    { title: "Free Shipping", description: "Free delivery on all orders above ₹2000", icon: "🚚" },
    { title: "Premium Quality", description: "Handpicked fabrics with expert craftsmanship", icon: "⭐" },
    { title: "Easy 7-Day Returns", description: "7-day return for damaged products with video proof", icon: "📦" },
  ];

  return (
    <div className="min-h-screen pb-16 sm:pb-0">
      {/* HERO — visual only, no text/CTA; small negative margin removes hairline gap */}
      <section
        className="relative -mt-px h-[65vh] sm:h-[72vh] md:h-[78vh] min-h-[460px] max-h-[760px] bg-black"
        aria-label="Hero"
      >
        <Slomo />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
      </section>

      {/* CATEGORY QUICK LINKS (all devices) */}
      <CategoryQuickNav categories={categories} />

      {/* CATEGORIES GRID */}
      <section className="py-10 sm:py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <span className="inline-block px-3.5 py-1.5 bg-gray-900 text-white text-xs sm:text-sm font-medium rounded-full uppercase tracking-wider">
              Collections
            </span>
            <h2 className="mt-4 text-[clamp(20px,3.6vw,36px)] font-bold text-gray-900">
              Curated for Every Occasion
            </h2>
            <p className="mt-2.5 text-gray-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Celebrate heritage with a modern touch — from festive sets to everyday essentials.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-6">
            {categories.map((category, index) => (
              <div key={category.name} className="group relative">
                <Link
                  href={category.href}
                  className="block overflow-hidden bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                  aria-label={category.name}
                >
                  <div className="relative aspect-[3/4]">
                    <Image
                      src={`/${category.img}`}
                      alt={category.name}
                      fill
                      priority={index === 0}
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.06] will-change-transform"
                      sizes="(max-width: 640px) 50vw, (max-width: 1200px) 33vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    {category.sale && (
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                        <span className="bg-red-600 text-white px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-md shadow">
                          SALE
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-3.5 sm:p-5 text-white">
                    <div className="transition-transform duration-300 group-hover:-translate-y-0.5">
                      <h3 className="text-[clamp(14px,2.8vw,22px)] font-semibold">
                        {category.name}
                      </h3>
                      <p className="hidden sm:block text-gray-200 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {category.desc}
                      </p>
                      <div className="w-10 sm:w-12 h-0.5 bg-white mt-2 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-10 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <span className="inline-block px-3 py-1.5 bg-gray-100 text-gray-900 text-xs sm:text-sm font-medium rounded-full uppercase tracking-wider">
              Customer Reviews
            </span>
            <h2 className="mt-3 text-[clamp(20px,3.6vw,36px)] font-bold text-gray-900">
              Trusted by Fashion Lovers
            </h2>
            <p className="mt-2 text-gray-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              What our customers say about their Nazmi experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {testimonials.map((t, i) => (
              <article
                key={i}
                className="bg-white p-5 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex flex-col"
              >
                <div className="flex justify-center mb-2">
                  {[...Array(t.rating)].map((_, i2) => (
                    <span key={i2} className="text-yellow-400 text-base sm:text-lg">⭐</span>
                  ))}
                </div>
                <blockquote className="text-gray-700 text-sm sm:text-base leading-relaxed text-center flex-1">
                  “{t.quote}”
                </blockquote>
                <div className="text-center border-t border-gray-100 pt-3 mt-4">
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">{t.author}</p>
                  <p className="text-gray-500 text-xs sm:text-sm mt-0.5">{t.role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-10 sm:py-16 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="text-center p-6 rounded-xl border border-gray-800 hover:bg-gray-900 transition-all duration-300"
              >
                <div className="text-3xl sm:text-4xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-white text-base sm:text-lg mb-1.5">
                  {f.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* PRODUCT COLOR DISCLAIMER */}
<section className="bg-white py-6 border-t border-gray-200">
  <div className="max-w-5xl mx-auto px-4 text-center">
    <p className="text-[13px] sm:text-sm text-gray-500 leading-relaxed">
      <span className="font-semibold text-gray-700">Please Note:</span> The photo may slightly differ from the actual item in terms of color due to lighting during photo shooting or monitor display variations.
    </p>
  </div>
</section>


      {/* MOBILE BOTTOM DOCK */}
      <MobileCategoryDock categories={categories} />
    </div>
  );
}
