"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Calendar } from "lucide-react"

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setFormData({ name: "", email: "", company: "", message: "" })

    // Show success message (you can implement toast notification here)
    alert("Thank you for your message! We'll get back to you soon.")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
      <section ref={sectionRef} id="contact" className="py-20 bg-black relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-green-500/10 rounded-full blur-xl float-animation" />
          <div
              className="absolute bottom-20 right-10 w-40 h-40 bg-green-500/10 rounded-full blur-2xl float-animation"
              style={{ animationDelay: "3s" }}
          />
          <div
              className="absolute top-1/2 left-1/3 w-24 h-24 bg-green-500/5 rounded-full blur-lg float-animation"
              style={{ animationDelay: "1.5s" }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <div className={`text-center mb-16 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance text-white">
              Get In <span className="text-green-400">Touch</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto text-pretty">
              Ready to transform your business with cutting-edge technology? Let's discuss your project.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <Card
                  className={`group modern-card-hover bg-gray-900/80 backdrop-blur-sm border border-gray-800 ${isVisible ? "animate-fade-in-left" : "opacity-0"}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mr-4 group-hover:bg-green-500/30 group-hover:scale-110 transition-all duration-300">
                      <Mail className="h-6 w-6 text-green-400 group-hover:text-green-300 transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-green-400 transition-colors">Email Us</h3>
                      <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                        Send us a message
                      </p>
                    </div>
                  </div>
                  <p className="text-green-400 font-medium">hello@techflow.com</p>
                </CardContent>
              </Card>

              <Card
                  className={`group modern-card-hover bg-gray-900/80 backdrop-blur-sm border border-gray-800 ${isVisible ? "animate-fade-in-left" : "opacity-0"}`}
                  style={{ animationDelay: "0.1s" }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mr-4 group-hover:bg-green-500/30 group-hover:scale-110 transition-all duration-300">
                      <Phone className="h-6 w-6 text-green-400 group-hover:text-green-300 transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-green-400 transition-colors">Call Us</h3>
                      <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                        Mon-Fri 9am-6pm PST
                      </p>
                    </div>
                  </div>
                  <p className="text-green-400 font-medium">+1 (555) 123-4567</p>
                </CardContent>
              </Card>

              <Card
                  className={`group modern-card-hover bg-gray-900/80 backdrop-blur-sm border border-gray-800 ${isVisible ? "animate-fade-in-left" : "opacity-0"}`}
                  style={{ animationDelay: "0.2s" }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mr-4 group-hover:bg-green-500/30 group-hover:scale-110 transition-all duration-300">
                      <MapPin className="h-6 w-6 text-green-400 group-hover:text-green-300 transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-green-400 transition-colors">Visit Us</h3>
                      <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                        Our headquarters
                      </p>
                    </div>
                  </div>
                  <p className="text-green-400 font-medium">
                    123 Innovation Drive
                    <br />
                    San Francisco, CA 94105
                  </p>
                </CardContent>
              </Card>

              <Card
                  className={`group modern-card-hover bg-gray-900/80 backdrop-blur-sm border border-gray-800 ${isVisible ? "animate-fade-in-left" : "opacity-0"}`}
                  style={{ animationDelay: "0.3s" }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mr-4 group-hover:bg-green-500/30 group-hover:scale-110 transition-all duration-300">
                      <Clock className="h-6 w-6 text-green-400 group-hover:text-green-300 transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-green-400 transition-colors">Business Hours</h3>
                      <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                        Pacific Standard Time
                      </p>
                    </div>
                  </div>
                  <div className="text-sm space-y-1 text-gray-400 group-hover:text-gray-300 transition-colors">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card
                  className={`h-fit modern-card-hover bg-gray-900/80 backdrop-blur-sm border border-gray-800 ${isVisible ? "animate-fade-in-right" : "opacity-0"}`}
                  style={{ animationDelay: "0.2s" }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <MessageSquare className="h-5 w-5 mr-2 text-green-400" />
                    Send us a message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-300">Full Name *</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            required
                            className="transition-all duration-200 focus:ring-2 focus:ring-green-400/20 focus:border-green-400 bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-300">Email Address *</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="john@company.com"
                            required
                            className="transition-all duration-200 focus:ring-2 focus:ring-green-400/20 focus:border-green-400 bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-gray-300">Company (Optional)</Label>
                      <Input
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          placeholder="Your Company Name"
                          className="transition-all duration-200 focus:ring-2 focus:ring-green-400/20 focus:border-green-400 bg-gray-800 border-gray-700 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-gray-300">Message *</Label>
                      <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Tell us about your project or how we can help you..."
                          rows={6}
                          required
                          className="transition-all duration-200 focus:ring-2 focus:ring-green-400/20 focus:border-green-400 resize-none bg-gray-800 border-gray-700 text-white"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 modern-button-hover bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 hover:scale-105 transition-all duration-300"
                      >
                        {isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Sending...
                            </>
                        ) : (
                            <>
                              Send Message
                              <Send className="ml-2 h-4 w-4" />
                            </>
                        )}
                      </Button>
                      <Button
                          type="button"
                          variant="outline"
                          className="modern-button-hover border-green-500 text-green-400 hover:bg-green-600 hover:text-white bg-transparent hover:scale-105 transition-all duration-300"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule Call
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
  )
}