import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const slides = [
  {
    image: hero1,
    eyebrow: "AESA Bhawan",
    title: "A home for Ahmednagar's builders",
    subtitle: "Conference halls, seminar space and a venue for the city's design community.",
    cta: { label: "Book Bhawan", to: "/bhawan" },
  },
  {
    image: hero2,
    eyebrow: "Membership",
    title: "Join 400+ architects, engineers & surveyors",
    subtitle: "A professional community shaping Ahmednagar's skyline since 1985.",
    cta: { label: "Apply for Membership", to: "/membership" },
  },
  {
    image: hero3,
    eyebrow: "Digital Business Card",
    title: "Your mini-website for just ₹1,500 / year",
    subtitle: "Shareable QR + link, hosted on aesanagar.org. Ready in 24 hours.",
    cta: { label: "Get Your Card", to: "/business-card" },
  },
];

export function HeroCarousel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % slides.length), 5500);
    return () => clearInterval(id);
  }, []);
  const s = slides[i];
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-ink shadow-[0_10px_40px_-20px_oklch(0.22_0.04_260/0.4)] aspect-[16/10] lg:aspect-[16/9]">
      {slides.map((sl, idx) => (
        <img
          key={idx}
          src={sl.image}
          alt={sl.title}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${idx === i ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-tr from-ink/85 via-ink/40 to-transparent" />
      <div className="relative h-full flex flex-col justify-end p-6 lg:p-10 text-background">
        <div className="eyebrow !text-brand-foreground/90 mb-3">{s.eyebrow}</div>
        <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-background max-w-xl">
          {s.title}
        </h2>
        <p className="mt-3 max-w-lg text-sm md:text-base text-background/85">{s.subtitle}</p>
        <div className="mt-5 flex items-center gap-3">
          <a
            href={s.cta.to}
            className="inline-flex items-center rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground hover:opacity-90"
          >
            {s.cta.label} →
          </a>
          <div className="flex gap-1.5 ml-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                aria-label={`slide ${idx + 1}`}
                onClick={() => setI(idx)}
                className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-background" : "w-3 bg-background/40"}`}
              />
            ))}
          </div>
        </div>
      </div>
      <button
        onClick={() => setI((x) => (x - 1 + slides.length) % slides.length)}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-background/85 text-ink hover:bg-background"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => setI((x) => (x + 1) % slides.length)}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-background/85 text-ink hover:bg-background"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}