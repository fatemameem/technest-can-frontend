import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/requireRole';


export async function POST(req: Request) {
  try {
    const payload = await getPayload({ config: configPromise });
    const body = await req.json();
    const input = Array.isArray(body) ? body : (Array.isArray(body?.items) ? body.items : [body]);
    
    console.log('Received podcast data:', JSON.stringify(input, null, 2));
    
    const created = [] as any[];
    for (const item of input) {
      try {
        // Prepare sanitized data
        const sanitizedData: Record<string, any> = {
          title: String(item.title || ''),
          description: String(item.description || ''),
          driveLink: String(item.driveLink || item.drive || ''),
          socialLinks: {
            linkedin: String(item.linkedin || ''),
            instagram: String(item.instagram || ''),
            facebook: String(item.facebook || '')
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          thumbnail: String(item.thumbnail || ''),
          published: true
        };
        
        // Handle thumbnail - now expecting the ID directly
        if (item.thumbnail) {
          // Log for debugging
          console.log('Thumbnail value received:', item.thumbnail);
          
          // If it's a valid MongoDB ObjectId, use it directly
          if (/^[0-9a-fA-F]{24}$/.test(item.thumbnail)) {
            sanitizedData.thumbnail = item.thumbnail;
            console.log('Using valid media ID for thumbnail:', item.thumbnail);
          } 
          // If it's a URL, log a warning but continue without thumbnail
          else if (item.thumbnail.startsWith('http')) {
            console.warn('Received URL instead of Media ID:', item.thumbnail);
            console.warn('Thumbnail relation will not be set.');
          }
        }
        
        console.log('Creating podcast with sanitized data:', JSON.stringify(sanitizedData, null, 2));
        
        const doc = await payload.create({
          collection: 'podcasts',
          data: sanitizedData,
          overrideAccess: true,
          depth: 0
        });
        
        created.push(doc);
      } catch (itemError) {
        console.error('Error processing podcast item:', itemError);
      }
    }
    
    return NextResponse.json({ ok: true, count: created.length, docs: created });
  } catch (e: any) {
    console.error('[admin/podcasts] error', e);
    return NextResponse.json({ error: e?.message || 'Failed to create podcasts' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    // Authorization check
    const auth = await requireRole(['admin', 'moderator']);
    if (!auth.ok) {
      return new Response(JSON.stringify(auth.json), { status: auth.status });
    }

    const url = new URL(req.url);
    const params = Object.fromEntries(url.searchParams);
    
    const payload = await getPayload({ config: configPromise });
    
    // Add depth parameter to populate the thumbnail relation
    const podcasts = await payload.find({
      collection: 'podcasts',
      depth: 1, // This is key - it populates relations one level deep
      sort: '-createdAt',
      limit: 100,
      overrideAccess: true,
      ...params
    });
    
    return Response.json(podcasts);
  } catch (e: any) {
    console.error('[admin/podcasts] GET error:', e);
    return Response.json(
      { error: e?.message || 'Failed to fetch podcasts' },
      { status: 500 }
    );
  }
}
