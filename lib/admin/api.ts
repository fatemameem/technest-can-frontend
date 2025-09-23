// -------- Payload-backed admin API helpers --------
async function createPodcasts(entries: any | any[]) {
  const items = Array.isArray(entries) ? entries : [entries];
  const res = await fetch('/api/admin/podcasts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(items) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function createEvents(entries: any | any[]) {
  const items = Array.isArray(entries) ? entries : [entries];
  const res = await fetch('/api/admin/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(items) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function createTeamMembers(entries: any | any[]) {
  const items = Array.isArray(entries) ? entries : [entries];
  const res = await fetch('/api/admin/team-members', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(items) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function upsertUsers(entries: any | any[]) {
  const items = Array.isArray(entries) ? entries : [entries];
  const res = await fetch('/api/admin/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(items) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function createBlogs(entries: any | any[]) {
  const items = Array.isArray(entries) ? entries : [entries];
  const res = await fetch('/api/admin/blogs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(items) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function fetchStats() {
  const res = await fetch('/api/admin/stats', { cache: 'no-store' });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function fetchPodcasts(params: any) {
  const res = await fetch(`/api/admin/podcasts?${new URLSearchParams(params)}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function fetchEvents(params: any) {
  const res = await fetch(`/api/admin/events?${new URLSearchParams(params)}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function fetchTeamMembers(params: any) {
  const res = await fetch(`/api/admin/team-members?${new URLSearchParams(params)}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function fetchUsers(params: any) {
  const res = await fetch(`/api/admin/users?${new URLSearchParams(params)}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function fetchBlogs(params: any) {
  const res = await fetch(`/api/admin/blogs?${new URLSearchParams(params)}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export { createPodcasts, createEvents, createTeamMembers, upsertUsers, createBlogs, fetchStats, fetchPodcasts, fetchEvents, fetchTeamMembers, fetchUsers, fetchBlogs };