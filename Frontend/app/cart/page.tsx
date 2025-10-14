'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag, Shield, Truck, ArrowLeft, CreditCard, RotateCcw } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  inStock: boolean;
  category?: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    loadCartItems();
    window.addEventListener('cart-updated', loadCartItems);
    
    // Sticky sidebar observer
    const observer = new IntersectionObserver(
      ([entry]) => setIsSticky(!entry.isIntersecting),
      { threshold: [0] }
    );
    
    const sentinel = document.getElementById('cart-sentinel');
    if (sentinel) observer.observe(sentinel);
    
    return () => {
      window.removeEventListener('cart-updated', loadCartItems);
      if (sentinel) observer.unobserve(sentinel);
    };
  }, []);

  const loadCartItems = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(cart);
    } catch (error) {
      console.error('Error loading cart:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const updatedCart = cartItems.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const removeItem = (productId: string) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.setItem('cart', '[]');
    window.dispatchEvent(new Event('cart-updated'));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    // Tiered discounts
    if (subtotal > 8000) return Math.round(subtotal * 0.15);
    if (subtotal > 5000) return Math.round(subtotal * 0.1);
    if (subtotal > 3000) return Math.round(subtotal * 0.05);
    return 0;
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 1999 ? 0 : 99;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount() + calculateShipping();
  };

  const getDiscountTier = () => {
    const subtotal = calculateSubtotal();
    if (subtotal > 8000) return '15%';
    if (subtotal > 5000) return '10%';
    if (subtotal > 3000) return '5%';
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              <div className="xl:col-span-3 space-y-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex gap-6">
                      <div className="w-28 h-28 bg-gray-200 rounded-xl"></div>
                      <div className="flex-1 space-y-3">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-8 bg-gray-200 rounded w-32"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-96"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Sticky Sentinel */}
      <div id="cart-sentinel" className="h-px" />
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl shadow-lg">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-light text-gray-900 mb-2">Shopping Cart</h1>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
                  <span>›</span>
                  <span className="text-gray-900 font-medium">Cart</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
              </span>
              {cartItems.length > 0 && (
                <button
                  onClick={clearCart}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 text-sm font-medium transition-colors border border-red-200 hover:border-red-300 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {cartItems.length === 0 ? (
          // Empty Cart State
          <div className="text-center py-20 max-w-2xl mx-auto">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
              <ShoppingBag className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-3xl font-light text-gray-900 mb-4">Your Cart Awaits</h2>
            <p className="text-gray-600 text-lg mb-12 max-w-md mx-auto leading-relaxed">
              Discover amazing products and fill your cart with style. Start exploring our curated collections.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/western"
                className="bg-gradient-to-r from-gray-900 to-gray-700 text-white px-10 py-4 rounded-xl font-medium hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Explore Western Collection
              </Link>
              <Link
                href="/sale"
                className="border-2 border-gray-300 text-gray-700 px-10 py-4 rounded-xl font-medium hover:border-gray-400 hover:shadow-lg transition-all duration-300"
              >
                View Sale Items
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Cart Items */}
            <div className="xl:col-span-3 space-y-6">
              {cartItems.map((item, index) => (
                <div 
                  key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                  className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 p-6"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <div className="relative w-28 h-28 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {!item.inStock && (
                          <div className="absolute inset-0 bg-red-500/90 flex items-center justify-center">
                            <span className="text-white text-sm font-medium px-2 py-1">Out of Stock</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">{item.name}</h3>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                              Size: {item.selectedSize}
                            </span>
                            {item.selectedColor && (
                              <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                                Color: {item.selectedColor}
                              </span>
                            )}
                            {item.category && (
                              <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                                {item.category}
                              </span>
                            )}
                          </div>
                          <p className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            ₹{item.price.toLocaleString()}
                          </p>
                        </div>
                        
                        <button
                          onClick={() => removeItem(item.id)}
                          className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center bg-gray-50 rounded-xl p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-lg hover:bg-white"
                          >
                            <Minus className="w-5 h-5" />
                          </button>
                          <span className="px-6 py-2 min-w-[60px] text-center font-semibold text-gray-900 text-lg border-l border-r border-gray-200">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 text-gray-600 hover:text-gray-800 transition-colors rounded-lg hover:bg-white"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {item.quantity} × ₹{item.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary - Sticky */}
            <div className="xl:col-span-1">
              <div className={`bg-white rounded-2xl shadow-xl border border-gray-100 p-6 transition-all duration-300 ${
                isSticky ? 'xl:fixed xl:top-24 xl:w-[380px] xl:z-40' : 'xl:sticky xl:top-8'
              }`}>
                <h2 className="text-2xl font-light text-gray-900 mb-6 pb-4 border-b border-gray-100">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-gray-700">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span className="font-semibold">₹{calculateSubtotal().toLocaleString()}</span>
                  </div>
                  
                  {calculateDiscount() > 0 && (
                    <div className="flex justify-between items-center text-green-600 bg-green-50 rounded-xl p-3">
                      <span className="font-medium">Discount ({getDiscountTier()})</span>
                      <span className="font-bold">-₹{calculateDiscount().toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center text-gray-700">
                    <span>Shipping</span>
                    <span className={calculateShipping() === 0 ? "text-green-600 font-bold" : "font-semibold"}>
                      {calculateShipping() === 0 ? "FREE" : `₹${calculateShipping().toLocaleString()}`}
                    </span>
                  </div>
                  
                  {/* Free Shipping Progress */}
                  {calculateShipping() > 0 && (
                    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-4">
                      <p className="text-yellow-800 font-medium mb-2 text-sm">
                        Add ₹{(1999 - calculateSubtotal()).toLocaleString()} more for FREE shipping!
                      </p>
                      <div className="w-full bg-yellow-200 rounded-full h-2 mb-1">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ 
                            width: `${Math.min((calculateSubtotal() / 1999) * 100, 100)}%` 
                          }}
                        ></div>
                      </div>
                      <p className="text-yellow-700 text-xs text-right">
                        {Math.round((calculateSubtotal() / 1999) * 100)}% to free shipping
                      </p>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center text-lg">
                      <span className="font-semibold text-gray-900">Total Amount</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        ₹{calculateTotal().toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mt-2">Inclusive of all taxes</p>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  className="w-full bg-gradient-to-r from-gray-900 to-gray-700 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-3 mb-4"
                >
                  <CreditCard className="w-5 h-5" />
                  Proceed to Checkout
                </Link>

                {/* Continue Shopping */}
                <Link
                  href="/sale"
                  className="w-full border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-medium hover:border-gray-400 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  Continue Shopping
                </Link>

                {/* Trust & Security */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-inner">
                        <Truck className="w-6 h-6 text-emerald-600" />
                      </div>
                      <p className="text-xs font-medium text-gray-700">Free Shipping</p>
                      <p className="text-xs text-gray-500">Above ₹1999</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-200 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-inner">
                        <Shield className="w-6 h-6 text-cyan-600" />
                      </div>
                      <p className="text-xs font-medium text-gray-700">Secure</p>
                      <p className="text-xs text-gray-500">256-bit SSL</p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-violet-200 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-inner">
                      <RotateCcw className="w-6 h-6 text-violet-600" />
                    </div>
                    <p className="text-xs font-medium text-gray-700">Easy Returns</p>
                    <p className="text-xs text-gray-500">30 Days Policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}