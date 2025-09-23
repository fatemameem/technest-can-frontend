import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { requireRole } from '@/lib/auth/requireRole'

export async function POST(req: Request) {
  try {
    const payload = await getPayload({ config: configPromise });
    const body = await req.json();
    const input = Array.isArray(body) ? body : (Array.isArray(body?.items) ? body.items : [body]);

    const created = [] as any[];
    for (const item of input) {
      const doc = await payload.create({
        collection: 'events',
        data: {
          title: item.title,
          topic: item.topic,
          description: item.description,
          eventDetails: {
            date: item.date || item.eventDetails?.date,
            timeStart: item.timeStart || item.eventDetails?.timeStart,
            timeEnd: item.timeEnd || item.eventDetails?.timeEnd,
            timeZone: item.timeZone || item.eventDetails?.timeZone,
            location: item.location || item.eventDetails?.location,
          },
          links: {
            lumaLink: item.lumaLink || item.links?.lumaLink,
            zoomLink: item.zoomLink || item.links?.zoomLink,
          },
          sponsors: Array.isArray(item.sponsors) ? item.sponsors.join(', ') : (item.sponsors || ''),
          published: Boolean(item.published ?? true),
        },
        overrideAccess: true,
      });
      created.push(doc);
    }
    return Response.json({ ok: true, count: created.length, docs: created });
  } catch (e: any) {
    console.error('[admin/events] error', e);
    return Response.json({ error: e?.message || 'Failed to create events' }, { status: 500 });
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
      collection: 'events', 
      limit: 200, 
      sort: '-eventDetails.date',
      overrideAccess: true 
    });
    return Response.json(res);
  } catch (error: any) {
    console.error('[admin/events] GET error', error);
    return new Response(JSON.stringify({ error: error?.message || 'Failed to load events' }), { status: 500 });
  }
}
