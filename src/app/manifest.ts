import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Moon 3D Studio",
    short_name: "Moon 3D",
    description:
      "Moon 3D Studio creates professional 3D game assets, vehicle models, hard-surface assets and game-ready artwork.",
    start_url: "/",
    display: "standalone",
    background_color: "#090a0d",
    theme_color: "#090a0d",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
