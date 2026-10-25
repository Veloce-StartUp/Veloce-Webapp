"use client"

import { TeamSection } from "@/components/team-section"
import { Footer } from "@/components/footer"

export default function TeamPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pt-20">
        <TeamSection />
      </div>
      <Footer />
    </main>
  )
}
