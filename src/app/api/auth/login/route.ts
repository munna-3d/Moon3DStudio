import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { loginSchema } from "@/lib/validations";
import { verifyPassword, setSessionCookie, DUMMY_PASSWORD_HASH } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    // Rate limit: Max 5 login attempts per 5 minutes per IP
    const rateLimit = checkRateLimit(`login_ip_${clientIp}`, 5, 5 * 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many login attempts. Please wait ${rateLimit.reset} seconds before trying again.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email and password." },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Account-targeted brute force rate limiting
    const accountRateLimit = checkRateLimit(`login_acc_${normalizedEmail}`, 5, 5 * 60 * 1000);
    if (!accountRateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many failed attempts for this account. Please wait ${accountRateLimit.reset} seconds before trying again.`,
        },
        { status: 429 }
      );
    }

    const user = await prisma.adminUser.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      // Execute dummy bcrypt comparison to neutralize response timing side-channel (timing attack)
      await verifyPassword(password, DUMMY_PASSWORD_HASH);
      return NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Update lastLoginAt
    await prisma.adminUser.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Set secure session cookie
    await setSessionCookie({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as "ADMIN" | "EDITOR",
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("[Login API Error]:", err);
    return NextResponse.json(
      { success: false, error: "Authentication service error. Please try again." },
      { status: 500 }
    );
  }
}
