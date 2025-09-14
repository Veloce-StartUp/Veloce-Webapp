"use client"

import { Navigation } from "@/components/navigation"
import { ProductsSection } from "@/components/products-section"
import { Footer } from "@/components/footer"
import { InteractiveBackground } from "@/components/interactive-background"

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      <InteractiveBackground />
      <Navigation />
      <div className="pt-20">
        <ProductsSection />
      </div>
      <Footer />
    </main>
  )
}
