"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Code, Zap, Globe, Shield, Rocket, Users } from "lucide-react"

const features = [
  {
    icon: Code,
    title: "Custom Development",
    description: "Tailored solutions built with cutting-edge technologies that perfectly fit your business needs.",
    details: ["React & Next.js", "Node.js & Python", "Cloud Architecture", "API Development"],
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized performance for exceptional user experiences with blazing-fast load times.",
    details: ["Performance Optimization", "CDN Integration", "Caching Strategies", "Speed Monitoring"],
  },
  {
    icon: Globe,
    title: "Global Scale",
    description: "Solutions that scale from startup to enterprise, handling millions of users worldwide.",
    details: ["Auto-scaling", "Load Balancing", "Global CDN", "Multi-region Deployment"],
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level security with advanced encryption and compliance standards.",
    details: ["SSL/TLS Encryption", "GDPR Compliance", "Security Audits", "Data Protection"],
  },
  {
    icon: Rocket,
    title: "Rapid Deployment",
    description: "From concept to production in record time with our streamlined development process.",
    details: ["CI/CD Pipelines", "Automated Testing", "Quick Iterations", "Fast Time-to-Market"],
  },
  {
    icon: Users,
    title: "Expert Team",
    description: "Dedicated team of senior developers and designers committed to your success.",
    details: ["Senior Developers", "UI/UX Designers", "DevOps Engineers", "24/7 Support"],
  },
]

export function FeaturesSection() {
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const index = Number.parseInt(entry.target.getAttribute("data-index") || "0")
            if (entry.isIntersecting) {
              setTimeout(() => {
                setVisibleItems((prev) => [...prev, index])
              }, index * 100)
            }
          })
        },
        { threshold: 0.3 },
    )

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        },
        { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
      <section
          ref={sectionRef}
          id="features"
          className="py-20 bg-black relative"
      >
        <div className="container mx-auto px-4 relative z-20">
          <div className={`text-center mb-16 ${isVisible ? "animate-fade-in-up" : "opacity-0"} relative z-20`}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-balance text-white">
              Why Choose <span className="text-green-400">TechFlow</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto text-pretty">
              We're not just developers - we're your technology partners committed to delivering excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 relative z-20">
            {features.map((feature, index) => {
              const Icon = feature.icon
              const isVisible = visibleItems.includes(index)

              return (
                  <div
                      key={index}
                      ref={(el) => (itemRefs.current[index] = el)}
                      data-index={index}
                      className={`${isVisible ? "animate-fade-in-up" : "opacity-0"} relative z-20`}
                  >
                    <Card className="z-40 group modern-card-hover bg-gray-900/80 backdrop-blur-sm border-gray-700 hover:border-green-400 transition-all duration-300 h-full">
                      <CardContent className="p-6 h-full flex flex-col">
                        <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center group-hover:bg-green-500/30 group-hover:scale-110 transition-all duration-300">
                          <Icon className="h-8 w-8 text-green-400 group-hover:text-green-300 transition-colors" />
                        </div>

                        <h3 className="text-xl font-semibold mb-3 text-center text-white group-hover:text-green-400 transition-colors">
                          {feature.title}
                        </h3>

                        <p className="text-gray-400 group-hover:text-white/100 text-center mb-4 flex-grow">{feature.description}</p>

                        <div className="space-y-2">
                          {feature.details.map((detail, detailIndex) => (
                              <div
                                  key={detailIndex}
                                  className="flex items-center text-sm text-gray-400 group-hover:text-gray-300 transition-colors"
                              >
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2 group-hover:scale-150 transition-transform" />
                                {detail}
                              </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
              )
            })}
          </div>
        </div>
      </section>
  )
}