import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";
import { siteConfig } from "@/lib/site";

const pages: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/services", priority: 0.9 },
  { path: "/products", priority: 0.9 },
  { path: "/contact", priority: 0.8 },
  { path: "/timeline", priority: 0.6 },
  { path: "/team", priority: 0.6 },
  { path: "/privacy-policy", priority: 0.2 },
  { path: "/terms-of-service", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...pages.map((page) => ({ url: `${siteConfig.url}${page.path}`, priority: page.priority })),
    ...projects.map((project) => ({
      url: `${siteConfig.url}/products/${project.slug}`,
      priority: 0.7,
    })),
  ];
}
