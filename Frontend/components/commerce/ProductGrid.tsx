"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Eye, Star } from "lucide-react";

type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  description?: string;
  sizes?: string[];
  colors?: string[];
  featured?: boolean;
  inStock?: boolean;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  // MongoDB fields
  product_code?: string;
  material?: string;
  variants?: any[];
  availableSizes?: string[];
  availableColors?: string[];
  totalStock?: number;
  minPrice?: number;
  maxPrice?: number;
};

type CartItem = Product & {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
};

const sampleProducts: Product[] = [
  {
    id: "p1",
    name: "Floral Print Anarkali",
    price: 2299,
    originalPrice: 2999,
    image: "/images/products/product-1.jpg",
    images: [
      "/images/products/product-1-1.jpg",
      "/images/products/product-1-2.jpg", 
      "/images/products/product-1-3.jpg",
      "/images/products/product-1-4.jpg"
    ],
    category: "traditional",
    description: "Beautiful floral print anarkali with intricate embroidery work and comfortable fabric",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Red", "Blue", "Green"],
    featured: true,
    inStock: true,
    rating: 4.5,
    reviewCount: 128,
    tags: ["new", "bestseller", "embroidered"]
  },
  {
    id: "p2", 
    name: "Designer Silk Saree",
    price: 3599,
    originalPrice: 4599,
    image: "/images/products/product-2.jpg",
    images: [
      "/images/products/product-2-1.jpg",
      "/images/products/product-2-2.jpg",
      "/images/products/product-2-3.jpg", 
      "/images/products/product-2-4.jpg"
    ],
    category: "traditional",
    description: "Pure silk saree with zari border and elegant pallu design",
    sizes: ["Free Size"],
    colors: ["Maroon", "Gold", "Navy"],
    featured: true,
    inStock: true,
    rating: 4.8,
    reviewCount: 89,
    tags: ["new", "premium", "silk"]
  },
  // Add more products as needed...
];

