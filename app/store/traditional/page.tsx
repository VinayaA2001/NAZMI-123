// app/traditional/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";

export default function TraditionalPage() {
  const categories = [
    {
      href: "/traditional/ethnic-dresses",
      image: "/images/churidhar1.png",
      title: "Ethnic Dresses",
      description: "Explore traditional anarkalis & gowns"
    },
    {
      href: "/traditional/festive-edits", 
      image: "/images/churidhar2.png",
      title: "Festive Edits",
      description: "Special picks for celebrations"
    },
    {
      href: "/traditional/kurta-and-sets",
      image: "/images/kurta-set.png",
      title: "Kurta & Sets",
      description: "Stylish & comfortable sets"
    }
  ];

  const features = [
    {
      icon: "🎁",
      title: "Premium Quality",
      description: "Finest fabrics and craftsmanship"
    },
    {
      icon: "✨", 
      title: "Authentic Designs",
      description: "Traditional patterns and embroidery"
    },
    {
      icon: "🚚",
      title: "Free Shipping",
      description: "On orders above ₹1999"
    },
    {
      icon: "↩️",
      title: "Easy Returns", 
      description: "30-day return policy"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-white py-16 md:py-24 border-b">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-6">
              Traditional Collection
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              Discover our exquisite collection of traditional Indian wear, 
              where timeless elegance meets contemporary style.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="#categories"
                className="bg-[#71a771] text-white px-8 py-4 rounded-lg font-medium hover:bg-[#5a8a5a] transition-all duration-300"
              >
                Explore Collection
              </Link>
              <Link 
                href="/sale"
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-medium hover:border-[#71a771] hover:text-[#71a771] transition-all duration-300"
              >
                Festive Sale
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section id="categories" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
              Shop Traditional Wear
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse through our carefully curated categories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={category.href}
                className="group relative bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-[#71a771] transition-all duration-300"
              >
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  
                  <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 text-center">
                      <span className="text-[#71a771] font-medium text-sm">Explore Now →</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-medium text-gray-900 mb-2 group-hover:text-[#71a771] transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-gray-900 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We bring you the finest traditional wear with unmatched quality
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="text-center p-6 bg-white rounded-lg border border-gray-200 hover:border-[#71a771] transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="font-medium text-lg text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Style Guide Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl font-light text-gray-900 mb-6">
                Traditional Style Guide
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Learn how to style your traditional outfits for different occasions.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-600 text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Choose the Right Fabric</h4>
                    <p className="text-gray-600 text-sm">Select fabrics based on season and occasion.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-600 text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Perfect Accessories</h4>
                    <p className="text-gray-600 text-sm">Complement your outfit with traditional jewelry.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-600 text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Occasion Matching</h4>
                    <p className="text-gray-600 text-sm">Pick outfits that match the formality.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">👑</span>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Traditional Excellence
                </h3>
                <p className="text-gray-600">
                  Embrace the beauty of Indian traditional wear
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#71a771]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-light text-white mb-4">
            Find Your Perfect Traditional Outfit
          </h2>
          <p className="text-gray-100 text-lg mb-8 max-w-2xl mx-auto">
            Browse our collection and discover traditional wear that celebrates your style.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/traditional/ethnic-dresses"
              className="bg-white text-[#71a771] px-8 py-4 rounded-lg font-medium hover:bg-gray-100 transition-all duration-300"
            >
              Start Shopping
            </Link>
            <Link 
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-medium hover:bg-white hover:text-[#71a771] transition-all duration-300"
            >
              Get Styling Advice
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}