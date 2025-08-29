// lib/auth/requireRole.ts
import { getServerSession } from "next-auth";
import { buildAuthOptions } from "./options";

export async function requireRole(allowed: Array<"admin"|"moderator">) {
  const session = await getServerSession(buildAuthOptions());
  const role = (session?.user as any)?.role as "admin" | "moderator" | undefined;

  if (!session || !role || !allowed.includes(role)) {
    return { ok: false as const, status: 401, json: { error: "Unauthorized" } };
  }
  return { ok: true as const, role };
}