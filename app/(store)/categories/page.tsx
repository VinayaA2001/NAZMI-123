// app/categories/page.tsx
import Link from 'next/link';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  subcategories: string[];
  count: number;
}

const categories: Category[] = [
  {
    id: 'traditional',
    name: 'Traditional Wear',
    description: 'Ethnic dresses, kurtas, and traditional sets',
    image: '/categories/traditional.jpg',
    subcategories: ['Ethnic Dresses', 'Kurta & Sets', 'Festive Edits'],
    count: 156
  },
  {
    id: 'western',
    name: 'Western Wear',
    description: 'Modern western outfits and accessories',
    image: '/categories/western.jpg',
    subcategories: ['Tops', 'Bottomwears', 'Officewear'],
    count: 89
  },
  {
    id: 'sale',
    name: 'Sale',
    description: 'Special discounts and offers',
    image: '/categories/sale.jpg',
    subcategories: ['Last Chance', 'Under ₹999', 'Under ₹1499'],
    count: 234
  }
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Categories</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Shop by Category</h1>
          <p className="text-gray-600 mt-1">Discover our curated collection of women's clothing</p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="group block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300 overflow-hidden"
            >
              {/* Category Image */}
              <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={category.id === 'traditional'} // Prioritize first image
                />
                <div className="absolute bottom-4 left-4 z-20">
                  <h2 className="text-xl font-bold text-white">{category.name}</h2>
                  <p className="text-white/90 text-sm">{category.count} products</p>
                </div>
              </div>

              {/* Category Info */}
              <div className="p-6">
                <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                
                {/* Subcategories */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-900">Popular in {category.name}:</h4>
                  <div className="flex flex-wrap gap-1">
                    {category.subcategories.map((subcat, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                      >
                        {subcat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* View Button */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="text-sm font-semibold text-black group-hover:underline">
                    Shop Now →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Shop With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-lg">🚚</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Free Shipping</h3>
              <p className="text-gray-600 text-sm">On orders above ₹999</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-lg">↩️</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Easy Returns</h3>
              <p className="text-gray-600 text-sm">30-day return policy</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-lg">⭐</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Quality Assured</h3>
              <p className="text-gray-600 text-sm">Premium quality products</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}