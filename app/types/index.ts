// types/index.ts
export interface Product {
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

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  addedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}