// import { authOptions } from "@/lib/auth";
import { buildAuthOptions } from "@/lib/auth/options";
import NextAuth from "next-auth";

const handler = NextAuth(buildAuthOptions());
export { handler as GET, handler as POST };
export const dynamic = "force-dynamic";