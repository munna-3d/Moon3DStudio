import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth";
import { projectSchema } from "@/lib/validations";

export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validation = projectSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues?.[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Check slug uniqueness
    const existing = await prisma.project.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Project slug "${data.slug}" is already in use. Please choose another.` },
        { status: 400 }
      );
    }

    const newProject = await prisma.project.create({
      data: {
        title: data.title,
        slug: data.slug,
        shortDescription: data.shortDescription,
        description: data.description,
        category: data.category,
        categoryLabel: data.categoryLabel,
        featured: data.featured,
        published: data.published,
        sortOrder: data.sortOrder,
        heroImage: data.heroImage,
        thumbnailImage: data.thumbnailImage || null,
        triangleCount: data.triangles || null,
        textureResolution: data.textureResolution || null,
        engine: data.engine || null,
        software: JSON.stringify(data.software),
        services: JSON.stringify(data.services),
        client: data.client || null,
        year: data.year,
        actionText: data.actionText || "EXPLORE MODEL ↗",
        seoTitle: data.seoTitle || `${data.title} | Moon 3D Studio`,
        seoDescription: data.seoDescription || data.shortDescription,
        ogImage: data.ogImage || null,
        images: {
          create: (data.images || []).map((img, idx) => ({
            url: img.url,
            altText: img.altText || null,
            caption: img.caption || null,
            sortOrder: img.sortOrder ?? idx,
            imageType: img.imageType || "DETAIL",
          })),
        },
      },
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    revalidatePath("/", "layout");
    return NextResponse.json({ success: true, project: newProject }, { status: 201 });
  } catch (err) {
    console.error("[Project Create Error]:", err);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
