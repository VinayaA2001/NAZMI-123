// app/product/[slug]/page.tsx
import ProductClientPage from "./ProductClientPage";

type ProductPageProps = {
  params: { slug: string };
};

export default function ProductPage({ params }: ProductPageProps) {
  return <ProductClientPage slug={params.slug} />;
}
