"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Rocket, Brain, Shield, ArrowRight, Star, Users } from "lucide-react"

const products = [
  {
    icon: Brain,
    title: "AI Analytics Platform",
    description: "Advanced AI-powered analytics platform that transforms your data into actionable insights.",
    status: "Live",
    users: "10K+",
    rating: 4.9,
    features: ["Real-time Analytics", "Predictive Modeling", "Custom Dashboards", "API Integration"],
    image: "/ai-analytics-dashboard.png",
    color: "from-green-600 to-emerald-600",
  },
  {
    icon: Shield,
    title: "SecureFlow",
    description: "Enterprise-grade security management system with automated threat detection.",
    status: "Beta",
    users: "5K+",
    rating: 4.8,
    features: ["Threat Detection", "Compliance Monitoring", "Incident Response", "Risk Assessment"],
    image: "/cybersecurity-dashboard.png",
    color: "from-emerald-600 to-teal-600",
  },
  {
    icon: Rocket,
    title: "CloudDeploy Pro",
    description: "Streamlined cloud deployment and management platform for modern applications.",
    status: "Live",
    users: "25K+",
    rating: 4.7,
    features: ["One-click Deploy", "Auto Scaling", "Monitoring", "Multi-cloud Support"],
    image: "/cloud-deployment-interface-with-servers-and-monito.jpg",
    color: "from-teal-600 to-cyan-600",
  },
]

export function ProductsSection() {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)
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
      <section ref={sectionRef} id="products" className="py-20 bg-black relative">
        <div className="container mx-auto px-4 relative z-20">
          <div className={`text-center mb-16 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance text-white">
              Our <span className="text-green-400">Products</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto text-pretty">
              Innovative software products designed to solve real-world problems and accelerate business growth.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-20">
            {products.map((product, index) => {
              const Icon = product.icon
              return (
                  <Card
                      key={index}
                      className={`group modern-card-hover relative overflow-hidden border border-gray-800 bg-gray-900/80 backdrop-blur-sm cursor-pointer ${
                          isVisible ? "animate-scale-in" : "opacity-0"
                      }`}
                      style={{ animationDelay: `${index * 0.2}s` }}
                      onMouseEnter={() => setHoveredProduct(index)}
                      onMouseLeave={() => setHoveredProduct(null)}
                  >
                    {/* Product Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.title}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-125 group-hover:rotate-2"
                      />
                      <div
                          className={`absolute inset-0 bg-gradient-to-t ${product.color} opacity-30 group-hover:opacity-50 transition-all duration-500`}
                      />

                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                      {/* Status Badge */}
                      <Badge
                          className={`absolute top-4 right-4 animate-bounce-in ${
                              product.status === "Live"
                                  ? "bg-green-600 hover:bg-green-700"
                                  : "bg-orange-500 hover:bg-orange-600"
                          }`}
                      >
                        {product.status}
                      </Badge>
                    </div>

                    <CardHeader className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                          <Icon className="h-5 w-5 text-green-400 group-hover:text-green-300 transition-colors" />
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center group-hover:text-green-400 transition-colors">
                            <Users className="h-4 w-4 mr-1" />
                            {product.users}
                          </div>
                          <div className="flex items-center group-hover:text-green-400 transition-colors">
                            <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400 group-hover:scale-110 transition-transform" />
                            {product.rating}
                          </div>
                        </div>
                      </div>

                      <CardTitle className="text-xl mb-2 text-white group-hover:text-green-400 transition-colors">
                        {product.title}
                      </CardTitle>
                      <CardDescription className="text-gray-400 group-hover:text-gray-300 transition-colors">
                        {product.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {product.features.map((feature, featureIndex) => (
                              <Badge
                                  key={featureIndex}
                                  variant="secondary"
                                  className="text-xs bg-gray-800 text-gray-300 group-hover:bg-green-500/30 group-hover:text-green-300 transition-all duration-300"
                                  style={{ animationDelay: `${featureIndex * 0.1}s` }}
                              >
                                {feature}
                              </Badge>
                          ))}
                        </div>

                        <div className="flex space-x-2">
                          <Button className="flex-1 modern-button-hover bg-green-600 hover:bg-green-700 text-white group-hover:scale-105 transition-all duration-300">
                            Try Now
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                          <Button
                              variant="outline"
                              className="border-green-500 text-green-400 hover:bg-green-600 hover:text-white bg-transparent group-hover:scale-105 transition-all duration-300"
                          >
                            View Site
                          </Button>
                        </div>
                      </div>
                    </CardContent>

                    {hoveredProduct === index && (
                        <div className="absolute inset-0 border-2 border-green-500/60 rounded-lg animate-glow-pulse shadow-lg shadow-green-500/20" />
                    )}
                  </Card>
              )
            })}
          </div>

          <div
              className={`text-center mt-12 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
              style={{ animationDelay: "0.8s" }}
          >
            <Button
                size="lg"
                variant="outline"
                className="modern-button-hover border-green-500 text-green-400 hover:bg-green-600 hover:text-white bg-transparent hover:scale-105 transition-all duration-300"
            >
              View All Products
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>
  )
}