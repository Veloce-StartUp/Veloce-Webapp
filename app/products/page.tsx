import type { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { AllProductsSection } from "@/components/all-products-section";
import { Footer } from "@/components/footer";
import { InteractiveBackground } from "@/components/interactive-background";
import { ScrollToTop } from "@/components/scroll-to-top";

export const metadata: Metadata = {
  title: "Projects & Products",
  description:
    "Explore the platforms, products and systems built by Veloce — membership platforms, event and awards systems, e-commerce, property management and corporate websites.",
  alternates: {
    canonical: "/products",
  },
};

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      <InteractiveBackground />
      <Navigation />
      <div className="pt-20">
        <AllProductsSection />
      </div>
      <Footer />
      <ScrollToTop />
    </main>
  );
}
