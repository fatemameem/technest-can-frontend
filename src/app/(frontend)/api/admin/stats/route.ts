import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise });
    const [pods, events, blogs] = await Promise.all([
      payload.find({ collection: 'podcasts', limit: 1, sort: '-createdAt', overrideAccess: true }),
      payload.find({ collection: 'events', limit: 1, sort: '-updatedAt', overrideAccess: true }),
      payload.find({ collection: 'blogs', limit: 1, sort: '-createdAt', overrideAccess: true }),
    ]);

    const [podcastCount, eventCount, blogCount] = await Promise.all([
      payload.count({ collection: 'podcasts' }),
      payload.count({ collection: 'events' }),
      payload.count({ collection: 'blogs' }),
    ]);

    const subscriberCount = 0; // Not modeled in Payload yet

    const lastPodcast = pods.docs?.[0]
      ? { title: pods.docs[0].title, when: pods.docs[0].createdAt }
      : null;
    const lastEvent = events.docs?.[0]
      ? { title: events.docs[0].title, when: events.docs[0].updatedAt }
      : null;
    const lastBlog = blogs.docs?.[0]
      ? { title: blogs.docs[0].title, when: blogs.docs[0].createdAt }
      : null;

    return Response.json({ 
      podcastCount: podcastCount.totalDocs, 
      eventCount: eventCount.totalDocs, 
      blogCount: blogCount.totalDocs,
      subscriberCount, 
      lastPodcast, 
      lastEvent,
      lastBlog
    });
  } catch (e: any) {
    console.error('[admin/stats] error', e);
    return Response.json({ error: e?.message || 'Failed to load stats' }, { status: 500 });
  }
}
