import { Suspense } from "react";
import VerifyEmailContent from "./VerifyEmailContent";

export const dynamic = "force-dynamic";

export default function OrderConfirmedPage() {
  return (
    <Suspense fallback={<div>Loading order confirmation...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
