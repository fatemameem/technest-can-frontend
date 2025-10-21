import 'server-only';
import { requireRole } from '@/lib/auth/requireRole';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { cleanupOrphanedMedia } from '@/helpers/cleanupOrphanedMedia';

/**
 * POST /api/admin/cleanup-media
 * 
 * Finds and deletes orphaned media files (not referenced by any collection)
 * Requires admin role
 */
export async function POST(req: Request) {
  const auth = await requireRole(['admin']);
  if (!auth.ok) {
    return new Response(JSON.stringify(auth.json), { status: auth.status });
  }

  try {
    const payload = await getPayload({ config: configPromise });
    const result = await cleanupOrphanedMedia(payload);

    return Response.json({
      success: true,
      message: `Cleanup complete: found ${result.found}, deleted ${result.deleted}, errors: ${result.errors}`,
      data: result,
    });
  } catch (error) {
    console.error('Error in cleanup-media route:', error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
