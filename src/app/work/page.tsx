import type { Metadata } from "next";
import WorkPageClient from "@/components/work/WorkPageClient";
import { SITE_URL, getBreadcrumbSchema } from "@/lib/seo";
import { getPublishedProjects } from "@/lib/cms";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "3D Game Art Portfolio | Moon 3D Studio",
  description:
    "Explore 3D game art, vehicle models, hard-surface assets and game-ready projects created by Moon 3D Studio.",
  alternates: {
    canonical: `${SITE_URL}/work`,
  },
  openGraph: {
    title: "3D Game Art Portfolio | Moon 3D Studio",
    description:
      "Explore 3D game art, vehicle models, hard-surface assets and game-ready projects created by Moon 3D Studio.",
    url: `${SITE_URL}/work`,
    siteName: "Moon 3D Studio",
    images: [
      {
        url: "/hero/hexa-bison-hero.webp",
        width: 1200,
        height: 630,
        alt: "Moon 3D Studio Portfolio Showcase",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "3D Game Art Portfolio | Moon 3D Studio",
    description:
      "Explore 3D game art, vehicle models, hard-surface assets and game-ready projects created by Moon 3D Studio.",
    images: ["/hero/hexa-bison-hero.webp"],
  },
};

export default async function WorkPage() {
  const projects = await getPublishedProjects();

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Work", url: "/work" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <WorkPageClient initialProjects={projects} />
    </>
  );
}
