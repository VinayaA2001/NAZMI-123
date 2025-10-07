"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  { src: "/images/poster1.png", alt: "Offer 1" },
  { src: "/images/poster2.png", alt: "Offer 2" },
  { src: "/images/poster3.png", alt: "Offer 3" },
];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-slide every 6s
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setIndex((n) => (n + 1) % SLIDES.length);
    }, 6000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Manual navigation
  const prevSlide = () => {
    setIndex((n) => (n - 1 + SLIDES.length) % SLIDES.length);
  };
  const nextSlide = () => {
    setIndex((n) => (n + 1) % SLIDES.length);
  };

  return (
    <section className="relative w-full h-screen bg-gray-100 overflow-hidden">
      <div className="relative w-full h-full">
        {SLIDES.map(({ src, alt }, i) => (
          <Image
            key={i}
            src={src}
            alt={alt}
            fill
            priority={i === 0}
            className={`absolute inset-0 object-cover transition-[opacity,transform] ease-in-out ${
              i === index
                ? "opacity-100 scale-105 duration-[6000ms]"
                : "opacity-0 scale-100 duration-700"
            }`}
          />
        ))}

        {/* Arrow Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-5 top-1/2 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60 transition"
        >
          <ChevronLeft size={28} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-5 top-1/2 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60 transition"
        >
          <ChevronRight size={28} />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-6 w-full flex justify-center gap-2">
          {SLIDES.map((_, i) => (
            <span
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full cursor-pointer ${
                i === index ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
