import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SITE_URL, getOrganizationSchema, getWebSiteSchema } from "@/lib/seo";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#090a0d",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Moon 3D Studio | 3D Game Art & Asset Production",
    template: "%s",
  },
  description:
    "Moon 3D Studio creates professional 3D game assets, vehicle models, hard-surface assets and game-ready artwork for games and digital experiences.",
  keywords: [
    "3D Game Art Studio",
    "Game Art Studio",
    "Game Art Outsourcing",
    "Game Asset Production",
    "3D Game Asset Studio",
    "Game-Ready 3D Assets",
    "3D Vehicle Modeling",
    "Game Vehicle Modeling",
    "3D Vehicle Modeling Studio",
    "Hard Surface 3D Modeling",
    "PBR Texturing",
    "Environment Asset Modeling",
    "3D Asset Optimization",
    "Real-Time Game Assets",
    "Unreal Engine 5",
    "Unity",
    "Moon 3D Studio",
  ],
  authors: [{ name: "Moon 3D Studio", url: SITE_URL }],
  creator: "Moon 3D Studio",
  publisher: "Moon 3D Studio",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "./",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
        alt: "Moon 3D Studio — 3D Game Art & Asset Production",
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
    creator: "@moon3dstudio",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/icon.svg" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgSchema = getOrganizationSchema();
  const websiteSchema = getWebSiteSchema();

  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#090a0d] text-white antialiased selection:bg-[#d4ff00] selection:text-black">
        <Navbar />
        <main id="main-content" className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
