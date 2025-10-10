// app/page.tsx
import Slomo from "@/components/blocks/slomo";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fff8f3] via-[#fdece4] to-[#fff8f3] py-16 px-6 md:px-20 space-y-20 rounded-3xl shadow-inner">

      {/* HERO SECTION */}
      <Slomo />

      {/* FEATURED CATEGORIES */}
      <section>
        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-10 text-center tracking-wide uppercase">
          EXPLORE CATEGORIES
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Traditional */}
          <a
            href="/traditional"
            className="group relative block overflow-hidden rounded-2xl shadow hover:shadow-lg"
          >
            <img
              src="/images/traditional.png"
              alt="Traditional"
              className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center">
              <span className="text-2xl md:text-3xl font-serif font-semibold tracking-wide uppercase">
                TRADITIONAL WEAR
              </span>
              <span className="text-sm font-sans opacity-80 mt-1">
                Salwar• Kurtis • Ethnic Sets
              </span>
            </div>
          </a>

          {/* Western */}
          <a
            href="/western"
            className="group relative block overflow-hidden rounded-2xl shadow hover:shadow-lg"
          >
            <img
              src="/images/western.png"
              alt="Western"
              className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center">
              <span className="text-2xl md:text-3xl font-serif font-semibold tracking-wide uppercase">
                WESTERN WEAR
              </span>
              <span className="text-sm font-sans opacity-80 mt-1">
                Tops • Dresses • Bottoms
              </span>
            </div>
          </a>

          {/* Sale */}
          <a
            href="/sale/under-999"
            className="group relative block overflow-hidden rounded-2xl shadow hover:shadow-lg"
          >
            <img
              src="/images/sales.png"
              alt="Sale"
              className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center">
              <span className="text-2xl md:text-3xl font-serif font-semibold tracking-wide uppercase">
                SALE UNDER ₹999
              </span>
              <span className="text-sm font-sans opacity-80 mt-1">
                Exclusive limited-time offers
              </span>
            </div>
          </a>
        </div>
      </section>

      {/* You can add other sections here instead, like:
      - Featured Products (different from New Arrivals)
      - Best Sellers  
      - Seasonal Collection
      - Customer Favorites
      */}
      
    </main>
  );
}