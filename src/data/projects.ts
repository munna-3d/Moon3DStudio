export type Project = {
  title: string;
  slug: string;
  category: "VEHICLES" | "HARD SURFACE" | "ENVIRONMENT" | "OTHER";
  categoryLabel: string;
  description: string;
  longDescription?: string;
  heroImage: string;
  gallery: string[];
  services: string[];
  client?: string;
  year: string;
  triangles: string;
  textureResolution: string;
  engine: string;
  software: string[];
  featured: boolean;
  actionText?: string;
};

export const PROJECTS: Project[] = [
  {
    title: "HEXA BISON VX-2.0",
    slug: "hexa-bison-vx2",
    category: "VEHICLES",
    categoryLabel: "VEHICLE",
    description: "High-performance off-road rally prototype featuring carbon-fiber widebody aero, reinforced beadlock wheels, and competition suspension.",
    longDescription: "The HEXA BISON VX-2.0 is a bespoke heavy-duty off-road racing platform engineered for extreme endurance rallies. Modeled with authentic mechanical kinematics, featuring custom carbon-composite fender flares, roof aerodynamic scoops, auxiliary LED rally arrays, beadlock competition wheels, and high-density quad topology ready for real-time engines.",
    heroImage: "/hero/hexa-bison-hero.webp",
    gallery: [
      "/hero/hexa-bison-hero.webp",
      "/projects/hexa-bison/hexa-bison-top.png",
      "/projects/hexa-bison/hexa-bison-rear.png",
      "/projects/hexa-bison/hexa-bison-wireframe.webp"
    ],
    services: ["Concept Design", "Sub-D High-Poly Modeling", "Game-Ready Retopology", "4K PBR Texturing", "Rally Livery Design"],
    client: "Moon 3D Studio Original",
    year: "2026",
    triangles: "165,000 Tris",
    textureResolution: "4K PBR Texture Sets",
    engine: "Unreal Engine 5 (Nanite & Lumen ready)",
    software: ["Blender", "Substance 3D Painter", "Unreal Engine 5"],
    featured: true,
    actionText: "EXPLORE MODEL ↗"
  },
  {
    title: "ATAV-7 TAC-ROVER",
    slug: "atav-7-tac-rover",
    category: "VEHICLES",
    categoryLabel: "VEHICLE",
    description: "Futuristic 6x6 all-terrain tactical reconnaissance vehicle with modular armor plating and roof-mounted surveillance optics.",
    longDescription: "A military-spec all-terrain platform designed for hostile planet exploration. Built with modular armor plating panels, independent suspension dampers, rugged run-flat tires, and calibrated for physics-driven vehicle rigs in Unreal Engine 5.",
    heroImage: "/projects/atav-7-rover.jpg",
    gallery: [
      "/projects/atav-7-rover.jpg",
      "/projects/atav-7-action.jpg"
    ],
    services: ["Hard-Surface Modeling", "UV Unwrapping", "Weathered PBR Texturing", "LOD Generation"],
    client: "Sci-Fi Tactical Shooter",
    year: "2026",
    triangles: "142,000 Tris",
    textureResolution: "3x 4K PBR Sets",
    engine: "Unreal Engine 5 / Unity HDRP",
    software: ["Blender", "ZBrush", "Substance 3D Painter"],
    featured: true,
    actionText: "EXPLORE MODEL ↗"
  },
  {
    title: "B-40 CYCLONE HEAVY RAILGUN",
    slug: "b-40-cyclone-railgun",
    category: "HARD SURFACE",
    categoryLabel: "HARD SURFACE",
    description: "Heavy electromagnetic defense turret engineered with dual accelerator rails, internal cooling vents, and hydraulic recoil dampeners.",
    longDescription: "Designed for orbital defense installations and heavy combat vessels. Features twin electromagnetic accelerators, exposed pneumatic actuation lines, modular ammunition magazines, and dynamic emissive power state channels.",
    heroImage: "/projects/b40-railgun.jpg",
    gallery: [
      "/projects/b40-railgun.jpg"
    ],
    services: ["Hard-Surface Concepting", "Sub-D Modeling", "Baking & Texturing", "Animation Prep"],
    client: "Space Combat Simulator",
    year: "2025",
    triangles: "98,000 Tris",
    textureResolution: "2x 4K PBR Sets",
    engine: "Unreal Engine 5",
    software: ["Fusion 360", "Blender", "Marmoset Toolbag", "Substance 3D Painter"],
    featured: true,
    actionText: "EXPLORE MODEL ↗"
  },
  {
    title: "ORBITAL DOCK G-04 CRANE",
    slug: "orbital-dock-crane",
    category: "ENVIRONMENT",
    categoryLabel: "ENVIRONMENT",
    description: "Massive articulated shipyard crane equipped with magnetic grapple system, steel truss lattice boom, and industrial safety livery.",
    longDescription: "A centerpiece architectural prop for space drydock environments. Incorporates modular truss geometry, high-capacity hydraulic pistons, cable rigging, and weathered industrial steel shaders with realistic edge wear and oxidation.",
    heroImage: "/projects/orbital-dock-crane.jpg",
    gallery: [
      "/projects/orbital-dock-crane.jpg"
    ],
    services: ["Environment Art", "Modular Asset Design", "Trim Sheet Creation", "LOD Pipeline"],
    client: "Orbital Station Simulation",
    year: "2025",
    triangles: "125,000 Tris",
    textureResolution: "Modular Trim Sheet + 2x 4K PBR",
    engine: "Unreal Engine 5 (Lumen)",
    software: ["Maya", "Substance 3D Designer", "Substance 3D Painter", "UE5"],
    featured: true,
    actionText: "Technical Details +"
  },
  {
    title: "TITAN ARMORED TRANSPORTER",
    slug: "titan-armored-transporter",
    category: "VEHICLES",
    categoryLabel: "VEHICLE",
    description: "6x6 heavy armored personnel carrier featuring blast-resistant V-hull architecture and remote rooftop gun emplacement.",
    longDescription: "Engineered to survive extreme ballistic threats. Built with high-tensile composite armor, reinforced bulletproof vision ports, rear troop deployment ramp, and fully unwrapped for clean game engine baking.",
    heroImage: "/projects/titan-armored-transporter.jpg",
    gallery: [
      "/projects/titan-armored-transporter.jpg"
    ],
    services: ["High & Low Poly Modeling", "Baking", "PBR Material Creation", "Rigging Preparation"],
    client: "Military Sim Studio",
    year: "2025",
    triangles: "160,000 Tris",
    textureResolution: "4x 4K PBR Sets",
    engine: "Unreal Engine 5 / Unity",
    software: ["Blender", "Substance 3D Painter", "Photoshop"],
    featured: true,
    actionText: "Technical Details +"
  },
  {
    title: "GLS-ORBITAL GANTRY RIG-X",
    slug: "gls-orbital-gantry-rig",
    category: "HARD SURFACE",
    categoryLabel: "HARD SURFACE",
    description: "Deep-space vessel fabrication and maintenance cradle featuring automated welding manipulators and industrial power couplings.",
    longDescription: "A complex orbital engineering installation designed for cinematic scale. Boasts precision scaffolding, robotic laser-welding gantries, illuminated warning beacons, and optimized draw-call hierarchy.",
    heroImage: "/projects/gls-orbital-gantry.jpg",
    gallery: [
      "/projects/gls-orbital-gantry.jpg"
    ],
    services: ["Complex Hard-Surface Modeling", "Decal Sheet Design", "Lighting & Emissives", "Engine Optimization"],
    client: "AAA Sci-Fi Action RPG",
    year: "2025",
    triangles: "210,000 Tris",
    textureResolution: "Tileable PBR + 4K Detail Decals",
    engine: "Unreal Engine 5",
    software: ["Blender", "ZBrush", "Substance 3D Painter", "UE5"],
    featured: true,
    actionText: "Technical Details +"
  }
];

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
