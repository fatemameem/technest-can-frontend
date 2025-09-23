// Types for your data structures
export interface Podcast {
  id: string
  title: string
  description: string
  thumbnail: string
  socialLinks: {
    linkedin?: string
    instagram?: string
    facebook?: string
  }
  driveLink: string
  published: boolean
  createdAt: string
  updatedAt: string
}

export interface Event {
  id: string
  title: string
  topic: string
  description: string
  eventDetails: {
    date: string
    time: string
    location: string
  }
  links: {
    lumaLink?: string
    zoomLink?: string
  }
  sponsors: string
  published: boolean
  createdAt: string
  updatedAt: string
}

export interface EventCardProps {
  event: {
    id: string;
    title: string;
    cover?: string;
    description: string;
    date?: string;
    // time?: string;
    timeStart?: string;
    timeEnd?: string;
    timeZone?: string;
    location?: string;
    topic?: string;
    tags?: string[];
    links?: {
      luma?: string;
      zoom?: string;
      recapUrl?: string; // Add recapUrl to EventCardProps
    };
    sponsors?: string[];
  };
  type: 'upcoming' | 'past';
}

export interface UIEvent {
  id: string;
  title: string;
  description: string;
  date?: string;
  // time?: string;
  timeStart?: string;
  timeEnd?: string;
  timeZone?: string;
  location?: string;
  topic?: string;
  tags?: string[];
  links?: {
    luma?: string;
    zoom?: string;
    recapUrl?: string; // Add recapUrl to UIEvent
  };
  sponsors?: string;
}

export type TeamMember = {
  id: string | number;
  name: string;
  role?: string;
  bio?: string;
  imageUrl?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  email?: string;
  website?: string;
  timestamp?: string;
  [key: string]: any; // allow extra fields from Sheets without breaking
};

// Types
export interface BlogMeta {
  title: string;
  subtitle?: string;
  authorRef: string;
  slug: string;
  coverImageRef?: string;
  tags: string[];
  category: string;
  readingTime: number;
  status: 'draft' | 'scheduled' | 'published';
  publishedAt?: string | null;
  updatedAt: string;
  seo: {
    title: string;
    description: string;
    ogImageRef?: string | null;
  };
}

export interface BlogLayout {
  preset: 'classic' | 'tech-guide' | 'default' | 'magazine-rail';
  columns: 'single' | 'two-column' | 'content+toc';
  sidebar?: {
    widgets: string[];
  };
}

export interface BlogBlock {
  id: string;
  type: string;
  props: Record<string, any>;
}

export interface BlogData {
  id?: string;
  meta: BlogMeta;
  layout: BlogLayout;
  blocks: BlogBlock[];
}

interface BlogEditorProps {
  mode: 'create' | 'edit';
  initialData?: BlogData;
}

export enum PostStatus {
  DRAFT = 'Draft',
  SCHEDULED = 'Scheduled',
  PUBLISHED = 'Published',
}

export enum LayoutPreset {
  CLASSIC = 'classic',
  TECH_GUIDE = 'tech-guide',
  DEFAULT = 'default',
  MAGAZINE_RAIL = 'magazine-rail',
}

export enum BlockType {
  HERO_MEDIA = 'HeroMedia',
  LEAD_PARAGRAPH = 'LeadParagraph',
  RICH_TEXT = 'RichText',
  IMAGE_FIGURE = 'ImageFigure',
  CODE_BLOCK = 'CodeBlock',
  QUOTE = 'Quote',
  CALLOUT = 'Callout',
  DIVIDER = 'Divider',
  VIDEO_EMBED = 'VideoEmbed',
}

export interface SEO {
  title: string;
  description: string;
  ogImageRef?: string;
}

export interface MetaData {
  title: string;
  subtitle?: string;
  authorRef: string;
  slug: string;
  coverImageRef?: string;
  tags: string[];
  categories: string[];
  readingTime: number;
  status: PostStatus;
  publishedAt?: string;
  updatedAt: string;
  seo: SEO;
}

export interface Layout {
  preset: LayoutPreset;
}

export interface Block {
  id: string;
  type: BlockType;
  props: any;
}

export interface HeroMediaProps {
  mediaRef: string;
  alt: string;
  caption?: string;
}

export interface LeadParagraphProps {
  text: string;
}

export interface RichTextProps {
  content: string; // Markdown or HTML content
}

export interface ImageFigureProps {
  mediaRef: string;
  alt: string;
  caption?: string;
  widthMode: 'full' | 'wide' | 'inline';
}

export interface CodeBlockProps {
  language: string;
  code: string;
  filename?: string;
}

export interface QuoteProps {
    quote: string;
    attribution?: string;
}

export interface CalloutProps {
    variant: 'info' | 'tip' | 'warning';
    title?: string;
    content: string;
}

export interface DividerProps {
    style: 'solid' | 'dashed' | 'dotted';
}

export interface VideoEmbedProps {
  url: string;
  caption?: string;
}

export interface BlogPost {
  id: string;
  linkedEvent?: string | null; // Add this field
  meta: MetaData;
  layout: Layout;
  blocks: Block[];
}

export interface PodcastForm {
  title: string;
  description: string;
  linkedin: string;
  instagram: string;
  drive: string;
  facebook: string;
  thumbnail: string;
}


export interface EventForm {
  title: string;
  topic: string;
  description: string;
  date: string;
  time: string;
  location: string;
  lumaLink: string;
  zoomLink: string;
  sponsors: string[];
}

export interface AdminForm {
  name: string;
  email: string;
  role: 'admin' | 'moderator' | '';
}

export interface Blog {
  title: string;
  content: string;
  coverImage: string;
  author: string;
  publishDate: string;
  status: 'draft' | 'published' | 'archived' | '';
}

export interface TeamMemberForm {
  name: string;
  email: string;
  designation: string;
  description: string;
  linkedin: string;
  twitter: string;
  github: string;
  website: string;
  imageLink: string;
}
