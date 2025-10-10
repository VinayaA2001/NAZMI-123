import ProductGrid from '@/components/commerce/ProductGrid';
export default function NewArrivalsPage() {
  return (
    <div className="min-h-screen bg-[#E8E9E0] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#2C2C2C] mb-4">
            New Arrivals
          </h1>
          <p className="text-lg text-[#6D7E5F] max-w-2xl mx-auto">
            Discover our latest collection. Fresh styles added regularly to keep you fashionable and trendy.
          </p>
        </div>

        {/* Products Grid */}
        <ProductGrid />
      </div>
    </div>
  );
}