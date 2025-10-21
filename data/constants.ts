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
          // Use placehold.co instead of picsum.photos
          mediaRef: 'https://placehold.co/1200x600/1e293b/64748b?text=Upload+Your+Hero+Image',
          alt: 'Placeholder hero image',
          caption: 'Replace this with your own image',
        },
      },
      {
        id: crypto.randomUUID(),
        type: BlockType.LEAD_PARAGRAPH,
        props: {
          text: 'Start writing your engaging introduction here...',
        },
      },
      {
        id: crypto.randomUUID(),
        type: BlockType.RICH_TEXT,
        props: {
          content: '## Your First Section\n\nBegin your story here.',
        },
      },
    ],
  };
}
