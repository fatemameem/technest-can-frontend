import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { requireRole } from '@/lib/auth/requireRole'

// DELETE event by ID
export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  const { id } = await context.params;
  
  try {
    const auth = await requireRole(['admin', 'moderator']);
    if (!auth.ok) {
      return new Response(JSON.stringify(auth.json), { status: auth.status });
    }

    if (!id) {
      return Response.json({ error: 'Event ID is required' }, { status: 400 });
    }

    const payload = await getPayload({ config: configPromise });
    
    // Optional: Get the event first to check if it has a thumbnail
    // You could optionally delete the media as well, but it's safer to keep it
    // in case it's referenced elsewhere
    const event = await payload.findByID({
      collection: 'events',
      id,
      overrideAccess: true,
    });

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
  const { id } = await context.params;
  
  try {
    const auth = await requireRole(['admin', 'moderator']);
    if (!auth.ok) {
      return new Response(JSON.stringify(auth.json), { status: auth.status });
    }

    if (!id) {
      return Response.json({ error: 'Event ID is required' }, { status: 400 });
    }

    const body = await req.json();
    
    // Validate thumbnail if provided
    if (body.thumbnail) {
      // Check if it's a valid MongoDB ObjectId
      if (!/^[0-9a-fA-F]{24}$/.test(body.thumbnail)) {
        return Response.json(
          { error: `Invalid thumbnail ID format: ${body.thumbnail}` },
          { status: 400 }
        );
      }

      // Optional: Verify the media exists
      const payload = await getPayload({ config: configPromise });
      try {
        await payload.findByID({
          collection: 'media',
          id: body.thumbnail,
        });
      } catch (e) {
        return Response.json(
          { error: `Thumbnail media not found with ID: ${body.thumbnail}` },
          { status: 404 }
        );
      }
    }
    
    const payload = await getPayload({ config: configPromise });
    
    // Prepare update data
    const updateData: any = {
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
    };

    // Add thumbnail if provided, or explicitly set to null if being removed
    if (body.thumbnail !== undefined) {
      updateData.thumbnail = body.thumbnail || null;
    }

    const updated = await payload.update({
      collection: 'events',
      id,
      data: updateData,
      overrideAccess: true,
      depth: 1, // Populate thumbnail relation in response
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
  const { id } = await context.params;
  
  try {
    if (!id) {
      return Response.json({ error: 'Event ID is required' }, { status: 400 });
    }

    const payload = await getPayload({ config: configPromise });
    const doc = await payload.findByID({
      collection: 'events',
      id,
      depth: 1, // Populate thumbnail relation
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