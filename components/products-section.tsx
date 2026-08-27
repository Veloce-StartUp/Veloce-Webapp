"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { featuredProjects, projects } from "@/lib/projects";

export function ProductsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="products" className="py-20 bg-black relative">
      <div className="container mx-auto px-4 relative z-20">
        <div
          className={`text-center mb-16 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance text-white">
            Our <span className="text-green-400">Products</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto text-pretty">
            Innovative software products designed to solve real-world problems
            and accelerate business growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-20">
          {featuredProjects.map((project, index) => (
            <ProductCard
              key={project.slug}
              project={project}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>

        <div
          className={`text-center mt-12 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
          style={{ animationDelay: "0.8s" }}
        >
          <Link href="/products">
            <Button
              size="lg"
              variant="outline"
              className="group modern-button-hover border-green-500 text-green-400 hover:bg-green-600 hover:text-white bg-transparent hover:scale-105 transition-all duration-300"
            >
              View All {projects.length} Projects
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
