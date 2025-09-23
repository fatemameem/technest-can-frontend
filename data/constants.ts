import { BlogPost, Block, PostStatus, LayoutPreset, BlockType } from '@/types';

// Blog constants
export const CATEGORIES = [
  'Cybersecurity',
  'AI Ethics',
  'Privacy',
  'Data Protection',
  'Incident Response',
  'Risk Management',
  'Compliance',
  'Education',
  'Research',
  'Community',
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
    linkedEvent: null, // Add linkedEvent field
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
          text: 'Start writing your blog post here. This lead paragraph will capture your readers\' attention and set the tone for the rest of your content.',
        },
      },
      {
        id: crypto.randomUUID(),
        type: BlockType.RICH_TEXT,
        props: {
          content: '## Introduction\n\nWrite your introduction here...\n\n## Main Content\n\nAdd your main content here...',
        },
      },
    ],
  };
}
