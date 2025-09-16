import { generateStrongPassword } from '@/helpers/generateStrongPassword';
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function POST(req: Request) {
  try {
    const payload = await getPayload({ config: configPromise });
    const body = await req.json();
    const items = Array.isArray(body) ? body : (Array.isArray(body?.items) ? body.items : [body]);

    const results: any[] = [];
    for (const item of items) {
      const email = String(item.email || '').toLowerCase();
      const role = item.accessLevel || item.role;
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
