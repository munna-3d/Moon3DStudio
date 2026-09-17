import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth";
import { projectSchema } from "@/lib/validations";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json({ project });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  // Support partial updates (e.g. toggling published / featured)
  if (body.toggleField) {
    const field = body.toggleField;
    const current = await prisma.project.findUnique({ where: { id } });
    if (!current) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (field === "published") {
      const updated = await prisma.project.update({
        where: { id },
        data: { published: !current.published },
      });
      revalidatePath("/", "layout");
      return NextResponse.json({ success: true, project: updated });
    } else if (field === "featured") {
      const updated = await prisma.project.update({
        where: { id },
        data: { featured: !current.featured },
      });
      revalidatePath("/", "layout");
      return NextResponse.json({ success: true, project: updated });
    }
  }

  const validation = projectSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.issues?.[0]?.message || "Validation failed" },
      { status: 400 }
    );
  }

  const data = validation.data;

  // Check slug uniqueness if slug changed
  const existing = await prisma.project.findUnique({
    where: { slug: data.slug },
  });

  if (existing && existing.id !== id) {
    return NextResponse.json(
      { error: `Slug "${data.slug}" is already used by another project.` },
      { status: 400 }
    );
  }

  await prisma.project.update({
    where: { id },
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
    },
  });

  // Sync gallery images if provided
  if (data.images !== undefined) {
    await prisma.projectImage.deleteMany({ where: { projectId: id } });
    if (data.images.length > 0) {
      await prisma.projectImage.createMany({
        data: data.images.map((img, idx) => ({
          projectId: id,
          url: img.url,
          altText: img.altText || null,
          caption: img.caption || null,
          sortOrder: img.sortOrder ?? idx,
          imageType: img.imageType || "DETAIL",
        })),
      });
    }
  }

  const refreshedProject = await prisma.project.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  revalidatePath("/", "layout");
  return NextResponse.json({ success: true, project: refreshedProject });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.project.delete({
    where: { id },
  });

  revalidatePath("/", "layout");
  return NextResponse.json({ success: true, message: "Project deleted successfully" });
}
