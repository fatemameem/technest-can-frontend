import React from 'react';
import { marked } from 'marked';

import type { BlogPost, Block } from '@/types';
import { BlockType, LayoutPreset } from '@/types';

const getYouTubeEmbedUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'youtu.be') return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
    if (parsed.hostname.includes('youtube.com')) {
      const videoId = parsed.searchParams.get('v');
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
  } catch (error) {
    return null;
  }
  return null;
};

const getGoogleDriveEmbedUrl = (url: string) => {
  const match = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  return match ? `https://drive.google.com/file/d/${match[1]}/preview` : null;
};

const BlockRenderer = ({ block }: { block: Block }) => {
  const props = block.props ?? {};

  switch (block.type) {
    case BlockType.HERO_MEDIA:
    case BlockType.IMAGE_FIGURE:
      return (
        <figure className="my-8">
          <img src={props.mediaRef} alt={props.alt} className="w-full rounded-lg shadow-lg" />
          {props.caption && <figcaption className="text-center text-sm text-gray-400 mt-2">{props.caption}</figcaption>}
        </figure>
      );
    case BlockType.LEAD_PARAGRAPH:
      return <p className="text-xl md:text-2xl text-gray-300 my-8 font-light leading-relaxed">{props.text}</p>;
    case BlockType.RICH_TEXT: {
      const htmlContent = marked.parse(props.content || '');
      return <div className="prose prose-invert prose-lg max-w-none my-6" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
    }
    case BlockType.CODE_BLOCK:
      return (
        <div className="my-8 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          {props.filename && <div className="text-xs text-gray-400 bg-gray-900 px-4 py-2">{props.filename}</div>}
          <pre className="p-4 overflow-x-auto"><code className={`language-${props.language}`}>{props.code}</code></pre>
        </div>
      );
    case BlockType.QUOTE:
      return (
        <blockquote className="my-8 border-l-4 border-blue-500 pl-6 italic">
          <p className="text-xl text-gray-200">{props.quote}</p>
          {props.attribution && <footer className="text-base text-gray-400 mt-2">- {props.attribution}</footer>}
        </blockquote>
      );
    case BlockType.CALLOUT: {
      const variantClasses: Record<string, string> = {
        info: 'bg-blue-900/50 border-blue-500',
        tip: 'bg-green-900/50 border-green-500',
        warning: 'bg-yellow-900/50 border-yellow-500',
      };
      const variant = props.variant ?? 'info';
      return (
        <div className={`my-8 p-4 border-l-4 rounded-r-lg ${variantClasses[variant] ?? variantClasses.info}`}>
          {props.title && <h4 className="font-bold text-white mb-2">{props.title}</h4>}
          <p className="text-gray-300">{props.content}</p>
        </div>
      );
    }
    case BlockType.DIVIDER: {
      const styleClasses: Record<string, string> = {
        solid: 'border-solid',
        dashed: 'border-dashed',
        dotted: 'border-dotted',
      };
      return <hr className={`my-12 border-gray-600 ${styleClasses[props.style] ?? 'border-solid'}`} />;
    }
    case BlockType.VIDEO_EMBED: {
      if (!props.url) {
        return (
          <figure className="my-8">
            <div className="w-full aspect-video bg-gray-800 flex items-center justify-center rounded-lg">
              <p className="text-gray-400">Enter a video URL</p>
            </div>
          </figure>
        );
      }
      const youtubeUrl = getYouTubeEmbedUrl(props.url);
      const driveUrl = getGoogleDriveEmbedUrl(props.url);
      const embedUrl = youtubeUrl || driveUrl;

      return (
        <figure className="my-8">
          {embedUrl ? (
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={embedUrl}
                className="w-full h-full rounded-lg shadow-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={props.caption || 'Embedded video'}
              />
            </div>
          ) : (
            <div className="w-full aspect-video bg-gray-800 flex items-center justify-center rounded-lg">
              <p className="text-gray-400">Unable to embed video</p>
            </div>
          )}
          {props.caption && <figcaption className="text-center text-sm text-gray-400 mt-2">{props.caption}</figcaption>}
        </figure>
      );
    }
    default:
      return null;
  }
};

