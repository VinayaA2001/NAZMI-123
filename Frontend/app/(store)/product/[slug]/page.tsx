import { use } from "react";
import ProductClientPage from "./ProductClientPage";

interface ProductPageServerProps {
  params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: ProductPageServerProps) {
  const { slug } = use(params); 
  return <ProductClientPage slug={slug} />; 
}
