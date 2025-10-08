"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  { src: "/images/poster1.png", alt: "Offer 1" },
  { src: "/images/poster2.png", alt: "Offer 2" },
  { src: "/images/poster3.png", alt: "Offer 3" },
];

export default function Slomo() {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const wrapRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const n = SLIDES.length;

  // --- autoplay with reduced-motion + pause on hover ---
  useEffect(() => {
    if (n < 2) return;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) return;

    const start = () => {
      stop();
      timerRef.current = setInterval(
        () => setIndex((x) => (x + 1) % n),
        6000
      );
    };
    const stop = () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };

    start();

    const el = wrapRef.current;
    el?.addEventListener("mouseenter", stop);
    el?.addEventListener("mouseleave", start);

    return () => {
      stop();
      el?.removeEventListener("mouseenter", stop);
      el?.removeEventListener("mouseleave", start);
    };
  }, [n]);

  // --- touch swipe (mobile) ---
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let sx = 0;
    const onStart = (e: TouchEvent) => (sx = e.touches[0].clientX);
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) {
        setIndex((x) => (dx < 0 ? (x + 1) % n : (x - 1 + n) % n));
      }
    };
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchend", onEnd);
    };
  }, [n]);

  // --- keyboard (left/right) ---
  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setIndex((x) => (x - 1 + n) % n);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setIndex((x) => (x + 1) % n);
    }
  };

  const prev = () => setIndex((x) => (x - 1 + n) % n);
  const next = () => setIndex((x) => (x + 1) % n);

  return (
    <section
      ref={wrapRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Homepage hero"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="relative overflow-hidden"
    >
      {/* Responsive hero sizing: tall on mobile, cinematic on desktop */}
      <div
        ref={trackRef}
        className="relative h-[66vw] max-h-[560px] md:h-[520px] lg:h-[620px] w-full"
      >
        {SLIDES.map(({ src, alt }, i) => {
          const active = i === index;
          return (
            <div key={src} className="absolute inset-0">
              <Image
                src={src}
                alt={alt}
                fill
                priority={i === 0}
                sizes="100vw"
                className={`object-cover transition-[opacity,transform] ease-linear
                ${active ? "opacity-100 scale-105 duration-[6000ms]" : "opacity-0 scale-100 duration-700"}`}
              />

              {/* subtle bottom gradient for text legibility if you add captions later */}
              <div className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent transition-opacity ${active ? "opacity-100" : "opacity-0"}`} />
            </div>
          );
        })}
      </div>

      {/* Arrows */}
      {n > 1 && (
        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 md:px-3">
          <button
            aria-label="Previous slide"
            onClick={prev}
            className="rounded-full bg-black/35 text-white w-9 h-9 md:w-10 md:h-10 grid place-items-center backdrop-blur hover:bg-black/45 focus:outline-none focus:ring-2 focus:ring-white/60"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            aria-label="Next slide"
            onClick={next}
            className="rounded-full bg-black/35 text-white w-9 h-9 md:w-10 md:h-10 grid place-items-center backdrop-blur hover:bg-black/45 focus:outline-none focus:ring-2 focus:ring-white/60"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      )}

      {/* Dots */}
      {n > 1 && (
        <div className="absolute bottom-3 md:bottom-4 w-full flex justify-center gap-2 md:gap-3">
          {SLIDES.map((_, d) => (
            <button
              key={d}
              aria-label={`Go to slide ${d + 1}`}
              onClick={() => setIndex(d)}
              className={`h-2.5 w-2.5 md:h-3 md:w-3 rounded-full border border-white/70 transition
              ${d === index ? "bg-white" : "bg-white/40 hover:bg-white/60"}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
