import { PrismaClient } from "@prisma/client";
import { contactFormSchema, loginSchema, projectSchema, serviceSchema, testimonialSchema } from "../src/lib/validations";
import { hashPassword, verifyPassword, createSessionToken, verifySessionToken } from "../src/lib/auth";
import { checkRateLimit } from "../src/lib/rate-limit";

const prisma = new PrismaClient();

async function runBackendTests() {
  console.log("=========================================");
  console.log("MOON 3D STUDIO — BACKEND INTEGRATION TEST SUITE");
  console.log("=========================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✓ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`✗ [FAIL] ${testName}`);
      failed++;
    }
  }

  // 1. Zod Validation Tests
  console.log("--- 1. Validation Logic ---");
  const validContact = contactFormSchema.safeParse({
    name: "Marcus Vance",
    email: "marcus@epicgames.com",
    company: "Epic Games",
    projectType: "3D Modeling",
    description: "Looking for hero vehicle model for upcoming Unreal Engine 5 title.",
    timeline: "3 Months",
    budget: "$15,000",
  });
  assert(validContact.success, "Contact form validates correct submission");

  const invalidEmail = contactFormSchema.safeParse({
    name: "Marcus Vance",
    email: "not-an-email",
    projectType: "3D Modeling",
    description: "Looking for hero vehicle model.",
  });
  assert(!invalidEmail.success, "Contact form rejects invalid email");

  const missingDesc = contactFormSchema.safeParse({
    name: "Marcus Vance",
    email: "marcus@epicgames.com",
    projectType: "3D Modeling",
    description: "",
  });
  assert(!missingDesc.success, "Contact form rejects empty description");

  const validLogin = loginSchema.safeParse({
    email: "admin@moon3dstudio.com",
    password: "AdminPassword123!",
  });
  assert(validLogin.success, "Login schema validates correct credentials format");

  const invalidProject = projectSchema.safeParse({
    title: "",
    slug: "INVALID SLUG WITH SPACES",
  });
  assert(!invalidProject.success, "Project schema rejects empty title and invalid slug");

  const validService = serviceSchema.safeParse({
    id: "3d-vehicle-modeling",
    title: "3D Vehicle Modeling",
    slug: "3d-vehicle-modeling",
    shortDesc: "High-performance game-ready vehicle art.",
    fullDesc: "Comprehensive vehicle production from high-poly sub-d modeling to game-engine optimization.",
    iconName: "car",
    highlights: ["Sub-D high poly"],
    deliverables: ["4K PBR sets"],
  });
  assert(validService.success, "Service schema validates correct service specification");

  const validTestimonial = testimonialSchema.safeParse({
    clientName: "David Cole",
    quote: "Exceptional 3D vehicle art delivered with optimized polycounts.",
  });
  assert(validTestimonial.success, "Testimonial schema validates client feedback");

  // 2. Auth & Cryptography Tests
  console.log("\n--- 2. Authentication & Sessions ---");
  const password = "TestStudioSecret123!";
  const hash = await hashPassword(password);
  const isValid = await verifyPassword(password, hash);
  assert(isValid, "bcrypt verifies correct password hash");

  const isInvalid = await verifyPassword("WrongPassword!", hash);
  assert(!isInvalid, "bcrypt rejects incorrect password hash");

  const token = await createSessionToken({
    userId: "test-admin-id",
    email: "admin@moon3dstudio.com",
    name: "Studio Lead",
    role: "ADMIN",
  });
  const session = await verifySessionToken(token);
  assert(session !== null && session.email === "admin@moon3dstudio.com", "Session JWT created and verified securely");

  const fakeSession = await verifySessionToken("tampered.token.here");
  assert(fakeSession === null, "Session rejection for invalid/tampered token");

  // 3. Rate Limiting Tests
  console.log("\n--- 3. Rate Limiting ---");
  const testIp = "192.0.2.42";
  let rateLimitExceeded = false;
  // Trigger limit (max 5)
  for (let i = 0; i < 6; i++) {
    const res = checkRateLimit(`test-enquiry:${testIp}`, 5, 60000);
    if (!res.success) {
      rateLimitExceeded = true;
    }
  }
  assert(rateLimitExceeded, "Rate limiter blocks excessive calls over threshold");

  // 4. Database Integrity Tests
  console.log("\n--- 4. Database Persistence & Models ---");
  // Enquiries
  const enquiryCount = await prisma.projectEnquiry.count();
  assert(enquiryCount >= 1, `Enquiries table populated (Found ${enquiryCount})`);

  // Projects
  const projectCount = await prisma.project.count({ where: { published: true } });
  assert(projectCount === 6, `Published projects correctly seeded (Found ${projectCount})`);

  // Services
  const serviceCount = await prisma.service.count({ where: { published: true } });
  assert(serviceCount === 6, `Active services correctly seeded (Found ${serviceCount})`);

  // Admin User
  const adminUser = await prisma.adminUser.findUnique({
    where: { email: "contact@moon3dstudio.com" },
  });
  assert(adminUser !== null && adminUser.role === "ADMIN", "Admin user exists with ADMIN role");

  console.log("\n=========================================");
  console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log("=========================================\n");

  await prisma.$disconnect();

  if (failed > 0) process.exit(1);
}

runBackendTests().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
