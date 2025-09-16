import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function POST(req: Request) {
  try {
    const payload = await getPayload({ config: configPromise });
    const body = await req.json();
    const input = Array.isArray(body) ? body : (Array.isArray(body?.items) ? body.items : [body]);

    const created = [] as any[];
    for (const item of input) {
      const doc = await payload.create({
        collection: 'team-members',
        data: {
          name: item.name,
          email: String(item.email || '').toLowerCase(),
          designation: item.designation,
          description: item.description,
          socialLinks: {
            linkedin: item.linkedIn || item.linkedin || item.socialLinks?.linkedin,
            twitter: item.twitter || item.socialLinks?.twitter,
            github: item.github || item.socialLinks?.github,
          },
          website: item.website,
          image: item.imageLink || item.image,
        },
        overrideAccess: true,
      });
      created.push(doc);
    }
    return Response.json({ ok: true, count: created.length, docs: created });
  } catch (e: any) {
    console.error('[admin/team-members] error', e);
    return Response.json({ error: e?.message || 'Failed to create team members' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise });
    const res = await payload.find({ collection: 'team-members', limit: 500, sort: 'name', overrideAccess: true });
    return Response.json(res);
  } catch (e: any) {
    return Response.json({ error: e?.message || 'Failed to load team members' }, { status: 500 });
  }
}
