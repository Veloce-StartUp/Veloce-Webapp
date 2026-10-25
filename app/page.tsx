import { FeaturesSection } from "@/components/features-section";
import { ServicesSection } from "@/components/services-section";
import { ProductsSection } from "@/components/products-section";
import { TimelineSection } from "@/components/timeline-section";
import { TeamSection } from "@/components/team-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/ui/hero-1";
import Testimonials from "@/components/testimonials";
import WaveSection from "@/components/WaveSection";
import { ClientsSection } from "@/components/clients-section";
import { RecognitionSection } from "@/components/recognition-section";
import { JudgingPortalSection } from "@/components/judging-portal-section";
import { RegistrationSection } from "@/components/registration-section";
import { Chapter } from "@/components/chapters/chapter";
import Script from "next/script";
import { socialProfiles } from "@/lib/social";

// Structured data for SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Veloce",
  url: "https://veloce-technology.com",
  logo: "/Veloce-Logo_White-Without-Name.png",
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
  sameAs: socialProfiles.map((profile) => profile.href),
};

export default function HomePage() {
  return (
    <main className="relative min-h-screen">
      {/* Add JSON-LD structured data */}
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Chapter label="Veloce">
        <Hero
          title="Build smarter tools for modern teams"
          highlight="smarter tools"
          subtitle="At VELOCE, we design and develop innovative software solutions that empower businesses to grow, scale, and lead the future."
          eyebrow="Build Tomorrow, Today."
          ctaLabel="Get Started"
          ctaHref="#contact"
        />
      </Chapter>
      <Chapter label="Partners">
        <ClientsSection />
        <RecognitionSection />
      </Chapter>
      <Chapter label="Why Veloce">
        <FeaturesSection />
        <WaveSection />
      </Chapter>
      <Chapter label="Services">
        <ServicesSection />
      </Chapter>
      <Chapter label="Solutions">
        <JudgingPortalSection />
        <RegistrationSection />
      </Chapter>
      <Chapter label="Products">
        <ProductsSection />
      </Chapter>
      <Chapter label="Process">
        <TimelineSection />
      </Chapter>
      <Chapter label="Team">
        <TeamSection />
      </Chapter>
      {/* <Testimonials /> */}
      <Chapter label="Contact">
        <ContactSection />
      </Chapter>
      <Footer />
    </main>
  );
}
