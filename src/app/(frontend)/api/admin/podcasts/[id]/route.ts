import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { requireRole } from '@/lib/auth/requireRole';

// DELETE podcast by ID
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
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
  context: { params: Promise<{ id: string }> }
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
      description: body.description,
      driveLink: body.driveLink || body.drive,
      socialLinks: {
        linkedin: body.linkedin || body.socialLinks?.linkedin,
        instagram: body.instagram || body.socialLinks?.instagram,
        facebook: body.facebook || body.socialLinks?.facebook,
      },
      // Add these arrays
      learnMoreLinks: Array.isArray(body.learnMoreLinks)
        ? body.learnMoreLinks
            .filter((link: any) => link.label?.trim() && link.url?.trim())
            .map((link: any) => ({
              label: String(link.label).trim(),
              url: String(link.url).trim(),
            }))
        : [],
      resourcesLinks: Array.isArray(body.resourcesLinks)
        ? body.resourcesLinks
            .filter((link: any) => link.label?.trim() && link.url?.trim())
            .map((link: any) => ({
              label: String(link.label).trim(),
              url: String(link.url).trim(),
            }))
        : [],
      published: Boolean(body.published ?? true),
    };

    // Add thumbnail if provided, or explicitly set to null if being removed
    if (body.thumbnail !== undefined) {
      updateData.thumbnail = body.thumbnail || null;
    }

    const updated = await payload.update({
      collection: 'podcasts',
      id,
      data: updateData,
      overrideAccess: true,
      depth: 1, // Populate thumbnail relation in response
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
  context: { params: Promise<{ id: string }> }
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
      depth: 1, // Populate thumbnail relation
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