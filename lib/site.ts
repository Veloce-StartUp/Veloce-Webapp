import type { Metadata } from "next";
import { socialProfiles } from "@/lib/social";

/** Veloce's public identity: one source for page metadata, the sitemap and structured data. */
export const siteConfig = {
  name: "Veloce Technology",
  shortName: "Veloce",
  legalName: "Veloce Technology (PVT) Limited",
  url: "https://veloce-technology.com",
  title: "Veloce Technology | Software Development Company in Sri Lanka",
  description:
    "Veloce Technology is a software development company in Sri Lanka building custom web and mobile apps, cloud and AI solutions, and event and awards platforms.",
  email: "build.veloce@gmail.com",
  telephone: "+94768794004",
  /** Dark mark on a light background, as Google shows logos on white. */
  logo: "/apple-touch-icon.png",
  /** What Veloce builds, for search engines' understanding of the company. */
  expertise: [
    "Software development",
    "Custom software development",
    "Web application development",
    "Mobile app development",
    "Cloud solutions",
    "DevOps",
    "Data engineering",
    "Artificial intelligence",
    "Business automation",
    "Cybersecurity",
    "Event registration systems",
    "Awards judging platforms",
    "Membership management platforms",
    "Next.js",
    "React",
    "React Native",
    "Flutter",
    "Node.js",
    "Java",
    "Python",
  ],
};

/**
 * The preview card drawn by app/opengraph-image.tsx. Next.js only attaches it to pages that leave
 * openGraph alone, so pages with their own openGraph list it again.
 */
export const shareImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Veloce Technology, a software development company in Sri Lanka",
};

interface PageMetadataOptions {
  title: string;
  description: string;
  /** Path from the site root, e.g. "/services". */
  path: string;
}

/**
 * Title, description, canonical URL and social tags for one page. Each page needs its own
 * canonical, or it inherits the home page's and search engines treat it as a duplicate.
 */
export function pageMetadata({ title, description, path }: PageMetadataOptions): Metadata {
  const socialTitle = `${title} | ${siteConfig.name}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: socialTitle,
      description,
      url: path,
      siteName: siteConfig.name,
      locale: "en_US",
      type: "website",
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [shareImage],
    },
  };
}

/** schema.org description of the company and the website, for the home page. */
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      alternateName: siteConfig.shortName,
      legalName: siteConfig.legalName,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}${siteConfig.logo}`,
        width: 180,
        height: 180,
      },
      description: siteConfig.description,
      email: siteConfig.email,
      telephone: siteConfig.telephone,
      address: {
        "@type": "PostalAddress",
        addressCountry: "LK",
      },
      areaServed: "Worldwide",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: siteConfig.telephone,
        email: siteConfig.email,
        contactType: "sales",
        availableLanguage: ["English"],
      },
      knowsAbout: siteConfig.expertise,
      sameAs: socialProfiles.map((profile) => profile.href),
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      name: siteConfig.name,
      alternateName: [siteConfig.shortName, "Veloce Tech"],
      url: siteConfig.url,
      publisher: { "@id": `${siteConfig.url}/#organization` },
      inLanguage: "en",
    },
  ],
};
