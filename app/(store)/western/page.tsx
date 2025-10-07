import Link from "next/link";

export default function WesternPage() {
  return (
    <section className="container py-10">
      {/* Removed the main centered title */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bottomwears */}
        <Link
          href="/western/bottomwears"
          className="border rounded-lg p-4 hover:shadow-lg transition flex flex-col"
        >
          <img
            src="/images/bottom.png"
            alt="Bottomwears"
            className="w-full h-64 object-cover rounded-md"
          />
          <div className="mt-3">
            <h2 className="text-xl font-semibold">Bottomwears</h2>
            <p className="text-gray-600">Jeans, skirts & Palazzo pants</p>
          </div>
        </Link>

        {/* Officewear */}
        <Link
          href="/western/Officewear"
          className="border rounded-lg p-4 hover:shadow-lg transition flex flex-col"
        >
          <img
            src="/images/Office.png"
            alt="Officewear"
            className="w-full h-64 object-cover rounded-md"
          />
          <div className="mt-3">
            <h2 className="text-xl font-semibold">Officewear</h2>
            <p className="text-gray-600">Stylish matching outfits</p>
          </div>
        </Link>

        {/* Tops & Shirts */}
        <Link
          href="/western/tops"
          className="border rounded-lg p-4 hover:shadow-lg transition flex flex-col"
        >
          <img
            src="/images/tops.png"
            alt="Tops & Shirts"
            className="w-full h-64 object-cover rounded-md"
          />
          <div className="mt-3">
            <h2 className="text-xl font-semibold">Tops & Shirts</h2>
            <p className="text-gray-600">Trendy casual & formal tops</p>
          </div>
        </Link>
      </div>
    </section>
  );
}
