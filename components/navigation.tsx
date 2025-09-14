"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Link from "next/link"

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/80 backdrop-blur-md border-b border-gray-800" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white">
            Veloce
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-300 hover:text-green-400 transition-all duration-300 hover:scale-105 relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="#services"
              className="text-gray-300 hover:text-green-400 transition-all duration-300 hover:scale-105 relative group"
            >
              Services
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="#products"
              className="text-gray-300 hover:text-green-400 transition-all duration-300 hover:scale-105 relative group"
            >
              Products
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="#timeline"
              className="text-gray-300 hover:text-green-400 transition-all duration-300 hover:scale-105 relative group"
            >
              Timeline
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="#team"
              className="text-gray-300 hover:text-green-400 transition-all duration-300 hover:scale-105 relative group"
            >
              Team
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="#contact"
              className="text-gray-300 hover:text-green-400 transition-all duration-300 hover:scale-105 relative group"
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="#contact">
              <Button className="bg-green-600 hover:bg-green-700 text-white border-0 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 relative overflow-hidden group">
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:text-green-400 hover:bg-green-900/20 transition-all duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-800 animate-fade-in-down">
            <div className="flex flex-col space-y-4 pt-4">
              <Link
                href="/"
                className="text-left text-gray-300 hover:text-green-400 transition-all duration-300 hover:translate-x-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="#services"
                className="text-left text-gray-300 hover:text-green-400 transition-all duration-300 hover:translate-x-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                href="#products"
                className="text-left text-gray-300 hover:text-green-400 transition-all duration-300 hover:translate-x-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="#timeline"
                className="text-left text-gray-300 hover:text-green-400 transition-all duration-300 hover:translate-x-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Timeline
              </Link>
              <Link
                href="#team"
                className="text-left text-gray-300 hover:text-green-400 transition-all duration-300 hover:translate-x-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Team
              </Link>
              <Link
                href="#contact"
                className="text-left text-gray-300 hover:text-green-400 transition-all duration-300 hover:translate-x-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link href="#contact" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="bg-green-600 hover:bg-green-700 text-white w-fit border-0 hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
