import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth";
import { serviceSchema } from "@/lib/validations";

export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const services = await prisma.service.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json({ services });
}

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validation = serviceSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues?.[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const data = validation.data;

    const existing = await prisma.service.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Service with slug "${data.slug}" already exists.` },
        { status: 400 }
      );
    }

    const newService = await prisma.service.create({
      data: {
        id: data.id,
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
    return NextResponse.json({ success: true, service: newService }, { status: 201 });
  } catch (err) {
    console.error("[Service Create Error]:", err);
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}
