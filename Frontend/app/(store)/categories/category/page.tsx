// app/categories/[category]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ProductGrid from '@/components/commerce/ProductGrid';
import { CategoryFilters } from '@/components/CategoryFilter';

// Mock data - replace with actual API calls
const categoryData: { [key: string]: any } = {
  traditional: {
    name: 'Traditional Wear',
    description: 'Explore our exquisite collection of traditional Indian wear including ethnic dresses, kurtas, and festive outfits.',
    banner: '/banners/traditional-banner.jpg',
    subcategories: [
      { id: 'ethnic-dresses', name: 'Ethnic Dresses', count: 67 },
      { id: 'kurta-and-sets', name: 'Kurta & Sets', count: 45 },
      { id: 'festive-edits', name: 'Festive Edits', count: 44 }
    ],
    filters: {
      price: ['Under ₹999', '₹1000 - ₹1999', '₹2000 - ₹2999', 'Above ₹3000'],
      size: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      occasion: ['Casual', 'Festive', 'Wedding', 'Party'],
      fabric: ['Cotton', 'Silk', 'Georgette', 'Chiffon']
    }
  },
  western: {
    name: 'Western Wear',
    description: 'Discover trendy western outfits including tops, bottomwears, and officewear for the modern woman.',
    banner: '/banners/western-banner.jpg',
    subcategories: [
      { id: 'tops', name: 'Tops', count: 34 },
      { id: 'bottomwears', name: 'Bottomwears', count: 28 },
      { id: 'officewear', name: 'Officewear', count: 27 }
    ],
    filters: {
      price: ['Under ₹999', '₹1000 - ₹1999', '₹2000 - ₹2999', 'Above ₹3000'],
      size: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      style: ['Casual', 'Formal', 'Party', 'Vintage'],
      color: ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow']
    }
  },
  sale: {
    name: 'Sale',
    description: 'Don\'t miss out on these amazing deals! Limited time offers on premium women\'s clothing.',
    banner: '/banners/sale-banner.jpg',
    subcategories: [
      { id: 'last-chance', name: 'Last Chance', count: 89 },
      { id: 'under-999', name: 'Under ₹999', count: 78 },
      { id: 'under-1499', name: 'Under ₹1499', count: 67 }
    ],
    filters: {
      discount: ['50% and above', '40% - 50%', '30% - 40%', '20% - 30%'],
      size: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      category: ['Traditional', 'Western', 'Accessories']
    }
  }
};

