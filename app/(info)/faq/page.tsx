// app/(store)/faq/page.tsx
"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What is Nazmi Boutique?",
    answer: "Nazmi Boutique offers a curated selection of traditional and western wear from Kerala."
  },
  {
    question: "Do you offer returns?",
    answer: "Yes, items can be returned within 7 days of delivery in unused condition."
  },
  {
    question: "How can I contact customer support?",
    answer: "You can reach us via our Contact page or directly on WhatsApp."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="container py-10">
      <h1 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border rounded-lg p-4">
            <button
              className="w-full flex justify-between items-center font-medium text-left"
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            >
              {faq.question}
              <span>{openIndex === idx ? "−" : "+"}</span>
            </button>
            {openIndex === idx && (
              <p className="mt-2 text-gray-600">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
