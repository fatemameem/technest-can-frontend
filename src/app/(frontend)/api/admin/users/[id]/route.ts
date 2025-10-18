import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { requireRole } from '@/lib/auth/requireRole'

// DELETE user by ID
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // Await the params object
  const { id } = await context.params;
  
  try {
    // Authorization check - only admins can manage users
    const auth = await requireRole(['admin']);
    if (!auth.ok) {
      return new Response(JSON.stringify(auth.json), { status: auth.status });
    }

    if (!id) {
      return Response.json({ error: 'User ID is required' }, { status: 400 });
    }

    const payload = await getPayload({ config: configPromise });
    await payload.delete({
      collection: 'users',
      id,
      overrideAccess: true,
    });

    return Response.json({ success: true, message: 'User deleted successfully' });
  } catch (e: any) {
    console.error(`[admin/users/${id}] DELETE error:`, e);
    return Response.json(
      { error: e?.message || 'Failed to delete user' },
      { status: 500 }
    );
  }
}

// UPDATE user by ID
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // Await the params object
  const { id } = await context.params;
  
  try {
    // Authorization check - only admins can manage users
    const auth = await requireRole(['admin']);
    if (!auth.ok) {
      return new Response(JSON.stringify(auth.json), { status: auth.status });
    }

    if (!id) {
      return Response.json({ error: 'User ID is required' }, { status: 400 });
    }

    const body = await req.json();
    
    const payload = await getPayload({ config: configPromise });
    const updated = await payload.update({
      collection: 'users',
      id,
      data: {
        email: String(body.email || '').toLowerCase(),
        role: body.role || body.accessLevel,
      },
      overrideAccess: true,
    });

    return Response.json({ success: true, doc: updated });
  } catch (e: any) {
    console.error(`[admin/users/${id}] PUT error:`, e);
    return Response.json(
      { error: e?.message || 'Failed to update user' },
      { status: 500 }
    );
  }
}

// GET a single user by ID
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // Await the params object
  const { id } = await context.params;
  
  try {
    // Basic authorization check
    const auth = await requireRole(['admin']);
    if (!auth.ok) {
      return new Response(JSON.stringify(auth.json), { status: auth.status });
    }

    if (!id) {
      return Response.json({ error: 'User ID is required' }, { status: 400 });
    }

    const payload = await getPayload({ config: configPromise });
    const doc = await payload.findByID({
      collection: 'users',
      id,
      overrideAccess: true,
    });

    return Response.json(doc);
  } catch (e: any) {
    console.error(`[admin/users/${id}] GET error:`, e);
    return Response.json(
      { error: e?.message || 'Failed to get user' },
      { status: 500 }
    );
  }
}