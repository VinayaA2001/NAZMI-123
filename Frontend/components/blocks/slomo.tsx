"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  { id: 1, src: "/images/poster1.png", alt: "Summer Collection" },
  { id: 2, src: "/images/poster2.png", alt: "New Arrivals" },
  { id: 3, src: "/images/poster3.png", alt: "Limited Time Offer" },
];

const AUTOPLAY_MS = 5000;
const PROGRESS_TICK = 50; // ms

export default function Slomo() {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const progressTimer = useRef<NodeJS.Timeout | null>(null);
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const count = SLIDES.length;

  const clearTimers = () => {
    if (timer.current) clearInterval(timer.current);
    if (progressTimer.current) clearInterval(progressTimer.current);
  };

  const startTimers = () => {
    if (prefersReducedMotion || !playing || count <= 1) return;
    setProgress(0);

    progressTimer.current = setInterval(() => {
      setProgress((p) => {
        const step = (100 * PROGRESS_TICK) / AUTOPLAY_MS;
        const next = p + step;
        return next >= 100 ? 100 : next;
      });
    }, PROGRESS_TICK);

    timer.current = setInterval(() => {
      setCurrent((i) => (i + 1) % count);
      setProgress(0);
    }, AUTOPLAY_MS);
  };

  // (Re)start timers when state changes
  useEffect(() => {
    clearTimers();
    startTimers();
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, current, count, prefersReducedMotion]);

  // Pause on tab hidden; resume on visible
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        clearTimers();
      } else {
        startTimers();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, prefersReducedMotion]);

  const next = () => setCurrent((i) => (i + 1) % count);
  const prev = () => setCurrent((i) => (i - 1 + count) % count);
  const go = (i: number) => setCurrent(i);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === " ") {
      e.preventDefault();
      setPlaying((p) => !p);
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = touchStartX.current - (e.changedTouches[0]?.clientX ?? 0);
    if (Math.abs(dx) > 50) (dx > 0 ? next : prev)();
    touchStartX.current = null;
  };

  if (count === 0) {
    return (
      <div className="w-full h-[40vh] min-h-[280px] bg-neutral-100 flex items-center justify-center border-b border-black/10">
        <p className="text-neutral-500 text-sm">No slides available</p>
      </div>
    );
  }

  return (
    <section
      role="region"
      aria-label="Featured promotions carousel"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      // Tight borders + no extra outer gaps
      className="relative w-full overflow-hidden bg-black border-b border-black/10"
      // Pause on hover/focus for better UX
      onMouseEnter={() => setPlaying(false)}
      onMouseLeave={() => setPlaying(true)}
    >
      {/* Responsive fixed height, compact on mobile */}
      <div className="relative w-full h-[46vh] sm:h-[56vh] md:h-[64vh] lg:h-[72vh] min-h-[320px] max-h-[820px]">
        {/* Top progress bar (hairline) */}
        {playing && count > 1 && !prefersReducedMotion && (
          <div className="absolute top-0 left-0 right-0 z-30 h-[2px] bg-white/25">
            <div
              className="h-full bg-white transition-[width] duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Slides */}
        <div className="relative w-full h-full will-change-opacity">
          {SLIDES.map((s, i) => (
            <div
              key={s.id}
              className={`absolute inset-0 transition-opacity duration-500 ease-linear ${
                i === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <Image
                src={s.src}
                alt={s.alt}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover select-none pointer-events-none"
                quality={85}
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Arrows (compact, contrast, always visible) */}
        {count > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-black/55 hover:bg-black/75 text-white rounded-full p-2.5 sm:p-3 transition-colors backdrop-blur-sm ring-1 ring-white/20"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              aria-label="Next slide"
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-black/55 hover:bg-black/75 text-white rounded-full p-2.5 sm:p-3 transition-colors backdrop-blur-sm ring-1 ring-white/20"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* Dots (centered, compact) */}
        {count > 1 && (
          <div className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 z-20">
            <div className="flex items-center gap-2 bg-black/45 backdrop-blur-sm rounded-full px-3 py-1.5 ring-1 ring-white/15">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === current}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === current ? "bg-white scale-110" : "bg-white/60 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Play/Pause (optional, small) */}
        {count > 1 && !prefersReducedMotion && (
          <button
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause slideshow" : "Play slideshow"}
            className="absolute top-3 right-3 z-20 bg-black/55 hover:bg-black/75 text-white rounded-full p-2 backdrop-blur-sm ring-1 ring-white/20"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              {playing ? (
                <div className="flex gap-[3px]">
                  <div className="w-[3px] h-3 bg-white" />
                  <div className="w-[3px] h-3 bg-white" />
                </div>
              ) : (
                <div className="w-0 h-0 border-l-[7px] border-l-white border-y-[5px] border-y-transparent" />
              )}
            </div>
          </button>
        )}
      </div>
    </section>
  );
}
