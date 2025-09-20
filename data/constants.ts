import { BlogPost, LayoutPreset, PostStatus, BlockType } from '@/types';

// Blog constants
export const CATEGORIES = [
  'cybersecurity', 'ai-security', 'ai-ethics-governance',
  'learning-tech', 'how-to', 'case-studies',
  'community-careers', 'product-updates'
];

export const TAGS = ['React', 'TypeScript', 'TailwindCSS', 'AI', 'Security', 'Frontend', 'UX'];

export const LAYOUT_PRESETS = [
  { name: 'Default', value: LayoutPreset.DEFAULT },
  { name: 'Classic', value: LayoutPreset.CLASSIC },
  { name: 'Tech Guide', value: LayoutPreset.TECH_GUIDE },
  { name: 'Magazine Rail', value: LayoutPreset.MAGAZINE_RAIL },
];

export const INITIAL_BLOG_POST: BlogPost = createInitialBlogPost();

export function createInitialBlogPost(): BlogPost {
  return {
    id: 'new',
    meta: {
      title: 'Untitled Blog Post',
      authorRef: 'Admin User',
      slug: 'untitled-blog-post',
      tags: [],
      categories: [CATEGORIES[0]],
      readingTime: 0,
      status: PostStatus.DRAFT,
      updatedAt: new Date().toISOString(),
      seo: {
        title: '',
        description: '',
      },
    },
    layout: {
      preset: LayoutPreset.DEFAULT,
    },
    blocks: [
      {
        id: crypto.randomUUID(),
        type: BlockType.HERO_MEDIA,
        props: {
          mediaRef: `https://picsum.photos/seed/${Math.random()}/1200/600`,
          alt: 'Placeholder hero image',
          caption: 'Photo by a talented artist',
        },
      },
      {
        id: crypto.randomUUID(),
        type: BlockType.LEAD_PARAGRAPH,
        props: {
          text: "This is the lead paragraph. It's designed to grab the reader's attention and provide a concise summary of the article's main points, setting the stage for the detailed content that follows.",
        },
      },
      {
        id: crypto.randomUUID(),
        type: BlockType.RICH_TEXT,
        props: {
          content: '## A Subheading for Your Section\n\nStart writing your amazing blog content here. You can use markdown to format text, create lists, and embed links. This rich text block is the workhorse of your article, allowing for detailed explanations and storytelling.\n\n*   Bullet points are great for lists.\n*   They help break up long paragraphs.\n*   And make content easier to scan.',
        },
      },
      {
        id: crypto.randomUUID(),
        type: BlockType.CODE_BLOCK,
        props: { language: 'typescript', code: 'console.log("Hello, TechNest!");', filename: 'example.ts' },
      },
    ],
  };
}
