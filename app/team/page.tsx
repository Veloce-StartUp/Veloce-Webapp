"use client"

import { Navigation } from "@/components/navigation"
import { TeamSection } from "@/components/team-section"
import { Footer } from "@/components/footer"
import { InteractiveBackground } from "@/components/interactive-background"

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      <InteractiveBackground />
      <Navigation />
      <div className="pt-20">
        <TeamSection />
      </div>
      <Footer />
    </main>
  )
}
