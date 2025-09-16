import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise });
    const [pods, events] = await Promise.all([
      payload.find({ collection: 'podcasts', limit: 1, sort: '-createdAt', overrideAccess: true }),
      payload.find({ collection: 'events', limit: 1, sort: '-updatedAt', overrideAccess: true }),
    ]);

    const podcastCount = (await payload.count({ collection: 'podcasts' })).totalDocs;
    const eventCount = (await payload.count({ collection: 'events' })).totalDocs;
    const subscriberCount = 0; // Not modeled in Payload yet

    const lastPodcast = pods.docs?.[0]
      ? { title: pods.docs[0].title, when: pods.docs[0].createdAt }
      : null;
    const lastEvent = events.docs?.[0]
      ? { title: events.docs[0].title, when: events.docs[0].updatedAt }
      : null;

    return Response.json({ podcastCount, eventCount, subscriberCount, lastPodcast, lastEvent });
  } catch (e: any) {
    console.error('[admin/stats] error', e);
    return Response.json({ error: e?.message || 'Failed to load stats' }, { status: 500 });
  }
}
