"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Smartphone, Globe, Database, Shield, Cloud, Cpu, ArrowRight, CheckCircle } from "lucide-react"
import { Squares } from "@/components/backgrounds/squares-background"

const services = [
  {
    icon: Globe,
    title: "Web Development",
    description: "Modern, responsive websites and web applications built with the latest technologies.",
    features: ["React & Next.js", "Progressive Web Apps", "E-commerce Solutions", "CMS Integration"],
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Smartphone,
    title: "Mobile Development",
    description: "Native and cross-platform mobile applications for iOS and Android.",
    features: ["React Native", "Flutter", "Native iOS/Android", "App Store Optimization"],
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Cloud,
    title: "Cloud Solutions",
    description: "Scalable cloud infrastructure and deployment solutions.",
    features: ["AWS/Azure/GCP", "DevOps & CI/CD", "Microservices", "Container Orchestration"],
    color: "from-teal-500 to-cyan-500",
  },
  {
    icon: Database,
    title: "Data Engineering",
    description: "Big data processing, analytics, and machine learning solutions.",
    features: ["Data Pipelines", "ML/AI Integration", "Real-time Analytics", "Data Visualization"],
    color: "from-green-600 to-green-400",
  },
  {
    icon: Shield,
    title: "Cybersecurity",
    description: "Comprehensive security solutions to protect your digital assets.",
    features: ["Security Audits", "Penetration Testing", "Compliance", "Incident Response"],
    color: "from-emerald-600 to-emerald-400",
  },
  {
    icon: Cpu,
    title: "AI & Automation",
    description: "Intelligent automation and AI-powered solutions for business optimization.",
    features: ["Process Automation", "Chatbots & AI", "Computer Vision", "Predictive Analytics"],
    color: "from-teal-600 to-teal-400",
  },
]

export function ServicesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

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
      <section ref={sectionRef} id="services" className="py-20 bg-black relative overflow-hidden">
        {/* Squares Background */}
        <div className="absolute inset-0 z-0 opacity-50">
          <Squares
              direction="diagonal"
              speed={0.4}
              squareSize={35}
              borderColor="#4A7C59" // Softer green instead of dark gray
              hoverFillColor="#3D6B4F" // Green hover effect
              className="w-full h-full"
          />
        </div>

        {/* Animated gradient elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 bg-green-500/5 rounded-full blur-xl animate-pulse" />
          <div
              className="absolute bottom-20 right-20 w-40 h-40 bg-green-400/5 rounded-full blur-2xl animate-pulse"
              style={{ animationDelay: "2s" }}
          />
          <div
              className="absolute top-1/2 left-1/3 w-24 h-24 bg-green-600/5 rounded-full blur-lg animate-pulse"
              style={{ animationDelay: "4s" }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <div className={`text-center mb-16 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl text-white font-bold mb-6 text-balance">
              Our <span className="text-green-400">Services</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto text-pretty">
              Comprehensive technology solutions tailored to drive your business forward in the digital age.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 relative z-20">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                  <Card
                      key={index}
                      className={`group modern-card-hover relative overflow-hidden border border-gray-800 bg-gray-900/80 backdrop-blur-sm cursor-pointer ${
                          isVisible ? "animate-bounce-in" : "opacity-0"
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div
                        className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-20 transition-all duration-500`}
                    />

                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-transparent to-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <CardHeader className="relative z-10">
                      <div className="w-12 h-12 mb-4 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 group-hover:scale-110 transition-all duration-300">
                        <Icon className="h-6 w-6 text-green-400 group-hover:text-green-300 transition-colors" />
                      </div>
                      <CardTitle className="text-xl mb-2 text-white group-hover:text-green-400 transition-colors">
                        {service.title}
                      </CardTitle>
                      <CardDescription className="text-gray-400 group-hover:text-gray-300 transition-colors">
                        {service.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="relative z-10">
                      <ul className="space-y-2 mb-6">
                        {service.features.map((feature, featureIndex) => (
                            <li
                                key={featureIndex}
                                className="flex items-center text-sm text-gray-400 group-hover:text-gray-300 transition-colors"
                            >
                              <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0 group-hover:scale-110 transition-transform" />
                              {feature}
                            </li>
                        ))}
                      </ul>

                      <Button
                          variant="ghost"
                          className="w-full modern-button-hover bg-gray-800 text-gray-300 group-hover:bg-green-600 group-hover:text-white transition-all duration-300"
                      >
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
                      </Button>
                    </CardContent>

                    {hoveredIndex === index && (
                        <div className="absolute inset-0 border-2 border-green-500/60 rounded-lg animate-glow-pulse" />
                    )}
                  </Card>
              )
            })}
          </div>
        </div>
      </section>
  )
}