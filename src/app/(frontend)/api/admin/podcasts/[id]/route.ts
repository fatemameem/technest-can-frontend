import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { requireRole } from '@/lib/auth/requireRole';

// DELETE podcast by ID
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
      return Response.json({ error: 'Podcast ID is required' }, { status: 400 });
    }

    const payload = await getPayload({ config: configPromise });
    await payload.delete({
      collection: 'podcasts',
      id,
      overrideAccess: true,
    });

    return Response.json({ success: true, message: 'Podcast deleted successfully' });
  } catch (e: any) {
    console.error(`[admin/podcasts/${id}] DELETE error:`, e);
    return Response.json(
      { error: e?.message || 'Failed to delete podcast' },
      { status: 500 }
    );
  }
}

// UPDATE podcast by ID
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
      return Response.json({ error: 'Podcast ID is required' }, { status: 400 });
    }

    const body = await req.json();
    
    const payload = await getPayload({ config: configPromise });
    const updated = await payload.update({
      collection: 'podcasts',
      id,
      data: {
        title: body.title,
        description: body.description,
        thumbnail: body.thumbnail,
        socialLinks: {
          linkedin: body.linkedin,
          instagram: body.instagram,
          facebook: body.facebook,
        },
        driveLink: body.driveLink || body.drive,
        published: Boolean(body.published ?? true),
      },
      overrideAccess: true,
    });

    return Response.json({ success: true, doc: updated });
  } catch (e: any) {
    console.error(`[admin/podcasts/${id}] PUT error:`, e);
    return Response.json(
      { error: e?.message || 'Failed to update podcast' },
      { status: 500 }
    );
  }
}

// GET a single podcast by ID
export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  // Await the params object
  const { id } = await context.params;
  
  try {
    if (!id) {
      return Response.json({ error: 'Podcast ID is required' }, { status: 400 });
    }

    const payload = await getPayload({ config: configPromise });
    const doc = await payload.findByID({
      collection: 'podcasts',
      id,
      overrideAccess: true,
    });

    return Response.json(doc);
  } catch (e: any) {
    console.error(`[admin/podcasts/${id}] GET error:`, e);
    return Response.json(
      { error: e?.message || 'Failed to get podcast' },
      { status: 500 }
    );
  }
}