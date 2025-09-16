// middleware.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const role = (token as any)?.role as "admin" | "moderator" | undefined;
  const { pathname } = req.nextUrl;

  // Protect admin UI
  if (pathname.startsWith("/admin")) {
    if (!token) return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // Protect new admin APIs (Payload-backed)
  if (pathname.startsWith("/api/admin/")) {
    // /api/admin/users upserts roles → admin only
    if (pathname.startsWith("/api/admin/users") && req.method === "POST") {
      if (role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // other admin APIs: admin or moderator can POST
    if (req.method === "POST" && (!role || !["admin", "moderator"].includes(role))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
