import { google } from "googleapis";

let authClient: ReturnType<typeof getAuth> | null = null;
function getAuth() {
  return new google.auth.JWT({
    email: process.env.GOOGLE_SA_EMAIL,
    key: process.env.GOOGLE_SA_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
}
function sheets() {
  if (!authClient) authClient = getAuth();
  return google.sheets({ version: "v4", auth: authClient });
}

export async function getValues(tab: string, a1 = "A1:Z") {
  const res = await sheets().spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID!,
    range: `${tab}!${a1}`,
    majorDimension: "ROWS",
  });
  return res.data.values ?? [];
}

export function rowsToObjects(values: string[][]) {
  const [headers, ...rows] = values;
  if (!headers) return [];
  const keys = headers.map((h) => String(h).trim());
  return rows.map((r) =>
    Object.fromEntries(keys.map((k, i) => [k, String(r[i] ?? "").trim()]))
  );
}

// light coercion for booleans/numbers/ISO date strings
export function coerce<T extends Record<string, any>>(rec: T): T {
  const toVal = (v: string) => {
    if (v === "TRUE" || v === "true") return true;
    if (v === "FALSE" || v === "false") return false;
    if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
    return v;
  };
  const out: Record<string, any> = {};
  for (const k in rec) out[k] = toVal(rec[k]);
  return out as T;
}