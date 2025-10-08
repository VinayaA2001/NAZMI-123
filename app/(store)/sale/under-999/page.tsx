// app/sale/under-999/page.tsx
import Image from "next/image";
import Link from "next/link";

type Item = {
  id: string;
  name: string;
  image: string; // e.g. /products/floral-a-line.jpg
  price: number; // sale price
  mrp?: number;  // original price (optional, will show strikethrough)
  badge?: string; // e.g. "-35%", "Hot", "New"
};

const items: Item[] = [
  {
    id: "u999-1",
    name: "Floral A-Line Kurti",
    image: "/products/floral-a-line.jpg",
    price: 899,
    mrp: 1499,
    badge: "-40%",
  },
  {
    id: "u999-2",
    name: "Chic Puff-Sleeve Top",
    image: "/products/chic-puff.jpg",
    price: 699,
    mrp: 999,
    badge: "Hot",
  },
  {
    id: "u999-3",
    name: "Everyday Cotton Tee",
    image: "/products/everyday-tee.jpg",
    price: 499,
    mrp: 799,
  },
  {
    id: "u999-4",
    name: "Printed Palazzo",
    image: "/products/printed-palazzo.jpg",
    price: 799,
    mrp: 1199,
  },
  {
    id: "u999-5",
    name: "Summer Midi Dress",
    image: "/products/summer-midi.jpg",
    price: 999,
    mrp: 1699,
    badge: "-41%",
  },
  {
    id: "u999-6",
    name: "Denim Overshirt",
    image: "/products/denim-overshirt.jpg",
    price: 949,
    mrp: 1399,
    badge: "Limited",
  },
];

export default function Under999Page() {
  return (
    <section className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-wide">Under ₹999</h2>
        <p className="text-gray-600">Trendy picks that fit your budget.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <ProductCard key={it.id} item={it} />
        ))}
      </div>
    </section>
  );
}

/** ---------- Product Card (inline) ---------- */
function ProductCard({ item }: { item: Item }) {
  const { id, name, image, price, mrp, badge } = item;

  return (
    <Link
      href={`/product/${encodeURIComponent(id)}`}
      className="group rounded-2xl overflow-hidden border bg-white shadow-sm hover:shadow-md transition"
    >
      {/* IMAGE */}
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          priority={false}
        />
        {/* subtle gradient for readability */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
        {/* badge */}
        {badge ? (
          <span className="absolute left-3 top-3 rounded-full bg-black/80 text-white text-xs tracking-wide px-3 py-1">
            {badge}
          </span>
        ) : null}
        {/* quick view hint */}
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-white/90 backdrop-blur px-3 py-1 rounded-full border">
          View Details
        </span>
      </div>

      {/* TEXT */}
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
