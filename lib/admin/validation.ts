// -------- Helper utilities (validation, timestamp, posting) --------
const isNonEmpty = (s: string | undefined | null) => !!s && s.trim().length > 0;

const isValidUrl = (s: string | undefined | null) => {
  if (!isNonEmpty(s || "")) return true; // treat empty as valid for optional fields
  try {
    const u = new URL((s || "").trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

const sanitize = (s: string | undefined | null) => (s || "").trim();

const buildTimestamp = () => new Date().toISOString();

const parseWhen = (v: any): number => {
  // try ISO/date first, then numeric id fallback
  const s = String(v ?? "");
  const t = Date.parse(s);
  if (!Number.isNaN(t)) return t;
  const n = Number(s);
  if (!Number.isNaN(n)) return n;
  return 0;
};

// Human-readable "time ago" formatter
const formatRelative = (ms: number): string => {
  if (!ms) return "—";
  const diff = Date.now() - ms;
  if (diff < 0) return "Just now";
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return "Just now";
  if (diff < hour) {
    const mins = Math.floor(diff / minute);
    return mins === 1 ? "1 min ago" : `${mins} mins ago`;
  }
  if (diff < day) {
    const hrs = Math.floor(diff / hour);
    return hrs === 1 ? "1 hour ago" : `${hrs} hours ago`;
  }
  const days = Math.floor(diff / day);
  return days === 1 ? "1 day ago" : `${days} days ago`;
};

export { isNonEmpty, isValidUrl, sanitize, buildTimestamp, parseWhen, formatRelative };