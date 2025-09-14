"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Github, Twitter, Linkedin, Mail, ArrowRight, Code, Zap, Shield, Globe, Heart } from "lucide-react"
import { DottedSurface } from "@/components/ui/dotted-surface"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
      <footer className="text-white  relative overflow-hidden">
        {/* Dotted Surface Background */}
        <div className="absolute inset-0 z-10">
          <DottedSurface dotColor="white" className="size-full" />
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

        <div className="container mx-auto px-4 py-16 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="text-2xl font-bold text-green-400">VELOCE</div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Innovating the future of technology with cutting-edge solutions that transform businesses and drive
                digital innovation forward.
              </p>
              <div className="flex space-x-3">
                <Button
                    size="icon"
                    variant="ghost"
                    className="hover:bg-green-600/20 hover:text-green-400 transition-all duration-300 hover:scale-110 text-gray-400"
                >
                  <Github className="h-4 w-4" />
                </Button>
                <Button
                    size="icon"
                    variant="ghost"
                    className="hover:bg-green-600/20 hover:text-green-400 transition-all duration-300 hover:scale-110 text-gray-400"
                >
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button
                    size="icon"
                    variant="ghost"
                    className="hover:bg-green-600/20 hover:text-green-400 transition-all duration-300 hover:scale-110 text-gray-400"
                >
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button
                    size="icon"
                    variant="ghost"
                    className="hover:bg-green-600/20 hover:text-green-400 transition-all duration-300 hover:scale-110 text-gray-400"
                >
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-400">Services</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                      href="#"
                      className="text-gray-400 hover:text-green-400 transition-all duration-300 flex items-center hover:translate-x-1"
                  >
                    <Code className="h-3 w-3 mr-2 text-green-500" />
                    Web Development
                  </a>
                </li>
                <li>
                  <a
                      href="#"
                      className="text-gray-400 hover:text-green-400 transition-all duration-300 flex items-center hover:translate-x-1"
                  >
                    <Zap className="h-3 w-3 mr-2 text-green-500" />
                    Mobile Apps
                  </a>
                </li>
                <li>
                  <a
                      href="#"
                      className="text-gray-400 hover:text-green-400 transition-all duration-300 flex items-center hover:translate-x-1"
                  >
                    <Shield className="h-3 w-3 mr-2 text-green-500" />
                    Cloud Solutions
                  </a>
                </li>
                <li>
                  <a
                      href="#"
                      className="text-gray-400 hover:text-green-400 transition-all duration-300 flex items-center hover:translate-x-1"
                  >
                    <Globe className="h-3 w-3 mr-2 text-green-500" />
                    AI & Automation
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-400">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                      href="#"
                      className="text-gray-400 hover:text-green-400 transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                      href="#"
                      className="text-gray-400 hover:text-green-400 transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                      href="#"
                      className="text-gray-400 hover:text-green-400 transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                      href="#"
                      className="text-gray-400 hover:text-green-400 transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    Press
                  </a>
                </li>
                <li>
                  <a
                      href="#"
                      className="text-gray-400 hover:text-green-400 transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    Partners
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-400">Stay Updated</h3>
              <p className="text-gray-400 text-sm">
                Subscribe to our newsletter for the latest tech insights and company updates.
              </p>
              <div className="space-y-2">
                <Input
                    type="email"
                    placeholder="Enter your email"
                    className="bg-gray-800/80 border-gray-700 text-white placeholder:text-gray-500 focus:border-green-500 transition-colors"
                />
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25">
                  Subscribe
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-gray-500 flex items-center">
                © {currentYear} VELOCE. Made with <Heart className="h-4 w-4 mx-1 text-green-500 animate-pulse" /> for
                innovation.
              </div>
              <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
                <a href="#" className="text-gray-500 hover:text-green-400 transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-500 hover:text-green-400 transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-500 hover:text-green-400 transition-colors">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
  )
}