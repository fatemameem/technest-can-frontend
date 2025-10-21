'use client';
import React from 'react';
import { marked } from 'marked';
import type { BlogPost, Block } from '@/types';
import { BlockType, LayoutPreset } from '@/types';

const getYouTubeEmbedUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    let videoId = null;
    if (urlObj.hostname === 'youtu.be') {
      videoId = urlObj.pathname.slice(1);
    } else if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
      videoId = urlObj.searchParams.get('v');
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch (e) {
    return null;
  }
};

const getGoogleDriveEmbedUrl = (url: string) => {
  const match = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  return match ? `https://drive.google.com/file/d/${match[1]}/preview` : null;
};

const BlockRenderer = ({ block }: { block: Block }) => {
  const props = block.props;

  const blockContent = () => {
    switch (block.type) {
      case BlockType.HERO_MEDIA:
      case BlockType.IMAGE_FIGURE:
        // Prioritize mediaUrl (Cloudinary) over mediaRef (legacy URL)
        const imageUrl = props.mediaUrl || props.mediaRef;
        
        if (!imageUrl) {
          return null; // Don't render empty image blocks on public site
        }

        return (
          <figure className="my-8">
            <img 
              src={imageUrl} 
              alt={props.alt || 'Blog image'} 
              className="w-full h-auto rounded-lg shadow-lg object-cover"
              style={{ maxHeight: '600px' }}
            />
            {props.caption && (
              <figcaption className="text-center text-sm text-gray-400 mt-2">
                {props.caption}
              </figcaption>
            )}
          </figure>
        );
      
      case BlockType.LEAD_PARAGRAPH:
        return (
          <p className="text-lg md:text-xl text-gray-300 my-6 font-light leading-relaxed">
            {props.text}
          </p>
        );

      case BlockType.RICH_TEXT:
        const htmlContent = marked.parse(props.content || '');
        return (
          <div 
            className="prose prose-invert prose-lg max-w-none my-6" 
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
          />
        );

      case BlockType.CODE_BLOCK:
        return (
          <div className="my-6 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            {props.filename && (
              <div className="text-xs text-gray-400 bg-gray-900 px-4 py-2">
                {props.filename}
              </div>
            )}
            <pre className="p-4 overflow-x-auto">
              <code className={`language-${props.language}`}>
                {props.code}
              </code>
            </pre>
          </div>
        );

      case BlockType.QUOTE:
        return (
          <blockquote className="my-6 border-l-4 border-blue-500 pl-6 italic">
            <p className="text-xl text-gray-200 leading-relaxed">
              "{props.text || ''}"
            </p>
            {(props.author || props.source) && (
              <footer className="text-base text-gray-400 mt-3">
                — {props.author && <span className="font-medium">{props.author}</span>}
                {props.author && props.source && <span>, </span>}
                {props.source && <cite className="italic">{props.source}</cite>}
              </footer>
            )}
          </blockquote>
        );
      
      case BlockType.CALLOUT:
        const calloutVariants = {
          info: {
            bg: 'bg-blue-900/30',
            border: 'border-blue-500',
            icon: 'ℹ️',
            title: 'Info'
          },
          warning: {
            bg: 'bg-yellow-900/30',
            border: 'border-yellow-500',
            icon: '⚠️',
            title: 'Warning'
          },
          error: {
            bg: 'bg-red-900/30',
            border: 'border-red-500',
            icon: '❌',
            title: 'Error'
          },
          success: {
            bg: 'bg-green-900/30',
            border: 'border-green-500',
            icon: '✅',
            title: 'Success'
          },
          tip: {
            bg: 'bg-purple-900/30',
            border: 'border-purple-500',
            icon: '💡',
            title: 'Tip'
          }
        };
        
        const variant = calloutVariants[props.type as keyof typeof calloutVariants] || calloutVariants.info;
        
        return (
          <div className={`my-6 p-4 border-l-4 rounded-r-lg ${variant.bg} ${variant.border}`}>
            <div className="flex items-start gap-3">
              <span className="text-lg flex-shrink-0 mt-0.5">{variant.icon}</span>
              <div className="flex-1">
                {props.title && (
                  <h4 className="font-bold text-white mb-2 text-lg">{props.title}</h4>
                )}
                {!props.title && props.type && (
                  <h4 className="font-bold text-white mb-2 text-lg">{variant.title}</h4>
                )}
                <div className="text-gray-300 leading-relaxed">
                  {props.content || ''}
                </div>
              </div>
            </div>
          </div>
        );

      case BlockType.HEADING:
        const HeadingTag = `h${props.level || 2}` as keyof JSX.IntrinsicElements;
        const headingSizes = {
          1: 'text-4xl md:text-5xl',
          2: 'text-3xl md:text-4xl',
          3: 'text-2xl md:text-3xl',
          4: 'text-xl md:text-2xl',
        };
        const sizeClass = headingSizes[props.level as keyof typeof headingSizes] || headingSizes[2];
        
        return (
          <HeadingTag className={`${sizeClass} font-bold text-white my-6`}>
            {props.text}
          </HeadingTag>
        );

      case BlockType.DIVIDER:
        const styleClasses = {
          solid: 'border-solid',
          dashed: 'border-dashed',
          dotted: 'border-dotted',
        };
        return (
          <hr className={`my-12 border-gray-600 ${styleClasses[props.style as 'solid' | 'dashed' | 'dotted'] || 'border-solid'}`} />
        );
      
      case BlockType.VIDEO_EMBED:
        if (!props.url) return null;
        
        const youtubeUrl = getYouTubeEmbedUrl(props.url);
        const driveUrl = getGoogleDriveEmbedUrl(props.url);
        const embedUrl = youtubeUrl || driveUrl;

        if (!embedUrl) return null;

        return (
          <figure className="my-6">
            <div className="aspect-w-16 aspect-h-9">
              <iframe 
                src={embedUrl}
                className="w-full h-full rounded-lg shadow-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                title={props.caption || 'Embedded video'}
              />
            </div>
            {props.caption && (
              <figcaption className="text-center text-sm text-gray-400 mt-2">
                {props.caption}
              </figcaption>
            )}
          </figure>
        );

      default:
        console.warn('Unknown block type:', block.type);
        return null;
    }
  };

  return <div className="my-4">{blockContent()}</div>;
};

