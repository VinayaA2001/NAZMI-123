"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, KeyboardEvent } from "react";

export type Slide = {
  src: string;
  alt: string;
  href?: string;
  caption?: string;
  // Optional per-slide focal point (e.g., "50% 35%")
  objectPosition?: string;
};

type SizePreset =
  | "fashion"   // immersive mobile height, cinematic desktop (default)
  | "banner"    // shorter hero banner
  | "square";   // square-ish layout blocks

export default function SlowMoSlider({
  slides,
  intervalMs = 9000,
  fadeMs = 2200,
  size = "fashion",
  showArrows = true,
  showDots = true,
  gradient = true,
  className = "",
}: {
  slides: Slide[];
  intervalMs?: number;
  fadeMs?: number;
  /** Layout preset */
  size?: SizePreset;
  /** Show next/prev controls */
  showArrows?: boolean;
  /** Show pagination dots */
  showDots?: boolean;
  /** Add subtle bottom gradient for text legibility */
  gradient?: boolean;
  /** Extra class to append to the outer section */
  className?: string;
}) {
  const [i, setI] = useState(0);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const wrapRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const list = useMemo(() => slides.filter(Boolean), [slides]);
  const n = list.length;
  if (!n) return null;

  // --- Layout presets (mobile first) ---
  // These mirror popular premium fashion sites: tall mobile hero, wider desktop.
  const sizeClasses = {
    fashion:
      // Mobile: ~66vw tall, capped to 560px; md: 520px; lg: 620px
      "relative h-[66vw] max-h-[560px] md:h-[520px] lg:h-[620px]",
    banner:
      // A shorter banner variant
      "relative h-[48vw] max-h-[420px] md:h-[380px] lg:h-[440px]",
    square:
      // Useful when used inside grids or modular sections
      "relative aspect-[1/1] md:aspect-[16/9] lg:aspect-[21/9]",
  } as const;

  // ---- autoplay (pause on hover) respecting reduced motion ----
  useEffect(() => {
    if (n < 2) return;
    const rm = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (rm) return;

    const start = () => {
      stop();
      timer.current = setInterval(() => setI((x) => (x + 1) % n), intervalMs);
    };
    const stop = () => {
      if (timer.current) clearInterval(timer.current);
      timer.current = null;
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
  }, [n, intervalMs]);

  // ---- swipe on touch ----
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let sx = 0;
    const ts = (e: TouchEvent) => (sx = e.touches[0].clientX);
    const te = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) setI((x) => (dx < 0 ? (x + 1) % n : (x - 1 + n) % n));
    };
    el.addEventListener("touchstart", ts, { passive: true });
    el.addEventListener("touchend", te, { passive: true });
    return () => {
      el.removeEventListener("touchstart", ts);
      el.removeEventListener("touchend", te);
    };
  }, [n]);

  // ---- keyboard navigation (← / →) for accessibility ----
  const onKey = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setI((x) => (x - 1 + n) % n);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setI((x) => (x + 1) % n);
    }
  };

  return (
    <section
      ref={wrapRef}
      className={`relative overflow-hidden ${className}`}
      aria-roledescription="carousel"
      aria-label="Showcase"
      role="region"
      tabIndex={0}
      onKeyDown={onKey}
    >
      <div ref={trackRef} className={`${sizeClasses[size]} w-full`}>
        {list.map((s, idx) => {
          const on = idx === i;
          return (
            <a
              key={s.src + idx}
              href={s.href || "#"}
              className="absolute inset-0"
              aria-hidden={!on}
              tabIndex={on ? 0 : -1}
            >
              <div
                className="absolute inset-0 transition-opacity ease-linear"
                style={{ opacity: on ? 1 : 0, transitionDuration: `${fadeMs}ms` }}
              >
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  priority={idx === 0}
                  className="object-cover"
                  sizes="100vw"
                  style={{
                    objectPosition: s.objectPosition || "center",
                  }}
                />

                {/* Optional top-to-bottom gradient for legibility */}
                {gradient && (
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                )}

                {s.caption && (
                  <div className="absolute bottom-4 left-4 md:left-6 rounded-full bg-black/45 text-white px-4 py-2 text-xs md:text-sm backdrop-blur-sm">
                    {s.caption}
                  </div>
                )}
              </div>
            </a>
          );
        })}
      </div>

      {/* DOTS */}
      {showDots && n > 1 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex items-center justify-center gap-2 md:gap-3">
          {list.map((_, d) => (
            <button
              key={d}
              onClick={() => setI(d)}
              aria-label={`Go to slide ${d + 1}`}
              className={`pointer-events-auto h-2.5 w-2.5 md:h-3 md:w-3 rounded-full border border-white/70 transition ${
                d === i ? "bg-white" : "bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      )}

      {/* ARROWS */}
      {showArrows && n > 1 && (
        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 md:px-3">
          <button
            aria-label="Previous slide"
            className="rounded-full bg-black/35 text-white w-9 h-9 md:w-10 md:h-10 grid place-items-center backdrop-blur hover:bg-black/45 focus:outline-none focus:ring-2 focus:ring-white/60"
            onClick={() => setI((x) => (x - 1 + n) % n)}
          >
            ‹
          </button>
          <button
            aria-label="Next slide"
            className="rounded-full bg-black/35 text-white w-9 h-9 md:w-10 md:h-10 grid place-items-center backdrop-blur hover:bg-black/45 focus:outline-none focus:ring-2 focus:ring-white/60"
            onClick={() => setI((x) => (x + 1) % n)}
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}
