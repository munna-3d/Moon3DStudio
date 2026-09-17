import React from "react";
import ContactSection from "@/components/home/ContactSection";
import { SITE_URL, getBreadcrumbSchema } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Start a 3D Game Art Project | Moon 3D Studio",
  description:
    "Have a 3D game-art project in mind? Contact Moon 3D Studio to discuss modeling, vehicles, hard-surface assets, texturing and game-ready production.",
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
  openGraph: {
    title: "Start a 3D Game Art Project | Moon 3D Studio",
    description:
      "Have a 3D game-art project in mind? Contact Moon 3D Studio to discuss modeling, vehicles, hard-surface assets, texturing and game-ready production.",
    url: `${SITE_URL}/contact`,
    siteName: "Moon 3D Studio",
    images: [
      {
        url: "/hero/hexa-bison-hero.webp",
        width: 1200,
        height: 630,
        alt: "Start a 3D Project with Moon 3D Studio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Start a 3D Game Art Project | Moon 3D Studio",
    description:
      "Have a 3D game-art project in mind? Contact Moon 3D Studio to discuss modeling, vehicles, hard-surface assets, texturing and game-ready production.",
    images: ["/hero/hexa-bison-hero.webp"],
  },
};

export default function ContactPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Contact", url: "/contact" },
  ]);

  return (
    <div className="pt-16 bg-[#090a0d] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ContactSection isPage={true} />
    </div>
  );
}
