import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import StatementSection from "@/components/home/StatementSection";
import SelectedWorkSection from "@/components/home/SelectedWorkSection";
import ServicesSection from "@/components/home/ServicesSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import WhyUsSection from "@/components/home/WhyUsSection";
import StudioFounderSection from "@/components/home/StudioFounderSection";
import ContactSection from "@/components/home/ContactSection";
import { SITE_URL } from "@/lib/seo";
import { getPublishedProjects, getPublishedServices } from "@/lib/cms";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Moon 3D Studio | 3D Game Art & Asset Production",
  description:
    "Moon 3D Studio creates professional 3D game assets, vehicle models, hard-surface assets and game-ready artwork for games and digital experiences.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Moon 3D Studio | 3D Game Art & Asset Production",
    description:
      "Moon 3D Studio creates professional 3D game assets, vehicle models, hard-surface assets and game-ready artwork for games and digital experiences.",
    url: SITE_URL,
    siteName: "Moon 3D Studio",
    images: [
      {
        url: "/hero/hexa-bison-hero.webp",
        width: 1200,
        height: 630,
        alt: "Moon 3D Studio Flagship Artwork — HEXA BISON VX-2.0",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Moon 3D Studio | 3D Game Art & Asset Production",
    description:
      "Moon 3D Studio creates professional 3D game assets, vehicle models, hard-surface assets and game-ready artwork for games and digital experiences.",
    images: ["/hero/hexa-bison-hero.webp"],
  },
};

export default async function Home() {
  const [projects, services] = await Promise.all([
    getPublishedProjects(),
    getPublishedServices(),
  ]);

  const featuredProject = projects.find((p) => p.featured) || projects[0];

  return (
    <>
      <HeroSection featuredProject={featuredProject} />
      <StatementSection />
      <SelectedWorkSection projects={projects} />
      <ServicesSection services={services} />
      <HowItWorksSection />
      <WhyUsSection />
      <StudioFounderSection />
      <ContactSection />
    </>
  );
}
