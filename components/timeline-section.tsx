"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Users, Code, TestTube, Rocket, CheckCircle2, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

const developmentStages = [
  {
    stage: "01",
    title: "Requirement Gathering",
    description:
        "We start by understanding your vision, goals, and specific requirements through detailed consultations.",
    icon: FileText,
    status: "active",
    details: [
      "Stakeholder interviews",
      "Technical requirements analysis",
      "Project scope definition",
      "Timeline planning",
    ],
    duration: "1-2 weeks",
  },
  {
    stage: "02",
    title: "Design & Planning",
    description: "Creating wireframes, UI/UX designs, and technical architecture for your project.",
    icon: Users,
    status: "active",
    details: ["UI/UX design", "System architecture", "Database design", "Technology stack selection"],
    duration: "2-3 weeks",
  },
  {
    stage: "03",
    title: "Development",
    description: "Our expert developers bring your vision to life using cutting-edge technologies and best practices.",
    icon: Code,
    status: "active",
    details: ["Frontend development", "Backend development", "API integration", "Regular progress updates"],
    duration: "4-8 weeks",
  },
  {
    stage: "04",
    title: "Testing & QA",
    description: "Comprehensive testing to ensure your product is bug-free and performs optimally.",
    icon: TestTube,
    status: "active",
    details: ["Unit testing", "Integration testing", "Performance testing", "Security testing"],
    duration: "1-2 weeks",
  },
  {
    stage: "05",
    title: "Deployment",
    description: "Launching your product to production with proper monitoring and support systems.",
    icon: Rocket,
    status: "active",
    details: ["Production deployment", "Performance monitoring", "Security setup", "Documentation"],
    duration: "1 week",
  },
  {
    stage: "06",
    title: "Support & Maintenance",
    description: "Ongoing support, updates, and maintenance to keep your product running smoothly.",
    icon: CheckCircle2,
    status: "ongoing",
    details: ["24/7 monitoring", "Regular updates", "Bug fixes", "Feature enhancements"],
    duration: "Ongoing",
  },
]

export function TimelineSection() {
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const index = Number.parseInt(entry.target.getAttribute("data-index") || "0")
            if (entry.isIntersecting) {
              setTimeout(() => {
                setVisibleItems((prev) => [...prev, index])
              }, index * 200)
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
      <section ref={sectionRef} id="timeline" className="py-20 bg-black relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-20">
          <div className={`text-center mb-16 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-balance text-white"
            >
              Our Development <span className="text-green-400">Process</span>
            </motion.h2>
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto text-pretty"
            >
              From initial concept to final deployment - here's how we transform your ideas into reality.
            </motion.p>
          </div>

          <div className="relative max-w-6xl mx-auto">
            {/* Vertical timeline line - hidden on mobile */}
            {!isMobile && (
                <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-400 via-green-500 to-green-600 transform -translate-x-0.5" />
            )}

            <div className="space-y-8 lg:space-y-12">
              {developmentStages.map((stage, index) => {
                const Icon = stage.icon
                const isVisible = visibleItems.includes(index)
                const isLeft = index % 2 === 0

                return (
                    <div
                        key={index}
                        ref={(el) => {
                          itemRefs.current[index] = el;
                        }}
                        data-index={index}
                        className={`relative flex flex-col lg:flex-row items-center ${
                            isLeft ? "lg:flex-row" : "lg:flex-row-reverse"
                        } ${isVisible ? (isLeft && !isMobile ? "animate-fade-in-left" : "animate-fade-in-right") : "opacity-0"}`}
                    >
                      {/* Timeline dot - hidden on mobile */}
                      {!isMobile && (
                          <div className="hidden lg:block absolute left-1/2 w-6 h-6 bg-green-500 rounded-full border-4 border-black transform -translate-x-1/2 z-10 animate-glow-pulse">
                            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75" />
                          </div>
                      )}

                      {/* Mobile timeline dot */}
                      {isMobile && (
                          <div className="lg:hidden absolute left-6 top-6 w-4 h-4 bg-green-500 rounded-full border-2 border-black z-10 animate-glow-pulse">
                            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75" />
                          </div>
                      )}

                      {/* Content card */}
                      <div className={`w-full ${isMobile ? 'pl-14' : 'lg:w-5/12'} ${isLeft && !isMobile ? "lg:mr-auto lg:pr-8" : !isMobile ? "lg:ml-auto lg:pl-8" : ""}`}>
                        <Card className="group modern-card-hover bg-gray-900/80 backdrop-blur-sm border-gray-800 hover:border-green-500/50 transition-all duration-300">
                          <CardContent className="p-6">
                            <div className="flex items-start mb-4">
                              <div className="w-14 h-14 bg-green-500/20 rounded-lg flex items-center justify-center mr-4 group-hover:bg-green-500/30 group-hover:scale-110 transition-all duration-300 flex-shrink-0">
                                <Icon className="h-7 w-7 text-green-400 group-hover:text-green-300 transition-colors" />
                              </div>
                              <div className="flex-grow">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                                  <Badge className="bg-green-600 hover:bg-green-700 text-white mb-2 sm:mb-0 w-fit">
                                    Stage {stage.stage}
                                  </Badge>
                                  {/*<span className="text-sm text-green-400 font-medium">{stage.duration}</span>*/}
                                </div>
                                <h3 className="text-xl font-semibold text-white group-hover:text-green-400 transition-colors mb-2">
                                  {stage.title}
                                </h3>
                              </div>
                            </div>

                            <p className="text-gray-400 mb-4 group-hover:text-gray-300 transition-colors">
                              {stage.description}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {stage.details.map((detail, detailIndex) => (
                                  <div
                                      key={detailIndex}
                                      className="text-sm text-gray-400 flex items-center group-hover:text-gray-300 transition-colors"
                                  >
                                    <ArrowRight className="w-3 h-3 text-green-400 mr-2 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                                    {detail}
                                  </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
  )
}