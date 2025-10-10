// components/CategoryFilters.tsx
'use client';
import { useState } from 'react';

interface CategoryFiltersProps {
  filters: any;
  category: string;
}

export function CategoryFilters({ filters, category }: CategoryFiltersProps) {
  const [selectedFilters, setSelectedFilters] = useState({
    price: [] as string[],
    size: [] as string[],
    occasion: [] as string[],
    fabric: [] as string[],
    discount: [] as string[],
    style: [] as string[],
    color: [] as string[]
  });

  const handleFilterChange = (filterType: string, value: string) => {
    setSelectedFilters(prev => {
      const currentFilters = prev[filterType as keyof typeof prev];
      const updatedFilters = currentFilters.includes(value)
        ? currentFilters.filter((item: string) => item !== value)
        : [...currentFilters, value];
      
      return {
        ...prev,
        [filterType]: updatedFilters
      };
    });
  };

  const clearFilters = () => {
    setSelectedFilters({
      price: [], size: [], occasion: [], fabric: [], 
      discount: [], style: [], color: []
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        <button 
          onClick={clearFilters}
          className="text-sm text-gray-600 hover:text-black underline"
        >
          Clear all
        </button>
      </div>

      {/* Price Filter */}
      {filters.price && (
        <div className="border-b border-gray-200 pb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Price</h4>
          <div className="space-y-2">
            {filters.price.map((price: string) => (
              <label key={price} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedFilters.price.includes(price)}
                  onChange={() => handleFilterChange('price', price)}
                  className="rounded border-gray-300 text-black focus:ring-black"
                />
                <span className="ml-2 text-sm text-gray-700">{price}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Size Filter */}
      {filters.size && (
        <div className="border-b border-gray-200 pb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Size</h4>
          <div className="grid grid-cols-3 gap-2">
            {filters.size.map((size: string) => (
              <button
                key={size}
                onClick={() => handleFilterChange('size', size)}
                className={`py-2 px-3 text-sm border rounded text-center transition-colors ${
                  selectedFilters.size.includes(size)
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

      {/* Occasion Filter */}
      {filters.occasion && (
        <div className="border-b border-gray-200 pb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Occasion</h4>
          <div className="space-y-2">
            {filters.occasion.map((occasion: string) => (
              <label key={occasion} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedFilters.occasion.includes(occasion)}
                  onChange={() => handleFilterChange('occasion', occasion)}
                  className="rounded border-gray-300 text-black focus:ring-black"
                />
                <span className="ml-2 text-sm text-gray-700">{occasion}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Discount Filter (for Sale category) */}
      {filters.discount && (
        <div className="border-b border-gray-200 pb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Discount</h4>
          <div className="space-y-2">
            {filters.discount.map((discount: string) => (
              <label key={discount} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedFilters.discount.includes(discount)}
                  onChange={() => handleFilterChange('discount', discount)}
                  className="rounded border-gray-300 text-black focus:ring-black"
                />
                <span className="ml-2 text-sm text-gray-700">{discount}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Apply Filters Button */}
      <button className="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold text-sm hover:bg-gray-800 transition-colors">
        Apply Filters
      </button>
    </div>
  );
}