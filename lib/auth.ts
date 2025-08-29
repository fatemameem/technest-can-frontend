import { getServerSession } from "next-auth";
import { buildAuthOptions } from "@/lib/auth/options";

/**
 * Central helper to fetch the current session in Server Components/Route Handlers
 * Usage: const session = await getAuth();
 */
export function getAuth() {
  return getServerSession(buildAuthOptions());
}