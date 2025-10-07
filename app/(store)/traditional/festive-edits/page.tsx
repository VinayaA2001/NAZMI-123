export default function FestiveEditsPage() {
  return (
    <section className="container py-10">
      <h1 className="text-2xl font-semibold mb-6">Festive Edits</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Example Festive Outfit */}
        <div className="border rounded-lg p-4">
          <img
            src="/images/sharara.png"
            alt="Sharara"
            className="w-full h-64 object-cover rounded-md"
          />
          <h2 className="mt-2 font-semibold">Sharara</h2>
          <p>₹2499</p>
          <button className="mt-2 px-4 py-2 bg-black text-white rounded">
            Add to Cart
          </button>
        </div>

        <div className="border rounded-lg p-4">
          <img
            src="/images/churidhar6.png"
            alt="Festive Churidhar"
            className="w-full h-64 object-cover rounded-md"
          />
          <h2 className="mt-2 font-semibold"> Churidhar</h2>
          <p>₹2199</p>
          <button className="mt-2 px-4 py-2 bg-black text-white rounded">
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  );
}
