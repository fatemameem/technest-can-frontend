import { getServerSession } from "next-auth";
import { buildAuthOptions } from "@/lib/auth/options";

export async function POST(req: Request) {
  try {
    // Check if there's a session (needed in production, relaxed in dev)
    const session = await getServerSession(buildAuthOptions());
    const isLocalDev = process.env.NODE_ENV === 'development';
    
    if (!session?.user?.email && !isLocalDev) {
      console.error("No authenticated session found");
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get target API and request details
    const body = await req.json().catch(error => {
      console.error("Failed to parse request body:", error);
      return null;
    });
    
    if (!body) {
      return Response.json({ error: "Invalid request body" }, { status: 400 });
    }
    
    const { target, method = "GET", body: requestBody } = body;
    
    // Validate target is an internal API
    if (!target || !target.startsWith('/api/sheets/')) {
      console.error("Invalid target:", target);
      return Response.json({ error: "Invalid target" }, { status: 400 });
    }
    
    // Determine base URL (using relative URLs in development)
    let apiUrl: URL;
    if (process.env.NODE_ENV === 'development') {
      // In dev, use a configurable base URL (default to localhost:3000 if not set)
      const devBaseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.DEV_APP_URL || 'http://localhost:3000';
      apiUrl = new URL(target, devBaseUrl);
    } else {
      // In production, use the NEXTAUTH_URL
      apiUrl = new URL(target, process.env.NEXTAUTH_URL);
      
      // Add bypass token in production
      const bypassToken = process.env.VERCEL_PROTECTION_BYPASS;
      if (bypassToken) {
        apiUrl.searchParams.append('__v_p', bypassToken);
      }
    }
    
    console.log(`[AdminProxy] Forwarding ${method} request to ${apiUrl.toString()}`);

    // Make the actual request
    const response = await fetch(apiUrl.toString(), {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: method !== "GET" ? JSON.stringify(requestBody) : undefined,
    });
    
    // Parse and forward the response
    try {
      const data = await response.json();
      return Response.json(data, { status: response.status });
    } catch (error) {
      const text = await response.text();
      console.error(`[AdminProxy] Error parsing response (${response.status}):`, text);
      return Response.json({ 
        error: "Failed to parse response",
        status: response.status,
        text: text.substring(0, 500) // Include part of the response for debugging
      }, { status: 500 });
    }
  } catch (error) {
    console.error("[AdminProxy] Unhandled error:", error);
    return Response.json({ 
      error: "Proxy request failed", 
      message: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}