export default function ProductGrid() {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  // Load products from MongoDB and combine with sample data
  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Fetch from MongoDB API
        const response = await fetch("http://127.0.0.1:5000/api/products");
        if (response.ok) {
          const mongoData = await response.json();
          
          // Transform MongoDB data to match Product type
          const mongoProducts = transformMongoDBProducts(mongoData);
          
          // Combine with sample products (you can remove sampleProducts if you want only MongoDB data)
          const allProducts = [...sampleProducts, ...mongoProducts];
          setProducts(allProducts);
        } else {
          // Fallback to sample products if API fails
          console.error("Failed to fetch from MongoDB, using sample data");
          setProducts(sampleProducts);
        }
      } catch (error) {
        console.error("Error loading products:", error);
        setProducts(sampleProducts);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Transform MongoDB products to match your Product type
  const transformMongoDBProducts = (mongoData: any[]): Product[] => {
    const productMap = new Map();
    
    mongoData.forEach((product: any) => {
      const key = product.product_code;
      
      if (!productMap.has(key)) {
        // Create base product
        productMap.set(key, {
          id: product._id,
          name: `${product.material} ${product.category}`,
          price: product.price || 0,
          image: product.images?.[0] || "/images/placeholder.jpg",
          images: product.images || [],
          category: product.category?.toLowerCase() || "traditional",
          description: `${product.material} ${product.category} - Handcrafted traditional wear`,
          sizes: [],
          colors: [],
          featured: false,
          inStock: (product.stock || 0) > 0,
          rating: 4.2, // Default rating for MongoDB products
          reviewCount: 0,
          tags: ["traditional", "handcrafted"],
          // MongoDB specific fields
          product_code: product.product_code,
          material: product.material,
          variants: [],
          availableSizes: [],
          availableColors: [],
          totalStock: 0,
          minPrice: product.price,
          maxPrice: product.price
        });
      }
      
      const baseProduct = productMap.get(key);
      
      // Add variant
      if (product.size && !baseProduct.sizes.includes(product.size)) {
        baseProduct.sizes.push(product.size);
        baseProduct.availableSizes.push(product.size);
      }
      
      if (product.colour && !baseProduct.colors.includes(product.colour)) {
        baseProduct.colors.push(product.colour);
        baseProduct.availableColors.push(product.colour);
      }
      
      // Add to variants array
      baseProduct.variants.push({
        _id: product._id,
        size: product.size,
        colour: product.colour,
        stock: product.stock || 0,
        price: product.price
      });
      
      // Update stock and pricing
      baseProduct.totalStock += product.stock || 0;
      baseProduct.minPrice = Math.min(baseProduct.minPrice, product.price);
      baseProduct.maxPrice = Math.max(baseProduct.maxPrice, product.price);
      
      // Update price to show range if different variants have different prices
      if (baseProduct.minPrice !== baseProduct.maxPrice) {
        baseProduct.price = baseProduct.minPrice;
      }
    });
    
    return Array.from(productMap.values());
  };

  // Load from localStorage
  useEffect(() => {
    try {
      const storedWishlist = localStorage.getItem("wishlist");
      const storedCart = localStorage.getItem("cart");
      
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
      if (storedCart) setCart(JSON.parse(storedCart));
    } catch (error) {
      console.error("Error loading from localStorage:", error);
    }
  }, []);

  // Filter products
  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  // Wishlist toggle
  const toggleWishlist = (product: Product) => {
    const isInWishlist = wishlist.some(item => item.id === product.id);
    const updatedWishlist = isInWishlist
      ? wishlist.filter(item => item.id !== product.id)
      : [...wishlist, product];

    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    window.dispatchEvent(new Event("wishlist-updated"));
  };

  // Add to cart with MongoDB variant support
  const addToCart = (product: Product, size: string = "", color: string = "") => {
    // For MongoDB products with variants, require size and color selection
    if (product.variants && product.variants.length > 1) {
      if (!size && product.availableSizes && product.availableSizes.length > 0) {
        alert("Please select a size before adding to cart.");
        return;
      }
      if (!color && product.availableColors && product.availableColors.length > 0) {
        alert("Please select a color before adding to cart.");
        return;
      }
    }

    // For MongoDB products, find the specific variant
    let variantPrice = product.price;
    let variantStock = product.totalStock || 0;
    
    if (product.variants && product.variants.length > 0) {
      const variant = product.variants.find((v: any) => 
        v.size === (size || product.sizes?.[0]) && 
        v.colour === (color || product.colors?.[0])
      );
      
      if (variant) {
        variantPrice = variant.price;
        variantStock = variant.stock;
        
        if (variant.stock < 1) {
          alert(`Sorry, ${size || ''} ${color || ''} is out of stock.`);
          return;
        }
      }
    }

    const defaultSize = size || product.sizes?.[0] || "Free Size";
    const defaultColor = color || product.colors?.[0] || "Default";
    
    const existingItem = cart.find(item => 
      item.id === product.id && 
      item.selectedSize === defaultSize && 
      item.selectedColor === defaultColor
    );
    
    const updatedCart = existingItem
      ? cart.map(item =>
          item.id === product.id && item.selectedSize === defaultSize && item.selectedColor === defaultColor
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [...cart, { 
          ...product, 
          quantity: 1, 
          selectedSize: defaultSize, 
          selectedColor: defaultColor,
          price: variantPrice // Use variant price if available
        }];

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cart-updated"));
    showNotification(`${product.name} added to cart!`);
  };

  // Quick view
  const openQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setCurrentImageIndex(0);
    setSelectedSize("");
    setSelectedColor("");
  };

  // Notification
  const showNotification = (message: string) => {
    // You can integrate a proper toast notification here
    console.log(message);
  };

  const handleImageError = (productId: string) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  // Get available colors for selected size (for MongoDB products)
  const getAvailableColors = (product: Product, size: string) => {
    if (!product.variants) return product.colors || [];
    return [...new Set(product.variants
      .filter((v: any) => v.size === size && v.stock > 0)
      .map((v: any) => v.colour)
    )];
  };

  // Get available sizes for selected color (for MongoDB products)
  const getAvailableSizes = (product: Product, color: string) => {
    if (!product.variants) return product.sizes || [];
    return [...new Set(product.variants
      .filter((v: any) => v.colour === color && v.stock > 0)
      .map((v: any) => v.size)
    )];
  };

  // Get price for selected variant
  const getSelectedVariantPrice = (product: Product) => {
    if (!selectedSize || !selectedColor || !product.variants) return product.price;
    
    const variant = product.variants.find((v: any) => 
      v.size === selectedSize && v.colour === selectedColor
    );
    return variant ? variant.price : product.price;
  };

  // Get stock for selected variant
  const getSelectedVariantStock = (product: Product) => {
    if (!selectedSize || !selectedColor || !product.variants) return product.totalStock || 0;
    
    const variant = product.variants.find((v: any) => 
      v.size === selectedSize && v.colour === selectedColor
    );
    return variant ? variant.stock : 0;
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 aspect-[3/4] rounded-2xl mb-4"></div>
              <div className="bg-gray-200 h-4 rounded mb-2"></div>
              <div className="bg-gray-200 h-4 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Products Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map((product) => {
          const isInWishlist = wishlist.some(item => item.id === product.id);
          const discount = product.originalPrice 
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            : 0;

          // For MongoDB products with price range
          const showPriceRange = product.minPrice && product.maxPrice && product.minPrice !== product.maxPrice;

          return (
            <div
              key={product.id}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#E8E9E0] hover:border-[#6D7E5F]"
            >
              {/* Product Badges */}
              <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                {product.tags?.includes('new') && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                    NEW
                  </span>
                )}
                {discount > 0 && (
                  <span className="bg-[#6D7E5F] text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                    {discount}% OFF
                  </span>
                )}
                {/* MongoDB Stock Badge */}
                {(product.totalStock !== undefined && product.totalStock < 5) && (
                  <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                    Only {product.totalStock} left
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
                <button
                  onClick={() => toggleWishlist(product)}
                  className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors shadow-lg"
                  aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      isInWishlist ? "text-red-500 fill-red-500" : "text-gray-600 hover:text-red-500"
                    }`}
                  />
                </button>
                
                <button
                  onClick={() => openQuickView(product)}
                  className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors shadow-lg"
                  aria-label="Quick view"
                >
                  <Eye className="w-4 h-4 text-gray-600 hover:text-[#6D7E5F]" />
                </button>
              </div>

              {/* Product Image */}
              <Link href={`/products/${product.id}`}>
                <div className="relative overflow-hidden bg-[#E8E9E0] aspect-[3/4]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    onError={() => handleImageError(product.id)}
                  />
                  
                  {/* MongoDB Variant Indicator */}
                  {product.variants && product.variants.length > 1 && (
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded text-xs">
                      {product.availableSizes?.length || 0} sizes • {product.availableColors?.length || 0} colors
                    </div>
                  )}
                </div>
              </Link>

              {/* Product Info */}
              <div className="p-4">
                <Link href={`/products/${product.id}`}>
                  <h3 className="font-semibold text-lg mb-1 hover:text-[#6D7E5F] transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>

                {/* Product Code for MongoDB products */}
                {product.product_code && (
                  <p className="text-xs text-gray-500 mb-1">Code: {product.product_code}</p>
                )}

                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(product.rating!) 
                              ? "text-yellow-400 fill-yellow-400" 
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">
                      ({product.reviewCount})
                    </span>
                  </div>
                )}

                {product.description && (
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {product.description}
                  </p>
                )}

                {/* Price */}
                <div className="flex items-center gap-2 mb-3">
                  {showPriceRange ? (
                    <p className="text-[#6D7E5F] font-bold text-lg">
                      ₹{product.minPrice} - ₹{product.maxPrice}
                    </p>
                  ) : (
                    <>
                      <p className="text-[#6D7E5F] font-bold text-lg">
                        ₹{product.price.toLocaleString()}
                      </p>
                      {product.originalPrice && (
                        <p className="text-gray-500 text-sm line-through">
                          ₹{product.originalPrice.toLocaleString()}
                        </p>
                      )}
                    </>
                  )}
                </div>

                {/* Sizes - Show available sizes from MongoDB */}
                {(product.sizes && product.sizes.length > 0) && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {product.sizes.slice(0, 4).map((size) => (
                      <span
                        key={size}
                        className="text-xs bg-[#E8E9E0] text-[#2C2C2C] px-2 py-1 rounded border"
                      >
                        {size}
                      </span>
                    ))}
                    {product.sizes.length > 4 && (
                      <span className="text-xs bg-[#E8E9E0] text-[#2C2C2C] px-2 py-1 rounded border">
                        +{product.sizes.length - 4}
                      </span>
                    )}
                  </div>
                )}

                {/* Add to Cart Button */}
                <button
                  onClick={() => addToCart(product)}
                  className="w-full bg-[#6D7E5F] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#5c6e50] transition-all duration-300 flex items-center justify-center space-x-2 group"
                >
                  <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Add to Cart</span>
                </button>

                {/* Quick Actions */}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => openQuickView(product)}
                    className="flex-1 text-center text-sm text-[#6D7E5F] hover:text-[#5c6e50] transition-colors py-1"
                  >
                    Quick View
                  </button>
                  <button className="flex-1 text-center text-sm text-[#6D7E5F] hover:text-[#5c6e50] transition-colors py-1">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick View Modal - Enhanced for MongoDB variants */}
      {quickViewProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="grid md:grid-cols-2 gap-8 p-6">
              {/* Product Images */}
              <div className="space-y-4">
                <div className="relative aspect-square bg-[#E8E9E0] rounded-2xl overflow-hidden">
                  <Image
                    src={quickViewProduct.images?.[currentImageIndex] || quickViewProduct.image}
                    alt={quickViewProduct.name}
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Thumbnail Gallery */}
                {quickViewProduct.images && quickViewProduct.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {quickViewProduct.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative aspect-square bg-[#E8E9E0] rounded-lg overflow-hidden border-2 ${
                          currentImageIndex === index ? "border-[#6D7E5F]" : "border-transparent"
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`${quickViewProduct.name} view ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-4">
                <button
                  onClick={() => setQuickViewProduct(null)}
                  className="ml-auto block text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
                
                <h2 className="text-2xl font-bold">{quickViewProduct.name}</h2>
                
                {/* MongoDB Product Code */}
                {quickViewProduct.product_code && (
                  <p className="text-sm text-gray-500">Product Code: {quickViewProduct.product_code}</p>
                )}
                
                {quickViewProduct.rating && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(quickViewProduct.rating!) 
                              ? "text-yellow-400 fill-yellow-400" 
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({quickViewProduct.reviewCount} reviews)
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-[#6D7E5F]">
                    {quickViewProduct.minPrice && quickViewProduct.maxPrice && quickViewProduct.minPrice !== quickViewProduct.maxPrice
                      ? `₹${quickViewProduct.minPrice} - ₹${quickViewProduct.maxPrice}`
                      : `₹${quickViewProduct.price.toLocaleString()}`
                    }
                  </p>
                  {quickViewProduct.originalPrice && (
                    <p className="text-lg text-gray-500 line-through">
                      ₹{quickViewProduct.originalPrice.toLocaleString()}
                    </p>
                  )}
                </div>

                {quickViewProduct.description && (
                  <p className="text-gray-600">{quickViewProduct.description}</p>
                )}

                {/* MongoDB Variant Selection */}
                {quickViewProduct.variants && quickViewProduct.variants.length > 1 && (
                  <>
                    {/* Size Selection */}
                    {quickViewProduct.availableSizes && quickViewProduct.availableSizes.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Size:</h4>
                        <div className="flex flex-wrap gap-2">
                          {quickViewProduct.availableSizes.map((size) => (
                            <button
                              key={size}
                              onClick={() => {
                                setSelectedSize(size);
                                // Auto-select first available color for this size
                                const availableColors = getAvailableColors(quickViewProduct, size);
                                if (availableColors.length > 0 && !selectedColor) {
                                  setSelectedColor(availableColors[0]);
                                }
                              }}
                              className={`px-4 py-2 border rounded-lg transition-colors ${
                                selectedSize === size 
                                  ? "border-[#6D7E5F] bg-[#6D7E5F] text-white" 
                                  : "border-gray-300 hover:border-[#6D7E5F]"
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Color Selection */}
                    {quickViewProduct.availableColors && quickViewProduct.availableColors.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Color:</h4>
                        <div className="flex flex-wrap gap-2">
                          {quickViewProduct.availableColors.map((color) => (
                            <button
                              key={color}
                              onClick={() => {
                                setSelectedColor(color);
                                // Auto-select first available size for this color
                                const availableSizes = getAvailableSizes(quickViewProduct, color);
                                if (availableSizes.length > 0 && !selectedSize) {
                                  setSelectedSize(availableSizes[0]);
                                }
                              }}
                              className={`px-4 py-2 border rounded-lg transition-colors ${
                                selectedColor === color 
                                  ? "border-[#6D7E5F] bg-[#6D7E5F] text-white" 
                                  : "border-gray-300 hover:border-[#6D7E5F]"
                              }`}
                            >
                              {color}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Selected Variant Info */}
                    {selectedSize && selectedColor && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-green-800 text-sm font-medium">
                          ✓ {selectedSize} - {selectedColor} is available
                        </p>
                        <p className="text-green-700 text-xs mt-1">
                          Price: ₹{getSelectedVariantPrice(quickViewProduct)} • Stock: {getSelectedVariantStock(quickViewProduct)} units
                        </p>
                      </div>
                    )}
                  </>
                )}

                {/* Regular Size Selection (for non-MongoDB products) */}
                {(!quickViewProduct.variants || quickViewProduct.variants.length <= 1) && quickViewProduct.sizes && (
                  <div>
                    <h4 className="font-semibold mb-2">Size:</h4>
                    <div className="flex flex-wrap gap-2">
                      {quickViewProduct.sizes.map((size) => (
                        <button
                          key={size}
                          className="px-4 py-2 border rounded-lg hover:border-[#6D7E5F] hover:bg-[#6D7E5F] hover:text-white transition-colors"
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Regular Color Selection (for non-MongoDB products) */}
                {(!quickViewProduct.variants || quickViewProduct.variants.length <= 1) && quickViewProduct.colors && (
                  <div>
                    <h4 className="font-semibold mb-2">Color:</h4>
                    <div className="flex flex-wrap gap-2">
                      {quickViewProduct.colors.map((color) => (
                        <button
                          key={color}
                          className="px-4 py-2 border rounded-lg hover:border-[#6D7E5F] transition-colors"
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => addToCart(quickViewProduct, selectedSize, selectedColor)}
                    className="flex-1 bg-[#6D7E5F] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#5c6e50] transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                  <button className="flex-1 bg-[#2C2C2C] text-white py-3 px-6 rounded-lg font-semibold hover:bg-black transition-colors">
                    Buy Now
                  </button>
                </div>

                <button
                  onClick={() => toggleWishlist(quickViewProduct)}
                  className="w-full border border-[#6D7E5F] text-[#6D7E5F] py-3 px-6 rounded-lg font-semibold hover:bg-[#6D7E5F] hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      wishlist.some(item => item.id === quickViewProduct.id) ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                  {wishlist.some(item => item.id === quickViewProduct.id) 
                    ? "Remove from Wishlist" 
                    : "Add to Wishlist"
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-[#92A079] text-6xl mb-4">🛍️</div>
          <h3 className="text-xl font-semibold text-[#2C2C2C] mb-2">No products found</h3>
          <p className="text-gray-600">Try selecting a different category</p>
        </div>
      )}
    </div>
  );
}