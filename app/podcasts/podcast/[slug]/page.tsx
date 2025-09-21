import PodcastDetailPage from './PodcastDetailPage';

export default async function PodcastDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <div className="min-h-screen bg-slate-950 pt-16">
      <PodcastDetailPage params={slug} />
    </div>
  );
}

