export default function BottomwearPage() {
  return (
    <section className="container py-10">
      <h1 className="text-2xl font-semibold mb-6">Bottomwear</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Example Items */}
        <div className="border rounded-lg p-4">
          <img
            src="/images/jeans.png"
            alt="Jeans"
            className="w-full h-64 object-cover rounded-md"
          />
          <h2 className="mt-2 font-semibold">Classic Blue Jeans</h2>
          <p>₹1299</p>
          <button className="mt-2 px-4 py-2 bg-black text-white rounded">
            Add to Cart
          </button>
        </div>

        <div className="border rounded-lg p-4">
          <img
            src="/images/palazzo.png"
            alt="Palazzo Pants"
            className="w-full h-64 object-cover rounded-md"
          />
          <h2 className="mt-2 font-semibold">Palazzo Pants</h2>
          <p>₹799</p>
          <button className="mt-2 px-4 py-2 bg-black text-white rounded">
            Add to Cart
          </button>
        </div>

        <div className="border rounded-lg p-4">
          <img
            src="/images/skirt.png"
            alt="Skirt"
            className="w-full h-64 object-cover rounded-md"
          />
          <h2 className="mt-2 font-semibold">Casual Skirt</h2>
          <p>₹999</p>
          <button className="mt-2 px-4 py-2 bg-black text-white rounded">
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  );
}
