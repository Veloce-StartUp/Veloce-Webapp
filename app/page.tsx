import { Navigation } from "@/components/navigation"
import { FeaturesSection } from "@/components/features-section"
import { ServicesSection } from "@/components/services-section"
import { ProductsSection } from "@/components/products-section"
import { TimelineSection } from "@/components/timeline-section"
import { TeamSection } from "@/components/team-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Hero } from "@/components/ui/hero-1"
import Testimonials from "@/components/testimonials";
import WaveSection from "@/components/WaveSection";

export default function HomePage() {
    return (
        <main className="min-h-screen bg-black relative">
            <Navigation />
            <Hero
                title="Build smarter tools for modern teams"
                subtitle="Streamline your workflow and boost productivity with intuitive solutions. Security, speed, and simplicity—all in one platform."
                eyebrow="Next-Gen Productivity"
                ctaLabel="Get Started"
                ctaHref="#"
            />
            <FeaturesSection />
            <WaveSection />
            <ServicesSection />
            <ProductsSection />
            <TimelineSection />
            <TeamSection />
            <Testimonials />
            <ContactSection />
            <Footer />
            <ScrollToTop />
        </main>
    )
}