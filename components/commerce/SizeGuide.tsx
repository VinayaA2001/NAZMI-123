// components/commerce/SizeGuide.tsx
import React, { useState } from 'react';

interface SizeGuideProps {
  productType?: string;
  className?: string;
}

const SizeGuide: React.FC<SizeGuideProps> = ({ 
  productType = 'clothing', 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(productType);

  // Size data for different product categories
  const sizeData = {
    clothing: {
      title: "Women's Clothing Size Guide",
      units: "All measurements in inches",
      headers: ["Size", "Bust", "Waist", "Hips"],
      rows: [
        { size: "XS", bust: "32-33", waist: "24-25", hips: "34-35" },
        { size: "S", bust: "34-35", waist: "26-27", hips: "36-37" },
        { size: "M", bust: "36-37", waist: "28-29", hips: "38-39" },
        { size: "L", bust: "38-39", waist: "30-31", hips: "40-41" },
        { size: "XL", bust: "40-42", waist: "32-34", hips: "42-44" },
        { size: "XXL", bust: "44-46", waist: "36-38", hips: "46-48" }
      ]
    },
    dresses: {
      title: "Dress Size Guide",
      units: "All measurements in inches",
      headers: ["US Size", "Bust", "Waist", "Hips", "Length"],
      rows: [
        { size: "2", bust: "32.5", waist: "25.5", hips: "35.5", length: "56" },
        { size: "4", bust: "33.5", waist: "26.5", hips: "36.5", length: "57" },
        { size: "6", bust: "34.5", waist: "27.5", hips: "37.5", length: "58" },
        { size: "8", bust: "35.5", waist: "28.5", hips: "38.5", length: "59" },
        { size: "10", bust: "37", waist: "30", hips: "40", length: "60" },
        { size: "12", bust: "38.5", waist: "31.5", hips: "41.5", length: "61" }
      ]
    },
    shoes: {
      title: "Shoe Size Guide",
      units: "US Women's Sizes",
      headers: ["US Size", "EU Size", "Foot Length (inches)"],
      rows: [
        { size: "5", eu: "35", length: "8.5" },
        { size: "6", eu: "36", length: "8.75" },
        { size: "7", eu: "37", length: "9" },
        { size: "8", eu: "38", length: "9.25" },
        { size: "9", eu: "39", length: "9.5" },
        { size: "10", eu: "40", length: "9.75" }
      ]
    }
  };

  const categories = [
    { id: 'clothing', label: 'Clothing' },
    { id: 'dresses', label: 'Dresses' },
    { id: 'shoes', label: 'Shoes' }
  ];

  const currentData = sizeData[activeCategory as keyof typeof sizeData] || sizeData.clothing;

  return (
    <div className={`size-guide ${className}`}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="text-sm text-gray-600 underline hover:text-gray-800 transition-colors"
      >
        Size Guide
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-serif font-semibold">Size Guide</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Category Tabs */}
            <div className="border-b">
              <div className="flex space-x-1 px-6">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-4 py-3 text-sm font-medium transition-colors ${
                      activeCategory === category.id
                        ? 'border-b-2 border-pink-500 text-pink-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-auto">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2">{currentData.title}</h3>
                <p className="text-sm text-gray-600">{currentData.units}</p>
              </div>

              {/* Size Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      {currentData.headers.map((header, index) => (
                        <th 
                          key={index}
                          className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.rows.map((row, rowIndex) => (
                      <tr 
                        key={rowIndex}
                        className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      >
                        {currentData.headers.map((header, colIndex) => (
                          <td 
                            key={colIndex}
                            className="px-4 py-3 text-sm text-gray-900 border-b"
                          >
                            {row[header.toLowerCase() as keyof typeof row]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Measurement Guide */}
              <div className="mt-8 p-4 bg-pink-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">How to Measure</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• <strong>Bust:</strong> Measure around the fullest part of your bust</li>
                  <li>• <strong>Waist:</strong> Measure around the narrowest part of your waist</li>
                  <li>• <strong>Hips:</strong> Measure around the fullest part of your hips</li>
                  <li>• Use a soft measuring tape and keep it parallel to the floor</li>
                </ul>
              </div>

              {/* Note */}
              <div className="mt-4 text-xs text-gray-500 text-center">
                <p>All measurements are in inches. Sizes may vary by brand and style.</p>
                <p>For personalized fitting advice, contact our stylists!</p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t px-6 py-4 bg-gray-50">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full bg-pink-500 text-white py-3 px-4 rounded-md hover:bg-pink-600 transition-colors font-medium"
              >
                Close Size Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SizeGuide;