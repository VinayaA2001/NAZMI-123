// app/page.tsx
import Slomo from "@/components/blocks/slomo";

export default function HomePage() {
  // Cloudinary-hosted category images
  const categories = [
    {
      name: "Traditional",
      href: "/traditional",
      desc: "Sarees • Kurtis • Ethnic Sets",
      img: "https://res.cloudinary.com/dq5xhg9uo/image/upload/v1728923012/nazmi/traditional.png",
    },
    {
      name: "Western",
      href: "/western",
      desc: "Tops • Dresses • Officewear",
      img: "https://res.cloudinary.com/dq5xhg9uo/image/upload/v1728923050/nazmi/western.png",
    },
    {
      name: "Special Offers",
      href: "/sale",
      desc: "Exclusive Deals • Limited Time",
      img: "https://res.cloudinary.com/dq5xhg9uo/image/upload/v1728923100/nazmi/sales.png",
      sale: true,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero">
        <Slomo />
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5"></div>
      </section>

      {/* FEATURED CATEGORIES */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-16 animate-fade-in-up">
            <span className="inline-block px-4 py-2 bg-amber-100 text-amber-900 rounded-full text-sm font-medium mb-4 uppercase tracking-wider">
              Collections
            </span>
            <h2 className="heading-1 text-gray-900 mb-6">
              Discover Our Curated Collections
            </h2>
            <p className="body-large text-gray-600 max-w-2xl mx-auto">
              Explore selections that blend traditional elegance with
              contemporary style — perfect for every occasion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {categories.map((cat, idx) => (
              <a
                key={cat.name}
                href={cat.href}
                className="group relative block overflow-hidden rounded-3xl card card-hover animate-scale-in"
                style={{ animationDelay: `${0.1 * (idx + 1)}s` }}
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={cat.img}
                    alt={`${cat.name} Collection`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  {cat.sale && (
                    <div className="absolute top-6 right-6">
                      <span className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-full shadow-lg">
                        SALE
                      </span>
                    </div>
                  )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                    <h3 className="text-2xl lg:text-3xl font-serif font-semibold mb-2">
                      {cat.name}
                    </h3>
                    <p className="text-amber-200 text-sm lg:text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                      {cat.desc}
                    </p>
                    <div className="w-12 h-0.5 bg-amber-400 mt-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 delay-200 origin-left"></div>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="text-center mt-16 animate-fade-in-up">
            <p className="body-base text-gray-600 mb-6">
              Can't find what you're looking for?
            </p>
            <a
              href="/products"
              className="btn btn-primary text-lg px-8 py-4 rounded-full bg-amber-500 hover:bg-amber-600 text-white"
            >
              Explore All Products
            </a>
          </div>
        </div>
      </section>

      {/* BRAND PROMISE */}
      <section className="section-padding bg-gradient-to-br from-amber-50 to-white border-t">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="heading-2 text-gray-900 mb-3">Premium Quality</h3>
              <p className="text-gray-600">
                Carefully selected fabrics and expert craftsmanship in every
                piece.
              </p>
            </div>
            <div>
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="heading-2 text-gray-900 mb-3">Elegant Designs</h3>
              <p className="text-gray-600">
                Blending traditional Kerala artistry with contemporary style.
              </p>
            </div>
            <div>
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="heading-2 text-gray-900 mb-3">Free Shipping</h3>
              <p className="text-gray-600">
                Free delivery on orders above ₹1999 across India.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
