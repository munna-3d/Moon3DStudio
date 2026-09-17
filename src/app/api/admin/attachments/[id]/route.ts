import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth";
import { getPrivateFile } from "@/lib/storage";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
  // 1. Authenticate Admin
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { id } = await params;

  // 2. Fetch Attachment Metadata
  const attachment = await prisma.enquiryAttachment.findUnique({
    where: { id },
  });

  if (!attachment) {
    return NextResponse.json({ error: "Attachment not found" }, { status: 404 });
  }

  // 3. Read Secure Private File
  const { buffer, exists } = await getPrivateFile(attachment.storageKey);
  if (!exists) {
    return NextResponse.json({ error: "File not found on storage disk" }, { status: 404 });
  }

  // 4. Stream Private File with Secure Headers (Uint8Array for web standard BodyInit)
  const encodedName = encodeURIComponent(attachment.originalName);
  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": attachment.mimeType || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${attachment.originalName}"; filename*=UTF-8''${encodedName}`,
      "Content-Length": buffer.length.toString(),
      "Cache-Control": "private, no-cache, no-store, must-revalidate",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
