// Frontend/app/returns-exchange/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Returns & Exchange | Nazmi Boutique",
  description:
    "Simple, fast returns: 10-day window from delivery. Tags & price tag must be attached. Unboxing/damage video required for defects. No Cash on Delivery (COD) available.",
};

const CONTACT = {
  whatsapp: "+91 99959 47709",
  email: "nazmiboutique1@gmail.com",
  hours: "Mon–Sat, 10:00–18:00 IST",
  effective: "14 Oct 2025",
};

export default function ReturnsExchangePage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the return window?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can request a return or exchange within 10 days from the date of delivery."
        }
      },
      {
        "@type": "Question",
        "name": "Are tags required?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. All brand tags and the price tag must remain attached to be eligible."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need an unboxing video for damages?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Share a single, continuous unboxing/damage video within 24–48 hours of delivery."
        }
      },
      {
        "@type": "Question",
        "name": "Is Cash on Delivery available?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Cash on Delivery (COD) is not available."
        }
      }
    ]
  };

  const waHref = `https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
    "Hello Nazmi Boutique! I’d like to request a Return/Exchange.\nOrder ID: ______\nReason: ______"
  )}`;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Returns & Exchange</h1>
        <p className="text-xs text-neutral-500">
          Effective: {CONTACT.effective}
        </p>
      </header>

      {/* Primary CTA (WhatsApp) */}
      <div className="mb-6 flex flex-col sm:flex-row gap-2">
        <a
          href={waHref}
          target="_blank"
          className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition"
        >
          Start on WhatsApp ({CONTACT.whatsapp})
        </a>
        <a
          href={`mailto:${CONTACT.email}?subject=Return/Exchange Request&body=Order ID:%20____%0AReason:%20____%0AUnboxing/Damage Video Link (if any):%20____`}
          className="inline-flex items-center justify-center rounded-md border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 transition"
        >
          Or Email Us
        </a>
      </div>

      {/* Key points (fast scan) */}
      <section className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-3">
        <Badge title="10-Day Window" detail="Request within 10 days of delivery" />
        <Badge title="Tags Required" detail="Brand & price tag must be attached" />
        <Badge title="Unboxing Video" detail="One continuous video for damages (24–48h)" />
        <Badge title="No COD" detail="Cash on Delivery is not available" />
      </section>

      {/* Quick Rules */}
      <Section title="Read This First (Quick Rules)">
        <ul className="space-y-2 text-sm">
          <li className="flex gap-2">
            <Dot /> Item must be <strong>unused, unwashed, unaltered</strong> in original condition & packing.
          </li>
          <li className="flex gap-2">
            <Dot /> <strong>All tags & price tag</strong> must be attached; removed tags = not eligible.
          </li>
          <li className="flex gap-2">
            <Dot /> For damage/defect/wrong item, share <strong>a single unboxing/damage video</strong> within <strong>24–48 hours</strong>.
          </li>
          <li className="flex gap-2">
            <Dot /> <strong>Shipping & express fees</strong> are non-refundable.
          </li>
          <li className="flex gap-2">
            <Dot /> Items marked <em>Final Sale/No Return</em> are not eligible.
          </li>
        </ul>
      </Section>

      {/* Start a Return – minimal steps */}
      <Section title="Start a Return / Exchange (2 Steps)">
        <ol className="list-decimal pl-5 space-y-2 text-sm">
          <li>
            <strong>Contact us:</strong> WhatsApp{" "}
            <a className="underline" href={waHref} target="_blank">
              {CONTACT.whatsapp}
            </a>{" "}
            or email{" "}
            <a className="underline" href={`mailto:${CONTACT.email}`}>
              {CONTACT.email}
            </a>. Share Order ID, reason, and video link (if damaged/defective/wrong).
          </li>
          <li>
            <strong>Send it back:</strong> We’ll arrange pickup where serviceable; otherwise we’ll share a self-ship address. Pack securely and <strong>do not remove tags/price tag</strong>.
          </li>
        </ol>
      </Section>

      {/* Resolution */}
      <Section title="What You’ll Get">
        <ul className="space-y-2 text-sm">
          <li className="flex gap-2">
            <Dot /> <strong>Exchange</strong> (size once, subject to stock).
          </li>
          <li className="flex gap-2">
            <Dot /> <strong>Store Credit</strong> (valid 6 months) or refund for eligible prepaid orders.
          </li>
          <li className="flex gap-2">
            <Dot /> If QC fails (used/washed/tags removed), return will be declined and re-shipping charges apply.
          </li>
        </ul>
      </Section>

      {/* Mini help line */}
      <p className="mt-4 text-xs text-neutral-500">
        Support: {CONTACT.hours}. For fastest help, WhatsApp us at{" "}
        <a className="underline" href={waHref} target="_blank">
          {CONTACT.whatsapp}
        </a>.
      </p>

      {/* JSON-LD for FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </main>
  );
}

/* ---------- UI bits (minimal, high-contrast, compact) ---------- */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <h2 className="text-base font-semibold mb-2">{title}</h2>
      <div className="rounded-md border border-neutral-200 p-3">{children}</div>
    </section>
  );
}

function Badge({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-md border border-neutral-200 p-3">
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-neutral-500">{detail}</p>
    </div>
  );
}

function Dot() {
  return <span className="mt-1.5 block h-1.5 w-1.5 rounded-full bg-neutral-800 flex-shrink-0" />;
}
