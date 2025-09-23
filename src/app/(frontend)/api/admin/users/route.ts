import { generateStrongPassword } from '@/helpers/generateStrongPassword';
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { requireRole } from '@/lib/auth/requireRole';

export async function POST(req: Request) {
  try {
    const payload = await getPayload({ config: configPromise });
    const body = await req.json();
    const items = Array.isArray(body) ? body : (Array.isArray(body?.items) ? body.items : [body]);

    const results: any[] = [];
    for (const item of items) {
      const email = String(item.email || '').toLowerCase();
      const role = item.accessLevel || item.role;
      const name = item.name || email; // Use email as fallback if name is not provided
      if (!email || !role) continue;

      const existing = await payload.find({ collection: 'users', where: { email: { equals: email } }, depth: 0, limit: 1, overrideAccess: true });
      if (existing.docs?.length) {
        const updated = await payload.update({ collection: 'users', id: existing.docs[0].id, data: { role }, overrideAccess: true });
        results.push(updated);
      } else {
        // Generate a unique strong password for each new user
        const password = generateStrongPassword();
        
        // Create user with the generated password
        const created = await payload.create({ 
          collection: 'users', 
          data: {
            name, 
            email, 
            role, 
            password  // Include the generated password
          }, 
          overrideAccess: true 
        });
        
        // Don't return the password in the response
        results.push({ ...created, password: undefined });
        
        // Optional: Log that a password was generated (for debugging)
        console.log(`Created user ${email} with auto-generated password`);
      }
    }
    return Response.json({ ok: true, count: results.length, docs: results });
  } catch (e: any) {
    console.error('[admin/users] error', e);
    return Response.json({ error: e?.message || 'Failed to upsert users' }, { status: 500 });
  }
}

// Add this GET function to your existing route.ts file
export async function GET() {
  try {
    // Only admins should be able to list all users
    const auth = await requireRole(['admin']);
    if (!auth.ok) {
      return new Response(JSON.stringify(auth.json), { status: auth.status });
    }
    
    const payload = await getPayload({ config: configPromise });
    const res = await payload.find({ 
      collection: 'users', 
      limit: 100, 
      sort: 'email',
      overrideAccess: true 
    });
    
    return Response.json(res);
  } catch (e: any) {
    console.error('[admin/users] GET error', e);
    return Response.json(
      { error: e?.message || 'Failed to load users' }, 
      { status: 500 }
    );
  }
}
