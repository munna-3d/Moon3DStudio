import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

const MEDIA_EXTS = new Set([
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

interface MediaItem {
  url: string;
  filename: string;
  folder: string;
  size: number;
  modified: string;
  isVideo: boolean;
  canDelete: boolean;
}

async function scanDirectory(
  dirPath: string,
  urlPrefix: string,
  folderName: string,
  canDelete: boolean = true
): Promise<MediaItem[]> {
  const items: MediaItem[] = [];
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (MEDIA_EXTS.has(ext)) {
          const fullPath = path.join(dirPath, entry.name);
          try {
            const stat = await fs.stat(fullPath);
            const isVideo = [".mp4", ".webm", ".ogg", ".mov"].includes(ext);
            items.push({
              url: `${urlPrefix}/${entry.name}`,
              filename: entry.name,
              folder: folderName,
              size: stat.size,
              modified: stat.mtime.toISOString(),
              isVideo,
              canDelete,
            });
          } catch {
            // skip stat error
          }
        }
      } else if (entry.isDirectory()) {
        // scan 1 level deeper (e.g. public/projects/hexa-bison)
        const subItems = await scanDirectory(
          path.join(dirPath, entry.name),
          `${urlPrefix}/${entry.name}`,
          `${folderName}/${entry.name}`,
          canDelete
        );
        items.push(...subItems);
      }
    }
  } catch {
    // Directory might not exist yet
  }
  return items;
}

export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const publicDir = path.join(process.cwd(), "public");

  const [uploads, projects, hero] = await Promise.all([
    scanDirectory(path.join(publicDir, "uploads"), "/uploads", "uploads", true),
    scanDirectory(path.join(publicDir, "projects"), "/projects", "projects", true),
    scanDirectory(path.join(publicDir, "hero"), "/hero", "hero", true),
  ]);

  // Combine and sort by modified date descending
  const allMedia = [...uploads, ...projects, ...hero].sort(
    (a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime()
  );

  return NextResponse.json({ media: allMedia });
}

export async function DELETE(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const urlParam = searchParams.get("url");
    const filenameParam = searchParams.get("filename");

    if (!urlParam && !filenameParam) {
      return NextResponse.json(
        { error: "URL or Filename is required" },
        { status: 400 }
      );
    }

    const publicDir = path.resolve(process.cwd(), "public");
    let relativePath = "";

    if (urlParam) {
      // urlParam can be e.g. "/uploads/demo.png" or "/projects/bison/image.png"
      relativePath = urlParam.replace(/^\/+/, "");
    } else if (filenameParam) {
      if (filenameParam.startsWith("/")) {
        relativePath = filenameParam.replace(/^\/+/, "");
      } else {
        relativePath = path.join("uploads", path.basename(filenameParam));
      }
    }

    const targetPath = path.resolve(publicDir, relativePath);

    const allowedDirs = [
      path.resolve(publicDir, "uploads"),
      path.resolve(publicDir, "projects"),
      path.resolve(publicDir, "hero"),
    ];

    const isInsideAllowedDir = allowedDirs.some((dir) =>
      targetPath.startsWith(dir + path.sep)
    );

    const ext = path.extname(targetPath).toLowerCase();
    if (!isInsideAllowedDir || !MEDIA_EXTS.has(ext)) {
      return NextResponse.json(
        { error: "Forbidden: Only media assets in uploads, projects, or hero directories can be deleted" },
        { status: 403 }
      );
    }

    try {
      await fs.unlink(targetPath);
    } catch (err: unknown) {
      const error = err as { code?: string };
      if (error.code !== "ENOENT") {
        throw err;
      }
    }

    // Also remove from ProjectImage database if referenced
    if (urlParam) {
      try {
        await prisma.projectImage.deleteMany({
          where: { url: urlParam },
        });
      } catch {
        // ignore db cascade if not found
      }
    }

    return NextResponse.json({ success: true, message: "Asset deleted successfully" });
  } catch (err) {
    console.error("[Media Delete Error]:", err);
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}
