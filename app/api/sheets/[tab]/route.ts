import { NextResponse } from "next/server";
import { z } from "zod";
import { getValues, rowsToObjects, coerce } from "@/lib/sheets";
import { google } from "googleapis";

export const runtime = "nodejs";       // required for googleapis
export const dynamic = "force-dynamic"; // opt out of static optimization
// or: export const revalidate = 0;

function getSheetsClientRW() {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SA_EMAIL,
    key: process.env.GOOGLE_SA_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"], // read/write
  });
  return google.sheets({ version: "v4", auth });
}

// in-memory cache (per server instance)
type Entry = { data: any; exp: number; stale: number };
const cache: Record<string, Entry> =
  (globalThis as any).__sheetCache ?? ((globalThis as any).__sheetCache = {});

function clearTabCache(tab: string) {
  const prefix = `sheets:${tab}:`;
  Object.keys(cache).forEach((k) => {
    if (k.startsWith(prefix)) delete cache[k];
  });
}

const TTL = Number(process.env.CACHE_TTL_SECONDS ?? 300);
const MAX_STALE = Number(process.env.CACHE_MAXSTALE_SECONDS ?? 900);
const now = () => Math.floor(Date.now() / 1000);

const Query = z.object({
  range: z.string().default("A1:Z"),
  limit: z.coerce.number().int().min(1).max(1000).optional(),
  offset: z.coerce.number().int().min(0).optional(),
  select: z.string().optional(), // comma-separated fields
});

function key(tab: string, q: unknown) {
  return `sheets:${tab}:${JSON.stringify(q)}`;
}

export async function GET(req: Request, ctx: { params: Promise<{ tab: string }> }) {
  const { tab } = await ctx.params;
  const url = new URL(req.url);
  const parsed = Query.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  const q = parsed.data;
  const k = key(tab, q);
  const t = now();

  const hit = cache[k];
  if (hit && t < hit.exp) {
    return NextResponse.json(hit.data, {
      headers: { "cache-control": `s-maxage=${TTL}, stale-while-revalidate=${MAX_STALE}` },
    });
  }

  try {
    const values = await getValues(tab, q.range);
    let rows = rowsToObjects(values).map(coerce);

    // add id field from timestamp
    rows = rows.map((r: any) => ({
      id: new Date(r["Timestamp"]).getTime().toString(), // numeric timestamp as string
      ...r,
    }));

    // 🔽 put your mapping logic here
    const mapByTab = {
      eventsInfo: (r: any) => ({
        id: r.id,
        timestamp: r["Timestamp"],
        title: r["Title"],
        topic: r["Topic"],
        description: r["Description"],
        date: r["Date"],
        time: r["Time"],
        location: r["Location"],
        lumaLink: r["Lu.ma Link"],
        zoomLink: r["Zoom Link"],
        sponsors: r["Sponsors"],
      }),
      podcastInfo: (r: any) => ({
        id: r.id,
        timestamp: r["Timestamp"],
        title: r["Title of the Podcast"],
        description: r["Description"],
        linkedin: r["LinkedIn link"],
        instagram: r["Instagram link"],
        youtube: r["Youtube link"],
        facebook: r["Facebook link"],
      }),
      subscriberInfo: (r: any) => ({
        id: r.id,
        timestamp: r["Timestamp"],
        fullName: r["Full Name"],
        email: r["Email Address"],
      }),
    } as const;

    const mapper = (mapByTab as any)[tab];
    if (mapper) rows = rows.map(mapper);

    // pagination
    const start = q.offset ?? 0;
    const end = q.limit ? start + q.limit : undefined;
    rows = rows.slice(start, end);

    // column selection
    if (q.select) {
      const fields = q.select.split(",").map((s) => s.trim()).filter(Boolean);
      rows = rows.map((r) => Object.fromEntries(fields.map((f) => [f, (r as any)[f]])));
    }

    cache[k] = { data: rows, exp: t + TTL, stale: t + TTL + MAX_STALE };

    return NextResponse.json(rows, {
      headers: { "cache-control": `s-maxage=${TTL}, stale-while-revalidate=${MAX_STALE}` },
    });
  } catch (e: any) {
    // Log detailed info to your terminal
    console.error("Sheets error:", e?.response?.data || e?.errors || e?.message || e);

    // If you want to see it in the browser while debugging locally:
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json(
        { error: "Sheets read failed", detail: e?.response?.data || e?.errors || e?.message || String(e) },
        { status: 502 }
      );
    }

    // Fallback for prod
    if (hit && t < hit.stale) {
      return NextResponse.json(hit.data, {
        headers: { "cache-control": `s-maxage=0, stale-while-revalidate=${MAX_STALE}` },
      });
    }
    return NextResponse.json({ error: "Sheets read failed" }, { status: 502 });
  }
}

