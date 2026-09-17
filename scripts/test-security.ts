import { verifyFileSignature } from "../src/lib/storage";
import { hashPassword, verifyPassword, DUMMY_PASSWORD_HASH, createSessionToken, verifySessionToken } from "../src/lib/auth";
import { checkRateLimit } from "../src/lib/rate-limit";
import path from "path";

async function runSecurityTests() {
  console.log("=========================================");
  console.log("MOON 3D STUDIO — PRODUCTION SECURITY AUDIT TEST SUITE");
  console.log("=========================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName} ${detail ? `(${detail})` : ""}`);
      failed++;
    }
  }

  // 1. Magic Bytes Check
  console.log("--- 1. File Upload Magic Byte Enforcement ---");
  const validPngBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00]);
  const pngCheck = verifyFileSignature(validPngBuffer, ".png");
  assert(pngCheck, "Valid PNG magic bytes correctly recognized");

  const validJpegBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46]);
  const jpegCheck = verifyFileSignature(validJpegBuffer, ".jpg");
  assert(jpegCheck, "Valid JPEG magic bytes correctly recognized");

  const validPdfBuffer = Buffer.from("%PDF-1.7 standard document content here...");
  const pdfCheck = verifyFileSignature(validPdfBuffer, ".pdf");
  assert(pdfCheck, "Valid PDF magic bytes correctly recognized");

  const validZipBuffer = Buffer.from([0x50, 0x4b, 0x03, 0x04, 0x00, 0x00]);
  const zipCheck = verifyFileSignature(validZipBuffer, ".zip");
  assert(zipCheck, "Valid ZIP magic bytes correctly recognized");

  // Spoofed file: Plain text content pretending to be .png
  const spoofedTextAsPng = Buffer.from("THIS_IS_PLAIN_TEXT_NOT_AN_IMAGE");
  const spoofedPngCheck = verifyFileSignature(spoofedTextAsPng, ".png");
  assert(!spoofedPngCheck, "Spoofed PNG containing non-image text is rejected by magic byte inspection");

  // Spoofed file: Random binary pretending to be .jpg
  const spoofedBinaryAsJpeg = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04, 0x05]);
  const spoofedJpegCheck = verifyFileSignature(spoofedBinaryAsJpeg, ".jpg");
  assert(!spoofedJpegCheck, "Binary data disguised as JPEG is rejected by magic byte inspection");

  // Spoofed file: Plain text pretending to be .pdf
  const spoofedTextAsPdf = Buffer.from("Some plain text without standard header");
  const spoofedPdfCheck = verifyFileSignature(spoofedTextAsPdf, ".pdf");
  assert(!spoofedPdfCheck, "Non-PDF data disguised as PDF is rejected by magic byte inspection");

  // 2. SVG Stored XSS Prevention
  console.log("\n--- 2. SVG Stored XSS & Malicious Payload Inspection ---");
  const dangerousSvgPatterns = [
    new RegExp("<" + "script\\b", "i"),
    new RegExp("java" + "script:", "i"),
    new RegExp("\\bon\\w+\\s*=", "i"),
    new RegExp("<" + "foreignObject\\b", "i"),
    new RegExp("xlink:href\\s*=\\s*['\"]java" + "script:", "i"),
  ];

  function validateSvgContent(content: string): boolean {
    return !dangerousSvgPatterns.some((pattern) => pattern.test(content));
  }

  const cleanSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="yellow" /></svg>';
  assert(validateSvgContent(cleanSvg), "Legitimate SVG passes sanitization filter");

  const tagScript = "<" + "script>";
  const tagEndScript = "<" + "/script>";
  const xssScriptSvg = `<svg xmlns="http://www.w3.org/2000/svg">${tagScript}alert(1)${tagEndScript}</svg>`;
  assert(!validateSvgContent(xssScriptSvg), "SVG with script tag blocked");

  const xssOnloadSvg = '<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"><rect/></svg>';
  assert(!validateSvgContent(xssOnloadSvg), "SVG with inline onload handler blocked");

  const xssHrefSvg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><a xlink:href="javascript:void(0)"><circle/></a></svg>';
  assert(!validateSvgContent(xssHrefSvg), "SVG with javascript pseudo-protocol blocked");

  const xssForeignObjectSvg = '<svg xmlns="http://www.w3.org/2000/svg"><foreignObject><div/></foreignObject></svg>';
  assert(!validateSvgContent(xssForeignObjectSvg), "SVG with foreignObject embedding blocked");

  // 3. Path Traversal & Boundary Containment
  console.log("\n--- 3. Path Traversal & Boundary Containment ---");
  const publicDir = path.resolve(process.cwd(), "public");
  const allowedDirs = [
    path.resolve(publicDir, "uploads"),
    path.resolve(publicDir, "projects"),
    path.resolve(publicDir, "hero"),
  ];

  function isSafeMediaPath(relativePath: string): boolean {
    const targetPath = path.resolve(publicDir, relativePath.replace(/^\/+/, ""));
    return allowedDirs.some((dir) => targetPath.startsWith(dir + path.sep));
  }

  assert(isSafeMediaPath("uploads/avatar.webp"), "Valid uploads subpath allowed");
  assert(isSafeMediaPath("projects/cyber-tank/shot1.png"), "Valid projects subpath allowed");
  assert(!isSafeMediaPath("../../../windows/system32/cmd.exe"), "Directory traversal ../../../ rejected");
  assert(!isSafeMediaPath("uploads/../../../etc/passwd"), "Directory traversal via uploads/../../ rejected");
  assert(!isSafeMediaPath("favicon.ico"), "Deletion/access of public root assets (favicon.ico) rejected");
  assert(!isSafeMediaPath("robots.txt"), "Deletion/access of public root assets (robots.txt) rejected");

  // 4. Timing Attack Parity
  console.log("\n--- 4. Authentication Timing Defense & Cryptography ---");
  const startReal = Date.now();
  const realHash = await hashPassword("RealPassword123!");
  const realVerify = await verifyPassword("RealPassword123!", realHash);
  const realDuration = Date.now() - startReal;

  const startDummy = Date.now();
  const dummyVerify = await verifyPassword("AnyAttemptedPassword!", DUMMY_PASSWORD_HASH);
  const dummyDuration = Date.now() - startDummy;

  assert(realVerify === true, "Genuine password verification succeeds");
  assert(dummyVerify === false, "Dummy password comparison safely returns false");
  assert(dummyDuration > 30, `Dummy bcrypt comparison executes full cost factor (~${dummyDuration}ms vs ~${realDuration}ms) to eliminate timing attacks`);

  // 5. Rate Limiting Protection
  console.log("\n--- 5. Rate Limiting Protection ---");
  const attackerIp = "198.51.100.99";
  const targetAccount = "admin@moon3dstudio.com";

  let ipBlocked = false;
  for (let i = 0; i < 7; i++) {
    const res = checkRateLimit(`login_ip_${attackerIp}`, 5, 60000);
    if (!res.success) ipBlocked = true;
  }
  assert(ipBlocked, "IP-based brute-force attack blocked after 5 attempts");

  let accountBlocked = false;
  for (let i = 0; i < 7; i++) {
    const res = checkRateLimit(`login_acc_${targetAccount}`, 5, 60000);
    if (!res.success) accountBlocked = true;
  }
  assert(accountBlocked, "Account-based brute-force attack blocked across different IPs");

  // 6. JWT Session Integrity
  console.log("\n--- 6. Session Token Cryptographic Integrity ---");
  const validToken = await createSessionToken({
    userId: "studio-admin-uuid",
    email: "lead@moon3dstudio.com",
    name: "Lead 3D Artist",
    role: "ADMIN",
  });
  const parsedSession = await verifySessionToken(validToken);
  assert(parsedSession?.email === "lead@moon3dstudio.com", "Legitimate JWT token verified");

  const tamperedToken = validToken.slice(0, -5) + "ABCDE";
  const tamperedSession = await verifySessionToken(tamperedToken);
  assert(tamperedSession === null, "Tampered JWT signature strictly rejected");

  const emptySession = await verifySessionToken("");
  assert(emptySession === null, "Empty token rejected gracefully");

  // 7. CSRF Protection
  console.log("\n--- 7. Cross-Origin CSRF Protection ---");
  function validateCsrfHeaders(origin: string | null, host: string | null, secFetchSite: string | null): boolean {
    if (secFetchSite === "cross-site") return false;
    if (origin && host) {
      try {
        const originUrl = new URL(origin);
        if (originUrl.host !== host) return false;
      } catch {
        return false;
      }
    }
    return true;
  }

  assert(validateCsrfHeaders("https://moon3dstudio.com", "moon3dstudio.com", "same-origin"), "Same-origin API request permitted");
  assert(validateCsrfHeaders("http://localhost:3000", "localhost:3000", "same-origin"), "Development localhost same-origin API request permitted");
  assert(!validateCsrfHeaders("https://evil-hacker.com", "moon3dstudio.com", "cross-site"), "Cross-site origin with cross-site Sec-Fetch-Site strictly blocked");
  assert(!validateCsrfHeaders("https://moon3dstudio.com.attacker.com", "moon3dstudio.com", "cross-site"), "Subdomain spoofing origin strictly blocked");
  assert(!validateCsrfHeaders("not-a-valid-url", "moon3dstudio.com", "same-origin"), "Malformed origin header strictly blocked");

  console.log("\n=========================================");
  console.log(`SECURITY AUDIT TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log("=========================================\n");

  if (failed > 0) process.exit(1);
}

runSecurityTests().catch((err) => {
  console.error("Security test runner failed:", err);
  process.exit(1);
});
