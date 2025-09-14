"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollIndicatorOpacity, setScrollIndicatorOpacity] = useState(1)
  const particlesRef = useRef<
      Array<{
        x: number
        y: number
        size: number
        opacity: number
        vx: number
        vy: number
        life: number
        color: string
      }>
  >([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const handleScroll = () => {
      const scrollY = window.scrollY
      const opacity = Math.max(0, 1 - scrollY / 300)
      setScrollIndicatorOpacity(opacity)
    }

    window.addEventListener("scroll", handleScroll)

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })

      // Create particles with different colors
      const colors = [
        "rgba(34, 197, 94, 0.8)", // green-500
        "rgba(134, 239, 172, 0.8)", // green-300
        "rgba(74, 222, 128, 0.8)", // green-400
        "rgba(163, 230, 53, 0.8)", // lime-500
      ]

      const newParticles = Array.from({ length: 5 }, () => {
        const color = colors[Math.floor(Math.random() * colors.length)]
        return {
          x: e.clientX - rect.left + (Math.random() - 0.5) * 50,
          y: e.clientY - rect.top + (Math.random() - 0.5) * 50,
          size: Math.random() * 4 + 2,
          opacity: 1,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: 60,
          color,
        }
      })

      particlesRef.current = [...particlesRef.current, ...newParticles].slice(-100)
    }

    canvas.addEventListener("mousemove", handleMouseMove)

    // Create floating particles independent of mouse movement
    const createFloatingParticles = () => {
      const colors = [
        "rgba(34, 197, 94, 0.4)",
        "rgba(134, 239, 172, 0.4)",
        "rgba(74, 222, 128, 0.4)",
        "rgba(163, 230, 53, 0.4)",
      ]

      const newParticle = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        life: 200 + Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
      }

      particlesRef.current.push(newParticle)
    }

    // Add floating particles periodically
    const floatingParticleInterval = setInterval(createFloatingParticles, 300)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw a subtle gradient background
      const gradient = ctx.createRadialGradient(
          canvas.width / 2,
          canvas.height / 2,
          0,
          canvas.width / 2,
          canvas.height / 2,
          Math.max(canvas.width, canvas.height) / 1.5
      )
      gradient.addColorStop(0, "rgba(0, 0, 0, 0.3)")
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particlesRef.current = particlesRef.current
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            opacity: particle.opacity * 0.98,
            life: particle.life - 1,
          }))
          .filter((particle) => particle.life > 0 && particle.opacity > 0.01)

      particlesRef.current.forEach((particle) => {
        ctx.save()
        ctx.globalAlpha = particle.opacity

        const gradient = ctx.createRadialGradient(
            particle.x,
            particle.y,
            0,
            particle.x,
            particle.y,
            particle.size * 3
        )
        gradient.addColorStop(0, particle.color)
        gradient.addColorStop(0.5, particle.color.replace("0.8", "0.4").replace("0.4", "0.2"))
        gradient.addColorStop(1, "rgba(34, 197, 94, 0)")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("scroll", handleScroll)
      canvas.removeEventListener("mousemove", handleMouseMove)
      clearInterval(floatingParticleInterval)
    }
  }, [])

  return (
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950">
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-green-500/10 rounded-full blur-xl animate-float" />
          <div
              className="absolute top-40 right-20 w-24 h-24 bg-green-400/10 rounded-full blur-lg animate-float"
              style={{ animationDelay: "2s" }}
          />
          <div
              className="absolute bottom-40 left-1/4 w-40 h-40 bg-green-600/5 rounded-full blur-2xl animate-float"
              style={{ animationDelay: "4s" }}
          />
          <div
              className="absolute top-1/2 left-10 w-20 h-20 bg-green-500/5 rounded-full blur-xl animate-float"
              style={{ animationDelay: "6s" }}
          />
          <div
              className="absolute bottom-20 right-10 w-28 h-28 bg-green-400/8 rounded-full blur-lg animate-float"
              style={{ animationDelay: "8s" }}
          />

          {/* Grid background */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik02MCAwSDB2NjBNNjAgMEwwIDYwIiBzdHJva2U9InJnYmEoNzQsIDIyMiwgMTI4LCAwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-30" />

          {/* Animated shapes */}
          <div className="absolute top-1/3 right-1/4 animate-3d-rotate">
            <div className="w-16 h-16 border-2 border-green-500/30 transform rotate-45" />
          </div>
          <div className="absolute bottom-1/3 left-1/3 animate-3d-rotate" style={{ animationDelay: "10s" }}>
            <div className="w-12 h-12 border border-green-400/40 rounded-lg transform rotate-12" />
          </div>
          <div className="absolute top-1/4 left-1/2 animate-3d-rotate" style={{ animationDelay: "15s" }}>
            <div className="w-8 h-8 border border-green-600/50 rounded-full" />
          </div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-20">
          <div className="max-w-4xl mx-auto">
            {/* Animated badge */}
            {/*<div className="inline-flex items-center justify-center px-4 py-2 mb-8 bg-green-900/30 backdrop-blur-sm rounded-full border border-green-700/30 animate-fade-in">*/}
            {/*  <Sparkles className="h-4 w-4 text-green-400 mr-2" />*/}
            {/*  <span className="text-green-400 text-sm font-medium">Next-gen solutions available now</span>*/}
            {/*</div>*/}

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance animate-fade-in-up">
              Innovating the
              <span className="text-green-400 block mt-2 relative inline-block">
              <span className="animate-text-shimmer bg-clip-text text-transparent bg-[linear-gradient(110deg,#86efac,45%,#22c55e,55%,#86efac)] bg-[length:250%_100%]">
                Future of Tech
              </span>
              <span className="absolute -inset-2 rounded-lg bg-green-500/10 -z-10 blur-md" />
            </span>
            </h1>

            <p
                className="text-lg sm:text-xl md:text-2xl text-slate-300 mb-8 text-pretty max-w-2xl mx-auto animate-fade-in-up"
                style={{ animationDelay: "0.2s" }}
            >
              We build cutting-edge solutions that transform businesses and drive digital innovation forward.
            </p>

            <div
                className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up"
                style={{ animationDelay: "0.4s" }}
            >
              <Link href="#contact">
                <Button
                    size="lg"
                    className="relative overflow-hidden group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 w-full sm:w-auto"
                >
                  <span className="relative z-10">Get Started</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform z-10 relative" />
                  <span className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Button>
              </Link>
              <Link href="#products">
                <Button
                    size="lg"
                    variant="outline"
                    className="border-green-500/50 text-green-400 hover:bg-green-600/10 hover:text-green-300 bg-slate-900/30 backdrop-blur-sm hover:scale-105 transition-all duration-300 w-full sm:w-auto group"
                >
                  <span>View Our Work</span>
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </Button>
              </Link>
            </div>

            {/* Stats preview */}
            <div
                className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto animate-fade-in-up border border-slate-800/50 rounded-2xl p-6 bg-slate-900/30 backdrop-blur-sm"
                style={{ animationDelay: "0.6s" }}
            >
              <div>
                <div className="text-2xl md:text-3xl font-bold text-green-400">200+</div>
                <div className="text-sm text-slate-400">Projects Completed</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-green-400">98%</div>
                <div className="text-sm text-slate-400">Client Satisfaction</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-green-400">15+</div>
                <div className="text-sm text-slate-400">Years Experience</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-green-400">50+</div>
                <div className="text-sm text-slate-400">Experts Team</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce"
            style={{ opacity: scrollIndicatorOpacity }}
        >
          <div className="flex flex-col items-center">
            <span className="text-sm text-slate-400 mb-2">Scroll to explore</span>
            <ChevronDown className="h-5 w-5 text-green-400" />
          </div>
        </div>
      </section>
  )
}