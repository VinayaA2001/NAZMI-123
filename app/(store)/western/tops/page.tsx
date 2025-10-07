export default function TopsPage() {
  return (
    <section className="container py-10">
      <h1 className="text-2xl font-semibold mb-6">Tops</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Example Items */}
        <div className="border rounded-lg p-4">
          <img
            src="/images/shirt.png"
            alt="Shirts"
            className="w-full h-64 object-cover rounded-md"
          />
          <h2 className="mt-2 font-semibold">Shirts</h2>
          <p>₹1299</p>
          <button className="mt-2 px-4 py-2 bg-black text-white rounded">
            Add to Cart
          </button>
        </div>

        <div className="border rounded-lg p-4">
          <img
            src="/images/tshirt.png"
            alt="T-Shirts"
            className="w-full h-64 object-cover rounded-md"
          />
          <h2 className="mt-2 font-semibold">T-Shirts</h2>
          <p>₹799</p>
          <button className="mt-2 px-4 py-2 bg-black text-white rounded">
            Add to Cart
          </button>
        </div>

        <div className="border rounded-lg p-4">
          <img
            src="/images/croptop.png"
            alt="Crop Tops"
            className="w-full h-64 object-cover rounded-md"
          />
          <h2 className="mt-2 font-semibold">Crop Tops</h2>
          <p>₹999</p>
          <button className="mt-2 px-4 py-2 bg-black text-white rounded">
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  );
}
