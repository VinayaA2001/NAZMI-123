// app/sale/under-1499/page.tsx
import Image from "next/image";
import Link from "next/link";

type Item = {
  id: string;
  name: string;
  image: string;
  price: number;   // sale price
  mrp?: number;    // original price
  badge?: string;  // e.g. "-30%", "Hot"
};

const items: Item[] = [
  { id: "u1499-1", name: "Floral Midi Dress", image: "/products/summer-midi.jpg", price: 1_299, mrp: 1_899, badge: "-32%" },
  { id: "u1499-2", name: "Boho Kurti Set", image: "/products/floral-a-line.jpg", price: 1_199, mrp: 1_699 },
  { id: "u1499-3", name: "Puff-Sleeve Top", image: "/products/chic-puff.jpg", price: 999, mrp: 1_299, badge: "Hot" },
  { id: "u1499-4", name: "Denim Overshirt", image: "/products/denim-overshirt.jpg", price: 1_449, mrp: 1_899 },
  { id: "u1499-5", name: "Printed Palazzo", image: "/products/printed-palazzo.jpg", price: 1_099, mrp: 1_499 },
  { id: "u1499-6", name: "Everyday Tee", image: "/products/everyday-tee.jpg", price: 749, mrp: 999 },
];

export default function Under1499Page() {
  return (
    <section className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-wide">Under ₹1499</h2>
        <p className="text-gray-600">Affordable elegance for every occasion.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <ProductCard key={it.id} item={it} />
        ))}
      </div>
    </section>
  );
}

function ProductCard({ item }: { item: Item }) {
  const { id, name, image, price, mrp, badge } = item;
  return (
    <Link
      href={`/product/${encodeURIComponent(id)}`}
      className="group rounded-2xl overflow-hidden border bg-white shadow-sm hover:shadow-md transition"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
        {badge ? (
          <span className="absolute left-3 top-3 rounded-full bg-black/80 text-white text-xs tracking-wide px-3 py-1">
            {badge}
          </span>
        ) : null}
      </div>

      <div className="p-4">
        <h3 className="line-clamp-1 text-base md:text-lg font-semibold">{name}</h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-semibold">₹{price}</span>
          {mrp ? <span className="text-sm text-gray-500 line-through">₹{mrp}</span> : null}
          {mrp && mrp > price ? (
            <span className="ml-auto text-xs text-green-600 font-medium">Save ₹{mrp - price}</span>
          ) : null}
        </div>
        <p className="mt-1 text-xs text-gray-500">Fast delivery • Easy returns</p>
      </div>
    </Link>
  );
}
