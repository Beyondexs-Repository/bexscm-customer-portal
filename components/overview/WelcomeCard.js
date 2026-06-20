"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const slides = [
  {
    eyebrow: "Weekly specials",
    title: "Save up to 20% on fresh produce",
    description: "Quality products. Better prices. Every week.",
    action: "Browse deals",
    href: "/catalog",
    image: "/overview/fresh-produce-banner.png",
    imageAlt: "A wooden crate filled with fresh vegetables",
    accent: "text-emerald-700",
  },
  {
    eyebrow: "Butcher specials",
    title: "Save 15% on premium cuts",
    description: "Quality beef, poultry, lamb and seafood for less.",
    action: "Shop meat deals",
    href: "/catalog",
    image: "/overview/premium-meats-offer.png",
    imageAlt: "Premium beef, poultry, lamb and salmon arranged on boards",
    accent: "text-red-700",
  },
  {
    eyebrow: "Bundle and save",
    title: "Fresh produce and proteins, one great price",
    description: "Build a better kitchen with our weekly fresh-food bundle.",
    action: "Explore the bundle",
    href: "/catalog",
    image: "/overview/produce-meat-bundle.png",
    imageAlt: "Fresh vegetables alongside premium meat and seafood",
    accent: "text-emerald-700",
  },
]

export default function WelcomeCard() {
  const [activeSlide, setActiveSlide] = useState(0)
  const touchStartX = useRef(null)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setActiveSlide((current) => (current + 1) % slides.length)
    }, 3000)

    return () => window.clearTimeout(timeout)
  }, [activeSlide])

  function showPreviousSlide() {
    setActiveSlide((current) => (current - 1 + slides.length) % slides.length)
  }

  function showNextSlide() {
    setActiveSlide((current) => (current + 1) % slides.length)
  }

  function handleTouchStart(event) {
    touchStartX.current = event.touches[0]?.clientX ?? null
  }

  function handleTouchEnd(event) {
    if (touchStartX.current === null) return

    const touchEndX = event.changedTouches[0]?.clientX
    const swipeDistance =
      typeof touchEndX === "number" ? touchEndX - touchStartX.current : 0

    touchStartX.current = null

    if (Math.abs(swipeDistance) < 40) return

    if (swipeDistance < 0) {
      showNextSlide()
    } else {
      showPreviousSlide()
    }
  }

  return (
    <section
      className="group relative min-h-[16rem] touch-pan-y overflow-hidden rounded-xl border bg-card shadow-sm sm:min-h-[15rem]"
      aria-roledescription="carousel"
      aria-label="Featured promotions"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={() => {
        touchStartX.current = null
      }}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.title}
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            index === activeSlide
              ? "z-10 opacity-100"
              : "pointer-events-none opacity-0",
          )}
          aria-hidden={index !== activeSlide}
        >
          <Image
            src={slide.image}
            alt={slide.imageAlt}
            fill
            priority={index === 0}
            sizes="(max-width: 768px) 100vw, 85vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/5 dark:from-slate-950 dark:via-slate-950/90 dark:to-slate-950/10" />

          <div className="relative z-10 flex min-h-[16rem] max-w-[76%] flex-col justify-center px-10 pb-12 pt-5 sm:min-h-[15rem] sm:max-w-[52%] sm:p-8">
            <p
              className={cn(
                "text-[11px] font-bold uppercase tracking-[0.16em]",
                slide.accent,
              )}
            >
              {slide.eyebrow}
            </p>
            <h1 className="mt-2 text-xl font-bold leading-tight tracking-tight text-slate-950 sm:text-3xl dark:text-white">
              {slide.title}
            </h1>
            <p className="mt-2 max-w-md text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300">
              {slide.description}
            </p>
            <Button asChild size="sm" className="mt-3 w-fit">
              <Link href={slide.href}>
                {slide.action}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="secondary"
        size="icon-sm"
        className="absolute left-2 top-1/2 z-30 -translate-y-1/2 rounded-full bg-background/85 shadow-md backdrop-blur transition-opacity sm:left-3 sm:opacity-0 sm:group-hover:opacity-100 hidden md:flex"
        onClick={showPreviousSlide}
        aria-label="Show previous promotion"
      >
        <ChevronLeft />
      </Button>
      <Button
        type="button"
        variant="secondary"
        size="icon-sm"
        className="absolute right-2 top-1/2 z-30 -translate-y-1/2 rounded-full bg-background/85 shadow-md backdrop-blur transition-opacity sm:right-3 sm:opacity-0 sm:group-hover:opacity-100 hidden md:flex"
        onClick={showNextSlide}
        aria-label="Show next promotion"
      >
        <ChevronRight />
      </Button>

      <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-white/85 px-2 py-1 shadow-sm backdrop-blur dark:bg-slate-950/75">
        {slides.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            className={cn(
              "h-1.5 rounded-full transition-all",
              index === activeSlide
                ? "w-5 bg-primary"
                : "w-1.5 bg-slate-300 hover:bg-slate-400 dark:bg-slate-600",
            )}
            onClick={() => setActiveSlide(index)}
            aria-label={`Show promotion ${index + 1}`}
            aria-current={index === activeSlide ? "true" : undefined}
          />
        ))}
      </div>
    </section>
  )
}
