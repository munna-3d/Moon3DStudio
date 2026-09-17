import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

// Allowed extensions and MIME types
const ALLOWED_MIME_TYPES = new Set([
  // Images
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  // Videos
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
]);

const ALLOWED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".svg",
  ".mp4",
  ".webm",
  ".ogg",
  ".mov",
]);

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 100MB limit" },
        { status: 400 }
      );
    }

    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { error: `File format ${ext} is not supported. Please upload JPG, PNG, WEBP, GIF, SVG, MP4 or WEBM.` },
        { status: 400 }
      );
    }

    if (file.type && !ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
      return NextResponse.json(
        { error: `File MIME type "${file.type}" is not supported.` },
        { status: 400 }
      );
    }

    // Sanitize filename
    const cleanBaseName = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, "-")
      .slice(0, 50);
    const uniqueSuffix = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const finalFilename = `${uniqueSuffix}_${cleanBaseName}${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    // SVG Stored XSS Prevention: reject active scripting, foreign objects, or event handlers
    if (ext === ".svg") {
      const svgContent = buffer.toString("utf-8").toLowerCase();
      const dangerousPatterns = [
        /<script/i,
        /javascript:/i,
        /data:\s*text\/html/i,
        /<foreignobject/i,
        /<iframe/i,
        /<embed/i,
        /<object/i,
        /xlink:href\s*=\s*["']\s*javascript:/i,
        /href\s*=\s*["']\s*javascript:/i,
        /on\w+\s*=/i, // onload, onerror, onclick, etc.
        /<!entity/i, // XXE injection
      ];
      if (dangerousPatterns.some((p) => p.test(svgContent))) {
        return NextResponse.json(
          { error: "Security violation: SVG contains prohibited executable scripts or active event handlers." },
          { status: 400 }
        );
      }
      if (!svgContent.includes("<svg")) {
        return NextResponse.json(
          { error: "Invalid SVG format: missing <svg> element." },
          { status: 400 }
        );
      }
    } else {
      // Magic bytes verification for images & videos
      const hex = buffer.subarray(0, 12).toString("hex").toUpperCase();
      let signatureValid = true;
      if (ext === ".jpg" || ext === ".jpeg") {
        signatureValid = hex.startsWith("FFD8FF");
      } else if (ext === ".png") {
        signatureValid = hex.startsWith("89504E47");
      } else if (ext === ".webp") {
        signatureValid = hex.startsWith("52494646") && buffer.subarray(8, 12).toString("ascii") === "WEBP";
      } else if (ext === ".gif") {
        signatureValid = hex.startsWith("47494638");
      } else if (ext === ".mp4" || ext === ".mov") {
        signatureValid = hex.slice(8, 16) === "66747970" || hex.slice(8, 16) === "6D6F6F76";
      } else if (ext === ".webm") {
        signatureValid = hex.startsWith("1A45DFA3");
      }

      if (!signatureValid) {
        return NextResponse.json(
          { error: `File content for "${file.name}" does not match its declared "${ext}" format.` },
          { status: 400 }
        );
      }
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, finalFilename);
    await fs.writeFile(filePath, buffer);

    const isVideo = [".mp4", ".webm", ".ogg", ".mov"].includes(ext);
    const publicUrl = `/uploads/${finalFilename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: finalFilename,
      originalName: file.name,
      size: file.size,
      mimeType: file.type || "application/octet-stream",
      isVideo,
    });
  } catch (err) {
    console.error("[Admin Media Upload Error]:", err);
    return NextResponse.json({ error: "Failed to upload media file" }, { status: 500 });
  }
}
