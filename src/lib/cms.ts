import prisma from "@/lib/prisma";
import { PROJECTS as STATIC_PROJECTS, Project } from "@/data/projects";
import { SERVICES as STATIC_SERVICES, Service } from "@/data/services";

/**
 * Fetch all published projects from database with static fallback
 */
export async function getPublishedProjects(): Promise<Project[]> {
  try {
    const dbProjects = await prisma.project.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (dbProjects && dbProjects.length > 0) {
      return dbProjects.map((p) => {
        let sw: string[] = [];
        let srv: string[] = [];
        try {
          sw = JSON.parse(p.software);
        } catch {
          sw = [p.software];
        }
        try {
          srv = JSON.parse(p.services);
        } catch {
          srv = [p.services];
        }

        const galleryUrls =
          p.images && p.images.length > 0
            ? p.images.map((img) => img.url)
            : [p.heroImage];

        return {
          title: p.title,
          slug: p.slug,
          category: p.category as Project["category"],
          categoryLabel: p.categoryLabel,
          description: p.shortDescription,
          longDescription: p.description,
          heroImage: p.heroImage,
          gallery: galleryUrls,
          services: srv,
          client: p.client || undefined,
          year: p.year,
          triangles: p.triangleCount || "N/A",
          textureResolution: p.textureResolution || "4K PBR",
          engine: p.engine || "Unreal Engine 5",
          software: sw,
          featured: p.featured,
          actionText: p.actionText || "EXPLORE MODEL ↗",
        };
      });
    }
  } catch (err) {
    console.warn("[CMS Data Fallback] Could not query database projects, using fallback data:", err);
  }

  return STATIC_PROJECTS;
}

/**
 * Fetch single published project by slug with static fallback
 */
export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  try {
    const p = await prisma.project.findUnique({
      where: { slug },
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (p && p.published) {
      let sw: string[] = [];
      let srv: string[] = [];
      try {
        sw = JSON.parse(p.software);
      } catch {
        sw = [p.software];
      }
      try {
        srv = JSON.parse(p.services);
      } catch {
        srv = [p.services];
      }

      const galleryUrls =
        p.images && p.images.length > 0
          ? p.images.map((img) => img.url)
          : [p.heroImage];

      return {
        title: p.title,
        slug: p.slug,
        category: p.category as Project["category"],
        categoryLabel: p.categoryLabel,
        description: p.shortDescription,
        longDescription: p.description,
        heroImage: p.heroImage,
        gallery: galleryUrls,
        services: srv,
        client: p.client || undefined,
        year: p.year,
        triangles: p.triangleCount || "N/A",
        textureResolution: p.textureResolution || "4K PBR",
        engine: p.engine || "Unreal Engine 5",
        software: sw,
        featured: p.featured,
        actionText: p.actionText || "EXPLORE MODEL ↗",
      };
    }
  } catch (err) {
    console.warn("[CMS Data Fallback] Could not query database for slug:", slug, err);
  }

  return STATIC_PROJECTS.find((proj) => proj.slug === slug);
}

/**
 * Fetch all published services with static fallback
 */
export async function getPublishedServices(): Promise<Service[]> {
  try {
    const dbServices = await prisma.service.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
    });

    if (dbServices && dbServices.length > 0) {
      return dbServices.map((s) => {
        let hl: string[] = [];
        let del: string[] = [];
        try {
          hl = JSON.parse(s.highlights);
        } catch {
          hl = [];
        }
        try {
          del = JSON.parse(s.deliverables);
        } catch {
          del = [];
        }

        return {
          id: s.id,
          title: s.title,
          shortDesc: s.shortDesc,
          fullDesc: s.fullDesc,
          iconName: s.iconName as Service["iconName"],
          highlights: hl,
          deliverables: del,
        };
      });
    }
  } catch (err) {
    console.warn("[CMS Data Fallback] Could not query database services, using fallback data:", err);
  }

  return STATIC_SERVICES;
}
