"use client"

import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function ContactPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pt-20">
        <ContactSection />
      </div>
      <Footer />
    </main>
  )
}
