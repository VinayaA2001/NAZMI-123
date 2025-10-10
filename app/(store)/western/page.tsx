// app/western/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";

export default function WesternPage() {
  const categories = [
    {
      href: "/western/bottomwears",
      image: "/images/bottom.png",
      title: "Bottomwears",
      description: "Jeans, skirts & Palazzo pants"
    },
    {
      href: "/western/officewear",
      image: "/images/office2.png",
      title: "Officewear",
      description: "Stylish matching outfits"
    },
    {
      href: "/western/tops",
      image: "/images/tops.png", 
      title: "Tops & Shirts",
      description: "Trendy casual & formal tops"
    }
  ];

  const features = [
    {
      icon: "👖",
      title: "Premium Fabrics",
      description: "High-quality materials for comfort and style"
    },
    {
      icon: "💼",
      title: "Professional Look", 
      description: "Perfect outfits for office and formal occasions"
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
      <section className="py-16 md:py-24 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
              Western Collection
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              Discover contemporary western wear that blends modern style with 
              everyday comfort. From office attire to casual outfits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="#categories"
                className="bg-gray-900 text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-300"
              >
                Explore Collection
              </Link>
              <Link 
                href="/sale"
                className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-medium hover:border-gray-400 transition-colors duration-300"
              >
                New Arrivals
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
              Shop Western Wear
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse through our carefully curated western wear categories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={category.href}
                className="group relative bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-gray-400 transition-all duration-300"
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
                      <span className="text-gray-900 font-medium text-sm">Explore Now →</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-medium text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
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
              Why Choose Our Western Collection?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Modern fashion with quality and comfort
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="text-center p-6 bg-white rounded-lg border border-gray-200 hover:border-gray-400 transition-all duration-300"
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
                Western Style Guide
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Learn how to style your western outfits for different occasions. 
                From casual jeans to professional office wear.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-600 text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Mix & Match</h4>
                    <p className="text-gray-600 text-sm">Create multiple looks with versatile pieces.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-600 text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Accessorize Smartly</h4>
                    <p className="text-gray-600 text-sm">Complete your look with the right accessories.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-600 text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Fit Matters</h4>
                    <p className="text-gray-600 text-sm">Choose the right fit for comfort and style.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">👔</span>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Modern Elegance
                </h3>
                <p className="text-gray-600">
                  Embrace contemporary style with our western collection
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-light text-white mb-4">
            Ready to Upgrade Your Western Wardrobe?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Browse our collection and discover western wear that matches your modern lifestyle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/western/bottomwears"
              className="bg-white text-gray-900 px-8 py-4 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-300"
            >
              Start Shopping
            </Link>
            <Link 
              href="/contact"
              className="border border-white text-white px-8 py-4 rounded-lg font-medium hover:bg-white hover:text-gray-900 transition-colors duration-300"
            >
              Get Styling Advice
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}