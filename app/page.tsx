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
import { JsonLd } from "@/components/json-ld";
import { organizationJsonLd } from "@/lib/site";

export default function HomePage() {
  return (
    <main className="relative min-h-screen">
      <JsonLd data={organizationJsonLd} />

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
