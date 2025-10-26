"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Heart, ShoppingCart, ZoomIn, Star, Shield, Truck, RotateCcw, Minus, Plus, Check, X, CreditCard, Lock } from "lucide-react";

interface ProductVariant {
  _id: string;
  size: string;
  colour: string;
  stock: number;
  price: number;
}

interface Product {
  _id: string;
  product_code: string;
  product_name: string;
  material: string;
  category: string;
  images: string[];
  description: string;
  variants: ProductVariant[];
  availableSizes: string[];
  availableColors: string[];
  totalStock: number;
  minPrice: number;
  maxPrice: number;
  hasMultipleOptions?: boolean;
}

interface OrderData {
  items: Array<{
    product_id: string;
    variant_id: string;
    quantity: number;
    price: number;
    size: string;
    color: string;
    product_code: string;
  }>;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  total_amount: number;
  payment_method: string;
}

export default function EthnicWearPage() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderingProduct, setOrderingProduct] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [cart, setCart] = useState<any[]>([]);
  const [zoomImage, setZoomImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showCartToast, setShowCartToast] = useState(false);
  const [addedProductName, setAddedProductName] = useState("");
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });
  const [error, setError] = useState<string | null>(null);

  // Fetch products from MongoDB
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Starting to fetch products from MongoDB...");
      
      const res = await fetch("/api/products");
      console.log("Response status:", res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log("Raw API response data:", data);
        
        if (!data || !Array.isArray(data)) {
          console.error("Invalid data format received:", data);
          setError("Invalid data format received from server");
          return;
        }

        if (data.length === 0) {
          console.log("No products found in database");
          setProductList([]);
          return;
        }

        // The backend now returns properly formatted data, so we can use it directly
        const formattedProducts: Product[] = data.map((product: any) => {
          // Fix for products with variants structure
          const hasMultipleVariants = product.variants && product.variants.length > 1;
          const hasMultipleColors = product.availableColors && product.availableColors.length > 1;
          const hasMultipleSizes = product.availableSizes && product.availableSizes.length > 1;
          
          return {
            ...product,
            // Ensure images are properly formatted and handle undefined/null
            images: Array.isArray(product.images) && product.images.length > 0 
              ? product.images.map((img: string) => {
                  if (!img) return '/images/placeholder.jpg';
                  if (img.startsWith('http')) {
                    return img; // Cloudinary URL
                  } else if (img.startsWith('/')) {
                    return img; // Local path
                  } else {
                    return `/images/${img}`; // Assume it's a local image filename
                  }
                })
              : ['/images/placeholder.jpg'],
            // Ensure we correctly identify if product has multiple options
            hasMultipleOptions: hasMultipleVariants || hasMultipleColors || hasMultipleSizes
          };
        });

        console.log("Formatted products:", formattedProducts);
        setProductList(formattedProducts);
      } else {
        const errorText = await res.text();
        console.error("Failed to fetch products. Status:", res.status, "Response:", errorText);
        setError(`Failed to load products: ${res.status} ${errorText}`);
      }
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Retry fetching products
  const retryFetch = () => {
    fetchProducts();
  };

  // Load wishlist & cart from localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    const savedCart = localStorage.getItem("cart");
    if (savedWishlist) {
      const wishlistData = JSON.parse(savedWishlist);
      setWishlist(new Set(wishlistData.map((item: any) => item.id)));
    }
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Cart Toast Notification
  const showCartNotification = (productName: string) => {
    setAddedProductName(productName);
    setShowCartToast(true);
    setTimeout(() => setShowCartToast(false), 3000);
  };

  const toggleWishlist = (product: Product) => {
    const newWishlist = new Set(wishlist);
    const item = {
      id: product._id,
      productId: product._id,
      name: `${product.material} ${product.category}`,
      price: product.minPrice,
      image: getImageUrl(product.images[0]),
      productCode: product.product_code
    };

    let existing: any[] = [];
    try {
      const data = localStorage.getItem("wishlist");
      if (data) existing = JSON.parse(data);
    } catch {
      existing = [];
    }

    if (newWishlist.has(product._id)) {
      newWishlist.delete(product._id);
      const updated = existing.filter((i: any) => i.id !== product._id);
      localStorage.setItem("wishlist", JSON.stringify(updated));
    } else {
      newWishlist.add(product._id);
      const updated = [...existing, item];
      localStorage.setItem("wishlist", JSON.stringify(updated));
    }

    setWishlist(newWishlist);
    window.dispatchEvent(new Event("wishlist-updated"));
  };

  const addToCart = (product: Product, size: string = "", color: string = "", qty: number = 1) => {
    // For products with multiple options, require size and color selection
    if (product.hasMultipleOptions) {
      if (!size && product.availableSizes.length > 1) {
        alert("Please select a size before adding to cart.");
        return;
      }
      if (!color && product.availableColors.length > 1) {
        alert("Please select a color before adding to cart.");
        return;
      }
    }

    // Find the specific variant
    let variant;
    if (product.variants.length === 1) {
      variant = product.variants[0];
    } else {
      variant = product.variants.find(v => 
        v.size === (size || product.availableSizes[0]) && 
        v.colour === (color || product.availableColors[0])
      );
    }

    if (!variant) {
      alert("Selected variant not available.");
      return;
    }

    if (variant.stock < qty) {
      alert(`Only ${variant.stock} items available in stock for ${variant.size} - ${variant.colour}.`);
      return;
    }

    const cartItem = {
      id: `${product._id}-${variant.size}-${variant.colour}`,
      productId: product._id,
      variantId: variant._id,
      name: `${product.material} ${product.category}`,
      price: variant.price,
      image: getImageUrl(product.images[0]),
      quantity: qty,
      size: variant.size,
      color: variant.colour,
      productCode: product.product_code,
      material: product.material,
      category: product.category,
      maxStock: variant.stock
    };

    let existing: any[] = [];
    try {
      const data = localStorage.getItem("cart");
      if (data) existing = JSON.parse(data);
    } catch {
      existing = [];
    }

    const existingItemIndex = existing.findIndex((item: any) => item.id === cartItem.id);
    let updated;

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      const newQuantity = existing[existingItemIndex].quantity + qty;
      if (newQuantity > cartItem.maxStock) {
        alert(`Only ${cartItem.maxStock} items available in stock. You already have ${existing[existingItemIndex].quantity} in cart.`);
        return;
      }
      updated = existing.map((item: any, i: number) => 
        i === existingItemIndex ? { ...item, quantity: newQuantity } : item
      );
    } else {
      // Add new item
      updated = [...existing, cartItem];
    }

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cart-updated"));
    
    // Show success notification
    showCartNotification(`${product.material} ${product.category}`);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setSelectedSize("");
    setSelectedColor("");
    setSelectedImageIndex(0);
    setQuantity(1);
  };

  const handleOrderNow = (product: Product) => {
    // For products with multiple options, validate selections
    if (product.hasMultipleOptions) {
      if (!selectedSize && product.availableSizes.length > 1) {
        alert("Please select a size before ordering.");
        return;
      }
      if (!selectedColor && product.availableColors.length > 1) {
        alert("Please select a color before ordering.");
        return;
      }
    }

    setOrderingProduct(product);
    setShowPaymentModal(true);
  };

  const handlePayment = async (method: string) => {
    if (!orderingProduct || !selectedProduct) return;

    // Validate customer information
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
      alert("Please fill in all customer information before proceeding with payment.");
      return;
    }

    setOrderProcessing(true);

    try {
      // Find the selected variant
      let variant;
      if (selectedProduct.variants.length === 1) {
        variant = selectedProduct.variants[0];
      } else {
        variant = selectedProduct.variants.find(v => 
          v.size === (selectedSize || selectedProduct.availableSizes[0]) && 
          v.colour === (selectedColor || selectedProduct.availableColors[0])
        );
      }

      if (!variant) {
        alert("Selected variant not found.");
        setOrderProcessing(false);
        return;
      }

      if (variant.stock < quantity) {
        alert(`Sorry, only ${variant.stock} items available in stock for ${variant.size} - ${variant.colour}.`);
        setOrderProcessing(false);
        return;
      }

      // Create order in backend
      const orderData: OrderData = {
        items: [{
          product_id: selectedProduct._id,
          variant_id: variant._id,
          quantity: quantity,
          price: variant.price,
          size: variant.size,
          color: variant.colour,
          product_code: selectedProduct.product_code
        }],
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        shipping_address: customerInfo.address,
        total_amount: variant.price * quantity,
        payment_method: method
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token") || ''}`
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const orderResult = await response.json();
        
        // Update local stock
        const updatedProducts = productList.map(product => {
          if (product._id === selectedProduct._id) {
            const updatedVariants = product.variants.map(v => {
              if (v._id === variant._id) {
                return { ...v, stock: v.stock - quantity };
              }
              return v;
            });
            
            const totalStock = updatedVariants.reduce((sum, v) => sum + v.stock, 0);
            
            return {
              ...product,
              variants: updatedVariants,
              totalStock
            };
          }
          return product;
        });

        setProductList(updatedProducts);

        alert(`Order placed successfully!\nOrder Number: ${orderResult.order_number}\nAmount: ₹${variant.price * quantity}\nWe will contact you at ${customerInfo.phone} for delivery details.`);
        
        // Reset states
        setShowPaymentModal(false);
        setOrderingProduct(null);
        setSelectedProduct(null);
        setCustomerInfo({ name: "", email: "", phone: "", address: "" });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Order creation failed");
      }
    } catch (error: any) {
      console.error("Order creation error:", error);
      alert(`Order failed: ${error.message || "Please try again later."}`);
    } finally {
      setOrderProcessing(false);
    }
  };

  const isInWishlist = (productId: string) => wishlist.has(productId);

  // Get available colors for selected size
  const getAvailableColors = (product: Product, size: string) => {
    return [...new Set(product.variants
      .filter(v => v.size === size && v.stock > 0)
      .map(v => v.colour)
    )];
  };

  // Get available sizes for selected color
  const getAvailableSizes = (product: Product, color: string) => {
    return [...new Set(product.variants
      .filter(v => v.colour === color && v.stock > 0)
      .map(v => v.size)
    )];
  };

  // Get price for selected variant
  const getSelectedVariantPrice = (product: Product) => {
    if (product.variants.length === 1) {
      return product.variants[0].price;
    }
    
    if (!selectedSize || !selectedColor) return product.minPrice;
    
    const variant = product.variants.find(v => 
      v.size === selectedSize && v.colour === selectedColor
    );
    return variant ? variant.price : product.minPrice;
  };

  // Get selected variant stock
  const getSelectedVariantStock = (product: Product) => {
    if (product.variants.length === 1) {
      return product.variants[0].stock;
    }
    
    if (!selectedSize || !selectedColor) return 0;
    
    const variant = product.variants.find(v => 
      v.size === selectedSize && v.colour === selectedColor
    );
    return variant ? variant.stock : 0;
  };

  // Safe image URL handler with proper error handling
  const getImageUrl = (imagePath: string | undefined | null): string => {
    if (!imagePath) {
      return '/images/placeholder.jpg';
    }
    
    if (typeof imagePath !== 'string') {
      return '/images/placeholder.jpg';
    }
    
    if (imagePath.startsWith('http')) {
      return imagePath; // Cloudinary URL
    } else if (imagePath.startsWith('/')) {
      return imagePath; // Local path
    } else {
      return `/images/${imagePath}`; // Fallback
    }
  };

  // Safe image component to prevent errors
  const SafeImage = ({ src, alt, ...props }: any) => {
    const [imgSrc, setImgSrc] = useState(getImageUrl(src));
    
    return (
      <Image
        {...props}
        src={imgSrc}
        alt={alt}
        onError={() => setImgSrc('/images/placeholder.jpg')}
      />
    );
  };

  // Check if product has multiple options (needs selection)
  const hasMultipleOptions = (product: Product) => {
    return product.variants.length > 1 || 
           product.availableSizes.length > 1 || 
           product.availableColors.length > 1;
  };

  // Filter out products with zero stock
  const availableProducts = productList.filter(product => product.totalStock > 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-light">Loading our exclusive collection...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-12 h-12 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Products</h3>
          <p className="text-gray-600 mb-4 max-w-md">{error}</p>
          <button
            onClick={retryFetch}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Cart Success Toast */}
      {showCartToast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-in slide-in-from-right duration-300 flex items-center gap-3">
          <Check className="w-5 h-5" />
          <div>
            <p className="font-semibold">Added to Cart!</p>
            <p className="text-sm opacity-90">{addedProductName}</p>
          </div>
          <button 
            onClick={() => setShowCartToast(false)}
            className="ml-2 hover:bg-green-600 rounded-full p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Collection Banner */}
      <div className="bg-gradient-to-br from-rose-50 via-white to-amber-50 border-b border-gray-100 pt-20">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 tracking-wide">Ethnic Collection</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Traditional elegance meets contemporary minimalism. Handcrafted pieces from Kerala.
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {availableProducts.map((product) => (
            <div
              key={`${product._id}-${product.product_code}`}
              className="group bg-white rounded-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-xl border border-gray-100"
              onClick={() => handleProductClick(product)}
            >
              {/* Product Image */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <SafeImage
                  src={product.images[0]}
                  alt={`${product.material} ${product.category}`}
                  fill
                  className="object-cover group-hover:scale-110 transition duration-500"
                />
                
                {/* Wishlist Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product);
                  }}
                  className={`absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 ${
                    isInWishlist(product._id) 
                      ? "text-red-500" 
                      : "text-gray-600 hover:text-red-500"
                  }`}
                >
                  <Heart 
                    className={`w-4 h-4 ${isInWishlist(product._id) ? "fill-current" : ""}`} 
                  />
                </button>

                {/* Variant Indicator - Only show if multiple options exist */}
                {hasMultipleOptions(product) && (
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
                    Options Available
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-3">
                <h3 className="font-medium text-gray-900 text-sm mb-1 leading-tight line-clamp-2">
                  {product.material} {product.category}
                </h3>
                <p className="text-xs text-gray-500 mb-2">Code: {product.product_code}</p>
                
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">
                      ₹{product.minPrice}
                      {product.minPrice !== product.maxPrice && ` - ₹${product.maxPrice}`}
                    </span>
                  </div>
                </div>

                {/* Quick Actions */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (product.totalStock === 0) {
                      alert("This product is currently out of stock.");
                      return;
                    }
                    if (hasMultipleOptions(product)) {
                      handleProductClick(product);
                    } else {
                      // For single variant, use the only available size and color
                      const variant = product.variants[0];
                      addToCart(product, variant.size, variant.colour);
                    }
                  }}
                  disabled={product.totalStock === 0}
                  className={`w-full py-2 text-xs font-medium rounded transition-all duration-300 ${
                    product.totalStock === 0 
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  {product.totalStock === 0 
                    ? "OUT OF STOCK" 
                    : hasMultipleOptions(product)
                      ? "SELECT OPTIONS" 
                      : "ADD TO CART"
                  }
                </button>
              </div>
            </div>
          ))}
        </div>

        {availableProducts.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-light text-gray-900 mb-2 tracking-wide">No Products Available</h3>
            <p className="text-gray-600 font-light">We're curating our next collection</p>
            <button
              onClick={retryFetch}
              className="mt-4 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Refresh Products
            </button>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 md:p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl md:rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="relative">
              {/* Close Button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="grid md:grid-cols-2 gap-8 p-6">
                {/* Product Images */}
                <div className="space-y-4">
                  {/* Main Image */}
                  <div 
                    className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-zoom-in"
                    onClick={() => setZoomImage(getImageUrl(selectedProduct.images[selectedImageIndex]))}
                  >
                    <SafeImage
                      src={selectedProduct.images[selectedImageIndex]}
                      alt={selectedProduct.description}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white p-1 rounded">
                      <ZoomIn className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Thumbnail Images */}
                  {selectedProduct.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {selectedProduct.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`relative aspect-square rounded border-2 overflow-hidden ${
                            selectedImageIndex === index ? 'border-black' : 'border-transparent'
                          }`}
                        >
                          <SafeImage
                            src={image}
                            alt={`${selectedProduct.description} view ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-light text-gray-900 mb-2">
                      {selectedProduct.material} {selectedProduct.category}
                    </h1>
                    <p className="text-sm text-gray-500 mb-4">Product Code: {selectedProduct.product_code}</p>
                    <p className="text-gray-700 leading-relaxed">{selectedProduct.description}</p>
                    
                    {/* Stock Info - Only show in detail modal */}
                    <div className="mt-4">
                      <p className={`text-sm font-medium ${
                        selectedProduct.totalStock > 5 ? 'text-green-600' : 
                        selectedProduct.totalStock > 0 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {selectedProduct.totalStock > 0 
                          ? `${selectedProduct.totalStock} items in stock` 
                          : 'Out of stock'
                        }
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-light text-gray-900">
                      ₹{getSelectedVariantPrice(selectedProduct)}
                    </span>
                    {selectedProduct.minPrice !== selectedProduct.maxPrice && (
                      <span className="text-sm text-gray-500">
                        (₹{selectedProduct.minPrice} - ₹{selectedProduct.maxPrice})
                      </span>
                    )}
                  </div>

                  {/* Variant Selection - Only show if multiple options exist */}
                  {hasMultipleOptions(selectedProduct) && (
                    <div className="space-y-4">
                      {/* Size Selection */}
                      {selectedProduct.availableSizes.length > 1 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Size {selectedSize && `: ${selectedSize}`}
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {selectedProduct.availableSizes.map((size) => (
                              <button
                                key={size}
                                onClick={() => {
                                  setSelectedSize(size);
                                  // Reset color when size changes if multiple colors exist
                                  if (selectedProduct.availableColors.length > 1) {
                                    setSelectedColor("");
                                  }
                                }}
                                className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all ${
                                  selectedSize === size
                                    ? 'border-black bg-black text-white'
                                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Color Selection */}
                      {selectedProduct.availableColors.length > 1 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Color {selectedColor && `: ${selectedColor}`}
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {getAvailableColors(
                              selectedProduct, 
                              selectedSize || selectedProduct.availableSizes[0]
                            ).map((color) => (
                              <button
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all ${
                                  selectedColor === color
                                    ? 'border-black bg-black text-white'
                                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                }`}
                              >
                                {color}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quantity Selection */}
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-900">Quantity:</label>
                    <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{quantity}</span>
                      <button
                        onClick={() => {
                          const maxStock = getSelectedVariantStock(selectedProduct);
                          setQuantity(Math.min(maxStock, quantity + 1));
                        }}
                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        disabled={quantity >= getSelectedVariantStock(selectedProduct)}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">
                      {getSelectedVariantStock(selectedProduct)} available
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => {
                        if (hasMultipleOptions(selectedProduct)) {
                          if (selectedProduct.availableSizes.length > 1 && !selectedSize) {
                            alert("Please select a size before adding to cart.");
                            return;
                          }
                          if (selectedProduct.availableColors.length > 1 && !selectedColor) {
                            alert("Please select a color before adding to cart.");
                            return;
                          }
                        }
                        addToCart(
                          selectedProduct,
                          selectedSize || selectedProduct.availableSizes[0],
                          selectedColor || selectedProduct.availableColors[0],
                          quantity
                        );
                        setSelectedProduct(null);
                      }}
                      className="flex-1 bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleOrderNow(selectedProduct)}
                      className="flex-1 border border-black text-black py-3 px-6 rounded-lg hover:bg-black hover:text-white transition-colors font-medium"
                    >
                      Buy Now
                    </button>
                  </div>

                  {/* Stock Warning */}
                  {getSelectedVariantStock(selectedProduct) < 5 && getSelectedVariantStock(selectedProduct) > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-yellow-800 text-sm">
                        Only {getSelectedVariantStock(selectedProduct)} items left in stock!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rest of your existing Payment Modal and other components remain the same */}
      {/* ... (Payment Modal, Trust Features, Zoom Modal) ... */}
    </div>
  );
}