import type { Metadata } from "next"
import { TeamSection } from "@/components/team-section"
import { Footer } from "@/components/footer"
import { pageMetadata } from "@/lib/site"

export const metadata: Metadata = pageMetadata({
  title: "Our Team",
  description:
    "Meet the founders, engineers and QA specialists behind Veloce Technology, the Sri Lankan software company building web, mobile and cloud platforms.",
  path: "/team",
})

export default function TeamPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pt-20">
        <TeamSection headingAs="h1" />
      </div>
      <Footer />
    </main>
  )
}
