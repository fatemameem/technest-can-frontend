# 🐣🔐 TECH-NEST — Cybersecurity & AI Ethics Website

**Live:** [https://tech-nest.communicatingtech.com](https://tech-nest.communicatingtech.com)
**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS · Radix UI · NextAuth (Google SSO) · Google Sheets (as CMS)

Modern, content-driven site for a cybersecurity & AI ethics collective. Fast, accessible, and easy to update—no heavyweight CMS required.

---

## ✨ Features

* **Marketing landing** with hero, services, podcasts teaser, and clear CTAs (“Explore Services”, “Upcoming Events”).
* **Events hub** with *Upcoming* / *Past* tabs, client-side sorting, and Luma/Zoom links. Data is sourced from Google Sheets.
* **Podcasts section** highlights the latest episodes pulled from Sheets.
* **Contact form** with consent checkbox, validation, toast feedback, and a `/api/contact` POST endpoint.
* **Admin dashboard** (auth-protected) to add/manage Podcasts, Events, Admins/Moderators, and Team Members.
* **Google Sign-In** via NextAuth for secure admin access and role-based features.
* **Caching** to reduce Google Sheets API calls and lower latency.

---

## 🧭 How it works (high level)

* **Frontend:** Next.js + TS + Tailwind + Radix UI.
* **Data:** Google Sheets acts like a lightweight CMS.

  * Public pages read from `/api/sheets/eventsInfo`, `/api/sheets/podcastInfo`, etc.
  * Admins create/update rows through a secure **admin proxy** to `/api/sheets/*`.
* **Auth:** NextAuth with Google provider. Guards admin actions and pages.
* **Contact:** `/api/contact` processes submissions and returns success/error for toast notifications.
* **Performance:** Route revalidation / caching to reduce quota pressure on Sheets and keep pages snappy.

---

## 📁 Project Structure

```
app/              # App Router pages & API routes (/, /about, /events, /contact, /admin, /api/*)
components/       # UI primitives, cards, sections, tabs, etc.
data/             # Sample JSON used for static content (services, stats)
hooks/            # Reusable React hooks
lib/              # Utilities (e.g., env helpers)
public/           # Images and other static assets
```

Key pages:

* `app/page.tsx` — landing (hero, services, podcasts teaser, upcoming events)
* `app/events/page.tsx` — events list with “Upcoming” and “Past” tabs + sorting
* `app/contact/page.tsx` — form with consent + POST to `/api/contact`
* `app/about/page.tsx` — mission/vision + CTA to team
* `app/admin/page.tsx` — multi-tab dashboard for podcasts, events, admins, team

---

## 🚀 Quickstart

**Requirements:** Node.js 18+

```bash
# 1) Clone
git clone https://github.com/fatemameem/technest-can-frontend
cd technest-can-frontend

# 2) Install deps
npm install

# 3) Environment
cp .env.example .env.local   # create local env and fill values

# 4) Dev server
npm run dev

# Build & start
npm run build
npm start
```

**Scripts (from `package.json`):**

```json
{
  "dev": "next dev",
  "dev:webpack": "NEXT_DISABLE_TURBOPACK=1 next dev",
  "build": "next build",
  "start": "next start",
  "typecheck": "tsc -w --noEmit",
  "lint": "next lint eslint --ext .ts,.tsx ."
}
```

---

## 🔐 Environment Variables (suggested)

> Names can vary depending on your API route implementations—adjust to match your code.

```bash
# NextAuth (Google SSO)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_long_random_string
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret

# Google Sheets (service account)
SHEETS_SPREADSHEET_ID=your_sheet_id
SHEETS_SERVICE_ACCOUNT_EMAIL=your_sa@project.iam.gserviceaccount.com
SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Mail provider used by /api/contact (example)
RESEND_API_KEY=your_resend_key
CONTACT_TO=hello@yourdomain.com
```

---

## ⚡ Caching tips (for Sheets)

Sheets is great but has quotas and latency. Keep it fast:

* **Route handler caching / revalidation** (e.g., `revalidate` in Next.js route handlers).
* **In-memory cache/LRU** for hot paths (consider invalidation on admin updates).
* **Client-side SWR** for non-critical views.

Example (pseudo-route pattern):

```ts
// app/api/sheets/eventsInfo/route.ts
export const revalidate = 300; // 5 minutes

export async function GET() {
  // 1) Try cache
  // 2) Fetch from Sheets if miss
  // 3) Normalize shape for UI (date/time parsing)
  // 4) Return JSON
}
```

---

## 🧑‍💻 Development notes

* Pages like `/events` and the home page parse dates from Sheets and sort client-side.
* Admin dashboard supports bulk add/remove, and separates concerns using small UI primitives.
* Radix UI + Tailwind keeps the design clean, accessible, and dark-mode friendly.

---

## ☁️ Deployment (Vercel)

* Push main → Vercel deployment via GH integration.
* Set **Environment Variables** in Vercel Project Settings.
* If using revalidation/caching, ensure your strategy matches ISR/Edge/Node runtime choices.

---

## 🙌 Credits

Built with ☕, Tailwind breezes, and a soft spot for ethical tech.
PRs and suggestions welcome!

