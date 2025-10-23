// components/blocks/slomo.tsx
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SLIDES = [
  { 
    id: 1, 
    src: "https://res.cloudinary.com/dq5xhg9uo/image/upload/v1761056854/sale1_xa0van.jpg", 
    alt: "Summer Collection - Premium Traditional Wear"
  },
  { 
    id: 2, 
    src: "https://res.cloudinary.com/dq5xhg9uo/image/upload/v1761056854/sale2_zqwjit.jpg", 
    alt: "New Arrivals - Contemporary Western Styles"
  },
  { 
    id: 3, 
    src: "https://res.cloudinary.com/dq5xhg9uo/image/upload/v1761056853/sale3_td4xeo.jpg", 
    alt: "Limited Time Offer - Exclusive Boutique Deals"
  },
];

export default function Slomo() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full">
      {SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            className="object-cover"
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  );
}