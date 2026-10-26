import type { Metadata } from "next"
import { ServicesSection } from "@/components/services-section"
import { Footer } from "@/components/footer"
import { pageMetadata } from "@/lib/site"

export const metadata: Metadata = pageMetadata({
  title: "Software Development Services",
  description:
    "Web development, mobile app development, cloud solutions, data engineering, cybersecurity and AI automation from Veloce Technology, a software company in Sri Lanka.",
  path: "/services",
})

export default function ServicesPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pt-20">
        <ServicesSection headingAs="h1" />
      </div>
      <Footer />
    </main>
  )
}
