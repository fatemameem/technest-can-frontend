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

  // Protect write APIs
  if (pathname.startsWith("/api/sheets/")) {
    // adminInfo POST must be admin
    if (pathname.includes("/adminInfo") && req.method === "POST") {
      if (role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // other tabs: admin or moderator can POST
    if (req.method === "POST" && (!role || !["admin","moderator"].includes(role))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/sheets/:path*"],
};