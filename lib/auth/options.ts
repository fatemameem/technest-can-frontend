// lib/auth/options.ts
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

/** You already have these helpers — keep them here or import them */
function getBaseUrl() {
  const url = process.env.NEXTAUTH_URL;
  if (!url) throw new Error("NEXTAUTH_URL is not set");
  return url.replace(/\/$/, "");
}

type AllowRow = { email?: string; accessLevel?: string; name?: string };
type Role = "admin" | "moderator";

async function fetchAllowlist(): Promise<Array<{ email: string; role: Role; name?: string }>> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/sheets/adminInfo?select=email,accessLevel,name`, { cache: "no-store" });
  if (!res.ok) return [];
  const rows = (await res.json()) as AllowRow[];
  return rows
    .map((r) => ({
      email: String(r.email || "").trim().toLowerCase(),
      role: String(r.accessLevel || "").trim().toLowerCase() as Role,
      name: r.name ? String(r.name) : undefined,
    }))
    .filter((r) => r.email && (r.role === "admin" || r.role === "moderator"));
}

/** Factory that returns a *new* options object each time to avoid TDZ/cycles */
export function buildAuthOptions(): NextAuthOptions {
  return {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
    ],
    session: { strategy: "jwt" },
    pages: {
      signIn: "/admin/login",
      error: "/admin/login?error=1",
    },
    callbacks: {
      async signIn({ user }) {
        const email = user?.email?.toLowerCase();
        if (!email) return false;
        const list = await fetchAllowlist();
        return !!list.find((r) => r.email === email);
      },
      async jwt({ token, account }) {
        if (account || !(token as any).role) {
          if (token.email) {
            const list = await fetchAllowlist();
            const m = list.find((r) => r.email === String(token.email).toLowerCase());
            if (m) {
              (token as any).role = m.role;
              if (m.name) token.name = m.name;
            } else {
              delete (token as any).role;
            }
          }
        }
        return token;
      },
      async session({ session, token }) {
        if (session.user) {
          (session.user as any).role = (token as any).role;
        }
        return session;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  };
}