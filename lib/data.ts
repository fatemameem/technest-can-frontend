// lib/data.ts
import "server-only";
import { cache } from "react";

/**
 * Base builder for your internal Sheets API.
 * Use an absolute base in server code to avoid env differences.
 * Expect process.env.API to equal something like `${process.env.NEXT_PUBLIC_BASE_URL}/api`
 * or just `/api` in dev with Next.js runtime aware of host.
 */
const API_BASE = process.env.API ?? "/api";

type FetchOpts = {
  /** Next.js revalidate seconds (default 300) */
  revalidate?: number;
  /** Tag for route segment cache invalidation */
  tag?: string;
  /** Optional query params, e.g., { limit: "4" } */
  query?: Record<string, string | number | boolean | undefined>;
};

/**
 * Generic sheet fetcher (GET) with caching.
 * Example:
 *   await getSheet("eventsInfo", { revalidate: 3600, tag: "events", query: { limit: "6" } })
 */
export const getSheet = cache(async (tab: string, opts: FetchOpts = {}) => {
  const { revalidate = 300, tag, query } = opts;
  const qs = new URLSearchParams();
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (typeof v !== "undefined" && v !== null) qs.set(k, String(v));
    });
  }
  const url = `${API_BASE}/sheets/${encodeURIComponent(tab)}${qs.toString() ? `?${qs}` : ""}`;
  const init: RequestInit & { next: { revalidate: number; tags?: string[] } } = {
    next: { revalidate, ...(tag ? { tags: [tag] } : {}) },
  };
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`Failed to fetch sheet: ${tab}`);
  return res.json();
});

/**
 * Specific helpers (still use the generic under the hood)
 * Use these if you prefer semantic names in pages/components.
 * They only call the generic once thanks to `cache()`.
 */
export const getEvents = cache(async () => {
  return getSheet("eventsInfo", { revalidate: 60, tag: "events" });
});

export const getPodcasts = cache(async () => {
  // NOTE: fixed path from "podcastsInfo" -> "podcastInfo"
  return getSheet("podcastInfo", { revalidate: 60, tag: "podcasts" });
});

export const getSubscribers = cache(async () => {
  return getSheet("subscriberInfo", { revalidate: 60, tag: "subscribers" });
});

/**
 * Batched for home page (fetch once, pass via props)
 */
export const getHomeData = cache(async () => {
  const [events, podcasts] = await Promise.all([
    getEvents(),
    getPodcasts(),
  ]);
  return { events, podcasts };
});

/**
 * Pattern for Server Component usage:
 * 
 * // app/(site)/page.tsx
 * import { getHomeData } from "@/lib/data";
 * export default async function Home() {
 *   const { events, podcasts } = await getHomeData(); // fetched once on the server
 *   return <HomePage events={events} podcasts={podcasts} />; // pass via props
 * }
 * 
 * // components/HomePage.tsx (Client or Server component)
 * export default function HomePage({ events, podcasts }: { events: any[]; podcasts: any[] }) {
 *   // render without additional fetch calls
 * }
 */