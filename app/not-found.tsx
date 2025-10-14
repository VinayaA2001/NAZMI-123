// app/not-found.tsx
export default function NotFound() {
  return (
    <section className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl md:text-4xl font-semibold">Page not found</h1>
      <p className="mt-3 text-neutral-600">The page you’re looking for doesn’t exist.</p>
      <a href="/" className="inline-flex mt-6 px-5 py-2 rounded-full border">
        Go Home
      </a>
    </section>
  );
}
