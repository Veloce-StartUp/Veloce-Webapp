"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { featuredProjects, projects } from "@/lib/projects";

/**
 * Widens the first (and, if needed, last) card so a three-column grid never
 * ends with a half-empty row, whatever the number of featured projects.
 */
function isWide(index: number, count: number) {
  const remainder = count % 3;
  if (remainder === 0) return false;
  if (index === 0) return true;
  return remainder === 1 && index === count - 1;
}

export function ProductsSection() {
  return (
    <section id="products" className="relative py-24 md:py-32">
      <div className="container relative z-20 mx-auto px-4">
        <SectionHeading
          title={
            <>
              Our <span className="text-gradient-green">Products</span>
            </>
          }
          description="Innovative software products designed to solve real-world problems and accelerate business growth."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {featuredProjects.map((project, index) => {
            const wide = isWide(index, featuredProjects.length);
            return (
              <ProductCard
                key={project.slug}
                project={project}
                wide={wide}
                className={wide ? "lg:col-span-2" : undefined}
              />
            );
          })}
        </div>

        <div data-reveal className="mt-14 flex justify-center">
          <Link href="/products" className="btn-glass group h-14 px-8">
            View All {projects.length} Projects
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
