import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth";
import { enquiryStatusSchema } from "@/lib/validations";
import { deletePrivateFile } from "@/lib/storage";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const enquiry = await prisma.projectEnquiry.findUnique({
    where: { id },
    include: {
      attachments: true,
    },
  });

  if (!enquiry) {
    return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
  }

  return NextResponse.json({ enquiry });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const validation = enquiryStatusSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Invalid status provided. Allowed: NEW, CONTACTED, IN_PROGRESS, COMPLETED, ARCHIVED, SPAM" },
      { status: 400 }
    );
  }

  const updated = await prisma.projectEnquiry.update({
    where: { id },
    data: { status: validation.data.status },
  });

  return NextResponse.json({ success: true, enquiry: updated });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Find attachments to clean up physical storage
  const enquiry = await prisma.projectEnquiry.findUnique({
    where: { id },
    include: { attachments: true },
  });

  if (!enquiry) {
    return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
  }

  // Delete physical files
  for (const att of enquiry.attachments) {
    await deletePrivateFile(att.storageKey);
  }

  // Delete record (cascade deletes EnquiryAttachment records)
  await prisma.projectEnquiry.delete({
    where: { id },
  });

  return NextResponse.json({ success: true, message: "Enquiry deleted successfully" });
}
