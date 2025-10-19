import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { requireRole } from '@/lib/auth/requireRole'

// DELETE team member by ID
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
      return Response.json({ error: 'Team member ID is required' }, { status: 400 });
    }

    const payload = await getPayload({ config: configPromise });
    await payload.delete({
      collection: 'team-members',
      id,
      overrideAccess: true,
    });

    return Response.json({ success: true, message: 'Team member deleted successfully' });
  } catch (e: any) {
    console.error(`[admin/team-members/${id}] DELETE error:`, e);
    return Response.json(
      { error: e?.message || 'Failed to delete team member' },
      { status: 500 }
    );
  }
}

// UPDATE team member by ID
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  
  try {
    // Authorization check
    const auth = await requireRole(['admin', 'moderator']);
    if (!auth.ok) {
      return new Response(JSON.stringify(auth.json), { status: auth.status });
    }

    if (!id) {
      return Response.json({ error: 'Team member ID is required' }, { status: 400 });
    }

    const body = await req.json();
    
    // Validate image if provided (Media ID)
    if (body.image && /^[0-9a-fA-F]{24}$/.test(body.image)) {
      const payload = await getPayload({ config: configPromise });
      try {
        await payload.findByID({
          collection: 'media',
          id: body.image,
        });
      } catch (e) {
        return Response.json(
          { error: `Profile image media not found with ID: ${body.image}` },
          { status: 404 }
        );
      }
    }
    
    const payload = await getPayload({ config: configPromise });
    
    const updateData: any = {
      name: body.name,
      email: String(body.email || '').toLowerCase(),
      designation: body.designation,
      description: body.description,
      socialLinks: {
        linkedin: body.linkedIn || body.linkedin || body.socialLinks?.linkedin || '',
        twitter: body.twitter || body.socialLinks?.twitter || '',
        github: body.github || body.socialLinks?.github || '',
      },
      website: body.website || '',
      // Only use the new image field
      image: body.image || null,
    };

    const updated = await payload.update({
      collection: 'team-members',
      id,
      data: updateData,
      overrideAccess: true,
      depth: 1, // Populate image relation in response
    });

    return Response.json({ success: true, doc: updated });
  } catch (e: any) {
    console.error(`[admin/team-members/${id}] PUT error:`, e);
    return Response.json(
      { error: e?.message || 'Failed to update team member' },
      { status: 500 }
    );
  }
}

// GET a single team member by ID
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
)  {
  const { id } = await context.params;
  
  try {
    if (!id) {
      return Response.json({ error: 'Team member ID is required' }, { status: 400 });
    }

    const payload = await getPayload({ config: configPromise });
    const doc = await payload.findByID({
      collection: 'team-members',
      id,
      overrideAccess: true,
    });

    return Response.json(doc);
  } catch (e: any) {
    console.error(`[admin/team-members/${id}] GET error:`, e);
    return Response.json(
      { error: e?.message || 'Failed to get team member' },
      { status: 500 }
    );
  }
}