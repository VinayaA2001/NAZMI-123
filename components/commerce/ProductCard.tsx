"use client";
import Image from "next/image";
import { Product } from '@/lib/data';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const msg = encodeURIComponent(`Hi Nazmi! I'm interested in "${product.name}" (₹${product.price}).`);
  const wa = phone ? `https://wa.me/${phone}?text=${msg}` : "#";
  
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <article className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image 
          src={product.images[0]} 
          alt={product.name} 
          fill 
          className="object-cover hover:scale-105 transition-transform duration-300" 
        />
        
        {/* New Badge */}
        {product.tags.includes('new') && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            NEW
          </div>
        )}
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 right-3 bg-[#6D7E5F] text-white px-2 py-1 rounded-full text-xs font-semibold">
            {discount}% OFF
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-[#2C2C2C] mb-1">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-[#6D7E5F]">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <a 
            href={`/products/${product.id}`} 
            className="flex-1 text-center bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            View Details
          </a>
          <a 
            href={wa} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex-1 text-center bg-[#6D7E5F] text-white px-3 py-2 rounded-lg hover:bg-[#5A6B4F] transition-colors text-sm"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}