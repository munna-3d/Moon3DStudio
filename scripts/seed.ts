import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { PROJECTS } from "../src/data/projects";
import { SERVICES } from "../src/data/services";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // 1. Seed Admin User
  const defaultAdminEmail = process.env.ADMIN_EMAIL || "admin@moon3dstudio.com";
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: defaultAdminEmail },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash("AdminPassword123!", 12);
    const admin = await prisma.adminUser.create({
      data: {
        email: defaultAdminEmail,
        passwordHash,
        name: "Studio Administrator",
        role: "ADMIN",
      },
    });
    console.log(`Created default admin user: ${admin.email} (Password: AdminPassword123!)`);
  } else {
    console.log(`Admin user already exists: ${existingAdmin.email}`);
  }

  // 2. Seed Services
  for (let i = 0; i < SERVICES.length; i++) {
    const s = SERVICES[i];
    const existingService = await prisma.service.findUnique({
      where: { slug: s.id },
    });

    if (!existingService) {
      await prisma.service.create({
        data: {
          id: s.id,
          title: s.title,
          slug: s.id,
          shortDesc: s.shortDesc,
          fullDesc: s.fullDesc,
          iconName: s.iconName,
          highlights: JSON.stringify(s.highlights),
          deliverables: JSON.stringify(s.deliverables),
          published: true,
          sortOrder: i,
          seoTitle: `${s.title} | Moon 3D Studio`,
          seoDescription: s.shortDesc,
        },
      });
      console.log(`Seeded service: ${s.title}`);
    }
  }

  // 3. Seed Projects
  for (let i = 0; i < PROJECTS.length; i++) {
    const p = PROJECTS[i];
    const existingProject = await prisma.project.findUnique({
      where: { slug: p.slug },
    });

    if (!existingProject) {
      const createdProject = await prisma.project.create({
        data: {
          title: p.title,
          slug: p.slug,
          category: p.category,
          categoryLabel: p.categoryLabel,
          shortDescription: p.description,
          description: p.longDescription || p.description,
          heroImage: p.heroImage,
          featured: p.featured,
          published: true,
          sortOrder: i,
          client: p.client || null,
          year: p.year,
          triangleCount: p.triangles,
          textureResolution: p.textureResolution,
          engine: p.engine,
          software: JSON.stringify(p.software),
          services: JSON.stringify(p.services),
          actionText: p.actionText || "EXPLORE MODEL ↗",
          seoTitle: `${p.title} — Game-Ready 3D Asset | Moon 3D Studio`,
          seoDescription: p.description,
        },
      });

      // Seed Project Gallery Images
      for (let gIdx = 0; gIdx < p.gallery.length; gIdx++) {
        const imgUrl = p.gallery[gIdx];
        const isWireframe = imgUrl.includes("wireframe");
        const isHero = imgUrl === p.heroImage;

        await prisma.projectImage.create({
          data: {
            projectId: createdProject.id,
            url: imgUrl,
            altText: `${p.title} ${isWireframe ? "Wireframe" : "Render"} View ${gIdx + 1}`,
            imageType: isHero ? "HERO" : isWireframe ? "WIREFRAME" : "FINAL",
            sortOrder: gIdx,
          },
        });
      }

      console.log(`Seeded project: ${p.title} with ${p.gallery.length} gallery items`);
    }
  }

  console.log("Database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
