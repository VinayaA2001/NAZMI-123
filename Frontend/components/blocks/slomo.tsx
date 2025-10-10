"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

const SLIDES = [
  { 
    src: "/images/poster1.png", 
    alt: "Summer Collection",
  },
  { 
    src: "/images/poster2.png", 
    alt: "New Arrivals",
  },
  { 
    src: "/images/poster3.png", 
    alt: "Limited Time Offer",
  },
];

export default function Slomo() {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>(new Array(SLIDES.length).fill(false));
  const [imageErrors, setImageErrors] = useState<boolean[]>(new Array(SLIDES.length).fill(false));
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const wrapRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const n = SLIDES.length;

  // Initialize images loaded state
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    // Mark first image as loaded if it's already in cache
    const img = new window.Image();
    img.src = SLIDES[0].src;
    img.onload = () => {
      setImagesLoaded(prev => {
        const newLoaded = [...prev];
        newLoaded[0] = true;
        return newLoaded;
      });
    };
    img.onerror = () => {
      setImageErrors(prev => {
        const newErrors = [...prev];
        newErrors[0] = true;
        return newErrors;
      });
    };
  }, []);

  // Autoplay with enhanced controls
  useEffect(() => {
    if (n < 2 || !isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) return;

    const start = () => {
      stop();
      timerRef.current = setInterval(
        () => setIndex((x) => (x + 1) % n),
        5000
      );
    };

    const stop = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    start();

    const el = wrapRef.current;
    el?.addEventListener("mouseenter", stop);
    el?.addEventListener("mouseleave", () => {
      if (isPlaying) start();
    });
    el?.addEventListener("focusin", stop);
    el?.addEventListener("focusout", () => {
      if (isPlaying) start();
    });

    return () => {
      stop();
      el?.removeEventListener("mouseenter", stop);
      el?.removeEventListener("mouseleave", start);
      el?.removeEventListener("focusin", stop);
      el?.removeEventListener("focusout", start);
    };
  }, [n, isPlaying]);

  // Enhanced touch swipe with velocity detection
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    
    let sx = 0;
    let sy = 0;
    let startTime = 0;
    
    const onStart = (e: TouchEvent) => {
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
      startTime = Date.now();
    };
    
    const onEnd = (e: TouchEvent) => {
      const ex = e.changedTouches[0].clientX;
      const ey = e.changedTouches[0].clientY;
      const dx = ex - sx;
      const dy = ey - sy;
      const timeElapsed = Date.now() - startTime;
      
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dy) < 50) {
        const velocity = Math.abs(dx) / timeElapsed;
        const threshold = velocity > 0.3 ? 20 : 40;
        
        if (Math.abs(dx) > threshold) {
          setIndex((x) => (dx < 0 ? (x + 1) % n : (x - 1 + n) % n));
        }
      }
    };
    
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchend", onEnd, { passive: true });
    
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchend", onEnd);
    };
  }, [n]);

  // Keyboard navigation with enhanced support
  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        setIndex((x) => (x - 1 + n) % n);
        break;
      case "ArrowRight":
        e.preventDefault();
        setIndex((x) => (x + 1) % n);
        break;
      case " ":
      case "Spacebar":
        e.preventDefault();
        setIsPlaying(!isPlaying);
        break;
      case "Home":
        e.preventDefault();
        setIndex(0);
        break;
      case "End":
        e.preventDefault();
        setIndex(n - 1);
        break;
    }
  };

  const prev = () => {
    setIsPlaying(false);
    setIndex((x) => (x - 1 + n) % n);
  };

  const next = () => {
    setIsPlaying(false);
    setIndex((x) => (x + 1) % n);
  };

  const goToSlide = (i: number) => {
    setIsPlaying(false);
    setIndex(i);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Handle image load
  const handleImageLoad = (i: number) => {
    setImagesLoaded(prev => {
      const newLoaded = [...prev];
      newLoaded[i] = true;
      return newLoaded;
    });
  };

  // Handle image error
  const handleImageError = (i: number) => {
    setImageErrors(prev => {
      const newErrors = [...prev];
      newErrors[i] = true;
      return newErrors;
    });
  };

  // Check if current slide is loading
  const currentSlideLoading = !imagesLoaded[index] && !imageErrors[index];

  return (
    <section
      ref={wrapRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured promotions slider"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="relative overflow-hidden group bg-gray-100"
    >
      {/* Progress Bar */}
      {isPlaying && n > 1 && (
        <div className="absolute top-0 left-0 right-0 z-20 h-1 bg-white/30">
          <div 
            className="h-full bg-white progress-bar"
            key={index}
          />
        </div>
      )}

      {/* Slider Track */}
      <div
        ref={trackRef}
        className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] w-full cursor-grab active:cursor-grabbing"
      >
        {SLIDES.map((slide, i) => {
          const active = i === index;
          const isLoaded = imagesLoaded[i];
          const hasError = imageErrors[i];

          return (
            <div 
              key={slide.src} 
              className={`absolute inset-0 transition-all duration-500 ease-out ${
                active ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              {/* Loading Skeleton */}
              {!isLoaded && !hasError && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
                  <div className="text-gray-400">Loading image {i + 1}...</div>
                </div>
              )}
              
              {/* Error State */}
              {hasError ? (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-400 flex items-center justify-center">
                  <div className="text-gray-500 text-center p-4">
                    <div className="text-4xl mb-3">📷</div>
                    <p className="text-lg font-medium">Image not available</p>
                    <p className="text-sm mt-1">{slide.alt}</p>
                  </div>
                </div>
              ) : (
                /* Actual Image - Clean without any text overlay */
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
                  className="object-cover w-full h-full"
                  onLoad={() => handleImageLoad(i)}
                  onError={() => handleImageError(i)}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      {n > 1 && (
        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3 md:px-4 lg:px-6">
          <button
            aria-label="Previous slide"
            onClick={prev}
            className="rounded-full bg-black/40 text-white w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 grid place-items-center backdrop-blur-sm hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white/60 transition-all duration-300 transform hover:scale-110 opacity-0 group-hover:opacity-100 z-20"
          >
            <ChevronLeft size={18} className="md:w-5 md:h-5" />
          </button>
          <button
            aria-label="Next slide"
            onClick={next}
            className="rounded-full bg-black/40 text-white w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 grid place-items-center backdrop-blur-sm hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white/60 transition-all duration-300 transform hover:scale-110 opacity-0 group-hover:opacity-100 z-20"
          >
            <ChevronRight size={18} className="md:w-5 md:h-5" />
          </button>
        </div>
      )}

      {/* Controls Bar */}
      {n > 1 && (
        <div className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2 md:gap-3 bg-black/40 backdrop-blur-sm rounded-full px-3 md:px-4 py-2 z-20">
          {/* Play/Pause Button */}
          <button
            aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
            onClick={togglePlay}
            className="text-white hover:text-gray-200 transition-colors p-1"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1 md:gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goToSlide(i)}
                className={`transition-all duration-300 rounded-full border border-white/70
                  ${i === index 
                    ? "bg-white w-3 h-3 md:w-4 md:h-4" 
                    : "bg-white/40 hover:bg-white/60 w-2 h-2 md:w-3 md:h-3"
                  }`}
              />
            ))}
          </div>

          {/* Slide Counter */}
          <div className="text-white text-xs md:text-sm font-medium min-w-[40px] text-center">
            {index + 1} / {n}
          </div>
        </div>
      )}

      {/* Loading Indicator for current slide */}
      {currentSlideLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-30">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-700">Loading slide {index + 1}...</span>
          </div>
        </div>
      )}
    </section>
  );
}