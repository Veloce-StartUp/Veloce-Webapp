"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { projectCategories, projects } from "@/lib/projects";
import { cn } from "@/lib/utils";

export function AllProductsSection() {
  const [activeCategory, setActiveCategory] = useState("All");

  const visibleProjects = useMemo(
    () =>
      activeCategory === "All"
        ? projects
        : projects.filter((project) => project.category === activeCategory),
    [activeCategory],
  );

  return (
    <section id="all-products" className="relative py-20">
      <div className="container relative z-20 mx-auto px-4">
        <SectionHeading
          as="h1"
          title={
            <>
              Our <span className="text-gradient-green">Projects</span>
            </>
          }
          description="Every platform, product and system we have designed, built and shipped for our clients — from membership platforms and event systems to property management."
          className="mb-12 md:mb-14"
        />

        {/* Category filter */}
        <div data-reveal className="mb-12 flex justify-center">
          <div className="glass flex flex-wrap justify-center gap-1 rounded-3xl p-1.5 sm:rounded-full">
            {projectCategories.map((category) => {
              const isActive = category === activeCategory;
              const count =
                category === "All"
                  ? projects.length
                  : projects.filter((project) => project.category === category).length;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  aria-pressed={isActive}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm transition-all duration-300",
                    isActive
                      ? "bg-green-600 text-white shadow-[0_8px_24px_-10px_rgba(34,197,94,0.9)]"
                      : "text-gray-300 hover:bg-white/[0.06] hover:text-green-300",
                  )}
                >
                  {category}
                  <span className={cn("ml-2 text-xs", isActive ? "text-white/80" : "text-gray-500")}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {visibleProjects.map((project) => (
            <ProductCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
