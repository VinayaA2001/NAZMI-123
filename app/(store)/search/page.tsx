"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  category: string;
  subcategory: string;
  image: string;
  inStock: boolean;
  tags: string[];
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Mock product data - replace with your actual product data or API call
  const allProducts: Product[] = [
    // Western Tops
    {
      id: 1,
      title: "Classic Cotton T-Shirt",
      description: "Premium cotton t-shirt with perfect fit for everyday comfort",
      price: 599,
      originalPrice: 899,
      category: "western",
      subcategory: "tops",
      image: "/images/top1-1.jpg",
      inStock: true,
      tags: ["casual", "cotton", "everyday", "basic"]
    },
    {
      id: 2,
      title: "Designer Crop Top",
      description: "Trendy crop top with unique design perfect for parties and outings",
      price: 899,
      originalPrice: 1299,
      category: "western",
      subcategory: "tops",
      image: "/images/top2-1.jpg",
      inStock: true,
      tags: ["party", "trendy", "crop", "fashion"]
    },
    // Officewear
    {
      id: 3,
      title: "Professional Blazer Set",
      description: "Elegant blazer set with perfect tailoring for corporate meetings",
      price: 2499,
      originalPrice: 3299,
      category: "western",
      subcategory: "officewear",
      image: "/images/office1-1.jpg",
      inStock: true,
      tags: ["formal", "office", "corporate", "professional"]
    },
    {
      id: 4,
      title: "Office Dress",
      description: "Sophisticated office dress with modest length and professional design",
      price: 1799,
      originalPrice: 2299,
      category: "western",
      subcategory: "officewear",
      image: "/images/office2-1.jpg",
      inStock: true,
      tags: ["office", "professional", "dress", "business"]
    },
    // Bottomwears
    {
      id: 5,
      title: "Business Trousers",
      description: "Comfortable and stylish business trousers with perfect fit",
      price: 1299,
      originalPrice: 1699,
      category: "western",
      subcategory: "bottomwears",
      image: "/images/office3-1.jpg",
      inStock: true,
      tags: ["office", "formal", "trousers", "professional"]
    },
    {
      id: 6,
      title: "Designer Jeans",
      description: "Trendy jeans with perfect fit and modern design",
      price: 1599,
      originalPrice: 1999,
      category: "western",
      subcategory: "bottomwears",
      image: "/images/jeans1.jpg",
      inStock: true,
      tags: ["casual", "jeans", "denim", "trendy"]
    },
    // Traditional wear
    {
      id: 7,
      title: "Silk Saree",
      description: "Elegant silk saree with traditional embroidery",
      price: 3499,
      originalPrice: 4499,
      category: "traditional",
      subcategory: "sarees",
      image: "/images/saree1.jpg",
      inStock: true,
      tags: ["traditional", "saree", "silk", "ethnic"]
    },
    {
      id: 8,
      title: "Designer Kurti",
      description: "Beautiful kurti with modern traditional design",
      price: 1299,
      originalPrice: 1699,
      category: "traditional",
      subcategory: "kurtis",
      image: "/images/kurti1.jpg",
      inStock: true,
      tags: ["kurti", "ethnic", "traditional", "comfort"]
    },
    // Sale Items
    {
      id: 9,
      title: "Summer Dress",
      description: "Light and comfortable summer dress with floral print",
      price: 999,
      originalPrice: 1999,
      category: "western",
      subcategory: "dresses",
      image: "/images/dress1.jpg",
      inStock: true,
      tags: ["summer", "dress", "floral", "sale"]
    },
    {
      id: 10,
      title: "Casual Shirt",
      description: "Comfortable casual shirt for everyday wear",
      price: 799,
      originalPrice: 1299,
      category: "western",
      subcategory: "tops",
      image: "/images/shirt1.jpg",
      inStock: true,
      tags: ["casual", "shirt", "comfort", "sale"]
    }
  ];

  // Search suggestions
  const popularSearches = [
    "cotton t-shirts",
    "office wear",
    "party tops",
    "traditional kurtis",
    "sale items",
    "jeans",
    "dresses",
    "formal wear"
  ];

  const categories = [
    "western tops",
    "officewear",
    "bottomwears",
    "traditional",
    "sale"
  ];

  useEffect(() => {
    if (query.length > 2) {
      const filteredSuggestions = [
        ...popularSearches,
        ...categories,
        ...allProducts.map(p => p.title.toLowerCase())
      ].filter(suggestion => 
        suggestion.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  const handleSearch = (searchQuery?: string) => {
    const searchTerm = searchQuery || query;
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setHasSearched(true);

    // Simulate API call delay
    setTimeout(() => {
      const filteredResults = allProducts.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.subcategory.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setResults(filteredResults);
      setIsLoading(false);
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    handleSearch(suggestion);
  };

  const handleQuickSearch = (quickQuery: string) => {
    setQuery(quickQuery);
    handleSearch(quickQuery);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setHasSearched(false);
    setShowSuggestions(false);
  };

  const getCategoryLink = (product: Product) => {
    return `/${product.category}/${product.subcategory}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Search Header */}
      <section className="border-b py-8 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-light text-gray-900 mb-2 text-center">
            Search Products
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Discover traditional, western, and sale items
          </p>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for traditional, western, officewear, tops, or sale items..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                {query && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
                
                {/* Search Suggestions */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Searching..." : "Search"}
              </button>
            </div>
          </form>

          {/* Quick Search Tags */}
          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-3 text-center">Popular searches:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickSearch(search)}
                  className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Search Results */}
      <section className="container mx-auto px-4 py-8 max-w-6xl">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="text-gray-600 mt-4">Searching products...</p>
          </div>
        ) : hasSearched ? (
          <>
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-light text-gray-900">
                  {results.length > 0 ? `Found ${results.length} product${results.length === 1 ? '' : 's'}` : 'No products found'}
                  {query && (
                    <span className="text-gray-600"> for "{query}"</span>
                  )}
                </h2>
              </div>
              {results.length > 0 && (
                <button
                  onClick={clearSearch}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Clear search
                </button>
              )}
            </div>

            {/* Results Grid */}
            {results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={getCategoryLink(product)}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-400 transition-colors group"
                  >
                    {/* Product Image */}
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-300"
                      />
                      {!product.inStock && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
                          Out of Stock
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                        {product.category}
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-700">
                        {product.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold text-gray-900">₹{product.price}</span>
                          {product.originalPrice > product.price && (
                            <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                          )}
                        </div>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-green-600 font-medium">
                            {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                          </span>
                        )}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {product.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              /* No Results */
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-light text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any products matching "{query}"
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={clearSearch}
                    className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Clear Search
                  </button>
                  <Link
                    href="/western"
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors"
                  >
                    Browse Western
                  </Link>
                  <Link
                    href="/traditional"
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors"
                  >
                    Browse Traditional
                  </Link>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Initial State - Browse Categories */
          <div className="text-center py-12">
            <h2 className="text-2xl font-light text-gray-900 mb-8">Browse Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Link
                href="/western/tops"
                className="p-6 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-400 transition-colors group"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-200 group-hover:border-gray-400">
                  <span className="text-2xl">👕</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Western Tops</h3>
                <p className="text-gray-600 text-sm">T-shirts, shirts, and blouses</p>
              </Link>

              <Link
                href="/western/officewear"
                className="p-6 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-400 transition-colors group"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-200 group-hover:border-gray-400">
                  <span className="text-2xl">💼</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Officewear</h3>
                <p className="text-gray-600 text-sm">Professional and formal wear</p>
              </Link>

              <Link
                href="/western/bottomwears"
                className="p-6 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-400 transition-colors group"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-200 group-hover:border-gray-400">
                  <span className="text-2xl">👖</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Bottomwears</h3>
                <p className="text-gray-600 text-sm">Jeans, trousers, and skirts</p>
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}