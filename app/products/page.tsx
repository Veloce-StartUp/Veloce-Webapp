import type { Metadata } from "next";
import { AllProductsSection } from "@/components/all-products-section";
import { Footer } from "@/components/footer";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Projects & Products",
  description:
    "Explore the platforms, products and systems built by Veloce Technology: membership platforms, event registration and awards judging systems, e-commerce, property management and corporate websites.",
  path: "/products",
});

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
