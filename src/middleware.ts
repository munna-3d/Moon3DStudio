import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "moon3d_admin_session";
const DEV_FALLBACK_SECRET = "moon-3d-studio-dev-secret-key-32-characters-secure-random";

function getSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET || DEV_FALLBACK_SECRET;
  return new TextEncoder().encode(secret);
}

async function isTokenValid(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ["HS256"],
    });
    return !!payload && !!payload.userId;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const method = req.method.toUpperCase();

  // 1. Cross-Site Request Forgery (CSRF) & Cross-Origin Protection on mutating API calls
  if (pathname.startsWith("/api/") && ["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const origin = req.headers.get("origin");
    const host = req.headers.get("host");
    const secFetchSite = req.headers.get("sec-fetch-site");

    // If browser marks request explicitly as cross-site, block it
    if (secFetchSite === "cross-site") {
      return NextResponse.json(
        { error: "Forbidden: Cross-site request rejected" },
        { status: 403 }
      );
    }

    // If Origin is present, verify it matches Host
    if (origin && host) {
      try {
        const originUrl = new URL(origin);
        if (originUrl.host !== host) {
          return NextResponse.json(
            { error: "Forbidden: Invalid origin" },
            { status: 403 }
          );
        }
      } catch {
        return NextResponse.json(
          { error: "Forbidden: Malformed origin header" },
          { status: 403 }
        );
      }
    }
  }

  // 2. Admin API edge defense-in-depth: /api/admin/*
  if (pathname.startsWith("/api/admin")) {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!token || !(await isTokenValid(token))) {
      return NextResponse.json(
        { error: "Unauthorized: Valid admin session required" },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // 3. Admin Pages protection: /admin/*
  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const isValid = token ? await isTokenValid(token) : false;

    // Login page: if already logged in, redirect to admin dashboard
    if (pathname === "/admin/login") {
      if (isValid) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      return NextResponse.next();
    }

    // Protected admin pages: if not logged in, redirect to login page
    if (!isValid) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/:path*",
  ],
};
