import { Navigation } from "@/components/navigation";
import { FeaturesSection } from "@/components/features-section";
import { ServicesSection } from "@/components/services-section";
import { ProductsSection } from "@/components/products-section";
import { TimelineSection } from "@/components/timeline-section";
import { TeamSection } from "@/components/team-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { ScrollToTop } from "@/components/scroll-to-top";
import { Hero } from "@/components/ui/hero-1";
import Testimonials from "@/components/testimonials";
import WaveSection from "@/components/WaveSection";
import { ClientsSection } from "@/components/clients-section";
import Script from "next/script";

// Structured data for SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Veloce",
  url: "https://veloce-technology.com",
  logo: "/Veloce-Logo_White.png",
  description:
    "Veloce designs and develops cutting-edge software solutions that empower businesses to grow, scale, and lead the future.",
  address: {
    "@type": "PostalAddress",
    // Add your company address here
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+94 (76) 879-4004",
    contactType: "customer service",
  },
  sameAs: [
    // Add your social media profiles
  ],
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black relative">
      {/* Add JSON-LD structured data */}
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navigation />
      <Hero
        title="Build smarter tools for modern teams"
        subtitle="At VELOCE, we design and develop innovative software solutions that empower businesses to grow, scale, and lead the future."
        eyebrow="Build Tomorrow, Today."
        ctaLabel="Get Started"
        ctaHref="#contact"
      />
      <ClientsSection />
      <FeaturesSection />
      <WaveSection />
      <ServicesSection />
      <ProductsSection />
      <TimelineSection />
      <TeamSection />
      {/* <Testimonials /> */}
      <ContactSection />
      <Footer />
      <ScrollToTop />
    </main>
  );
}
