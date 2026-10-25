import type { Metadata } from "next";
import { AllProductsSection } from "@/components/all-products-section";
import { Footer } from "@/components/footer";

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
    <main className="relative min-h-screen overflow-hidden">
      <div className="pt-20">
        <AllProductsSection />
      </div>
      <Footer />
    </main>
  );
}
