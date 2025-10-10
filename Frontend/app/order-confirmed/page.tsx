// app/order-confirmed/page.tsx
import { Suspense } from "react";
import OrderConfirmedContent from "./OrderConfirmedContent";

export const dynamic = "force-dynamic"; // keep this

export default function OrderConfirmedPage() {
  return (
    <Suspense fallback={<div>Loading order confirmation...</div>}>
      <OrderConfirmedContent />
    </Suspense>
  );
}
