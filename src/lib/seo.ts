/**
 * SEO Constants and Structured Data Generators for Moon 3D Studio
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://moon3dstudio.com";

export const SITE_NAME = "Moon 3D Studio";

export const SOCIAL_LINKS = {
  artstation: "https://www.artstation.com",
  linkedin: "https://www.linkedin.com",
  instagram: "https://www.instagram.com",
  email: "contact@moon3dstudio.com",
};

/**
 * Global Organization Schema (JSON-LD)
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/icon.svg`,
      width: "512",
      height: "512",
    },
    description:
      "Moon 3D Studio is a professional 3D game art and asset production studio specializing in vehicle modeling, hard-surface assets, texturing, and game-ready 3D art.",
    founder: {
      "@type": "Person",
      name: "Munna Ahmed",
      jobTitle: "Founder & Lead 3D Artist",
    },
    sameAs: [
      SOCIAL_LINKS.artstation,
      SOCIAL_LINKS.linkedin,
      SOCIAL_LINKS.instagram,
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: SOCIAL_LINKS.email,
      availableLanguage: ["English"],
    },
  };
}

/**
 * Global WebSite Schema (JSON-LD)
 */
export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    description:
      "Professional 3D game assets, vehicle models, hard-surface assets and game-ready artwork for games and digital experiences.",
  };
}

/**
 * BreadcrumbList Schema Generator
 */
export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * Service Schema Generator
 */
export function getServicesSchema(
  services: { id: string; title: string; fullDesc: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/services#service`,
    name: "Moon 3D Studio 3D Game Art Services",
    url: `${SITE_URL}/services`,
    provider: {
      "@id": `${SITE_URL}/#organization`,
    },
    description:
      "Professional 3D modeling, vehicle modeling, hard-surface assets, texturing and game-ready asset production.",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "3D Asset Production Services",
      itemListElement: services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.title,
          description: service.fullDesc,
        },
      })),
    },
  };
}

/**
 * CreativeWork / VisualArtwork Schema for 3D Project Case Studies
 */
export function getProjectSchema(project: {
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  heroImage: string;
  categoryLabel: string;
  year: string;
  software: string[];
}) {
  const imageUrl = project.heroImage.startsWith("http")
    ? project.heroImage
    : `${SITE_URL}${project.heroImage}`;

  return {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    "@id": `${SITE_URL}/work/${project.slug}#artwork`,
    name: project.title,
    headline: project.title,
    description: project.longDescription || project.description,
    image: imageUrl,
    url: `${SITE_URL}/work/${project.slug}`,
    artform: "3D Digital Art",
    artMedium: project.software.join(", "),
    dateCreated: project.year,
    creator: {
      "@id": `${SITE_URL}/#organization`,
    },
    genre: project.categoryLabel,
  };
}
