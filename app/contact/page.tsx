import type { Metadata } from "next"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { pageMetadata } from "@/lib/site"

export const metadata: Metadata = pageMetadata({
  title: "Contact Us",
  description:
    "Talk to Veloce Technology about your software project. Email build.veloce@gmail.com or call +94 76 879 4004 for a free consultation. We reply within 24 hours.",
  path: "/contact",
})

export default function ContactPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pt-20">
        <ContactSection headingAs="h1" />
      </div>
      <Footer />
    </main>
  )
}
