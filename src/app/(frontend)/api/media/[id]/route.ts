// //cloudinary- API route for fetching a single media item

// filepath: /src/app/(frontend)/api/media/[id]/route.ts
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Await params to get the id
    const { id } = await context.params;
    console.log('Fetching media with ID:', id);
    
    if (!id || id.length !== 24) {
      console.warn('Invalid media ID format:', id);
      return NextResponse.json({ error: 'Invalid media ID' }, { status: 400 });
    }
    
    const payload = await getPayload({ config: configPromise });
    
    try {
      console.log('Searching for media document with ID:', id);
      const media = await payload.findByID({
        collection: 'media',
        id,
        overrideAccess: true, // Bypass access control
      });
      
      if (!media) {
        console.log('Media not found with ID:', id);
        return NextResponse.json({ error: 'Media not found' }, { status: 404 });
      }
      
      console.log('Found media:', media.id);
      return NextResponse.json(media);
    } catch (findError) {
      console.error('Error finding media:', findError);
      
      // If we can't find by ID, try finding by Cloudinary URL
      console.log('Attempting to find media by cloudinary URL');
      const mediaResults = await payload.find({
        collection: 'media',
        overrideAccess: true,
        limit: 1,
      });
      
      console.log(`Found ${mediaResults.totalDocs} media documents`);
      
      // Return 404 if truly not found
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch media',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}