import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { requireRole } from '@/lib/auth/requireRole'

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
      // Validate thumbnail if provided
      if (item.thumbnail) {
        // Check if it's a valid MongoDB ObjectId (24 hex characters)
        if (!/^[0-9a-fA-F]{24}$/.test(item.thumbnail)) {
          return Response.json(
            { error: `Invalid thumbnail ID format: ${item.thumbnail}` },
            { status: 400 }
          );
        }

        // Optional: Verify the media exists
        try {
          await payload.findByID({
            collection: 'media',
            id: item.thumbnail,
          });
        } catch (e) {
          return Response.json(
            { error: `Thumbnail media not found with ID: ${item.thumbnail}` },
            { status: 404 }
          );
        }
      }

      const doc = await payload.create({
        collection: 'events',
        data: {
          title: item.title,
          topic: item.topic,
          description: item.description,
          eventDetails: {
            date: item.date || item.eventDetails?.date,
            timeStart: item.timeStart || item.time || item.eventDetails?.timeStart,
            timeEnd: item.timeEnd || item.eventDetails?.timeEnd,
            timeZone: item.timeZone || item.eventDetails?.timeZone || 'EST',
            location: item.location || item.eventDetails?.location,
          },
          links: {
            lumaLink: item.lumaLink || item.links?.lumaLink,
            zoomLink: item.zoomLink || item.links?.zoomLink,
          },
          sponsors: Array.isArray(item.sponsors) 
            ? item.sponsors.join(', ') 
            : (item.sponsors || ''),
          // Add thumbnail field - this references the Media collection
          thumbnail: item.thumbnail || undefined,
          published: Boolean(item.published ?? true),
        },
        overrideAccess: true,
        depth: 1, // Populate the thumbnail relation in response
      });
      created.push(doc);
    }
    return Response.json({ ok: true, count: created.length, docs: created });
  } catch (e: any) {
    console.error('[admin/events] POST error', e);
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
      depth: 1, // Populate thumbnail relation
      overrideAccess: true 
    });
    return Response.json(res);
  } catch (error: any) {
    console.error('[admin/events] GET error', error);
    return new Response(JSON.stringify({ error: error?.message || 'Failed to load events' }), { status: 500 });
  }
}
