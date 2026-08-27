"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { projectCategories, projects } from "@/lib/projects";

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
    <section id="all-products" className="py-20 bg-black relative">
      <div className="container mx-auto px-4 relative z-20">
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance text-white">
            Our <span className="text-green-400">Projects</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto text-pretty">
            Every platform, product and system we have designed, built and
            shipped for our clients — from membership platforms and event
            systems to property management.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {projectCategories.map((category) => {
            const isActive = category === activeCategory;
            const count =
              category === "All"
                ? projects.length
                : projects.filter((project) => project.category === category)
                    .length;

            return (
              <Button
                key={category}
                variant="outline"
                size="sm"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-green-600 border-green-500 text-white hover:bg-green-700 hover:text-white"
                    : "bg-transparent border-gray-800 text-gray-400 hover:border-green-500/60 hover:text-green-400 hover:bg-green-500/10"
                }`}
              >
                {category}
                <span
                  className={`ml-2 text-xs ${isActive ? "text-white/80" : "text-gray-600"}`}
                >
                  {count}
                </span>
              </Button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleProjects.map((project, index) => (
            <ProductCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
