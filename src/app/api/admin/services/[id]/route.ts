import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth";
import { serviceSchema } from "@/lib/validations";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const service = await prisma.service.findUnique({
    where: { id },
  });

  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  return NextResponse.json({ service });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  // Support toggle published
  if (body.togglePublished) {
    const current = await prisma.service.findUnique({ where: { id } });
    if (!current) return NextResponse.json({ error: "Service not found" }, { status: 404 });
    const updated = await prisma.service.update({
      where: { id },
      data: { published: !current.published },
    });
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true, service: updated });
  }

  const validation = serviceSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.issues?.[0]?.message || "Validation failed" },
      { status: 400 }
    );
  }

  const data = validation.data;

  const updatedService = await prisma.service.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      shortDesc: data.shortDesc,
      fullDesc: data.fullDesc,
      iconName: data.iconName,
      heroImage: data.heroImage || null,
      highlights: JSON.stringify(data.highlights),
      deliverables: JSON.stringify(data.deliverables),
      published: data.published,
      sortOrder: data.sortOrder,
      seoTitle: data.seoTitle || `${data.title} | Moon 3D Studio`,
      seoDescription: data.seoDescription || data.shortDesc,
    },
  });

  revalidatePath("/", "layout");
  return NextResponse.json({ success: true, service: updatedService });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.service.delete({ where: { id } });
  revalidatePath("/", "layout");
  return NextResponse.json({ success: true, message: "Service deleted successfully" });
}
