import fs from "fs";
import path from "path";
import crypto from "crypto";

// Allowed MIME types and extensions
export const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
  "application/x-rar-compressed",
  "application/vnd.rar",
  "application/octet-stream", // Some browsers send octet-stream for .rar / .zip
]);

export const ALLOWED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".pdf",
  ".zip",
  ".rar",
]);

export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

// Local private storage directory (outside public folder)
const LOCAL_STORAGE_DIR = path.join(process.cwd(), "storage", "attachments");

// Ensure local private storage folder exists
function ensureStorageDir() {
  if (!fs.existsSync(LOCAL_STORAGE_DIR)) {
    fs.mkdirSync(LOCAL_STORAGE_DIR, { recursive: true });
  }
}

export interface StoredFileInfo {
  originalName: string;
  storageKey: string;
  mimeType: string;
  size: number;
}

/**
 * Verify file magic bytes against allowed extensions
 */
export function verifyFileSignature(buffer: Buffer, ext: string): boolean {
  if (buffer.length < 4) return false;
  const hex = buffer.subarray(0, 12).toString("hex").toUpperCase();

  switch (ext) {
    case ".jpg":
    case ".jpeg":
      // JPEG SOI marker: FFD8FF
      return hex.startsWith("FFD8FF");

    case ".png":
      // PNG header: 89504E47
      return hex.startsWith("89504E47");

    case ".webp":
      // RIFF....WEBP
      return hex.startsWith("52494646") && buffer.subarray(8, 12).toString("ascii") === "WEBP";

    case ".pdf":
      // %PDF-
      return hex.startsWith("25504446");

    case ".zip":
      // PK.. (PK\x03\x04 or PK\x05\x06 or PK\x07\x08)
      return (
        hex.startsWith("504B0304") ||
        hex.startsWith("504B0506") ||
        hex.startsWith("504B0708")
      );

    case ".rar":
      // Rar!
      return hex.startsWith("52617221");

    default:
      return false;
  }
}

/**
 * Validate incoming file metadata and magic bytes
 */
export async function validateUploadFile(file: File): Promise<{ valid: boolean; error?: string }> {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File "${file.name}" exceeds the maximum allowed size of 50MB.`,
    };
  }

  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return {
      valid: false,
      error: `File type "${ext}" is not permitted. Allowed: JPG, PNG, WEBP, PDF, ZIP, RAR.`,
    };
  }

  // Check MIME type (if provided by browser)
  if (file.type && !ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
    return {
      valid: false,
      error: `File MIME type "${file.type}" is not permitted.`,
    };
  }

  // Verify file magic bytes to prevent file extension spoofing / disguised payloads
  try {
    const headerSlice = await file.slice(0, 16).arrayBuffer();
    const headerBuffer = Buffer.from(headerSlice);
    if (!verifyFileSignature(headerBuffer, ext)) {
      return {
        valid: false,
        error: `File content for "${file.name}" does not match its declared "${ext}" format.`,
      };
    }
  } catch {
    return {
      valid: false,
      error: `Failed to verify content signature for file "${file.name}".`,
    };
  }

  return { valid: true };
}

/**
 * Save file into private secure storage
 */
export async function savePrivateFile(file: File): Promise<StoredFileInfo> {
  ensureStorageDir();

  const ext = path.extname(file.name).toLowerCase();
  const randomId = crypto.randomBytes(16).toString("hex");
  const timestamp = Date.now();
  const storageKey = `att_${timestamp}_${randomId}${ext}`;

  const destinationPath = path.join(LOCAL_STORAGE_DIR, storageKey);
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Re-verify signature before writing to disk
  if (!verifyFileSignature(buffer, ext)) {
    throw new Error(`File signature verification failed for "${file.name}"`);
  }

  await fs.promises.writeFile(destinationPath, buffer);

  return {
    originalName: file.name,
    storageKey,
    mimeType: file.type || "application/octet-stream",
    size: file.size,
  };
}

/**
 * Retrieve private file as buffer/stream for authenticated admin download
 */
export async function getPrivateFile(storageKey: string): Promise<{ buffer: Buffer; exists: boolean }> {
  // Prevent directory traversal
  const safeKey = path.basename(storageKey);
  const resolvedDir = path.resolve(LOCAL_STORAGE_DIR);
  const filePath = path.resolve(resolvedDir, safeKey);

  // Strict boundary check: ensure resolved path is strictly inside LOCAL_STORAGE_DIR
  if (!filePath.startsWith(resolvedDir + path.sep)) {
    return { buffer: Buffer.alloc(0), exists: false };
  }

  if (!fs.existsSync(filePath)) {
    return { buffer: Buffer.alloc(0), exists: false };
  }

  const buffer = await fs.promises.readFile(filePath);
  return { buffer, exists: true };
}

/**
 * Delete private file if enquiry is deleted
 */
export async function deletePrivateFile(storageKey: string): Promise<boolean> {
  try {
    const safeKey = path.basename(storageKey);
    const filePath = path.join(LOCAL_STORAGE_DIR, safeKey);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
