// components/blocks/commerce/AddToCart.tsx
'use client';
import { useState } from 'react';

// Define types locally if global types are not working
interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  subcategory: string;
  description: string;
  detailedDescription: string;
  sizes: string[];
  colors: string[];
  images: string[];
  inStock: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  features: string[];
  material: string;
  care: string;
  delivery: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
}

interface AddToCartProps {
  product: Product;
}

export function AddToCart({ product }: AddToCartProps) {
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const addToCart = async (): Promise<void> => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    setIsAdding(true);

    try {
      const cartItem = {
        ...product,
        selectedSize,
        selectedColor,
        quantity,
        addedAt: new Date().toISOString(),
      };

      // Get existing cart from localStorage
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      // Check if item already exists with same size and color
      const existingItemIndex = existingCart.findIndex(
        (item: any) => 
          item.id === product.id && 
          item.selectedSize === selectedSize && 
          item.selectedColor === selectedColor
      );

      let updatedCart;
      if (existingItemIndex > -1) {
        // Update quantity of existing item
        updatedCart = existingCart.map((item: any, index: number) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        updatedCart = [...existingCart, cartItem];
      }

      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      
      // Dispatch event for cart updates
      window.dispatchEvent(new Event('cart-updated'));

      // Show success notification
      showNotification(`${product.name} added to cart!`);
      
      // Reset quantity
      setQuantity(1);

    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const showNotification = (message: string): void => {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-right duration-300';
    toast.innerHTML = `
      <div class="flex items-center gap-3">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
        </svg>
        <span>${message}</span>
      </div>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3000);
  };

  const incrementQuantity = (): void => setQuantity(prev => prev + 1);
  const decrementQuantity = (): void => setQuantity(prev => Math.max(1, prev - 1));

  return (
    <div className="space-y-6">
      {/* Size Selection */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Select Size</h3>
          <button 
            type="button"
            className="text-sm text-blue-600 hover:text-blue-700 underline"
          >
            Size Guide
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((size: string) => (
            <button
              key={size}
              type="button"
              onClick={() => setSelectedSize(size)}
              className={`px-4 py-3 border-2 rounded-lg font-medium transition-all min-w-[60px] ${
                selectedSize === size
                  ? 'border-black bg-black text-white shadow-md'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
              } ${!product.inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!product.inStock}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color Selection */}
      {product.colors.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Select Color</h3>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color: string) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`px-4 py-3 border-2 rounded-lg font-medium transition-all ${
                  selectedColor === color
                    ? 'border-black bg-black text-white shadow-md'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                } ${!product.inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!product.inStock}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Quantity</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              type="button"
              onClick={decrementQuantity}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={quantity <= 1}
            >
              −
            </button>
            <span className="px-4 py-2 min-w-[60px] text-center font-medium">
              {quantity}
            </span>
            <button
              type="button"
              onClick={incrementQuantity}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors rounded-r-lg"
            >
              +
            </button>
          </div>
          <span className="text-sm text-gray-600">
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          onClick={addToCart}
          disabled={!product.inStock || isAdding}
          className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-3 ${
            product.inStock
              ? 'bg-black text-white hover:bg-gray-800 hover:shadow-lg transform hover:scale-105 active:scale-95'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          } ${isAdding ? 'opacity-70 cursor-wait' : ''}`}
        >
          {isAdding ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Adding...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add to Cart
            </>
          )}
        </button>

        <button
          type="button"
          className="flex-1 py-4 px-6 border-2 border-black text-black rounded-lg font-semibold hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          Wishlist
        </button>
      </div>

      {/* Quick Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
        <div className="text-center">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-xs text-gray-600">Free Shipping</p>
        </div>
        <div className="text-center">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <p className="text-xs text-gray-600">Easy Returns</p>
        </div>
        <div className="text-center">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p className="text-xs text-gray-600">Secure Payment</p>
        </div>
      </div>
    </div>
  );
}