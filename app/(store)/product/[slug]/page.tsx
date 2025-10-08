// app/(store)/product/[slug]/page.tsx

interface ProductPageProps {
  params: { slug: string };
  searchParams?: Record<string, string | string[] | undefined>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const slug = decodeURIComponent(params.slug);

  return (
    <section className="container py-10">
      <h1 className="text-xl md:text-2xl font-semibold">
        Product: {slug}
      </h1>
      <p className="mt-2 text-neutral-600">PDP placeholder.</p>
    </section>
  );
}
