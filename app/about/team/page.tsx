"use client";

import { Hero } from '@/components/ui/hero';
import { Section } from '@/components/ui/section';
import { TeamCard } from '@/components/cards/TeamCard';
import { useEffect, useState } from 'react';

// Convert Google Drive sharing links to direct image URLs for <img src>
function toDirectDriveUrl(link?: string): string | undefined {
  if (!link) return undefined;
  const s = String(link).trim();
  if (!s) return undefined;
  // Match formats like: /file/d/FILE_ID/view or ...?id=FILE_ID
  const dMatch = s.match(/\/d\/([a-zA-Z0-9_-]{10,})/);
  const idMatch = s.match(/[?&]id=([a-zA-Z0-9_-]{10,})/);
  const fileId = dMatch?.[1] ?? idMatch?.[1];
  return fileId ? `https://drive.google.com/uc?export=view&id=${fileId}` : s;
}

type TeamMember = {
  id: string | number;
  name: string;
  role?: string;
  bio?: string;
  imageUrl?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  email?: string;
  website?: string;
  timestamp?: string;
  [key: string]: any; // allow extra fields from Sheets without breaking
};

function normalizeMember(raw: any): TeamMember {
  const coerce = (v: any) => (typeof v === 'string' ? v.trim() : v);
  const orUndef = (v: any) => {
    const x = coerce(v);
    return x ? x : undefined;
  };
  return {
    id: raw.id ?? raw.ID ?? raw.Id ?? String(Math.random()),
    name: coerce(raw.name) ?? coerce(raw.fullName) ?? '',
    role: orUndef(raw.designation ?? raw.role),
    bio: orUndef(raw.description ?? raw.bio),
    imageUrl: toDirectDriveUrl(
      (raw.imageLink ?? raw.image_url ?? raw.imageUrl) as string | undefined
    ),
    linkedin: orUndef(raw.linkedIn ?? raw.linkedin),
    twitter: orUndef(raw.twitter),
    github: orUndef(raw.github),
    email: orUndef(raw.email),
    website: orUndef(raw.website),
    timestamp: orUndef(raw.timestamp),
    ...raw,
  };
}

export default function Team() {
  const [members, setMembers] = useState<TeamMember[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch('/api/sheets/teamInfo', { cache: 'no-store' });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data = await res.json();
        // Support either an array or an object with a `team` property
        const list: TeamMember[] = Array.isArray(data) ? data : (data?.team ?? []);
        const normalized = list.map(normalizeMember);
        if (!cancelled) setMembers(normalized);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load team data');
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  console.log('Team members:', members, 'Error:', error);

  return (
    <>
      <Hero
        title="Our Team"
        subtitle="Meet the experts behind TECH-NEST's cybersecurity and AI ethics initiatives."
        imageUrl="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&h=600&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />

      <Section>
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
            Failed to load team: {error}
          </div>
        )}

        {!error && !members && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-lg border p-6">
                <div className="h-40 w-full rounded-md bg-gray-200" />
                <div className="mt-4 h-4 w-2/3 bg-gray-200 rounded" />
                <div className="mt-2 h-4 w-1/2 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        )}

        {members && members.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>
        )}

        {members && members.length === 0 && !error && (
          <div className="text-center text-gray-600">No team members found.</div>
        )}
      </Section>
    </>
  );
}