// Extended mock products data for categories
const categoryProducts = [
  {
    id: 'ted-1',
    name: 'Embroidered Anarkali Dress',
    price: 2499,
    originalPrice: 3999,
    discount: 38,
    category: 'traditional',
    subcategory: 'ethnic-dresses',
    image: '/images/poster1.png',
    images: ['/images/poster1.png'],
    rating: 4.5,
    reviewCount: 128,
    sizes: ['S', 'M', 'L', 'XL'],
    isNew: true,
    isBestSeller: true,
    featured: true,
    description: 'Beautiful embroidered anarkali dress with intricate work'
  },
  {
    id: 'ted-2',
    name: 'Designer Lehenga Set',
    price: 4599,
    originalPrice: 5999,
    discount: 23,
    category: 'traditional',
    subcategory: 'ethnic-dresses',
    image: '/images/poster2.png',
    images: ['/images/poster2.png'],
    rating: 4.8,
    reviewCount: 89,
    sizes: ['S', 'M', 'L'],
    isNew: false,
    isBestSeller: true,
    featured: true,
    description: 'Exquisite designer lehenga set for weddings'
  },
  {
    id: 'tks-1',
    name: 'Printed Cotton Kurta Set',
    price: 1499,
    originalPrice: 1999,
    discount: 25,
    category: 'traditional',
    subcategory: 'kurta-and-sets',
    image: '/images/poster3.png',
    images: ['/images/poster3.png'],
    rating: 4.3,
    reviewCount: 156,
    sizes: ['S', 'M', 'L', 'XL'],
    isNew: false,
    isBestSeller: true,
    featured: false,
    description: 'Comfortable cotton kurta set for daily wear'
  },
  {
    id: 'tfe-1',
    name: 'Festive Sequence Saree',
    price: 2599,
    originalPrice: 3999,
    discount: 35,
    category: 'traditional',
    subcategory: 'festive-edits',
    image: '/images/poster1.png',
    images: ['/images/poster1.png'],
    rating: 4.4,
    reviewCount: 67,
    sizes: ['Free Size'],
    isNew: true,
    isBestSeller: false,
    featured: true,
    description: 'Glittering sequence work saree for festivals'
  },
  {
    id: 'wt-1',
    name: 'Designer Crop Top',
    price: 899,
    originalPrice: 1299,
    discount: 31,
    category: 'western',
    subcategory: 'tops',
    image: '/images/poster2.png',
    images: ['/images/poster2.png'],
    rating: 4.4,
    reviewCount: 203,
    sizes: ['XS', 'S', 'M', 'L'],
    isNew: false,
    isBestSeller: true,
    featured: true,
    description: 'Trendy crop top for casual outings'
  },
  {
    id: 'wb-1',
    name: 'High-Waist Palazzo Pants',
    price: 1299,
    originalPrice: 1799,
    discount: 28,
    category: 'western',
    subcategory: 'bottomwears',
    image: '/images/poster3.png',
    images: ['/images/poster3.png'],
    rating: 4.6,
    reviewCount: 178,
    sizes: ['S', 'M', 'L', 'XL'],
    isNew: false,
    isBestSeller: true,
    featured: false,
    description: 'Comfortable and stylish palazzo pants'
  },
  {
    id: 'wo-1',
    name: 'Formal Blazer Dress',
    price: 2999,
    originalPrice: 3999,
    discount: 25,
    category: 'western',
    subcategory: 'officewear',
    image: '/images/poster1.png',
    images: ['/images/poster1.png'],
    rating: 4.7,
    reviewCount: 94,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    isNew: true,
    isBestSeller: false,
    featured: true,
    description: 'Elegant blazer dress for professional settings'
  },
  {
    id: 'sale-1',
    name: 'Discounted Party Gown',
    price: 1999,
    originalPrice: 3999,
    discount: 50,
    category: 'sale',
    subcategory: 'last-chance',
    image: '/images/poster2.png',
    images: ['/images/poster2.png'],
    rating: 4.5,
    reviewCount: 134,
    sizes: ['S', 'M', 'L'],
    isNew: false,
    isBestSeller: true,
    featured: true,
    description: 'Beautiful party gown at 50% discount'
  }
];

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<{
    sort?: string;
    price?: string;
    size?: string;
    page?: string;
  }>;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const resolvedParams = await params;
  const categoryKey = resolvedParams.category;
  const category = categoryData[categoryKey];
  
  if (!category) {
    notFound();
  }

  const filteredProducts = categoryProducts.filter(product => 
    product.category === categoryKey
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <span>/</span>
            <Link href="/categories" className="hover:text-gray-900">Categories</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{category.name}</span>
          </nav>
        </div>
      </div>

      {/* Category Header */}
      <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="absolute inset-0 bg-black/20 z-10" />
        <div className="relative h-48 md:h-64 flex items-center justify-center">
          <div className="text-center z-20 px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{category.name}</h1>
            <p className="text-lg text-gray-100 max-w-2xl mx-auto">
              {category.description}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-4">
              <CategoryFilters 
                filters={category.filters} 
                category={categoryKey}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Subcategories Navigation */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Shop by Type</h3>
              <div className="flex flex-wrap gap-2">
                {category.subcategories.map((subcat: any) => (
                  <Link
                    key={subcat.id}
                    href={`/${categoryKey}/${subcat.id}`}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:border-black hover:text-black transition-colors"
                  >
                    {subcat.name}
                    <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                      {subcat.count}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Results Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div>
                <p className="text-gray-600">
                  Showing <span className="font-semibold">{filteredProducts.length}</span> products
                  {categoryKey && (
                    <span className="ml-2 text-sm text-gray-500">
                      in {category.name}
                    </span>
                  )}
                </p>
              </div>
              
              {/* Sort Options */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 hidden sm:block">Sort by:</span>
                <select className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black">
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="mb-8">
              <ProductGrid />
            </div>

            {/* Load More/Pagination */}
            {filteredProducts.length > 0 && (
              <div className="mt-12 text-center">
                <button className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:border-black hover:text-black transition-colors font-semibold">
                  Load More Products
                </button>
              </div>
            )}

            {/* No Products Message */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🛍️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">We couldn't find any products in this category.</p>
                <Link
                  href="/categories"
                  className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Browse All Categories
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate static params for SSG
export async function generateStaticParams() {
  return [
    { category: 'traditional' },
    { category: 'western' },
    { category: 'sale' }
  ];
}