interface BlogArticleProps {
  blog: BlogPost;
}

const layoutWrapperClasses: Record<LayoutPreset, string> = {
  [LayoutPreset.DEFAULT]: 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12',
  [LayoutPreset.CLASSIC]: 'max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12',
  [LayoutPreset.TECH_GUIDE]: 'max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12',
  [LayoutPreset.MAGAZINE_RAIL]: 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12 py-12',
};

const BlogArticle: React.FC<BlogArticleProps> = ({ blog }) => {
  const { meta, layout, blocks } = blog;
  const wrapperClass = layoutWrapperClasses[layout.preset] ?? layoutWrapperClasses[LayoutPreset.DEFAULT];

  return (
    <div className="bg-gray-950 text-slate-100">
      <style>
        {`
          .prose-invert h1, .prose-invert h2, .prose-invert h3, .prose-invert h4, .prose-invert h5, .prose-invert h6 { color: #fff; margin-top: 1.25em; margin-bottom: 0.5em; font-weight: 600; }
          .prose-invert h1 { font-size: 2.25em; }
          .prose-invert h2 { font-size: 1.875em; }
          .prose-invert p, .prose-invert ul, .prose-invert ol, .prose-invert li { color: #d1d5db; line-height: 1.75; }
          .prose-invert a { color: #60a5fa; text-decoration: underline; }
          .prose-invert strong { color: #fff; }
          .prose-invert blockquote { border-left-color: #3b82f6; color: #d1d5db; padding-left: 1em; font-style: italic; }
          .prose-invert code { color: #f97316; background-color: #374151; padding: 0.2em 0.4em; border-radius: 0.25em; }
          .prose-invert pre code { background-color: transparent; padding: 0; }
          .aspect-w-16 { position: relative; padding-bottom: 56.25%; }
          .aspect-h-9 { height: 0; }
          .aspect-w-16 > iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
        `}
      </style>
      <div className={wrapperClass}>
        <article className="lg:col-span-2">
          <header className="mb-12 text-center">
            <div className="text-sm uppercase text-blue-400 font-semibold tracking-wider mb-2">
              {(meta.categories || []).join(', ')}
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight tracking-tight">
              {meta.title}
            </h1>
            {meta.subtitle && <p className="mt-4 text-xl md:text-2xl text-gray-400">{meta.subtitle}</p>}
            <div className="mt-6 text-sm text-gray-500">
              <span>By {meta.authorRef}</span>
              <span className="mx-2">&bull;</span>
              <span>
                {meta.publishedAt
                  ? new Date(meta.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : new Date(meta.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
              </span>
              <span className="mx-2">&bull;</span>
              <span>{meta.readingTime} min read</span>
            </div>
          </header>

          <div>
            {blocks.map((block) => (
              <BlockRenderer key={block.id} block={block} />
            ))}
          </div>
        </article>

        {layout.preset === LayoutPreset.MAGAZINE_RAIL && (
          <aside className="space-y-8">
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h3 className="font-bold text-white mb-3 border-b border-gray-700 pb-2">About this post</h3>
              <dl className="text-sm text-gray-300 space-y-2">
                <div>
                  <dt className="font-semibold text-gray-400">Author</dt>
                  <dd>{meta.authorRef}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-400">Published</dt>
                  <dd>{meta.publishedAt ? new Date(meta.publishedAt).toLocaleDateString() : 'Not published'}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-400">Categories</dt>
                  <dd className="flex flex-wrap gap-1 mt-1">
                    {(meta.categories || []).map((category: string) => (
                      <span key={category} className="bg-blue-900 text-blue-300 text-xs px-2 py-0.5 rounded-full">
                        {category}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default BlogArticle;
