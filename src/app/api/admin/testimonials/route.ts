import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth";
import { testimonialSchema } from "@/lib/validations";

export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const testimonials = await prisma.testimonial.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json({ testimonials });
}

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validation = testimonialSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues?.[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const data = validation.data;

    const newTestimonial = await prisma.testimonial.create({
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

    return NextResponse.json({ success: true, testimonial: newTestimonial }, { status: 201 });
  } catch (err) {
    console.error("[Testimonial Create Error]:", err);
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 });
  }
}
