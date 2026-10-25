"use client"

import { TimelineSection } from "@/components/timeline-section"
import { Footer } from "@/components/footer"

export default function TimelinePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pt-20">
        <TimelineSection />
      </div>
      <Footer />
    </main>
  )
}
