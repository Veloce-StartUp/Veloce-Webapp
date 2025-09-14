"use client"

import { Navigation } from "@/components/navigation"
import { TimelineSection } from "@/components/timeline-section"
import { Footer } from "@/components/footer"
import { InteractiveBackground } from "@/components/interactive-background"

export default function TimelinePage() {
  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      <InteractiveBackground />
      <Navigation />
      <div className="pt-20">
        <TimelineSection />
      </div>
      <Footer />
    </main>
  )
}
