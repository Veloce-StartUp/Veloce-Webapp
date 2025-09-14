"use client"

import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeroProps {
  eyebrow?: string
  title: string
  subtitle: string
  ctaLabel?: string
  ctaHref?: string
}

export function Hero({
                         eyebrow = "Innovate Without Limits",
                         title,
                         subtitle,
                         ctaLabel = "Explore Now",
                         ctaHref = "#",
                     }: HeroProps) {
    return (
        <section
            id="hero"
            className="relative mx-auto w-full pt-40 px-6 text-center md:px-8
      min-h-[calc(100vh-40px)] overflow-hidden
      bg-black
      rounded-b-xl"
        >
            {/* Grid BG - Dark version */}
            <div
                className="absolute z-0 inset-0 opacity-80 h-[600px] w-full
        bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)]
        bg-[size:6rem_5rem]
        [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"
            />

            {/* Radial Accent - Dark version */}
            <div
                className="absolute left-1/2 top-[calc(100%-90px)] lg:top-[calc(100%-150px)]
        h-[500px] w-[700px] md:h-[500px] md:w-[1100px] lg:h-[750px] lg:w-[140%]
        -translate-x-1/2 rounded-[100%] border-[#4A5568]
        bg-[radial-gradient(closest-side,#000_82%,#2D3748)]
        animate-fade-up"
            />

            {/* Content container with proper z-index */}
            <div className="relative z-10"> {/* Added z-10 here */}
                {/* Eyebrow */}
                {eyebrow && (
                    <a href="#" className="group">
            <span
                className="text-sm text-gray-400 font-geist mx-auto px-5 py-2
              bg-gradient-to-tr from-gray-800/5 via-gray-700/5 to-transparent
              border-[2px] border-gray-700/20
              rounded-3xl w-fit tracking-tight uppercase flex items-center justify-center"
            >
              {eyebrow}
                <ChevronRight className="inline w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
                    </a>
                )}

                {/* Title */}
                <h1
                    className="animate-fade-in text-balance
          bg-gradient-to-br from-white from-30% to-gray-400
          bg-clip-text py-6 text-5xl font-semibold leading-none tracking-tighter
          text-transparent sm:text-6xl md:text-7xl lg:text-8xl
          mx-auto max-w-4xl"
                    style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
                >
                    {title}
                </h1>

                {/* Subtitle */}
                <p
                    className="animate-fade-in mb-12 text-balance
          text-lg tracking-tight text-gray-400
          md:text-xl mx-auto max-w-2xl"
                    style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
                >
                    {subtitle}
                </p>

                {/* CTA */}
                {ctaLabel && (
                    <div className="flex justify-center">
                        <Button
                            asChild
                            className="mt-[-20px] w-fit md:w-52 font-geist tracking-tighter text-center text-lg
              bg-green-600 hover:bg-green-700 text-white"
                            style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
                        >
                            <a href={ctaHref}>{ctaLabel}</a>
                        </Button>
                    </div>
                )}
            </div>

            {/* Bottom Fade */}
            <div
                className="animate-fade-up relative mt-32 [perspective:2000px]
        after:absolute after:inset-0 after:z-50
        after:[background:linear-gradient(to_top,hsl(var(--background))_10%,transparent)]"
                style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}
            />
        </section>
    )
}