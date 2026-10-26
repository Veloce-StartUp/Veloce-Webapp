import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { ProjectDetail } from "@/components/project-detail";
import { getProjectBySlug, projects } from "@/lib/projects";
import { pageMetadata, siteConfig } from "@/lib/site";

interface ProjectPageProps {
  params: { slug: string };
}

/** Every project is known at build time, so anything else is a real 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export function generateMetadata({ params }: ProjectPageProps): Metadata {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  const metadata = pageMetadata({
    title: `${project.productName} — ${project.title}`,
    description: project.description,
    path: `/products/${project.slug}`,
  });

  // Share the project's own screenshot rather than the site-wide card.
  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      images: [{ url: project.image, alt: project.productName }],
    },
    twitter: {
      ...metadata.twitter,
      images: [{ url: project.image, alt: project.productName }],
    },
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
            { "@type": "ListItem", position: 2, name: "Projects", item: `${siteConfig.url}/products` },
            {
              "@type": "ListItem",
              position: 3,
              name: project.productName,
              item: `${siteConfig.url}/products/${project.slug}`,
            },
          ],
        }}
      />
      <ProjectDetail slug={project.slug} />
      <Footer />
    </main>
  );
}
