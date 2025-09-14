"use client"

import { useEffect, useRef } from "react"

export function InteractiveBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100

      container.style.setProperty("--mouse-x", `${x}%`)
      container.style.setProperty("--mouse-y", `${y}%`)
    }

    const createParticle = (e: MouseEvent) => {
      const particle = document.createElement("div")
      particle.className = "absolute w-2 h-2 bg-blue-400 rounded-full floating-particles pointer-events-none"
      particle.style.left = `${e.clientX - container.getBoundingClientRect().left}px`
      particle.style.top = `${e.clientY - container.getBoundingClientRect().top}px`

      container.appendChild(particle)

      setTimeout(() => {
        particle.remove()
      }, 8000)
    }

    container.addEventListener("mousemove", handleMouseMove)
    container.addEventListener("click", createParticle)

    return () => {
      container.removeEventListener("mousemove", handleMouseMove)
      container.removeEventListener("click", createParticle)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 interactive-bg section-bg-pattern pointer-events-none"
      style={{ zIndex: -1 }}
    >
      {/* Matrix rain effect */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-px h-20 bg-gradient-to-b from-transparent via-blue-400 to-transparent matrix-rain"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  )
}
