export default function EthnicDressesPage() {
  return (
    <section className="container py-10">
      <h1 className="text-2xl font-semibold mb-6">Ethnic Dresses</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Example Ethnic Dress */}
        <div className="border rounded-lg p-4">
          <img
            src="/images/churidhar2.png"
            alt="Ethnic Dress"
            className="w-full h-64 object-cover rounded-md"
          />
          <h2 className="mt-2 font-semibold">Ethnic Anarkali</h2>
          <p>₹1799</p>
          <button className="mt-2 px-4 py-2 bg-black text-white rounded">
            Add to Cart
          </button>
        </div>

        <div className="border rounded-lg p-4">
          <img
            src="/images/churidhar2.png"
            alt="Ethnic Dress"
            className="w-full h-64 object-cover rounded-md"
          />
          <h2 className="mt-2 font-semibold">Ethnic Gown</h2>
          <p>₹1999</p>
          <button className="mt-2 px-4 py-2 bg-black text-white rounded">
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  );
}
