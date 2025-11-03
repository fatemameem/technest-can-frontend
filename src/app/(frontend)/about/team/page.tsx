import 'server-only';
import { Hero } from '@/components/ui/hero';
import { Section } from '@/components/ui/section';
import { TeamCard } from '@/components/cards/TeamCard';
import type { TeamMember } from '@/types';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const metadata: Metadata = {
  title: 'Team | TECH-NEST',
  description: 'Meet the experts behind TECH-NEST.'
};

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

export default async function Team() {
  const payload = await getPayload({ config: configPromise });
  const result = await payload.find({
    collection: 'team-members',
    sort: 'name',
    limit: 500,
    overrideAccess: true,
  });
  const docs = result?.docs || [];
  const members: TeamMember[] = docs.map((raw: any) =>
    normalizeMember({
      id: raw.id,
      name: raw.name,
      designation: raw.designation,
      description: raw.description,
      imageLink: raw.image.url,
      linkedin: raw.socialLinks?.linkedin,
      twitter: raw.socialLinks?.twitter,
      github: raw.socialLinks?.github,
      email: raw.email,
      website: raw.website,
      timestamp: raw.createdAt,
    })
  );

  return (
    <>
      <Hero
        title="Our Team"
        subtitle="Meet the experts behind TECH-NEST's cybersecurity and AI ethics initiatives."
        imageUrl="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&h=600&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />

      <Section>
        {members.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>
        )}

        {members.length === 0 && (
          <div className="text-center text-gray-600">No team members found.</div>
        )}
      </Section>
    </>
  );
}
