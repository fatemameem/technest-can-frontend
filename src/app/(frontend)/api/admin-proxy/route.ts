import { getServerSession } from "next-auth";
import { buildAuthOptions } from "@/lib/auth/options";

export async function POST(req: Request) {
  try {
    // Get incoming request cookies - IMPORTANT
    const cookies = req.headers.get('cookie');
    
    // Log debug info
    // console.log("[AdminProxy] Request headers:", {
    //   hasCookies: !!cookies,
    //   cookieLength: cookies?.length
    // });

    // Get target API and request details
    const body = await req.json().catch(error => {
      console.error("Failed to parse request body:", error);
      return null;
    });
    
    if (!body) {
      return Response.json({ error: "Invalid request body" }, { status: 400 });
    }
    
    const { target, method = "GET", body: requestBody } = body;
    
    if (!target || !target.startsWith('/api/sheets/')) {
      console.error("Invalid target:", target);
      return Response.json({ error: "Invalid target" }, { status: 400 });
    }
    
    // Determine base URL
    let apiUrl: URL;
    if (process.env.NODE_ENV === 'development') {
      apiUrl = new URL(target, 'http://localhost:3000');
    } else {
      apiUrl = new URL(target, process.env.NEXTAUTH_URL);
      
      // Add bypass token in production if needed
      const bypassToken = process.env.VERCEL_PROTECTION_BYPASS;
      if (bypassToken) {
        apiUrl.searchParams.append('__v_p', bypassToken);
      }
    }
    
    console.log(`[AdminProxy] Forwarding ${method} request to ${apiUrl.toString()}`);

    // Forward the request WITH cookies to maintain session
    const response = await fetch(apiUrl.toString(), {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies || '', // THIS IS THE KEY PART - FORWARD THE COOKIES
      },
      body: method !== "GET" ? JSON.stringify(requestBody) : undefined,
    });
    
    try {
      const data = await response.json();
      return Response.json(data, { status: response.status });
    } catch (error) {
      const text = await response.text();
      console.error(`[AdminProxy] Error parsing response (${response.status}):`, text);
      return Response.json({ 
        error: "Failed to parse response",
        status: response.status,
        text: text.substring(0, 500)
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