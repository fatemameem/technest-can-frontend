import { getServerSession } from "next-auth/next";
import { buildAuthOptions } from "@/lib/auth/options";

export async function POST(req: Request) {
  const session = await getServerSession(buildAuthOptions());
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { target, method = "GET", body } = await req.json();
  if (!target || !target.startsWith('/api/sheets/')) {
    return Response.json({ error: "Invalid target" }, { status: 400 });
  }

  const bypassToken = process.env.VERCEL_PROTECTION_BYPASS;
  const apiUrl = new URL(target, process.env.NEXTAUTH_URL);
  if (bypassToken) {
    apiUrl.searchParams.append('x-vercel-protection-bypass', bypassToken);
  }

  try {
    const response = await fetch(apiUrl.toString(), {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: method !== "GET" ? JSON.stringify(body) : undefined,
    });
    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    return Response.json({ error: "Proxy request failed" }, { status: 500 });
  }
}