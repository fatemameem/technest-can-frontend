import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/requireRole';

export async function POST(req: Request) {
  try {
    // Authorization check
    const auth = await requireRole(['admin', 'moderator']);
    if (!auth.ok) {
      return new Response(JSON.stringify(auth.json), { status: auth.status });
    }

    const payload = await getPayload({ config: configPromise });
    const body = await req.json();
    const input = Array.isArray(body) ? body : (Array.isArray(body?.items) ? body.items : [body]);
    
    console.log('Received podcast data:', JSON.stringify(input, null, 2));
    
    const created = [] as any[];
    for (const item of input) {
      try {
        // Prepare sanitized data with proper typing
        const sanitizedData = {
          title: String(item.title || ''),
          description: String(item.description || ''),
          driveLink: String(item.driveLink || item.drive || ''),
          socialLinks: {
            linkedin: String(item.linkedin || ''),
            instagram: String(item.instagram || ''),
            facebook: String(item.facebook || '')
          },
          published: true,
          // Add these arrays
          learnMoreLinks: Array.isArray(item.learnMoreLinks)
            ? item.learnMoreLinks
                .filter((link: any) => link.label?.trim() && link.url?.trim())
                .map((link: any) => ({
                  label: String(link.label).trim(),
                  url: String(link.url).trim(),
                }))
            : [],
          resourcesLinks: Array.isArray(item.resourcesLinks)
            ? item.resourcesLinks
                .filter((link: any) => link.label?.trim() && link.url?.trim())
                .map((link: any) => ({
                  label: String(link.label).trim(),
                  url: String(link.url).trim(),
                }))
            : [],
          // Only add thumbnail if it's a valid Media ID
          ...(item.thumbnail && /^[0-9a-fA-F]{24}$/.test(item.thumbnail) 
            ? { thumbnail: item.thumbnail } 
            : {}
          ),
        };
        
        // Log for debugging
        if (item.thumbnail) {
          console.log('Thumbnail value received:', item.thumbnail);
          
          if (/^[0-9a-fA-F]{24}$/.test(item.thumbnail)) {
            console.log('Using valid media ID for thumbnail:', item.thumbnail);
          } else if (item.thumbnail.startsWith('http')) {
            console.warn('Received URL instead of Media ID:', item.thumbnail);
            console.warn('Thumbnail relation will not be set.');
          }
        }
        
        console.log('Creating podcast with sanitized data:', JSON.stringify(sanitizedData, null, 2));
        
        const doc = await payload.create({
          collection: 'podcasts',
          data: sanitizedData,
          overrideAccess: true,
          depth: 1, // Populate thumbnail relation in response
        });
        
        created.push(doc);
      } catch (itemError) {
        console.error('Error processing podcast item:', itemError);
        throw itemError; // Re-throw to be caught by outer catch
      }
    }
    
    return NextResponse.json({ ok: true, count: created.length, docs: created });
  } catch (e: any) {
    console.error('[admin/podcasts] POST error:', e);
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