interface BlogArticleProps {
  blogPost: BlogPost;
}

export default function BlogArticle({ blogPost }: BlogArticleProps) {
  // Add defensive check
  if (!blogPost || !blogPost.meta) {
    console.error('BlogArticle received invalid blogPost:', blogPost);
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="text-gray-400">This blog post could not be loaded.</p>
        </div>
      </div>
    );
  }

  const { meta, layout, blocks } = blogPost;

  const layoutWrapperClasses = {
    [LayoutPreset.DEFAULT]: 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12',
    [LayoutPreset.CLASSIC]: 'max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12',
    [LayoutPreset.TECH_GUIDE]: 'max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12',
    [LayoutPreset.MAGAZINE_RAIL]: 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12',
  };

  // Display cover image if available (prioritize coverImageUrl over coverImage)
  const coverImageUrl = meta.coverImageUrl || meta.coverImage;

  const mainContent = (
    <article>
      {/* Cover Image (if exists) */}
      {coverImageUrl && (
        <div className="relative w-full mb-8 -mx-4 sm:-mx-6 lg:-mx-8">
          <img 
            src={coverImageUrl} 
            alt={meta.title || 'Cover image'} 
            className="w-full h-auto rounded-lg shadow-2xl object-cover"
            style={{ maxHeight: '500px' }}
          />
        </div>
      )}

      <header className="mb-8 text-center">
        <div className="text-sm uppercase text-blue-400 font-semibold tracking-wider mb-2">
          {meta.categories.join(' • ')}
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight tracking-tighter">
          {meta.title}
        </h1>
        {meta.subtitle && (
          <p className="mt-4 text-xl md:text-2xl text-gray-400">
            {meta.subtitle}
          </p>
        )}
        <div className="mt-6 text-sm text-gray-500 flex items-center justify-center gap-2 flex-wrap">
          <span>By {meta.authorRef}</span>
          <span className="mx-2">&bull;</span>
          <span>
            {meta.publishedAt 
              ? new Date(meta.publishedAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })
              : new Date(meta.updatedAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })
            }
          </span>
          {meta.readingTime && (
            <>
              <span className="mx-2">&bull;</span>
              <span>{meta.readingTime} min read</span>
            </>
          )}
        </div>
      </header>

      <div>
        {blocks.map((block) => (
          <BlockRenderer key={block.id} block={block} />
        ))}
      </div>
    </article>
  );

  const magazineSidebar = (
    <aside className="space-y-8">
      <div className="p-4 bg-gray-800/50 rounded-lg sticky top-8">
        <h3 className="font-bold text-white mb-3 border-b border-gray-700 pb-2">
          About this post
        </h3>
        <dl className="text-sm text-gray-300 space-y-2">
          <div>
            <dt className="font-semibold text-gray-400">Author</dt>
            <dd>{meta.authorRef}</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-400">Published</dt>
            <dd>
              {meta.publishedAt 
                ? new Date(meta.publishedAt).toLocaleDateString() 
                : 'Not published'}
            </dd>
          </div>
          {meta.readingTime && (
            <div>
              <dt className="font-semibold text-gray-400">Reading Time</dt>
              <dd>{meta.readingTime} minutes</dd>
            </div>
          )}
          <div>
            <dt className="font-semibold text-gray-400">Categories</dt>
            <dd className="flex flex-wrap gap-1 mt-1">
              {meta.categories.map((cat) => (
                <span 
                  key={cat} 
                  className="bg-blue-900 text-blue-300 text-xs px-2 py-0.5 rounded-full"
                >
                  {cat}
                </span>
              ))}
            </dd>
          </div>
          {meta.tags && meta.tags.length > 0 && (
            <div>
              <dt className="font-semibold text-gray-400">Tags</dt>
              <dd className="flex flex-wrap gap-1 mt-1">
                {meta.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <style>
        {`
          /* Prose styles for markdown content */
          .prose-invert h1, .prose-invert h2, .prose-invert h3, .prose-invert h4, .prose-invert h5, .prose-invert h6 { 
            color: #fff; 
            margin-top: 1.25em; 
            margin-bottom: 0.5em; 
            font-weight: 600; 
          }
          .prose-invert h1 { font-size: 2.25em; }
          .prose-invert h2 { font-size: 1.875em; }
          .prose-invert h3 { font-size: 1.5em; }
          .prose-invert p, .prose-invert ul, .prose-invert ol, .prose-invert li { 
            color: #d1d5db; 
            line-height: 1.75; 
          }
          .prose-invert a { 
            color: #60a5fa; 
            text-decoration: underline; 
          }
          .prose-invert strong { color: #fff; }
          .prose-invert blockquote { 
            border-left-color: #3b82f6; 
            color: #d1d5db; 
            padding-left: 1em; 
            font-style: italic; 
          }
          .prose-invert code { 
            color: #f97316; 
            background-color: #374151; 
            padding: 0.2em 0.4em; 
            border-radius: 0.25em; 
          }
          .prose-invert pre code { 
            background-color: transparent; 
            padding: 0; 
          }
          .prose-invert ul, .prose-invert ol {
            padding-left: 1.5em;
            margin: 1em 0;
          }
          .prose-invert ul {
            list-style-type: disc;
          }
          .prose-invert ol {
            list-style-type: decimal;
          }

          /* Aspect ratio for video embeds */
          .aspect-w-16 { position: relative; padding-bottom: 56.25%; }
          .aspect-h-9 { height: 0; }
          .aspect-w-16 > iframe { 
            position: absolute; 
            top: 0; 
            left: 0; 
            width: 100%; 
            height: 100%; 
          }
        `}
      </style>
      <div className={layoutWrapperClasses[layout.preset]}>
        {layout.preset === LayoutPreset.MAGAZINE_RAIL ? (
          <>
            <main className="lg:col-span-2">{mainContent}</main>
            {magazineSidebar}
          </>
        ) : (
          <main>{mainContent}</main>
        )}
      </div>
    </div>
  );
}
