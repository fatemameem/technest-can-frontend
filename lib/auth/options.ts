// lib/auth/options.ts
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import configPromise from '@payload-config'
import { getPayload } from 'payload'

/** You already have these helpers — keep them here or import them */
function getBaseUrl() {
  const url = process.env.NEXTAUTH_URL;
  if (!url) throw new Error("NEXTAUTH_URL is not set");
  return url.replace(/\/$/, "");
}

type Role = 'admin' | 'moderator'

async function getUserRoleByEmail(email: string): Promise<{ role?: Role; name?: string } | null> {
  try {
    const payload = await getPayload({ config: configPromise });
    const res = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    const doc = res.docs?.[0] as any;
    if (!doc) return null;
    const role = doc.role as Role | undefined;
    return role ? { role, name: doc?.name } : null;
  } catch (e) {
    console.error('[Auth] Failed to read user role from Payload:', e);
    return null;
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
        const match = await getUserRoleByEmail(email);
        return !!match?.role;
      },
      async jwt({ token, account }) {
        if (account || !(token as any).role) {
          if (token.email) {
            const m = await getUserRoleByEmail(String(token.email).toLowerCase());
            if (m?.role) {
              (token as any).role = m.role;
              if (m.name) token.name = m.name as string;
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
