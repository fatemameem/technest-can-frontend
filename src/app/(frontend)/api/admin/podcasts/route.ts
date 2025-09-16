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
        collection: 'podcasts',
        data: {
          title: item.title,
          description: item.description,
          thumbnail: item.thumbnail,
          socialLinks: {
            linkedin: item.linkedin,
            instagram: item.instagram,
            facebook: item.facebook,
          },
          driveLink: item.driveLink || item.drive,
          published: Boolean(item.published ?? true),
        },
        overrideAccess: true,
      });
      created.push(doc);
    }
    return Response.json({ ok: true, count: created.length, docs: created });
  } catch (e: any) {
    console.error('[admin/podcasts] error', e);
    return Response.json({ error: e?.message || 'Failed to create podcasts' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise });
    const res = await payload.find({ collection: 'podcasts', limit: 100, sort: '-createdAt', overrideAccess: true });
    return Response.json(res);
  } catch (e: any) {
    return Response.json({ error: e?.message || 'Failed to load podcasts' }, { status: 500 });
  }
}
