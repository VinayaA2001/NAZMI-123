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

function MobileCategoryDock({ categories }: { categories: Category[] }) {
  const mains = categories.map((c) => ({
    ...c,
    // tiny emoji helpers; swap for icons later if you want
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
              className="flex-1 py-3 px-2 flex flex-col items-center justify-center gap-1"
            >
              <span className="text-xl leading-none">{m.emoji}</span>
              <span className="text-[11px] font-medium text-gray-900">
                {m.name}
              </span>
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

function MobileCategoryChips({ categories }: { categories: Category[] }) {
  return (
    <div className="sm:hidden bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar [-ms-overflow-style:none] [scrollbar-width:none]">
          {categories.map((c) => (
            <Link
              key={c.name}
              href={c.href}
              className="whitespace-nowrap px-3 py-2 rounded-full text-sm border border-gray-300 hover:border-gray-900 transition-colors"
            >
              {c.name} {c.sale ? "🔥" : ""}
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
    <div className="min-h-screen pb-16 sm:pb-0">{/* pb for mobile dock */}
      {/* HERO */}
      <section className="relative h-[70vh] sm:h-[75vh] md:h-[80vh] lg:h-[85vh] min-h-[500px] max-h-[800px] bg-black">
        <Slomo />
      </section>

      {/* MOBILE QUICK CATEGORIES (chips under hero) */}
      <MobileCategoryChips categories={categories} />

      {/* CATEGORIES GRID */}
      <section className="py-10 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <div className="mb-5">
              <span className="inline-block px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-full uppercase tracking-wider">
                Collections
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Curated Collections
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-gray-900 mx-auto mb-5 sm:mb-6" />
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Discover exquisite pieces that celebrate heritage while embracing contemporary elegance
            </p>
          </div>

          {/* mobile: 2-cols, larger tap targets */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
            {categories.map((category, index) => (
              <div key={category.name} className="group relative">
                <Link
                  href={category.href}
                  className="block overflow-hidden bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-200"
                  aria-label={category.name}
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={`/${category.img}`}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 50vw, (max-width: 1200px) 33vw, 33vw"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    {category.sale && (
                      <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
                        <span className="bg-red-600 text-white px-2 py-1 sm:px-4 sm:py-2 text-[10px] sm:text-sm font-bold uppercase tracking-widest rounded-md sm:rounded-lg shadow-lg">
                          SALE
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 text-white">
                    <div className="transform transition-all duration-500 group-hover:-translate-y-1 sm:group-hover:-translate-y-2">
                      <h3 className="text-lg sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-3">
                        {category.name}
                      </h3>
                      <p className="hidden sm:block text-gray-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                        {category.desc}
                      </p>
                      <div className="w-10 sm:w-12 h-0.5 bg-white mt-2 sm:mt-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <span className="inline-block px-4 py-2 bg-gray-100 text-gray-900 text-xs sm:text-sm font-medium rounded-full mb-3 sm:mb-4 uppercase tracking-wider">
              Customer Reviews
            </span>
            <h2 className="text-2xl sm:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Trusted by Fashion Lovers
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-gray-900 mx-auto mb-5 sm:mb-6"></div>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Read what our valued customers have to say about their shopping experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex justify-center mb-3 sm:mb-4">
                  {[...Array(t.rating)].map((_, i2) => (
                    <span key={i2} className="text-yellow-400 text-lg sm:text-xl">⭐</span>
                  ))}
                </div>
                <div className="text-gray-400 text-3xl sm:text-4xl mb-3 sm:mb-4 text-center">"</div>
                <p className="text-gray-700 text-base sm:text-lg mb-5 sm:mb-6 leading-relaxed text-center">
                  "{t.quote}"
                </p>
                <div className="text-center border-t border-gray-100 pt-4 sm:pt-6">
                  <p className="font-bold text-gray-900 text-sm sm:text-lg">{t.author}</p>
                  <p className="text-gray-500 text-xs sm:text-sm mt-1">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-12 sm:py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
            {features.map((f, i) => (
              <div
                key={i}
                className="text-center group p-6 sm:p-8 rounded-lg hover:bg-gray-900 transition-all duration-300 border border-gray-800"
              >
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  {f.icon}
                </div>
                <h3 className="font-bold text-white text-lg sm:text-xl mb-2 sm:mb-4">{f.title}</h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MOBILE BOTTOM DOCK */}
      <MobileCategoryDock categories={categories} />
    </div>
  );
}
