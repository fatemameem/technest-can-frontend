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

    const body = await req.json();
    
    const payload = await getPayload({ config: configPromise });
    const updated = await payload.update({
      collection: 'team-members',
      id,
      data: {
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
        image: body.imageLink || body.image || '',
      },
      overrideAccess: true,
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