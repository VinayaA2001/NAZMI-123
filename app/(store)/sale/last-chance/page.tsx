// app/sale/last-chance/page.tsx
import Image from "next/image";
import Link from "next/link";

type Item = {
  id: string;
  name: string;
  image: string;  // e.g. /products/lastchance-wrap-dress.jpg
  price: number;  // sale price
  mrp?: number;   // original price for strikethrough
  badge?: string; // e.g. "-50%", "Last Few", "Hot"
  stock?: number; // show "Only X left" if small
};

const items: Item[] = [
  {
    id: "lc-1",
    name: "Satin Wrap Dress",
    image: "/products/lastchance-wrap-dress.jpg",
    price: 1099,
    mrp: 1899,
    badge: "-42%",
    stock: 3,
  },
  {
    id: "lc-2",
    name: "Embroidered Kurti",
    image: "/products/lastchance-embro-kurti.jpg",
    price: 999,
    mrp: 1499,
    badge: "Last Few",
    stock: 5,
  },
  {
    id: "lc-3",
    name: "Pleated Midi Skirt",
    image: "/products/lastchance-pleated-midi.jpg",
    price: 899,
    mrp: 1299,
    stock: 2,
  },
  {
    id: "lc-4",
    name: "Chiffon Ruffle Top",
    image: "/images/top1.png",
    price: 749,
    mrp: 1099,
  },
  {
    id: "lc-5",
    name: "Boho Maxi Dress",
    image: "/products/lastchance-boho-maxi.jpg",
    price: 1199,
    mrp: 1999,
    badge: "-40%",
  },
  {
    id: "lc-6",
    name: "Denim Shirt Dress",
    image: "lastchance-denim-shirt.jpg",
    price: 999,
    mrp: 1599,
  },
];

export default function LastChancePage() {
  return (
    <section className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-wide">Last Chance</h2>
        <p className="text-gray-600">Grab your favorites before they&apos;re gone!</p>
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
  const { id, name, image, price, mrp, badge, stock } = item;

  return (
    <Link
      href={`/product/${encodeURIComponent(id)}`}
      className="group rounded-2xl overflow-hidden border bg-white shadow-sm hover:shadow-md transition"
    >
      {/* Image */}
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
        {typeof stock === "number" && stock <= 5 ? (
          <span className="absolute right-3 top-3 rounded-full bg-rose-600 text-white text-xs tracking-wide px-3 py-1">
            Only {stock} left
          </span>
        ) : null}
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-white/90 backdrop-blur px-3 py-1 rounded-full border">
          View Details
        </span>
      </div>

      {/* Text */}
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
