export type Service = {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: "box" | "gamepad" | "car" | "shield" | "sparkles" | "layers";
  highlights: string[];
  deliverables: string[];
};

export const SERVICES: Service[] = [
  {
    id: "3d-modeling",
    title: "3D MODELING",
    shortDesc: "High-quality detailed 3D models for games, commercial and digital experiences.",
    fullDesc: "From initial concept silhouette to pristine geometry, we craft high-resolution and low-poly 3D models tailored for real-time engines, cinematics, and interactive presentations.",
    iconName: "box",
    highlights: ["Sub-D & Hard Surface Precision", "Clean Edge Flow & Topology", "Zero Shading Artifacts", "Custom Concept Modeling"],
    deliverables: [".FBX / .OBJ source files", "Clean Non-destructive UVs", "High-Poly & Low-Poly meshes"]
  },
  {
    id: "game-ready-assets",
    title: "GAME-READY ASSETS",
    shortDesc: "We produce optimized 3D assets for real-time engines and games.",
    fullDesc: "Production-ready game meshes engineered to meet strict draw-call, polygon budget, and memory requirements while delivering maximum visual impact in engine.",
    iconName: "gamepad",
    highlights: ["Target Triangle Count Optimization", "Custom Collision Meshes (UCX)", "Automated & Hand-Crafted LODs", "Socket & Pivot Setup"],
    deliverables: ["Engine-ready asset packages", "LOD0 - LOD4 Meshes", "Custom collision hulls", "Material instances"]
  },
  {
    id: "vehicles",
    title: "VEHICLES",
    shortDesc: "Cars, trucks, military and custom modern vehicles.",
    fullDesc: "Specialized vehicle modeling covering hypercars, tactical armored units, futuristic haulers, and tracked platforms with complete interior, mechanical and exterior detail.",
    iconName: "car",
    highlights: ["Photorealistic Body Panels & Aero", "Exposed Powertrains & Exhausts", "Suspension, Steering & Wheel Hierarchy", "Separated Movable Components"],
    deliverables: ["Hierarchical rigged vehicle mesh", "Separate glass, calipers, interior elements", "4K PBR Liveries"]
  },
  {
    id: "hard-surface-assets",
    title: "HARD-SURFACE ASSETS",
    shortDesc: "Mechanical, industrial, and complex sci-fi assets.",
    fullDesc: "Complex industrial machinery, heavy weaponry, robotic structures, and sci-fi hardware modeled with authentic mechanical functionality and believable proportions.",
    iconName: "shield",
    highlights: ["Functional Mechanical Kinematics", "Intricate Panel Lines & Bevels", "Hydraulics, Pistons & Fasteners", "PBR Decal Integration"],
    deliverables: ["Modular mechanical sub-assemblies", "Bake-ready cage and meshes", "PBR material maps"]
  },
  {
    id: "texturing",
    title: "TEXTURING",
    shortDesc: "Detailed PBR materials and realistic surface maps.",
    fullDesc: "Industry-standard Physically Based Rendering (PBR) metallic/roughness material creation. We capture realistic micro-scratches, edge wear, heat oxidation, and grime without muddying detail.",
    iconName: "sparkles",
    highlights: ["Authentic Material Response (PBR)", "Custom Roughness Variation & Dirt", "Heat Staining & Edge Wear", "Multi-UDIM / Trim Sheet Workflows"],
    deliverables: ["Albedo / Base Color", "ORM (Occlusion, Roughness, Metallic)", "Normal Map (DirectX / OpenGL)", "Emissive & Mask Maps"]
  },
  {
    id: "environment-assets",
    title: "ENVIRONMENT ASSETS",
    shortDesc: "Modular and stand-alone assets for virtual worlds.",
    fullDesc: "Modular architectural kits, industrial gantry rigs, space dock structures, and environmental hero props designed for seamless world-building and level design.",
    iconName: "layers",
    highlights: ["Modular Grid Snapping Compatibility", "Weighted Normal Workflows", "Shared Trim Sheet Optimization", "Lumen & Virtual Shadow Maps"],
    deliverables: ["Modular asset kit libraries", "Trim sheet textures", "Decal sets", "Unreal Engine project migration files"]
  }
];
