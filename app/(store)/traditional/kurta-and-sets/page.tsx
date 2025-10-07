export default function KurtaAndSetsPage() {
  return (
    <section className="container py-10">
      <h1 className="text-2xl font-semibold mb-6">Kurta & Sets</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded-lg p-4">
          <img
            src="/images/kurta1.png"
            alt="Cotton Kurta Set"
            className="w-full h-64 object-cover rounded-md"
          />
          <h2 className="mt-2 font-semibold">Cotton Kurta Set</h2>
          <p>₹1499</p>
          <button className="mt-2 px-4 py-2 bg-black text-white rounded">
            Add to Cart
          </button>
        </div>

        <div className="border rounded-lg p-4">
          <img
            src="/images/kurta2.png"
            alt="Embroidered Kurta Set"
            className="w-full h-64 object-cover rounded-md"
          />
          <h2 className="mt-2 font-semibold">Embroidered Kurta Set</h2>
          <p>₹1899</p>
          <button className="mt-2 px-4 py-2 bg-black text-white rounded">
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  );
}
