import EditBlogPageClient from './EditBlogPageClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPage({ params }: PageProps) {
  const { id } = await params;
  return <EditBlogPageClient blogId={id} />;
}
