import 'server-only';
import { Payload } from 'payload';

/**
 * Utility to find and optionally delete orphaned media files
 * (Media documents that are not referenced by any other collection)
 * 
 * Usage:
 * const payload = await getPayload({ config: configPromise });
 * const orphaned = await findOrphanedMedia(payload);
 * console.log(`Found ${orphaned.length} orphaned media files`);
 * 
 * // To delete them:
 * await deleteOrphanedMedia(payload, orphaned);
 */

export async function findOrphanedMedia(payload: Payload): Promise<string[]> {
  try {
    // Get all media IDs
    const allMedia = await payload.find({
      collection: 'media',
      limit: 10000,
      pagination: false,
    });

    const allMediaIds = new Set(allMedia.docs.map((doc: any) => doc.id));
    const referencedMediaIds = new Set<string>();

    // Check blogs
    const blogs = await payload.find({
      collection: 'blogs',
      limit: 10000,
      pagination: false,
    });

    blogs.docs.forEach((blog: any) => {
      // Cover image
      if (blog.coverImage) {
        const id = typeof blog.coverImage === 'string' ? blog.coverImage : blog.coverImage?.id;
        if (id) referencedMediaIds.add(id);
      }

      // OG image
      if (blog.meta?.seo?.ogImage) {
        const id = typeof blog.meta.seo.ogImage === 'string' ? blog.meta.seo.ogImage : blog.meta.seo.ogImage?.id;
        if (id) referencedMediaIds.add(id);
      }

      // Block images
      if (Array.isArray(blog.blocks)) {
        blog.blocks.forEach((block: any) => {
          if (block.type === 'Image' && block.props?.mediaId) {
            referencedMediaIds.add(block.props.mediaId);
          }
        });
      }
    });

    // Check events
    const events = await payload.find({
      collection: 'events',
      limit: 10000,
      pagination: false,
    });

    events.docs.forEach((event: any) => {
      if (event.thumbnail) {
        const id = typeof event.thumbnail === 'string' ? event.thumbnail : event.thumbnail?.id;
        if (id) referencedMediaIds.add(id);
      }
    });

    // Check podcasts
    const podcasts = await payload.find({
      collection: 'podcasts',
      limit: 10000,
      pagination: false,
    });

    podcasts.docs.forEach((podcast: any) => {
      if (podcast.thumbnail) {
        const id = typeof podcast.thumbnail === 'string' ? podcast.thumbnail : podcast.thumbnail?.id;
        if (id) referencedMediaIds.add(id);
      }
    });

    // Check team members
    const teamMembers = await payload.find({
      collection: 'team-members',
      limit: 10000,
      pagination: false,
    });

    teamMembers.docs.forEach((member: any) => {
      if (member.image) {
        const id = typeof member.image === 'string' ? member.image : member.image?.id;
        if (id) referencedMediaIds.add(id);
      }
    });

    // Find orphaned media (in allMedia but not referenced)
    const orphanedIds: string[] = [];
    allMediaIds.forEach((mediaId) => {
      if (!referencedMediaIds.has(mediaId)) {
        orphanedIds.push(mediaId);
      }
    });

    return orphanedIds;
  } catch (error) {
    console.error('Error finding orphaned media:', error);
    throw error;
  }
}

export async function deleteOrphanedMedia(
  payload: Payload,
  orphanedIds: string[]
): Promise<{ deleted: number; errors: number }> {
  let deleted = 0;
  let errors = 0;

  for (const mediaId of orphanedIds) {
    try {
      await payload.delete({
        collection: 'media',
        id: mediaId,
        overrideAccess: true,
      });
      deleted++;
      console.log(`✅ Deleted orphaned media: ${mediaId}`);
    } catch (error) {
      errors++;
      console.error(`❌ Error deleting orphaned media ${mediaId}:`, error);
    }
  }

  return { deleted, errors };
}

/**
 * Convenience function to find and delete all orphaned media in one go
 */
export async function cleanupOrphanedMedia(payload: Payload): Promise<{
  found: number;
  deleted: number;
  errors: number;
}> {
  console.log('🔍 Searching for orphaned media...');
  const orphanedIds = await findOrphanedMedia(payload);
  
  console.log(`📊 Found ${orphanedIds.length} orphaned media files`);
  
  if (orphanedIds.length === 0) {
    return { found: 0, deleted: 0, errors: 0 };
  }

  console.log('🗑️ Deleting orphaned media...');
  const { deleted, errors } = await deleteOrphanedMedia(payload, orphanedIds);
  
  console.log(`✅ Cleanup complete: ${deleted} deleted, ${errors} errors`);
  
  return { found: orphanedIds.length, deleted, errors };
}