// ---------------- POST: append a new row ----------------
export async function POST(
  req: Request,
  { params }: { params: Promise<{ tab: string }> }
) {
  const { tab } = await params;

  // Define per-tab schemas for payloads
  const PodcastSchema = z.object({
    timestamp: z.string().optional(),
    title: z.string().min(1),
    description: z.string().optional().default(""),
    linkedin: z.string().url().optional().or(z.literal("")).default(""),
    instagram: z.string().url().optional().or(z.literal("")).default(""),
    youtube: z.string().url().optional().or(z.literal("")).default(""),
    facebook: z.string().url().optional().or(z.literal("")).default(""),
  });

  const EventsSchema = z.object({
    timestamp: z.string().optional(),
    title: z.string().min(1),
    topic: z.string().optional().default(""),
    description: z.string().optional().default(""),
    date: z.string().optional().default(""),   // send as display string or ISO
    time: z.string().optional().default(""),
    location: z.string().optional().default(""),
    lumaLink: z.string().url().optional().or(z.literal("")).default(""),
    zoomLink: z.string().url().optional().or(z.literal("")).default(""),
    sponsors: z.string().optional().default(""),
  });

  const SubscriberSchema = z.object({
    timestamp: z.string().optional(),
    fullName: z.string().min(1),
    email: z.string().email(),
  });

  // Parse body once
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Build values array in exact column order per tab
  let values: string[] | null = null;

  try {
    if (tab === "podcastInfo") {
      const p = PodcastSchema.parse(json);
      values = [
        p.timestamp ?? new Date().toISOString(), // Timestamp
        p.title,                                  // Title of the Podcast
        p.description,                            // Description
        p.linkedin,                               // LinkedIn link
        p.instagram,                              // Instagram link
        p.youtube,                                // Youtube link
        p.facebook,                               // Facebook link
      ];
    } else if (tab === "eventsInfo") {
      const e = EventsSchema.parse(json);
      values = [
        e.timestamp ?? new Date().toISOString(), // Timestamp
        e.title,                                  // Title
        e.topic,                                  // Topic
        e.description,                            // Description
        e.date,                                   // Date
        e.time,                                   // Time
        e.location,                               // Location
        e.lumaLink,                               // Lu.ma Link
        e.zoomLink,                               // Zoom Link
        e.sponsors,                               // Sponsors
      ];
    } else if (tab === "subscriberInfo") {
      const s = SubscriberSchema.parse(json);
      values = [
        s.timestamp ?? new Date().toISOString(), // Timestamp
        s.fullName,                               // Full Name
        s.email,                                  // Email Address
      ];
    } else {
      return NextResponse.json({ error: "Unknown tab" }, { status: 400 });
    }
  } catch (err: any) {
    // zod validation errors
    return NextResponse.json(
      { error: "Validation failed", issues: err?.issues ?? String(err) },
      { status: 400 }
    );
  }

  // Append to sheet
  try {
    const sheets = getSheetsClientRW();
    const res = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID!,
      range: `${tab}!A1:Z`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [values] },
    });

    // Clear cached GET responses for this tab so new data shows up immediately
    clearTabCache(tab);

    return NextResponse.json({ ok: true, updates: res.data.updates }, { status: 201 });
  } catch (e: any) {
    console.error("Sheets append error:", e?.response?.data || e?.message || e);
    return NextResponse.json({ error: "Write failed" }, { status: 502 });
  }
}