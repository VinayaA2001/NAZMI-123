// app/page.tsx
import Slomo from "@/components/blocks/slomo";
import Image from "next/image";

export default function HomePage() {
  const categories = [
    { 
      name: "Ethnic Wears", 
      href: "/Ethnic-Wears",  // Fixed path
      desc: "Festive Edits • Kurtis • Ethnic Sets", 
      img: "images/anarkali2.png"
    },
    { 
      name: "Western", 
      href: "/western", 
      desc: "Tops • Dresses • Officewear", 
      img: "images/short top1.png"
    },
    { 
      name: "Special Offers", 
      href: "/sale", 
      desc: "Exclusive Deals • Limited Time", 
      img: "images/sales.png", 
      sale: true
    },
  ];

  const testimonials = [
    {
      quote: "The quality of fabric and stitching is exceptional. Perfect fit every time!",
      author: "Shamna",
      role: "Regular Customer",
      rating: 5
    },
    {
      quote: "Love how they blend traditional designs with modern styles. Always get compliments!",
      author: "Anjali",
      role: "Fashion Blogger",
      rating: 5
    },
    {
      quote: "Fast shipping and excellent customer service. My go-to for ethnic wear!",
      author: "Shamsiya",
      role: "Working Professional",
      rating: 5
    },
    {
      quote: "The attention to detail in every piece is remarkable. Worth every penny!",
      author: "Lakshmi",
      role: "Loyal Customer",
      rating: 5
    }
  ];

  const features = [
    {
      title: "Free Shipping",
      description: "Free delivery on all orders above ₹2000",
      icon: "🚚"
    },
    {
      title: "Premium Quality",
      description: "Handpicked fabrics with expert craftsmanship",
      icon: "⭐"
    },
    {
      title: "Easy 7-Day Returns",
      description: "7-day return for damaged products with video proof",
      icon: "📦"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* HERO SECTION - Optimized for all devices */}
      <section className="relative h-[70vh] sm:h-[75vh] md:h-[80vh] lg:h-[85vh] min-h-[500px] max-h-[800px] bg-black">
        <Slomo />
      </section>

      {/* CATEGORIES SECTION - Professional Showcase */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            {/* Only Collections badge remains */}
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-full uppercase tracking-wider">
                Collections
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Curated Collections
            </h2>
            <div className="w-20 h-1 bg-gray-900 mx-auto mb-6"></div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Discover exquisite pieces that celebrate heritage while embracing contemporary elegance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <div key={category.name} className="group relative">
                <a 
                  href={category.href} 
                  className="block overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-200"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={`/${category.img}`}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {category.sale && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-red-600 text-white px-4 py-2 text-sm font-bold uppercase tracking-widest rounded-lg shadow-lg">
                          SALE
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <div className="transform transition-all duration-500 group-hover:-translate-y-2">
                      <h3 className="text-2xl md:text-3xl font-bold mb-3">{category.name}</h3>
                      <p className="text-gray-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                        {category.desc}
                      </p>
                      <div className="w-12 h-0.5 bg-white mt-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION - Professional Social Proof */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-gray-100 text-gray-900 text-sm font-medium rounded-full mb-4 uppercase tracking-wider">
              Customer Reviews
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Trusted by Fashion Lovers
            </h2>
            <div className="w-20 h-1 bg-gray-900 mx-auto mb-6"></div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Read what our valued customers have to say about their shopping experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group">
                {/* Star Rating */}
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">⭐</span>
                  ))}
                </div>
                
                <div className="text-gray-400 text-4xl mb-4 text-center">"</div>
                <p className="text-gray-700 text-lg mb-6 leading-relaxed text-center">"{testimonial.quote}"</p>
                
                <div className="text-center border-t border-gray-100 pt-6">
                  <p className="font-bold text-gray-900 text-lg">{testimonial.author}</p>
                  <p className="text-gray-500 text-sm mt-1">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION - Above Footer */}
      <section className="py-16 sm:py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group p-8 rounded-lg hover:bg-gray-900 transition-all duration-300 border border-gray-800">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-white text-xl mb-4">{feature.title}</h3>
                <p className="text-gray-300 text-base leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}