import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

function getBaseUrl() {
  // Absolute URL for server-side fetches during auth callbacks
  // (NEXTAUTH_URL must be set in your envs)
  const url = process.env.NEXTAUTH_URL;
  if (!url) throw new Error("NEXTAUTH_URL is not set");
  return url.replace(/\/$/, "");
}

type AllowRow = { email?: string; accessLevel?: string; name?: string };

async function fetchAllowlist(): Promise<Array<{ email: string; role: "admin"|"moderator"; name?: string }>> {
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

export const authOptions: NextAuthOptions = {
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
    // Allow only emails present in adminInfo with admin/moderator role
    async signIn({ user }) {
      const email = user?.email?.toLowerCase();
      if (!email) return false;

      const list = await fetchAllowlist();
      const match = list.find((r) => r.email === email);
      return !!match; // true => proceed, false => block
    },

    // Put role/name on the token so client can gate UI
    async jwt({ token, account }) {
      // Refresh role on initial login or if missing
      if (account || !token.role) {
        if (token.email) {
          const list = await fetchAllowlist();
          const match = list.find((r) => r.email === String(token.email).toLowerCase());
          if (match) {
            token.role = match.role;            // "admin" | "moderator"
            if (match.name) token.name = match.name;
          } else {
            // If not on allowlist, clear role
            delete (token as any).role;
          }
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = (token as any).role; // may be undefined if not allowlisted
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };