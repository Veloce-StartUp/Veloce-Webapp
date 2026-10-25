import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { ProjectDetail } from "@/components/project-detail";
import { getProjectBySlug, projects } from "@/lib/projects";

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

  return {
    title: `${project.productName} — ${project.title}`,
    description: project.description,
    alternates: {
      canonical: `/products/${project.slug}`,
    },
    openGraph: {
      title: `${project.productName} — ${project.title}`,
      description: project.description,
      url: `/products/${project.slug}`,
      images: [{ url: project.image, alt: project.productName }],
      type: "article",
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
      <ProjectDetail slug={project.slug} />
      <Footer />
    </main>
  );
}
