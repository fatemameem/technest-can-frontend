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


const BlockRenderer = ({ block, selected, onClick }: { block: Block; selected: boolean; onClick: () => void; }) => {
    const props = block.props;

    const blockContent = () => {
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

            case BlockType.RICH_TEXT:
                const htmlContent = marked.parse(props.content || '');
                return <div className="prose prose-invert prose-lg max-w-none my-6" dangerouslySetInnerHTML={{ __html: htmlContent }} />;

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
            
            case BlockType.CALLOUT:
                const variantClasses = {
                    info: 'bg-blue-900/50 border-blue-500',
                    tip: 'bg-green-900/50 border-green-500',
                    warning: 'bg-yellow-900/50 border-yellow-500',
                };
                return (
                    <div className={`my-8 p-4 border-l-4 rounded-r-lg ${variantClasses[props.variant as 'info' | 'tip' | 'warning']}`}>
                        {props.title && <h4 className="font-bold text-white mb-2">{props.title}</h4>}
                        <p className="text-gray-300">{props.content}</p>
                    </div>
                );

            case BlockType.DIVIDER:
                const styleClasses = {
                    solid: 'border-solid',
                    dashed: 'border-dashed',
                    dotted: 'border-dotted',
                };
                return <hr className={`my-12 border-gray-600 ${styleClasses[props.style as 'solid' | 'dashed' | 'dotted']}`} />;
            
            case BlockType.VIDEO_EMBED:
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
                                    title="Embedded video"
                                ></iframe>
                            </div>
                        ) : (
                            <div className="w-full aspect-video bg-gray-800 flex items-center justify-center rounded-lg">
                                <p className="text-gray-400">Invalid or unsupported video URL</p>
                            </div>
                        )}
                        {props.caption && <figcaption className="text-center text-sm text-gray-400 mt-2">{props.caption}</figcaption>}
                    </figure>
                );

            default:
                return <div className="my-4 p-4 bg-red-900/50 rounded-lg text-white">Unknown block type: {block.type}</div>;
        }
    };

    return (
        <div 
            onClick={onClick}
            className={`relative p-2 rounded-lg transition-all duration-200 ${selected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-950' : 'hover:ring-1 ring-blue-400/30'}`}
        >
            {blockContent()}
        </div>
    );
};


interface PreviewPanelProps {
    blogPost: BlogPost;
    selectedBlockId: string | null;
    setSelectedBlockId: (id: string | null) => void;
    device: 'desktop' | 'tablet' | 'mobile';
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ blogPost, selectedBlockId, setSelectedBlockId, device }) => {
    const { meta, layout, blocks } = blogPost;

    const deviceClasses = {
        desktop: 'w-full',
        tablet: 'w-[768px] mx-auto border-x-8 border-slate-700 rounded-2xl',
        mobile: 'w-[375px] mx-auto border-x-8 border-slate-700 rounded-2xl',
    };
    
    const layoutWrapperClasses = {
        [LayoutPreset.DEFAULT]: 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12',
        [LayoutPreset.CLASSIC]: 'max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12',
        [LayoutPreset.TECH_GUIDE]: 'max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12',
        [LayoutPreset.MAGAZINE_RAIL]: 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12',
    };

    const mainContent = (
        <article>
            <header className="mb-12 text-center">
                <div className="text-sm uppercase text-blue-400 font-semibold tracking-wider mb-2">
                    {meta.categories.join(', ')}
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight tracking-tighter">
                    {meta.title}
                </h1>
                {meta.subtitle && <p className="mt-4 text-xl md:text-2xl text-gray-400">{meta.subtitle}</p>}
                <div className="mt-6 text-sm text-gray-500">
                    <span>By {meta.authorRef}</span>
                    <span className="mx-2">&bull;</span>
                    <span>{new Date(meta.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            </header>

            <div>
                {blocks.map(block => (
                    <BlockRenderer 
                        key={block.id} 
                        block={block} 
                        selected={block.id === selectedBlockId}
                        onClick={() => setSelectedBlockId(block.id)}
                    />
                ))}
            </div>
        </article>
    );

    const magazineSidebar = (
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
                            {meta.categories.map(cat => <span key={cat} className="bg-blue-900 text-blue-300 text-xs px-2 py-0.5 rounded-full">{cat}</span>)}
                        </dd>
                    </div>
                </dl>
            </div>
        </aside>
    );
    
    return (
        <div className={`h-full overflow-y-auto bg-gray-900 transition-all duration-300 ${deviceClasses[device]}`}>
            <style>
            {`
                /* Basic prose styles for Tailwind */
                .prose-invert h1, .prose-invert h2, .prose-invert h3, .prose-invert h4, .prose-invert h5, .prose-invert h6 { color: #fff; margin-top: 1.25em; margin-bottom: 0.5em; font-weight: 600; }
                .prose-invert h1 { font-size: 2.25em; }
                .prose-invert h2 { font-size: 1.875em; }
                .prose-invert p, .prose-invert ul, .prose-invert ol, .prose-invert li { color: #d1d5db; line-height: 1.75; }
                .prose-invert a { color: #60a5fa; text-decoration: underline; }
                .prose-invert strong { color: #fff; }
                .prose-invert blockquote { border-left-color: #3b82f6; color: #d1d5db; padding-left: 1em; font-style: italic; }
                .prose-invert code { color: #f97316; background-color: #374151; padding: 0.2em 0.4em; border-radius: 0.25em; }
                .prose-invert pre code { background-color: transparent; padding: 0; }

                /* Aspect ratio for video embeds */
                .aspect-w-16 { position: relative; padding-bottom: 56.25%; }
                .aspect-h-9 { height: 0; }
                .aspect-w-16 > iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
            `}
            </style>
            <div className={layoutWrapperClasses[layout.preset]}>
                {layout.preset === LayoutPreset.MAGAZINE_RAIL ? (
                    <>
                        <main className="lg:col-span-2">
                            {mainContent}
                        </main>
                        {magazineSidebar}
                    </>
                ) : (
                     <main>
                        {mainContent}
                    </main>
                )}
            </div>
        </div>
    );
};

export default PreviewPanel;
