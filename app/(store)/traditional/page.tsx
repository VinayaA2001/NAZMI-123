import Link from "next/link";

export default function TraditionalPage() {
  return (
    <section className="container py-10">
      <h1 className="text-2xl font-semibold mb-6">Traditional</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ethnic Dresses */}
        <Link href="/traditional/ethnic-dresses" className="border rounded-lg p-4 block hover:shadow-lg transition">
          <img
            src="/images/churidhar2.png"
            alt="Ethnic Dresses"
            className="w-full h-64 object-cover rounded-md"
          />
          <h2 className="mt-2 font-semibold">Ethnic Dresses</h2>
          <p>Explore traditional anarkalis & gowns</p>
        </Link>

        {/* Festive Edits */}
        <Link href="/traditional/festive-edits" className="border rounded-lg p-4 block hover:shadow-lg transition">
          <img
            src="/images/churidhar1.png"
            alt="Festive Edits"
            className="w-full h-64 object-cover rounded-md"
          />
          <h2 className="mt-2 font-semibold">Festive Edits</h2>
          <p>Special picks for celebrations</p>
        </Link>

        {/* Kurta & Sets */}
        <Link href="/traditional/kurta-and-sets" className="border rounded-lg p-4 block hover:shadow-lg transition">
          <img
            src="/images/kurta set.png"
            alt="Kurta & Sets"
            className="w-full h-64 object-cover rounded-md"
          />
          <h2 className="mt-2 font-semibold">Kurta & Sets</h2>
          <p>Stylish & comfortable sets</p>
        </Link>
      </div>
    </section>
  );
}
