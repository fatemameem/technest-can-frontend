// lib/auth/options.ts
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { API_BASE } from "@/lib/env";

/** You already have these helpers — keep them here or import them */
function getBaseUrl() {
  const url = process.env.NEXTAUTH_URL;
  if (!url) throw new Error("NEXTAUTH_URL is not set");
  return url.replace(/\/$/, "");
}

type AllowRow = { email?: string; accessLevel?: string; name?: string };
type Role = "admin" | "moderator";

async function fetchAllowlist(): Promise<Array<{ email: string; role: Role; name?: string }>> {
  try {
    console.log(`[Auth] Fetching allowlist from ${API_BASE}/sheets/adminInfo`);
    const res = await fetch(`${API_BASE}/sheets/adminInfo?select=email,accessLevel,name`, { 
      cache: "no-store",
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log(`[Auth] Allowlist API response status: ${res.status}`);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[Auth] Failed to fetch allowlist: ${res.status} ${errorText}`);
      return [];
    }
    
    const rows = await res.json();
    console.log(`[Auth] Fetched ${rows.length} admins from API`);
    
    interface AllowlistApiRow {
      email?: string;
      accessLevel?: string;
      name?: string;
    }

    interface AllowlistProcessedRow {
      email: string;
      role: "admin" | "moderator";
      name?: string;
    }

    const processed: AllowlistProcessedRow[] = (rows as AllowlistApiRow[])
      .map((r: AllowlistApiRow): AllowlistProcessedRow => ({
        email: String(r.email || "").trim().toLowerCase(),
        role: String(r.accessLevel || "").trim().toLowerCase() as "admin" | "moderator",
        name: r.name ? String(r.name) : undefined,
      }))
      .filter((r: AllowlistProcessedRow) => r.email && (r.role === "admin" || r.role === "moderator"));
    
    console.log(`[Auth] Processed ${processed.length} valid admins`);
    return processed;
  } catch (error) {
    console.error(`[Auth] Exception in fetchAllowlist:`, error);
    return []; // don't crash NextAuth if the API hiccups
  }
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
