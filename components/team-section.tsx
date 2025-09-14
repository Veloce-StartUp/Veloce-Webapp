"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Linkedin, Twitter, Github, Mail, MapPin, Calendar } from "lucide-react"

const teamMembers = [
  {
    name: "Yohan Athukorala",
    role: "CEO & Founder",
    bio: "Passionate about building scalable systems and leading high-performing teams.",
    image: "/yohan-nayanajith.jpeg",
    location: "Colombo, Sri Lanka",
    experience: "12+ years",
    skills: ["Leadership", "Strategy", "Product Vision", "Full-Stack", "DevOps", "AI/ML"],
    social: {
      linkedin: "https://www.linkedin.com/in/yohan-nayanajith/",
      twitter: "#",
      email: "yohannayanajith40@gmail.com",
    },
  },
  {
    name: "Kumud Perera",
    role: "CTO",
    bio: "Full-stack architect with expertise in distributed systems.",
    image: "/kumud-perera.jpeg",
    location: "Colombo, Sri Lanka",
    experience: "15+ years",
    skills: ["UI/UX", "Backend", "Architecture", "DevOps"],
    social: {
      linkedin: "https://www.linkedin.com/in/kumud-perera-4559801a0/",
      github: "#",
      email: "nethmalperera54@gmail.com",
    },
  },
  {
    name: "Binali Ukwatte",
    role: "Head of Product",
    bio: "Product strategist with a track record of launching successful B2B and B2C products.",
    image: "/binali-ukwatte.jpeg",
    location: "Boston, MA",
    experience: "9+ years",
    skills: ["Product Strategy", "Market Research", "Analytics", "Business Analyst"],
    social: {
      linkedin: "https://www.linkedin.com/in/binali-ukwatte-56556a269/",
      twitter: "#",
      email: "binaliukwatte@gmail.com",
    },
  }
]

export function TeamSection() {
  const [hoveredMember, setHoveredMember] = useState<number | null>(null)
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
      <section ref={sectionRef} id="team" className="py-20 bg-black relative">
        <div className="container mx-auto px-4 relative z-20">
          <div className={`text-center mb-16 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance text-white">
              Meet Our <span className="text-green-400">Team</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto text-pretty">
              Talented individuals from diverse backgrounds united by a passion for innovation and excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-20">
            {teamMembers.map((member, index) => (
                <Card
                    key={index}
                    className={`group modern-card-hover relative overflow-hidden border border-gray-800 bg-gray-900/80 backdrop-blur-sm cursor-pointer ${
                        isVisible ? "animate-bounce-in" : "opacity-0"
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onMouseEnter={() => setHoveredMember(index)}
                    onMouseLeave={() => setHoveredMember(null)}
                >
                  {/* Profile Image */}
                  <div className="relative h-64 md:h-96 overflow-hidden">
                    <img
                        src={member.image || "/placeholder.svg"}
                        alt={member.name}
                        className="w-full h-full object-cover object-top transition-all duration-700 group-hover:scale-125 group-hover:rotate-2"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-500/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                    {/* Social Links - Appear on Hover */}
                    <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 z-30">
                      {member.social.linkedin && (
                          <Button
                              size="icon"
                              variant="secondary"
                              className="h-8 w-8 modern-button-hover bg-gray-800 text-gray-300 hover:bg-green-600 hover:text-white"
                              onClick={() => {window.open(member.social.linkedin)}}
                          >
                            <Linkedin className="h-4 w-4" />
                          </Button>
                      )}
                      {member.social.twitter && (
                          <Button
                              size="icon"
                              variant="secondary"
                              className="h-8 w-8 modern-button-hover bg-gray-800 text-gray-300 hover:bg-green-600 hover:text-white"
                          >
                            <Twitter className="h-4 w-4" />
                          </Button>
                      )}
                      {member.social.github && (
                          <Button
                              size="icon"
                              variant="secondary"
                              className="h-8 w-8 modern-button-hover bg-gray-800 text-gray-300 hover:bg-green-600 hover:text-white"
                          >
                            <Github className="h-4 w-4" />
                          </Button>
                      )}
                      {member.social.email && (
                          <Button
                              size="icon"
                              variant="secondary"
                              className="h-8 w-8 modern-button-hover bg-gray-800 text-gray-300 hover:bg-green-600 hover:text-white"
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold mb-1 text-white group-hover:text-green-400 transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-green-400 font-medium mb-2 group-hover:text-green-300 transition-colors">
                        {member.role}
                      </p>
                      <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                        {member.bio}
                      </p>
                    </div>

                    <div className="space-y-3">
                      {/*<div className="flex items-center text-sm text-gray-400 group-hover:text-gray-300 transition-colors">*/}
                      {/*  <MapPin className="h-4 w-4 mr-2 text-green-400 group-hover:text-green-300 transition-colors" />*/}
                      {/*  {member.location}*/}
                      {/*</div>*/}
                      {/*<div className="flex items-center text-sm text-gray-400 group-hover:text-gray-300 transition-colors">*/}
                      {/*  <Calendar className="h-4 w-4 mr-2 text-green-400 group-hover:text-green-300 transition-colors" />*/}
                      {/*  {member.experience}*/}
                      {/*</div>*/}

                      <div className="flex flex-wrap gap-1">
                        {member.skills.map((skill, skillIndex) => (
                            <Badge
                                key={skillIndex}
                                variant="secondary"
                                className="text-xs bg-gray-800 text-gray-300 group-hover:bg-green-500/30 group-hover:text-green-300 transition-all duration-300"
                            >
                              {skill}
                            </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>

                  {hoveredMember === index && (
                      <div className="absolute inset-0 border-2 border-green-500/60 rounded-lg animate-glow-pulse shadow-lg shadow-green-500/20" />
                  )}
                </Card>
            ))}
          </div>

          {/*<div*/}
          {/*    className={`text-center mt-12 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}*/}
          {/*    style={{ animationDelay: "0.8s" }}*/}
          {/*>*/}
          {/*  <p className="text-gray-400 mb-6 text-lg">Want to join our amazing team?</p>*/}
          {/*  <Button*/}
          {/*      size="lg"*/}
          {/*      className="modern-button-hover bg-green-600 hover:bg-green-700 text-white hover:scale-105 transition-all duration-300"*/}
          {/*  >*/}
          {/*    View Open Positions*/}
          {/*  </Button>*/}
          {/*</div>*/}
        </div>
      </section>
  )
}