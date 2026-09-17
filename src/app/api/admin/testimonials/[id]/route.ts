import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth";
import { testimonialSchema } from "@/lib/validations";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  if (body.togglePublished) {
    const current = await prisma.testimonial.findUnique({ where: { id } });
    if (!current) return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    const updated = await prisma.testimonial.update({
      where: { id },
      data: { published: !current.published },
    });
    return NextResponse.json({ success: true, testimonial: updated });
  }

  const validation = testimonialSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.issues?.[0]?.message || "Validation failed" },
      { status: 400 }
    );
  }

  const data = validation.data;
  const updated = await prisma.testimonial.update({
    where: { id },
    data: {
      clientName: data.clientName,
      company: data.company || null,
      quote: data.quote,
      project: data.project || null,
      image: data.image || null,
      published: data.published,
      sortOrder: data.sortOrder,
    },
  });

  return NextResponse.json({ success: true, testimonial: updated });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.testimonial.delete({ where: { id } });
  return NextResponse.json({ success: true, message: "Testimonial deleted successfully" });
}
