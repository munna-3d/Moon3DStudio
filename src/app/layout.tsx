import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://moon3dstudio.com"),
  title: "Moon 3D Studio — 3D Game Art & Asset Production",
  description:
    "Moon 3D Studio creates professional 3D models, game-ready assets, vehicles, hard-surface models and textures for games and digital experiences.",
  keywords: [
    "3D Studio",
    "Game Art",
    "Vehicle Modeling",
    "Hard Surface",
    "Unreal Engine 5",
    "Unity",
    "Game Ready Assets",
    "PBR Texturing",
  ],
  authors: [{ name: "Moon 3D Studio" }],
  openGraph: {
    title: "Moon 3D Studio — 3D Game Art & Asset Production",
    description:
      "High-end 3D modeling, texturing, vehicles and real-time game asset production.",
    url: "https://moon3dstudio.com",
    siteName: "Moon 3D Studio",
    images: [
      {
        url: "/hero/hexa-bison-hero.webp",
        width: 1200,
        height: 630,
        alt: "Moon 3D Studio Flagship Artwork",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Moon 3D Studio — 3D Game Art & Asset Production",
    description:
      "High-end 3D modeling, texturing, vehicles and real-time game asset production.",
    images: ["/hero/hexa-bison-hero.webp"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col bg-[#090a0d] text-white antialiased selection:bg-[#d4ff00] selection:text-black">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
