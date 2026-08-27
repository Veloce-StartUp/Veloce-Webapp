"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ExternalLink } from "lucide-react";
import type { Project } from "@/lib/projects";

interface ProductCardProps {
  project: Project;
  index?: number;
  isVisible?: boolean;
}

export function ProductCard({
  project,
  index = 0,
  isVisible = true,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = project.icon;

  const handleVisitSite = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (project.url) {
      window.open(project.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Card
      className={`group modern-card-hover relative flex flex-col overflow-hidden border border-gray-800 bg-gray-900/80 backdrop-blur-sm ${
        isVisible ? "animate-scale-in" : "opacity-0"
      }`}
      style={{ animationDelay: `${index * 0.15}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Project Image */}
      <Link
        href={`/products/${project.slug}`}
        className="relative h-48 overflow-hidden block"
      >
        <img
          src={project.image || "/placeholder.svg"}
          alt={project.productName}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-125 group-hover:rotate-2"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

        {/* Status Badge */}
        <Badge
          className={`absolute top-4 right-4 animate-bounce-in ${
            project.status === "Live"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {project.status}
        </Badge>

        {/* Platform Badges */}
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
          {project.platforms.map((platform) => (
            <Badge
              key={platform}
              className="bg-black/70 text-gray-200 border border-white/10 backdrop-blur-sm hover:bg-black/70"
            >
              {platform}
            </Badge>
          ))}
        </div>
      </Link>

      <CardHeader className="relative">
        <div className="flex items-center space-x-4 mb-2">
          <div className="w-10 h-10 shrink-0 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
            <Icon className="h-5 w-5 text-green-400 group-hover:text-green-300 transition-colors" />
          </div>
          <Link href={`/products/${project.slug}`}>
            <CardTitle className="text-xl text-white group-hover:text-green-400 transition-colors">
              {project.productName}
            </CardTitle>
          </Link>
        </div>

        <CardTitle className="text-lg mb-2 text-white group-hover:text-green-400 transition-colors">
          {project.title}
        </CardTitle>
        <CardDescription className="text-gray-400 group-hover:text-gray-300 transition-colors">
          {project.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="mt-auto">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {project.features.slice(0, 5).map((feature, featureIndex) => (
              <Badge
                key={feature}
                variant="secondary"
                className="text-xs bg-gray-800 text-gray-300 group-hover:bg-green-500/30 group-hover:text-green-300 transition-all duration-300"
                style={{ animationDelay: `${featureIndex * 0.1}s` }}
              >
                {feature}
              </Badge>
            ))}
            {project.features.length > 5 && (
              <Badge
                variant="secondary"
                className="text-xs bg-gray-800 text-gray-400"
              >
                +{project.features.length - 5} more
              </Badge>
            )}
          </div>

          <div className="flex gap-2">
            <Link href={`/products/${project.slug}`} className="flex-1">
              <Button className="w-full modern-button-hover bg-green-600 hover:bg-green-700 text-white group-hover:scale-105 transition-all duration-300 z-30">
                View Details
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            {project.url && (
              <Button
                variant="outline"
                aria-label={`Visit ${project.productName} website`}
                className="border-green-500 text-green-400 hover:bg-green-600 hover:text-white bg-transparent group-hover:scale-105 transition-all duration-300 z-30"
                onClick={handleVisitSite}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>

      {isHovered && (
        <div className="absolute inset-0 border-2 border-green-500/60 rounded-lg animate-glow-pulse shadow-lg shadow-green-500/20 pointer-events-none" />
      )}
    </Card>
  );
}
