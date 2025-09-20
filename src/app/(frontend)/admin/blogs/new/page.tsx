
import BlogEditor from '@/components/admin/blogs/BlogEditor';
import { createInitialBlogPost } from '@/data/constants';

export default function NewBlogPage() {
  return <BlogEditor mode="create" initialPost={createInitialBlogPost()} />;
}
