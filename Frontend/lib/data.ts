export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  tags: string[];
  inStock: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Mock data
export const products: Product[] = [
  {
    id: "1",
    name: "Embroidered Kurti",
    description: "Beautiful hand-embroidered cotton kurti",
    price: 1899,
    originalPrice: 2499,
    images: ["/images/products/kurti-1.jpg"],
    category: "traditional",
    tags: ["new", "embroidered", "cotton"],
    inStock: true,
    featured: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: "2",
    name: "Designer Saree",
    description: "Elegant silk saree with designer work",
    price: 4599,
    originalPrice: 5999,
    images: ["/images/products/saree-1.jpg"],
    category: "traditional",
    tags: ["new", "silk", "designer"],
    inStock: true,
    featured: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  }
];

export function getNewArrivals(): Product[] {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  return products
    .filter(product => product.createdAt >= thirtyDaysAgo)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}