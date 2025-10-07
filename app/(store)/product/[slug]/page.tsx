export default function ProductPage({ params }: { params: { slug: string } }) {
  return (
    <section className="container py-10">
      <h1 className="text-xl md:text-2xl font-semibold">
        Product: {decodeURIComponent(params.slug)}
      </h1>
      <p className="mt-2 text-neutral-600">PDP placeholder.</p>
    </section>
  );
}
