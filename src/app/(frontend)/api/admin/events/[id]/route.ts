import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { requireRole } from '@/lib/auth/requireRole'

// DELETE event by ID
export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  // Await the params object
  const { id } = await context.params;
  
  try {
    // Authorization check
    const auth = await requireRole(['admin', 'moderator']);
    if (!auth.ok) {
      return new Response(JSON.stringify(auth.json), { status: auth.status });
    }

    if (!id) {
      return Response.json({ error: 'Event ID is required' }, { status: 400 });
    }

    const payload = await getPayload({ config: configPromise });
    await payload.delete({
      collection: 'events',
      id,
      overrideAccess: true,
    });

    return Response.json({ success: true, message: 'Event deleted successfully' });
  } catch (e: any) {
    console.error(`[admin/events/${id}] DELETE error:`, e);
    return Response.json(
      { error: e?.message || 'Failed to delete event' },
      { status: 500 }
    );
  }
}

// UPDATE event by ID
export async function PUT(
  req: Request,
  context: { params: { id: string } }
) {
  // Await the params object
  const { id } = await context.params;
  
  try {
    // Authorization check
    const auth = await requireRole(['admin', 'moderator']);
    if (!auth.ok) {
      return new Response(JSON.stringify(auth.json), { status: auth.status });
    }

    if (!id) {
      return Response.json({ error: 'Event ID is required' }, { status: 400 });
    }

    const body = await req.json();
    
    const payload = await getPayload({ config: configPromise });
    const updated = await payload.update({
      collection: 'events',
      id,
      data: {
        title: body.title,
        topic: body.topic,
        description: body.description,
        eventDetails: {
          date: body.date || body.eventDetails?.date,
          timeStart: body.time || body.timeStart || body.eventDetails?.timeStart,
          timeEnd: body.timeEnd || body.eventDetails?.timeEnd,
          timeZone: body.timeZone || body.eventDetails?.timeZone || 'EST',
          location: body.location || body.eventDetails?.location,
        },
        links: {
          lumaLink: body.lumaLink || body.links?.lumaLink,
          zoomLink: body.zoomLink || body.links?.zoomLink,
        },
        sponsors: Array.isArray(body.sponsors) 
          ? body.sponsors.filter((s: string) => s).join(', ') 
          : (body.sponsors || ''),
        published: Boolean(body.published ?? true),
      },
      overrideAccess: true,
    });

    return Response.json({ success: true, doc: updated });
  } catch (e: any) {
    console.error(`[admin/events/${id}] PUT error:`, e);
    return Response.json(
      { error: e?.message || 'Failed to update event' },
      { status: 500 }
    );
  }
}

// GET a single event by ID
export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  // Await the params object
  const { id } = await context.params;
  
  try {
    if (!id) {
      return Response.json({ error: 'Event ID is required' }, { status: 400 });
    }

    const payload = await getPayload({ config: configPromise });
    const doc = await payload.findByID({
      collection: 'events',
      id,
      overrideAccess: true,
    });

    return Response.json(doc);
  } catch (e: any) {
    console.error(`[admin/events/${id}] GET error:`, e);
    return Response.json(
      { error: e?.message || 'Failed to get event' },
      { status: 500 }
    );
  }
}