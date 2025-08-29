// import { authOptions } from "@/lib/auth";
import { buildAuthOptions } from "@/lib/auth/options";
import NextAuth, { NextAuthOptions } from "next-auth";

function getBaseUrl() {
  // Absolute URL for server-side fetches during auth callbacks
  // (NEXTAUTH_URL must be set in your envs)
  const url = process.env.NEXTAUTH_URL;
  if (!url) throw new Error("NEXTAUTH_URL is not set");
  return url.replace(/\/$/, "");
}

type AllowRow = { email?: string; accessLevel?: string; name?: string };

export async function fetchAllowlist(): Promise<Array<{ email: string; role: "admin"|"moderator"; name?: string }>> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/sheets/adminInfo?select=email,accessLevel,name`, {
    // make sure we aren't getting a cached empty list during first setup
    cache: "no-store",
  });
  if (!res.ok) {
    // Fail closed (deny sign-in) if allowlist lookup fails
    return [];
  }
  const rows = (await res.json()) as AllowRow[];
  // Normalize emails + roles from sheet (your sheet returns "Admin"/"Moderator")
  return rows
    .map((r) => ({
      email: String(r.email || "").trim().toLowerCase(),
      role: String(r.accessLevel || "").trim().toLowerCase() as "admin"|"moderator",
      name: r.name ? String(r.name) : undefined,
    }))
    .filter((r) => r.email && (r.role === "admin" || r.role === "moderator"));
}



const handler = NextAuth(buildAuthOptions());
export { handler as GET, handler as POST };
export const dynamic = "force-dynamic";