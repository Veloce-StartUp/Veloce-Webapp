import type { Metadata } from "next"
import { TimelineSection } from "@/components/timeline-section"
import { Footer } from "@/components/footer"
import { pageMetadata } from "@/lib/site"

export const metadata: Metadata = pageMetadata({
  title: "Our Development Process",
  description:
    "How Veloce Technology takes a software project from idea to launch: requirement gathering, design and planning, development, testing and QA, deployment, and ongoing support.",
  path: "/timeline",
})

export default function TimelinePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pt-20">
        <TimelineSection headingAs="h1" />
      </div>
      <Footer />
    </main>
  )
}
