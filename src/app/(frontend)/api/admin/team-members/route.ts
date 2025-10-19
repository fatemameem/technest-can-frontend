import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { requireRole } from '@/lib/auth/requireRole'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    // Authorization check
    const auth = await requireRole(['admin', 'moderator']);
    if (!auth.ok) {
      return new Response(JSON.stringify(auth.json), { status: auth.status });
    }

    const payload = await getPayload({ config: configPromise });
    const body = await req.json();
    const input = Array.isArray(body) ? body : (Array.isArray(body?.items) ? body.items : [body]);

    const created = [] as any[];
    for (const item of input) {
      // Validate image if provided (Media ID)
      if (item.image && /^[0-9a-fA-F]{24}$/.test(item.image)) {
        try {
          await payload.findByID({
            collection: 'media',
            id: item.image,
          });
        } catch (e) {
          return NextResponse.json(
            { error: `Profile image media not found with ID: ${item.image}` },
            { status: 404 }
          );
        }
      }

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
          // Only use the new image field (Media ID)
          image: item.image,
        },
        overrideAccess: true,
        depth: 1, // Populate image relation in response
      });
      created.push(doc);
    }
    
    return NextResponse.json({ ok: true, count: created.length, docs: created });
  } catch (e: any) {
    console.error('[admin/team-members] POST error', e);
    return NextResponse.json({ error: e?.message || 'Failed to create team members' }, { status: 500 });
  }
}

export async function GET() {
  const auth = await requireRole(['admin', 'moderator']);
  if (!auth.ok) {
    return new Response(JSON.stringify(auth.json), { status: auth.status });
  }

  try {
    const payload = await getPayload({ config: configPromise });
    const res = await payload.find({ 
      collection: 'team-members', 
      limit: 200, 
      sort: 'name',
      depth: 1, // Populate image relation
      overrideAccess: true 
    });
    return Response.json(res);
  } catch (error: any) {
    console.error('[admin/team-members] GET error', error);
    return new Response(JSON.stringify({ error: error?.message || 'Failed to load team members' }), { status: 500 });
  }
}
