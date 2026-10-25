"use client"

import { ServicesSection } from "@/components/services-section"
import { Footer } from "@/components/footer"

export default function ServicesPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pt-20">
        <ServicesSection />
      </div>
      <Footer />
    </main>
  )
}
